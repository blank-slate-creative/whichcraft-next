/**
 * The objectionable-content filter for a shared list's title (App Review Guideline 1.2; blank-slate
 * issue 1477, Legal memo R5).
 *
 * The title is the only text in a share that the sender types: every beer field comes from the
 * catalog. The app won't share a title that fails, and neither the app nor this page shows one. The
 * list still opens, untitled, so a link behaves the same in both places.
 *
 * Two rules: no links or email addresses, and none of a short list of slurs and obscenities,
 * matched as whole words after folding case, accents, and common digit-for-letter swaps.
 *
 * WhichCraft-iOS applies the same rules and lists (`WhichCraft/Data/Sharing/ShareTitleFilter.swift`).
 * Change both together.
 */

export type TitleRejection = 'link' | 'language';

export const TOP_LEVEL_DOMAINS = [
  'com',
  'net',
  'org',
  'io',
  'co',
  'beer',
  'ly',
  'me',
  'app',
  'xyz',
  'info',
  'biz',
  'us',
  'uk',
  'ru',
  'tk',
  'gg',
  'tv',
  'link',
  'site',
  'online',
  'club',
  'top',
  'shop',
  'store',
  'live',
  'fun',
  'ai',
  'dev',
  'gl',
  'be',
  'to',
  'cc',
  'ws',
];

const LINK = new RegExp(
  `://|www\\.|[^\\s@]+@[^\\s@]+\\.[a-z]{2,}|[a-z0-9-]\\.(${TOP_LEVEL_DOMAINS.join('|')})(?![a-z0-9])`,
  'i'
);

/** Blocked as whole words. */
export const BLOCKED_WORDS = new Set([
  'asshole',
  'assholes',
  'bitch',
  'bitches',
  'bollocks',
  'bullshit',
  'chink',
  'chinks',
  'cunt',
  'cunts',
  'dyke',
  'dykes',
  'fag',
  'fags',
  'faggot',
  'faggots',
  'heil',
  'hitler',
  'kike',
  'kikes',
  'kkk',
  'kys',
  'nazi',
  'nazis',
  'nigga',
  'niggas',
  'nigger',
  'niggers',
  'porn',
  'porno',
  'pussy',
  'rape',
  'raped',
  'rapist',
  'retard',
  'retarded',
  'retards',
  'shit',
  'shits',
  'shitty',
  'slut',
  'sluts',
  'spic',
  'spics',
  'tranny',
  'trannies',
  'twat',
  'wank',
  'wanker',
  'wetback',
  'wetbacks',
  'whore',
  'whores',
]);

/** Blocked at the start of any word. Only roots that start no ordinary word. */
export const BLOCKED_PREFIXES = ['fuck', 'motherfuck', 'cunt', 'nigger', 'faggot', 'shit', 'bitch'];

const SWAPS: Record<string, string> = {
  '0': 'o',
  '1': 'i',
  '3': 'e',
  '4': 'a',
  '5': 's',
  '7': 't',
  '@': 'a',
  $: 's',
  '!': 'i',
};

/**
 * A letter, for splitting words: anything with upper and lower case (Latin, Greek, Cyrillic), and
 * the uncased scripts from U+2E80 up (CJK and others). Every blocked word is Latin, so this only
 * has to split Latin correctly.
 */
function isLetter(ch: string): boolean {
  return ch.toLowerCase() !== ch.toUpperCase() || (ch.codePointAt(0) ?? 0) >= 0x2e80;
}

/** Lowercased, accents folded, swaps undone, then split on anything that isn't a letter. */
export function titleWords(text: string): string[] {
  const folded = text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  const words: string[] = [];
  let current = '';
  for (const raw of Array.from(folded)) {
    const ch = SWAPS[raw] ?? raw;
    if (isLetter(ch)) {
      current += ch;
    } else if (current !== '') {
      words.push(current);
      current = '';
    }
  }
  if (current !== '') words.push(current);
  return words;
}

function hasBlockedWord(text: string): boolean {
  const words = titleWords(text);
  // Spaced-out letters ("f u c k") read as one word too.
  const singles = words.filter(word => Array.from(word).length === 1).join('');
  const candidates = Array.from(singles).length > 2 ? [...words, singles] : words;
  return candidates.some(
    word => BLOCKED_WORDS.has(word) || BLOCKED_PREFIXES.some(prefix => word.startsWith(prefix))
  );
}

/** Null when the title may be shown. */
export function titleRejection(title: string): TitleRejection | null {
  const lowered = title.toLowerCase();
  if (LINK.test(lowered)) return 'link';
  if (hasBlockedWord(lowered)) return 'language';
  return null;
}
