// Regenerates brewlist-v1.json. Run: node lib/share/fixtures/make-fixture.mjs
// The output is the shared contract with the iOS app: change a case only on purpose, and copy the
// new file to both repos. Encoding is rawDeflate (no zlib header) then base64url, no padding.
import { deflateRawSync } from 'node:zlib';
import { writeFileSync } from 'node:fs';

const encode = obj =>
  deflateRawSync(Buffer.from(JSON.stringify(obj), 'utf8'), { level: 9 }).toString('base64url');

const cases = [
  {
    name: 'titled-list',
    payload: {
      v: 1,
      title: "Dad's picks",
      beers: [
        {
          name: 'Heady Topper',
          producer: 'The Alchemist',
          style: 'Double IPA',
          abv: 8,
          liked: true,
          untappdId: 4691,
        },
        {
          name: 'Saison Dupont',
          producer: 'Brasserie Dupont',
          style: 'Saison',
          abv: 6.5,
          liked: true,
          untappdId: 4689,
        },
        {
          name: 'Budweiser',
          producer: 'Anheuser-Busch',
          style: 'American Lager',
          abv: 5,
          liked: false,
          untappdId: 2174,
        },
      ],
    },
  },
  {
    name: 'untitled-minimal',
    payload: { v: 1, beers: [{ name: 'Pilsner Urquell', liked: true }] },
  },
  {
    name: 'unicode-and-markup-text',
    payload: {
      v: 1,
      title: 'Café ☕ <b>run</b>',
      beers: [
        {
          name: 'Märzen <script>alert(1)</script>',
          producer: 'Brauerei Spaten-Franziskaner',
          style: 'Märzen',
          abv: 5.8,
          liked: true,
        },
        { name: 'Kölsch', producer: 'Früh', liked: false },
      ],
    },
  },
];

const out = {
  spec:
    'WhichCraft brew-list share link, wire format version 1. A link is https://whichcraft.beer/l#<encoded>. ' +
    'encoded = base64url (RFC 4648 section 5, no padding) of rawDeflate (RFC 1951, no zlib header) of the UTF-8 bytes of `json`. ' +
    'Decoders also accept the zlib-wrapped form (RFC 1950). Encoders omit absent optional fields and may use any compressor, ' +
    'so a decoder must decode `encoded` and compare to `payload`; it must never re-encode and compare strings. ' +
    'Every case: decode(encoded) deep-equals payload, and inflating `encoded` gives exactly `json`. ' +
    'Text is data: the web page shows `<script>` as literal characters. ' +
    'Decoders reject: more than 50 beers, more than 16384 characters of encoded text, more than 65536 inflated bytes, ' +
    'a missing or non-boolean liked, an empty list, and any v other than 1. ' +
    'Display limits (the web page trims longer text): title 40, name 100, producer 100, style 60 characters. ' +
    'Required: v, beers (1 to 50), name, liked. Optional: title, producer, style, abv (0 to 100), untappdId (positive integer).',
  version: 1,
  cases: cases.map(({ name, payload }) => ({
    name,
    json: JSON.stringify(payload),
    encoded: encode(payload),
    payload,
  })),
  invalid: [
    { name: 'not-base64url', fragment: 'not base64!!', reason: 'malformed' },
    { name: 'not-deflate', fragment: 'aGVsbG8gd29ybGQ', reason: 'malformed' },
    { name: 'empty', fragment: '', reason: 'empty' },
    {
      name: 'future-version',
      fragment: encode({ v: 2, beers: [{ name: 'X', liked: true }] }),
      reason: 'unsupported-version',
    },
  ],
};

writeFileSync(new URL('./brewlist-v1.json', import.meta.url), JSON.stringify(out, null, 2) + '\n');
