import { deflateRawSync, deflateSync, inflateRawSync } from 'node:zlib';
import { describe, expect, it } from 'vitest';
import fixture from './fixtures/brewlist-v1.json';
import {
  LIMITS,
  bytesToBase64Url,
  cleanText,
  decodeBrewlist,
  encodeBrewlist,
  type SharedBrewlist,
} from './brewlist';

const pack = (value: unknown, deflate = deflateRawSync) =>
  bytesToBase64Url(deflate(Buffer.from(JSON.stringify(value), 'utf8')));

// Built from code points so the invisible characters are visible in the source.
const ZERO_WIDTH = String.fromCodePoint(0x200b);
const BIDI_OVERRIDE = String.fromCodePoint(0x202e);

const beer = (n: number) => ({ name: `Beer ${n}`, liked: n % 2 === 0 });

describe('shared fixture (the contract with the iOS app)', () => {
  it.each(fixture.cases)('decodes $name to its payload', async ({ encoded, payload }) => {
    const result = await decodeBrewlist(encoded);
    expect(result).toEqual({ ok: true, list: payload });
  });

  it.each(fixture.cases)('$name inflates to exactly its json', ({ encoded, json }) => {
    expect(inflateRawSync(Buffer.from(encoded, 'base64url')).toString('utf8')).toBe(json);
  });

  it.each(fixture.invalid)('rejects $name', async ({ fragment, reason }) => {
    expect(await decodeBrewlist(fragment)).toEqual({ ok: false, reason });
  });

  it('keeps markup as literal text', async () => {
    const result = await decodeBrewlist(fixture.cases[2].encoded);
    expect(result.ok && result.list.beers[0].name).toBe('Märzen <script>alert(1)</script>');
  });
});

describe('round trip', () => {
  it('decodes what encodeBrewlist wrote', async () => {
    const list = fixture.cases[0].payload as SharedBrewlist;
    expect(await decodeBrewlist(await encodeBrewlist(list))).toEqual({ ok: true, list });
  });

  it('accepts a leading # and surrounding whitespace', async () => {
    const encoded = fixture.cases[1].encoded;
    expect(await decodeBrewlist(`#${encoded}`)).toEqual({
      ok: true,
      list: fixture.cases[1].payload,
    });
    expect(await decodeBrewlist(`#${encoded}  `)).toEqual({
      ok: true,
      list: fixture.cases[1].payload,
    });
  });

  it('accepts the zlib-wrapped form and base64 padding', async () => {
    const value = fixture.cases[1].payload;
    const wrapped = await decodeBrewlist(pack(value, deflateSync));
    expect(wrapped).toEqual({ ok: true, list: value });
    const padded = `${pack(value)}${'='.repeat((4 - (pack(value).length % 4)) % 4)}`;
    expect(await decodeBrewlist(padded)).toEqual({ ok: true, list: value });
  });
});

describe('caps and rejection', () => {
  it('accepts exactly 50 beers and rejects 51', async () => {
    const fifty = { v: 1, beers: Array.from({ length: 50 }, (_, i) => beer(i)) };
    const result = await decodeBrewlist(pack(fifty));
    expect(result.ok && result.list.beers).toHaveLength(50);
    const tooMany = { v: 1, beers: Array.from({ length: 51 }, (_, i) => beer(i)) };
    expect(await decodeBrewlist(pack(tooMany))).toEqual({ ok: false, reason: 'too-long' });
  });

  it('trims long text to the display caps', async () => {
    const long = 'x'.repeat(500);
    const result = await decodeBrewlist(
      pack({ v: 1, title: long, beers: [{ name: long, producer: long, style: long, liked: true }] })
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(Array.from(result.list.title ?? '')).toHaveLength(LIMITS.titleChars);
    expect(Array.from(result.list.beers[0].name)).toHaveLength(LIMITS.nameChars);
    expect(Array.from(result.list.beers[0].producer ?? '')).toHaveLength(LIMITS.producerChars);
    expect(Array.from(result.list.beers[0].style ?? '')).toHaveLength(LIMITS.styleChars);
  });

  it('refuses a fragment over the length cap before decoding it', async () => {
    const result = await decodeBrewlist('A'.repeat(LIMITS.maxFragmentChars + 1));
    expect(result).toEqual({ ok: false, reason: 'too-long' });
  });

  it('stops a small link that inflates past the byte cap', async () => {
    const bomb = deflateRawSync(Buffer.alloc(LIMITS.maxInflatedBytes * 4, 0x20));
    expect(bomb.length).toBeLessThan(LIMITS.maxFragmentChars);
    expect(await decodeBrewlist(bytesToBase64Url(bomb))).toEqual({ ok: false, reason: 'too-long' });
  });

  it.each([
    ['an empty list', { v: 1, beers: [] }],
    ['no beers key', { v: 1 }],
    ['a missing liked', { v: 1, beers: [{ name: 'A' }] }],
    ['a non-boolean liked', { v: 1, beers: [{ name: 'A', liked: 'yes' }] }],
    ['a nameless beer', { v: 1, beers: [{ name: ZERO_WIDTH, liked: true }] }],
    ['a numeric name', { v: 1, beers: [{ name: 7, liked: true }] }],
    ['abv out of range', { v: 1, beers: [{ name: 'A', liked: true, abv: 101 }] }],
    ['a non-integer untappdId', { v: 1, beers: [{ name: 'A', liked: true, untappdId: 1.5 }] }],
    ['an object title', { v: 1, title: { a: 1 }, beers: [{ name: 'A', liked: true }] }],
    ['an array root', [{ v: 1 }]],
    ['a missing version', { beers: [{ name: 'A', liked: true }] }],
  ])('rejects %s as malformed', async (_label, value) => {
    expect(await decodeBrewlist(pack(value))).toEqual({ ok: false, reason: 'malformed' });
  });

  it('reports a newer version separately', async () => {
    expect(await decodeBrewlist(pack({ v: 2, beers: [beer(1)] }))).toEqual({
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

describe('cleanText', () => {
  it('removes control and bidi characters and collapses whitespace', () => {
    expect(cleanText(`  A${BIDI_OVERRIDE}evil${ZERO_WIDTH}\n\n  name\u0000 `, 100)).toBe(
      'A evil name'
    );
  });

  it('counts code points, not UTF-16 units', () => {
    expect(Array.from(cleanText('🍺'.repeat(60), 40))).toHaveLength(40);
  });

  it('never adds markup', () => {
    expect(cleanText('<img src=x onerror=alert(1)>', 100)).toBe('<img src=x onerror=alert(1)>');
  });
});
