import { describe, expect, it } from 'vitest';
import { titleRejection } from './titleFilter';
import { decodeBrewlist, encodeBrewlist } from './brewlist';

// The same cases as WhichCraft-iOS's ShareTitleFilterTests.
describe('titleRejection', () => {
  it.each([
    'Friday night picks',
    'St. Louis trip',
    'No.1 IPAs',
    'Top 10 sours',
    'Cocktail-hour stouts',
    'Classic lagers',
    'Arrogant Bastard and friends',
    'Dr. Pepper beers',
    'A to Z',
    'Hazy & juicy',
    'Brewlist 2026',
    'Beers @ the lake',
  ])('allows %s', title => {
    expect(titleRejection(title)).toBeNull();
  });

  it.each([
    'https://example.com',
    'see www.example',
    'bit.ly/abc',
    'promo.xyz deals',
    'Mail me: a@b.co',
    'WHICHCRAFT.BEER',
  ])('rejects the link in %s', title => {
    expect(titleRejection(title)).toBe('link');
  });

  it.each(['shit beers', 'SH1T beers', 'f u c k this', 'fuckin good', 'Bullshit IPAs', 'sh!tty'])(
    'rejects the language in %s',
    title => {
      expect(titleRejection(title)).toBe('language');
    }
  );
});

describe('a shared list with a failing title', () => {
  it('opens untitled', async () => {
    const fragment = await encodeBrewlist({
      v: 1,
      title: 'go to example.com',
      beers: [{ name: 'Pliny the Elder', producer: 'Russian River', liked: true }],
    });
    const result = await decodeBrewlist(fragment);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.list.title).toBeUndefined();
      expect(result.list.beers).toHaveLength(1);
    }
  });
});
