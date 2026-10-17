import { deflateRawSync, deflateSync, inflateRawSync } from 'node:zlib';
import { describe, expect, it } from 'vitest';
import fixture from './fixtures/shared-brewlist-v1.json';
import {
  LIMITS,
  bytesToBase64Url,
  decodeBrewlist,
  encodeBrewlist,
  hasNoForbiddenCharacters,
  type DecodeFailure,
  type SharedBrewlist,
} from './brewlist';

const pack = (value: unknown, deflate = deflateRawSync) =>
  bytesToBase64Url(deflate(Buffer.from(JSON.stringify(value), 'utf8')));

const cp = (...codePoints: number[]) => String.fromCodePoint(...codePoints);

const beer = (n: number) => ({ name: `Beer ${n}`, producer: 'B', liked: n % 2 === 0 });
const oneBeer = (extra: Record<string, unknown> = {}) => ({
  v: 1,
  beers: [{ name: 'A', producer: 'B', liked: true, ...extra }],
});

// The iOS file is the contract (blank-slate issue 1321). Every invalid case in it must be
// refused. The file names the iOS error; this table maps each to the reason this page reports.
// A case added to the file without a row here fails the "every invalid case is mapped" test.
const WEB_REASON: Record<string, DecodeFailure> = {
  'unsupported-version': 'unsupported-version',
  'no-beers': 'malformed',
  'too-many-beers': 'too-long',
  'title-too-long': 'malformed',
  'name-too-long': 'malformed',
  'missing-name': 'malformed',
  'newline-in-name': 'malformed',
  'bidi-override-in-title': 'malformed',
  'abv-out-of-range': 'malformed',
  'missing-beers-key': 'malformed',
  'not-base64': 'malformed',
  'not-deflate': 'malformed',
  'not-json': 'malformed',
  'inflates-past-limit': 'too-long',
};

describe('shared fixture (the contract with the iOS app)', () => {
  it.each(fixture.valid)('decodes $name to its list', async ({ fragment, list }) => {
    // Compare decoded lists, never fragments: encoders differ byte for byte.
    expect(await decodeBrewlist(fragment)).toEqual({ ok: true, list });
  });

  it.each(fixture.valid)('$name inflates to exactly its json', ({ fragment, json }) => {
    expect(inflateRawSync(Buffer.from(fragment, 'base64url')).toString('utf8')).toBe(json);
  });

  it('has a mapped reason for every invalid case', () => {
    expect(fixture.invalid.map(c => c.name).sort()).toEqual(Object.keys(WEB_REASON).sort());
  });

  it.each(fixture.invalid)(
    'rejects $name, never showing part of a list',
    async ({ name, fragment }) => {
      expect(await decodeBrewlist(fragment)).toEqual({ ok: false, reason: WEB_REASON[name] });
    }
  );

  it('states the limits this page enforces', () => {
    const rules = fixture.contract.join('\n');
    expect(rules).toContain(`at most ${LIMITS.maxFragmentChars} characters`);
    expect(rules).toContain(`at most ${LIMITS.maxInflatedBytes} bytes`);
    expect(rules).toContain(`1 to ${LIMITS.maxBeers} objects`);
    expect(rules).toContain(`at most ${LIMITS.titleChars} Unicode code points`);
    expect(rules).toContain(`at most ${LIMITS.nameChars} Unicode code points`);
    expect(LIMITS.producerChars).toBe(LIMITS.nameChars);
    expect(LIMITS.styleChars).toBe(LIMITS.nameChars);
  });
});

describe('round trip', () => {
  it('decodes what encodeBrewlist wrote', async () => {
    const list = fixture.valid[0].list as SharedBrewlist;
    expect(await decodeBrewlist(await encodeBrewlist(list))).toEqual({ ok: true, list });
  });

  it('keeps markup as literal text', async () => {
    const result = await decodeBrewlist(
      pack({
        v: 1,
        title: '<b>Hi</b>',
        beers: [{ name: 'Märzen <script>alert(1)</script>', producer: '<img src=x>', liked: true }],
      })
    );
    expect(result.ok && result.list.title).toBe('<b>Hi</b>');
    expect(result.ok && result.list.beers[0].name).toBe('Märzen <script>alert(1)</script>');
    expect(result.ok && result.list.beers[0].producer).toBe('<img src=x>');
  });

  it('ignores unknown keys', async () => {
    const result = await decodeBrewlist(pack({ ...oneBeer({ extra: 1 }), later: { a: 1 } }));
    expect(result).toEqual({
      ok: true,
      list: { v: 1, beers: [{ name: 'A', producer: 'B', liked: true }] },
    });
  });
});

describe('the fragment', () => {
  const value = fixture.valid[1].list;
  const good = pack(value);

  it('takes the fragment without a "#": a leading "#" or any whitespace is rejected', async () => {
    expect(await decodeBrewlist(good)).toEqual({ ok: true, list: value });
    for (const bad of [
      `#${good}`,
      ` ${good}`,
      `${good} `,
      `${good}\n`,
      good.slice(0, 8) + ' ' + good.slice(8),
    ]) {
      expect(await decodeBrewlist(bad)).toEqual({ ok: false, reason: 'malformed' });
    }
  });

  it('rejects padding and the standard base64 characters', async () => {
    // Find a list whose link is not a multiple of four long, so padding would be added.
    const needsPadding = [0, 1, 2, 3]
      .map(k => pack(oneBeer({ name: 'A'.repeat(1 + k) })))
      .find(link => link.length % 4 !== 0) as string;
    const padded = `${needsPadding}${'='.repeat(4 - (needsPadding.length % 4))}`;
    expect((await decodeBrewlist(needsPadding)).ok).toBe(true);
    expect(await decodeBrewlist(padded)).toEqual({ ok: false, reason: 'malformed' });
    for (const bad of ['+', '/', '=']) {
      expect(await decodeBrewlist(good.slice(0, 4) + bad + good.slice(5))).toEqual({
        ok: false,
        reason: 'malformed',
      });
    }
  });

  it('rejects a length that is one more than a multiple of four', async () => {
    expect(await decodeBrewlist('AAAAA')).toEqual({ ok: false, reason: 'malformed' });
  });

  it('rejects the zlib-wrapped form, which the app also rejects', async () => {
    expect(await decodeBrewlist(pack(value, deflateSync))).toEqual({
      ok: false,
      reason: 'malformed',
    });
  });

  it('reports an empty fragment', async () => {
    expect(await decodeBrewlist('')).toEqual({ ok: false, reason: 'empty' });
  });
});

describe('size caps', () => {
  it('accepts exactly 50 beers and rejects 51', async () => {
    const fifty = { v: 1, beers: Array.from({ length: 50 }, (_, i) => beer(i)) };
    const result = await decodeBrewlist(pack(fifty));
    expect(result.ok && result.list.beers).toHaveLength(50);
    const tooMany = { v: 1, beers: Array.from({ length: 51 }, (_, i) => beer(i)) };
    expect(await decodeBrewlist(pack(tooMany))).toEqual({ ok: false, reason: 'too-long' });
  });

  it('refuses a fragment over 20,000 characters before decoding it', async () => {
    expect(await decodeBrewlist('A'.repeat(LIMITS.maxFragmentChars + 1))).toEqual({
      ok: false,
      reason: 'too-long',
    });
    // Exactly at the cap it is not refused for length (it is then just not a list).
    const atCap = await decodeBrewlist('A'.repeat(LIMITS.maxFragmentChars));
    expect(atCap.ok).toBe(false);
    expect(!atCap.ok && atCap.reason).not.toBe('too-long');
  });

  it('opens a link the app makes: 50 beers with 100-character names and producers, over the old 16,384 cap', async () => {
    // Deterministic noise, so deflate cannot shrink it much.
    let seed = 20_261_017;
    const next = () => {
      seed = (seed * 1_103_515_245 + 12_345) % 2_147_483_648;
      return seed / 2_147_483_648;
    };
    const chars = Array.from({ length: 94 }, (_, i) => cp(0x21 + i))
      .concat(Array.from({ length: 192 }, (_, i) => cp(0xc0 + i)))
      .filter(c => c !== '"' && c !== '\\')
      .join('');
    const points = Array.from(chars);
    const text = (n: number) =>
      Array.from({ length: n }, () => points[Math.floor(next() * points.length)]).join('');
    const list = {
      v: 1,
      title: 'Fifty long ones',
      beers: Array.from({ length: 50 }, (_, i) => ({
        name: text(LIMITS.nameChars),
        producer: text(LIMITS.producerChars),
        abv: 5,
        liked: i % 2 === 0,
        untappdId: 1000 + i,
      })),
    };
    const fragment = pack(list);
    expect(fragment.length).toBeGreaterThan(16_384);
    expect(fragment.length).toBeLessThanOrEqual(LIMITS.maxFragmentChars);
    expect(await decodeBrewlist(fragment)).toEqual({ ok: true, list });
  });

  it('stops a small link that inflates past 32 KB', async () => {
    const bomb = deflateRawSync(Buffer.alloc(LIMITS.maxInflatedBytes * 4, 0x20));
    expect(bomb.length).toBeLessThan(LIMITS.maxFragmentChars);
    expect(await decodeBrewlist(bytesToBase64Url(bomb))).toEqual({ ok: false, reason: 'too-long' });
  });

  it('accepts exactly 32,768 inflated bytes and rejects one more', async () => {
    const withBytes = (size: number) => {
      const base = JSON.stringify({ ...oneBeer(), pad: '' });
      const json = JSON.stringify({ ...oneBeer(), pad: 'x'.repeat(size - base.length) });
      expect(Buffer.byteLength(json)).toBe(size);
      return bytesToBase64Url(deflateRawSync(Buffer.from(json, 'utf8')));
    };
    expect((await decodeBrewlist(withBytes(LIMITS.maxInflatedBytes))).ok).toBe(true);
    expect(await decodeBrewlist(withBytes(LIMITS.maxInflatedBytes + 1))).toEqual({
      ok: false,
      reason: 'too-long',
    });
  });
});

describe('required fields and types', () => {
  it.each([
    ['an empty list', { v: 1, beers: [] }],
    ['no beers key', { v: 1 }],
    ['a beers value that is not a list', { v: 1, beers: {} }],
    ['a missing liked', { v: 1, beers: [{ name: 'A', producer: 'B' }] }],
    ['a non-boolean liked', oneBeer({ liked: 'yes' })],
    ['a missing producer', { v: 1, beers: [{ name: 'A', liked: true }] }],
    ['a null producer', oneBeer({ producer: null })],
    ['a numeric producer', oneBeer({ producer: 7 })],
    ['a missing name', { v: 1, beers: [{ producer: 'B', liked: true }] }],
    ['a blank name', oneBeer({ name: '   ' })],
    ['an empty name', oneBeer({ name: '' })],
    ['a numeric name', oneBeer({ name: 7 })],
    ['a numeric style', oneBeer({ style: 7 })],
    ['abv over 100', oneBeer({ abv: 101 })],
    ['a negative abv', oneBeer({ abv: -0.5 })],
    ['a string abv', oneBeer({ abv: '5' })],
    ['a non-integer untappdId', oneBeer({ untappdId: 1.5 })],
    ['an untappdId of zero', oneBeer({ untappdId: 0 })],
    ['a negative untappdId', oneBeer({ untappdId: -3 })],
    ['an object title', { ...oneBeer(), title: { a: 1 } }],
    ['a beer that is not an object', { v: 1, beers: ['A'] }],
    ['an array root', [{ v: 1 }]],
    ['a missing version', { beers: [{ name: 'A', producer: 'B', liked: true }] }],
    ['a non-numeric version', { v: '1', beers: [] }],
  ])('rejects %s as malformed', async (_label, value) => {
    expect(await decodeBrewlist(pack(value))).toEqual({ ok: false, reason: 'malformed' });
  });

  it('accepts an empty producer, the edges of abv, and absent or null optionals', async () => {
    const list = {
      v: 1,
      beers: [
        { name: 'A', producer: '', liked: false, abv: 0 },
        { name: 'B', producer: '', liked: true, abv: 100, untappdId: 1 },
        { name: 'C', producer: 'P', liked: true, style: null, abv: null, untappdId: null },
      ],
    };
    const result = await decodeBrewlist(pack({ ...list, title: null }));
    expect(result).toEqual({
      ok: true,
      list: {
        v: 1,
        beers: [
          { name: 'A', producer: '', liked: false, abv: 0 },
          { name: 'B', producer: '', liked: true, abv: 100, untappdId: 1 },
          { name: 'C', producer: 'P', liked: true },
        ],
      },
    });
  });

  it('reports a newer version separately, and before anything else', async () => {
    expect(await decodeBrewlist(pack({ v: 2, beers: [beer(1)] }))).toEqual({
      ok: false,
      reason: 'unsupported-version',
    });
    expect(await decodeBrewlist(pack({ v: 2, beers: [] }))).toEqual({
      ok: false,
      reason: 'unsupported-version',
    });
  });

  it('rejects invalid UTF-8 and non-JSON', async () => {
    const badUtf8 = bytesToBase64Url(deflateRawSync(Buffer.from([0x7b, 0xff, 0xfe, 0x7d])));
    expect(await decodeBrewlist(badUtf8)).toEqual({ ok: false, reason: 'malformed' });
    const text = bytesToBase64Url(deflateRawSync(Buffer.from('not json')));
    expect(await decodeBrewlist(text)).toEqual({ ok: false, reason: 'malformed' });
  });
});

describe('text rules: reject, never trim or repair', () => {
  const fields = {
    title: (text: string) => ({ ...oneBeer(), title: text }),
    name: (text: string) => oneBeer({ name: text }),
    producer: (text: string) => oneBeer({ producer: text }),
    style: (text: string) => oneBeer({ style: text }),
  } as const;
  const caps = {
    title: LIMITS.titleChars,
    name: LIMITS.nameChars,
    producer: LIMITS.producerChars,
    style: LIMITS.styleChars,
  } as const;

  for (const field of Object.keys(fields) as (keyof typeof fields)[]) {
    describe(field, () => {
      it('accepts the cap in code points and rejects one more', async () => {
        const at = await decodeBrewlist(pack(fields[field]('x'.repeat(caps[field]))));
        expect(at.ok).toBe(true);
        const over = await decodeBrewlist(pack(fields[field]('x'.repeat(caps[field] + 1))));
        expect(over).toEqual({ ok: false, reason: 'malformed' });
      });

      it('counts code points, not UTF-16 units', async () => {
        // Each beer emoji is two UTF-16 units but one code point.
        const at = await decodeBrewlist(pack(fields[field]('🍺'.repeat(caps[field]))));
        expect(at.ok).toBe(true);
        const over = await decodeBrewlist(pack(fields[field]('🍺'.repeat(caps[field] + 1))));
        expect(over).toEqual({ ok: false, reason: 'malformed' });
      });

      it.each([
        ['NUL', cp(0x00)],
        ['tab', cp(0x09)],
        ['newline', cp(0x0a)],
        ['carriage return', cp(0x0d)],
        ['unit separator', cp(0x1f)],
        ['DEL', cp(0x7f)],
        ['NEL', cp(0x85)],
        ['C1 control', cp(0x9f)],
        ['line separator', cp(0x2028)],
        ['paragraph separator', cp(0x2029)],
        ['left-to-right mark', cp(0x200e)],
        ['right-to-left mark', cp(0x200f)],
        ['left-to-right embedding', cp(0x202a)],
        ['right-to-left embedding', cp(0x202b)],
        ['pop directional formatting', cp(0x202c)],
        ['left-to-right override', cp(0x202d)],
        ['right-to-left override', cp(0x202e)],
        ['left-to-right isolate', cp(0x2066)],
        ['right-to-left isolate', cp(0x2067)],
        ['first strong isolate', cp(0x2068)],
        ['pop directional isolate', cp(0x2069)],
      ])('rejects %s', async (_label, char) => {
        const result = await decodeBrewlist(pack(fields[field](`ab${char}cd`)));
        expect(result).toEqual({ ok: false, reason: 'malformed' });
      });

      it('returns the text exactly as sent: no trimming, no collapsing', async () => {
        const sent = '  Two  spaces  ';
        const result = await decodeBrewlist(pack(fields[field](sent)));
        expect(result.ok).toBe(true);
        if (!result.ok) return;
        const got =
          field === 'title'
            ? result.list.title
            : result.list.beers[0][field as 'name' | 'producer' | 'style'];
        expect(got).toBe(sent);
      });
    });
  }

  it('does not rewrite characters the contract allows', async () => {
    const family = `${cp(0x1f468)}${cp(0x200d)}${cp(0x1f469)}${cp(0x200d)}${cp(0x1f467)}`;
    const allowed = `${family} a${cp(0x200b)}b${cp(0xad)}c${cp(0xfeff)}d${cp(0x2060)}e`;
    const result = await decodeBrewlist(pack(oneBeer({ name: allowed, producer: allowed })));
    expect(result.ok && result.list.beers[0].name).toBe(allowed);
    expect(result.ok && result.list.beers[0].producer).toBe(allowed);
  });

  it('tells forbidden from allowed characters', () => {
    expect(hasNoForbiddenCharacters('Märzen <b>')).toBe(true);
    expect(hasNoForbiddenCharacters(`a${cp(0x200d)}b`)).toBe(true);
    expect(hasNoForbiddenCharacters(`a${cp(0x202e)}b`)).toBe(false);
  });
});
