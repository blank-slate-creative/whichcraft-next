/**
 * Brew-list share links (WhichCraft plan A2, blank-slate issue 1315).
 *
 * A shared list lives entirely inside the link: https://whichcraft.beer/l#<payload>. The part after
 * the "#" is never sent to a server, so we hold nothing and cannot take a link down. That is why the
 * decoder is strict: it caps every length, accepts only the known fields, and never returns markup.
 *
 * The contract is the iOS fixture, shared-brewlist-v1.json, copied byte for byte from
 * WhichCraft-iOS (WhichCraftTests/Fixtures). Its "contract" array is the rule list this file
 * implements: a link that breaks any rule is rejected whole, never trimmed, repaired, or shown in
 * part, so a link that opens here also opens in the app and the other way round.
 *
 * Wire format, version 1:
 *   payload  = base64url( rawDeflate( utf8( json ) ) )      no padding, only A-Z a-z 0-9 - _
 *   json     = { "v": 1, "title"?: string, "beers": Beer[] }
 *   Beer     = { "name": string, "producer": string, "liked": boolean, "style"?: string,
 *                "abv"?: number, "untappdId"?: number }
 * "Raw deflate" is RFC 1951 with no zlib header (Apple's COMPRESSION_ZLIB; `deflate-raw` on the
 * web). The zlib-wrapped form (RFC 1950) is rejected, as the app rejects it. Unknown fields are
 * ignored. decodeBrewlist takes the fragment without its "#"; the page strips that itself.
 */

import { titleRejection } from './titleFilter';

export const SHARE_VERSION = 1;

/**
 * Caps, from the shared contract. A link over any of these is rejected whole. Text caps count
 * Unicode code points, not UTF-16 units.
 */
export const LIMITS = {
  /** Longest fragment we will even try to decode, in characters. */
  maxFragmentChars: 20_000,
  /** Largest inflated payload, in bytes (32 KB). Stops a small link from inflating into a big one. */
  maxInflatedBytes: 32_768,
  maxBeers: 50,
  titleChars: 40,
  nameChars: 100,
  producerChars: 100,
  styleChars: 100,
} as const;

export interface SharedBeer {
  name: string;
  /** Required by the contract; may be the empty string. */
  producer: string;
  style?: string;
  abv?: number;
  liked: boolean;
  untappdId?: number;
}

export interface SharedBrewlist {
  v: 1;
  title?: string;
  beers: SharedBeer[];
}

export type DecodeFailure =
  | 'empty' // no fragment at all
  | 'too-long' // fragment, inflated payload, or beer count over the cap
  | 'malformed' // not base64url, not raw deflate, not JSON, or any other rule broken
  | 'unsupported-version'; // a newer link than this page understands

export type DecodeResult =
  | { ok: true; list: SharedBrewlist }
  | { ok: false; reason: DecodeFailure };

class Failure extends Error {
  constructor(readonly reason: DecodeFailure) {
    super(reason);
  }
}

// Characters the contract forbids in the title, name, producer, and style: control characters
// (Unicode Cc: U+0000 to U+001F and U+007F to U+009F), the line and paragraph separators, and the
// bidirectional marks and overrides, which let a crafted name hide or reorder text. Nothing else is
// touched: zero-width joiners stay, because they hold emoji sequences together.
const FORBIDDEN_CHARS =
  /[\u0000-\u001F\u007F-\u009F\u2028\u2029\u200E\u200F\u202A-\u202E\u2066-\u2069]/;

/** True when `text` has none of the characters the contract forbids. */
export function hasNoForbiddenCharacters(text: string): boolean {
  return !FORBIDDEN_CHARS.test(text);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** A string within `max` code points and free of forbidden characters, exactly as sent. */
function checkedText(value: unknown, max: number): string {
  if (typeof value !== 'string') throw new Failure('malformed');
  if (!hasNoForbiddenCharacters(value)) throw new Failure('malformed');
  // A string of n UTF-16 units has at most n code points, so only count when it could be over.
  if (value.length > max && Array.from(value).length > max) throw new Failure('malformed');
  return value;
}

/** An optional string: absent or null is fine; anything else must pass checkedText. */
function optionalText(value: unknown, max: number): string | undefined {
  if (value === undefined || value === null) return undefined;
  return checkedText(value, max);
}

function parseBeer(value: unknown): SharedBeer {
  if (!isRecord(value)) throw new Failure('malformed');
  const name = checkedText(value.name, LIMITS.nameChars);
  if (name.trim() === '') throw new Failure('malformed');
  const producer = checkedText(value.producer, LIMITS.producerChars);
  if (typeof value.liked !== 'boolean') throw new Failure('malformed');

  const beer: SharedBeer = { name, producer, liked: value.liked };
  const style = optionalText(value.style, LIMITS.styleChars);
  if (style !== undefined) beer.style = style;

  if (value.abv !== undefined && value.abv !== null) {
    if (typeof value.abv !== 'number' || !Number.isFinite(value.abv))
      throw new Failure('malformed');
    if (value.abv < 0 || value.abv > 100) throw new Failure('malformed');
    beer.abv = value.abv;
  }
  if (value.untappdId !== undefined && value.untappdId !== null) {
    if (!Number.isSafeInteger(value.untappdId) || (value.untappdId as number) <= 0) {
      throw new Failure('malformed');
    }
    beer.untappdId = value.untappdId as number;
  }
  return beer;
}

/** Validate decoded JSON into a brew list. Throws Failure; use decodeBrewlist for a result. */
export function parseBrewlist(data: unknown): SharedBrewlist {
  if (!isRecord(data)) throw new Failure('malformed');
  // The version comes first, so a newer link reads as "newer" whatever else it holds.
  if (typeof data.v !== 'number') throw new Failure('malformed');
  if (data.v !== SHARE_VERSION) throw new Failure('unsupported-version');
  if (!Array.isArray(data.beers) || data.beers.length === 0) throw new Failure('malformed');
  if (data.beers.length > LIMITS.maxBeers) throw new Failure('too-long');

  const list: SharedBrewlist = { v: SHARE_VERSION, beers: data.beers.map(parseBeer) };
  const title = optionalText(data.title, LIMITS.titleChars);
  // A title the filter rejects is not shown; the list still opens (titleFilter.ts, issue 1477).
  if (title !== undefined && titleRejection(title) === null) list.title = title;
  return list;
}

function base64UrlToBytes(text: string): Uint8Array {
  // Only the base64url alphabet, no padding: "=", "+", "/", and whitespace are all rejected.
  if (!/^[A-Za-z0-9_-]+$/.test(text) || text.length % 4 === 1) throw new Failure('malformed');
  const binary = atob(text.replace(/-/g, '+').replace(/_/g, '/'));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** Inflate raw DEFLATE (RFC 1951), stopping the moment the output passes the byte cap. */
async function inflateRaw(bytes: Uint8Array): Promise<Uint8Array> {
  const stream = new Blob([bytes as BlobPart])
    .stream()
    .pipeThrough(new DecompressionStream('deflate-raw'));
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.length;
    if (total > LIMITS.maxInflatedBytes) {
      await reader.cancel();
      throw new Failure('too-long');
    }
    chunks.push(value);
  }
  const out = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.length;
  }
  return out;
}

/**
 * Decode the text after the "#" of a share link (without the "#" itself). Never throws; never
 * returns markup; never returns part of a list.
 */
export async function decodeBrewlist(fragment: string): Promise<DecodeResult> {
  try {
    if (fragment === '') return { ok: false, reason: 'empty' };
    if (fragment.length > LIMITS.maxFragmentChars) return { ok: false, reason: 'too-long' };

    const inflated = await inflateRaw(base64UrlToBytes(fragment));
    let json: unknown;
    try {
      json = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(inflated));
    } catch {
      throw new Failure('malformed');
    }
    return { ok: true, list: parseBrewlist(json) };
  } catch (error) {
    return { ok: false, reason: error instanceof Failure ? error.reason : 'malformed' };
  }
}

/** Encode a list into the text that goes after the "#". Used by tests. */
export async function encodeBrewlist(list: SharedBrewlist): Promise<string> {
  const bytes = new TextEncoder().encode(JSON.stringify(list));
  const stream = new Blob([bytes as BlobPart])
    .stream()
    .pipeThrough(new CompressionStream('deflate-raw'));
  const compressed = new Uint8Array(await new Response(stream).arrayBuffer());
  return bytesToBase64Url(compressed);
}
