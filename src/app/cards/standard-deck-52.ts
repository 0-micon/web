/**
 * Standard 52-card deck
 */

export const SUITS = 'SDCH';
export const SUIT_NUM = SUITS.length;

export const SUIT_CHARACTERS: Readonly<string[]> = Array.from(SUITS);
export const SUIT_PLAY_NAMES: Readonly<string[]> = ['♠', '♦', '♣', '♥'];
export const SUIT_FULL_NAMES: Readonly<string[]> = ['spades', 'diamonds', 'clubs', 'hearts'];

/**
 * Special Symbol Character Codes for HTML
 */
export const SUIT_HTML_CODES: Readonly<string[]> = ['&spades;', '&diams;', '&clubs;', '&hearts;'];

export const RANKS = 'A23456789TJQK';
export const RANK_NUM = RANKS.length;

export const RANK_CHARACTERS: Readonly<string[]> = Array.from(RANKS);
export const RANK_PLAY_NAMES: Readonly<string[]> = [
  'A',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'J',
  'Q',
  'K'
];
export const RANK_FULL_NAMES: Readonly<string[]> = [
  'Ace',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Jack',
  'Queen',
  'King'
];

export const CARD_NUM = SUIT_NUM * RANK_NUM;

/**
 * Returns card index [0, CARD_NUM). It's defined as: suit + rank * SUIT_NUM.
 * @param s card suit [0, SUIT_NUM)
 * @param r card rank [0, RANK_NUM)
 */
export function indexOf(s: number, r: number): number {
  return s + r * SUIT_NUM;
}

/**
 * Returns card rank [0, RANK_NUM)
 * @param index card index [0, CARD_NUM)
 */
export function rankOf(index: number): number {
  return Math.floor(index / SUIT_NUM);
}

/**
 * Returns card suit [0, SUIT_NUM)
 * @param index card index [0, CARD_NUM)
 */
export function suitOf(index: number): number {
  return index % SUIT_NUM;
}

// Card names:
export function nameOf(index: number): string {
  return RANK_CHARACTERS[rankOf(index)] + SUIT_CHARACTERS[suitOf(index)];
}

export function playNameOf(index: number): string {
  return RANK_PLAY_NAMES[rankOf(index)] + SUIT_PLAY_NAMES[suitOf(index)];
}

export function fullNameOf(index: number): string {
  return RANK_FULL_NAMES[rankOf(index)] + ' of ' + SUIT_FULL_NAMES[suitOf(index)];
}

// Suit names:
export function suitNameOf(index: number): string {
  return SUIT_CHARACTERS[suitOf(index)];
}

export function suitPlayNameOf(index: number): string {
  return SUIT_PLAY_NAMES[suitOf(index)];
}

export function suitFullNameOf(index: number) {
  return SUIT_FULL_NAMES[suitOf(index)];
}

export function suitHTMLCodeOf(index: number) {
  return SUIT_HTML_CODES[suitOf(index)];
}

// Rank names:
export function rankNameOf(index: number) {
  return RANK_CHARACTERS[rankOf(index)];
}

export function rankPlayNameOf(index: number) {
  return RANK_PLAY_NAMES[rankOf(index)];
}

export function rankFullNameOf(index: number) {
  return RANK_FULL_NAMES[rankOf(index)];
}

// A set of optionally shuffled playing cards.
export function createDeck(seed?: number): number[] {
  const cards: number[] = [];
  if (seed === undefined) {
    for (let i = 0; i < CARD_NUM; i++) {
      cards.push(i);
    }
  } else {
    // use LCG algorithm to pick up cards from the deck
    // http://en.wikipedia.org/wiki/Linear_congruential_generator
    const m = 0x80000000;
    const a = 1103515245;
    const c = 12345;

    for (let i = 0; i < CARD_NUM; i++) {
      seed = (a * seed + c) % m;

      let card = seed % CARD_NUM;
      while (cards.indexOf(card) >= 0) {
        card = (card + 1) % CARD_NUM;
      }
      cards.push(card);
    }
  }
  return cards;
}

export function stackIndexOf(cardPosition: number): number {
  return Math.floor(cardPosition / CARD_NUM);
}

export function stackOffsetOf(cardPosition: number): number {
  return cardPosition % CARD_NUM;
}

export function stackPositionOf(stackIndex: number, stackOffset: number): number {
  return stackIndex * CARD_NUM + stackOffset;
}

export function toDeck(stacks: number[][]): number[] {
  const deck = Array(CARD_NUM).fill(-1);
  for (let stackIndex = 0; stackIndex < stacks.length; stackIndex++) {
    const stack = stacks[stackIndex];
    for (let stackOffset = 0; stackOffset < stack.length; stackOffset++) {
      const card = stack[stackOffset];
      if (card >= 0) {
        deck[card] = stackPositionOf(stackIndex, stackOffset);
      }
    }
  }
  return deck;
}

export function toStacks(deck: number[]): number[][] {
  const stacks: number[][] = [];
  for (let card = 0; card < deck.length; card++) {
    const cardPosition = deck[card];
    if (cardPosition >= 0) {
      const stackIndex = stackIndexOf(cardPosition);
      const stackOffset = stackOffsetOf(cardPosition);
      while (stacks.length <= stackIndex) {
        stacks.push([]);
      }
      const stack = stacks[stackIndex];
      while (stack.length <= stackOffset) {
        stack.push(-1);
      }
      stack[stackOffset] = card;
    }
  }
  return stacks;
}
