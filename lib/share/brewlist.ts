/**
 * Brew-list share links (WhichCraft plan A2, blank-slate issue 1315).
 *
 * A shared list lives entirely inside the link: https://whichcraft.beer/l#<payload>. The part after
 * the "#" is never sent to a server, so we hold nothing and cannot take a link down. That is why the
 * decoder is strict: it caps every length, accepts only the known fields, and never returns markup.
 *
 * Wire format, version 1 (the iOS app encodes the same thing; see fixtures/brewlist-v1.json):
 *   payload  = base64url( rawDeflate( utf8( json ) ) )      no padding
 *   json     = { "v": 1, "title"?: string, "beers": Beer[] }
 *   Beer     = { "name": string, "producer"?: string, "style"?: string, "abv"?: number,
 *                "liked": boolean, "untappdId"?: number }
 * "Raw deflate" is RFC 1951 with no zlib header (Apple's COMPRESSION_ZLIB; `deflate-raw` on the
 * web). The decoder also accepts the zlib-wrapped form (RFC 1950) so a sender that adds the header
 * still works. Optional fields are left out when absent. Unknown fields are ignored.
 */

export const SHARE_VERSION = 1;

/** Caps. A link over any of these is rejected (sizes) or trimmed (text), never rendered whole. */
export const LIMITS = {
  /** Longest fragment we will even try to decode, in characters. */
  maxFragmentChars: 16_384,
  /** Largest inflated payload, in bytes. Stops a small link from inflating into a huge one. */
  maxInflatedBytes: 65_536,
  maxBeers: 50,
  titleChars: 40,
  nameChars: 100,
  producerChars: 100,
  styleChars: 60,
} as const;

export interface SharedBeer {
  name: string;
  producer?: string;
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
  | 'too-long' // fragment or inflated payload over the cap
  | 'malformed' // not base64url, not deflate, not JSON, or the wrong shape
  | 'unsupported-version'; // a newer link than this page understands

export type DecodeResult =
  | { ok: true; list: SharedBrewlist }
  | { ok: false; reason: DecodeFailure };

class Failure extends Error {
  constructor(readonly reason: DecodeFailure) {
    super(reason);
  }
}

// Control characters, zero-width and bidi-override characters, and the BOM. These let a crafted
// name hide or reorder text, so they never reach the page.
const UNSAFE_CHARS =
  /[\u0000-\u001F\u007F-\u009F\u00AD\u200B-\u200F\u2028-\u202E\u2060-\u206F\uFEFF]/g;

/** Strip unsafe characters, collapse whitespace, and trim to `max` code points. */
export function cleanText(input: string, max: number): string {
  const flat = input.replace(UNSAFE_CHARS, ' ').replace(/\s+/g, ' ').trim();
  const points = Array.from(flat);
  return points.length > max
    ? points
        .slice(0, max - 1)
        .join('')
        .trimEnd() + '…'
    : flat;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function optionalText(value: unknown, max: number): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== 'string') throw new Failure('malformed');
  const text = cleanText(value, max);
  return text === '' ? undefined : text;
}

function parseBeer(value: unknown): SharedBeer {
  if (!isRecord(value)) throw new Failure('malformed');
  const name = optionalText(value.name, LIMITS.nameChars);
  if (name === undefined || typeof value.liked !== 'boolean') throw new Failure('malformed');

  const beer: SharedBeer = { name, liked: value.liked };
  const producer = optionalText(value.producer, LIMITS.producerChars);
  if (producer !== undefined) beer.producer = producer;
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
  if (typeof data.v !== 'number') throw new Failure('malformed');
  if (data.v !== SHARE_VERSION) throw new Failure('unsupported-version');
  if (!Array.isArray(data.beers) || data.beers.length === 0) throw new Failure('malformed');
  if (data.beers.length > LIMITS.maxBeers) throw new Failure('too-long');

  const list: SharedBrewlist = { v: SHARE_VERSION, beers: data.beers.map(parseBeer) };
  const title = optionalText(data.title, LIMITS.titleChars);
  if (title !== undefined) list.title = title;
  return list;
}

function base64UrlToBytes(text: string): Uint8Array {
  const body = text.replace(/=+$/, '');
  if (!/^[A-Za-z0-9_-]+$/.test(body) || body.length % 4 === 1) throw new Failure('malformed');
  const binary = atob(body.replace(/-/g, '+').replace(/_/g, '/'));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function inflate(bytes: Uint8Array, format: 'deflate-raw' | 'deflate'): Promise<Uint8Array> {
  const stream = new Blob([bytes as BlobPart])
    .stream()
    .pipeThrough(new DecompressionStream(format));
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

async function inflateEither(bytes: Uint8Array): Promise<Uint8Array> {
  // A zlib header (RFC 1950) is 0x78 followed by a byte that makes the pair a multiple of 31.
  const hasZlibHeader =
    bytes.length > 2 && bytes[0] === 0x78 && (bytes[0] * 256 + bytes[1]) % 31 === 0;
  const order: ('deflate-raw' | 'deflate')[] = hasZlibHeader
    ? ['deflate', 'deflate-raw']
    : ['deflate-raw', 'deflate'];
  for (const format of order) {
    try {
      return await inflate(bytes, format);
    } catch (error) {
      if (error instanceof Failure) throw error;
    }
  }
  throw new Failure('malformed');
}

/** Decode the text after the "#" of a share link. Never throws; never returns markup. */
export async function decodeBrewlist(fragment: string): Promise<DecodeResult> {
  try {
    const payload = fragment.startsWith('#') ? fragment.slice(1) : fragment;
    if (payload.trim() === '') return { ok: false, reason: 'empty' };
    if (payload.length > LIMITS.maxFragmentChars) return { ok: false, reason: 'too-long' };

    const inflated = await inflateEither(base64UrlToBytes(payload.trim()));
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

/** Encode a list into the text that goes after the "#". Used by tests and fixture tooling. */
export async function encodeBrewlist(list: SharedBrewlist): Promise<string> {
  const bytes = new TextEncoder().encode(JSON.stringify(list));
  const stream = new Blob([bytes as BlobPart])
    .stream()
    .pipeThrough(new CompressionStream('deflate-raw'));
  const compressed = new Uint8Array(await new Response(stream).arrayBuffer());
  return bytesToBase64Url(compressed);
}
