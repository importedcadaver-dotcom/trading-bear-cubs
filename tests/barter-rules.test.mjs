import { describe, it, expect } from 'vitest';
import { isNullBarter, transferDelta, canPay, applyDelta } from '../src/lib/barter-rules.mjs';

describe('trading conservation, null-deal exploit and validation', () => {
  it('rejects exactly identical berry-for-berry exchanges', () => {
    expect(isNullBarter({ berry: 1 }, { berry: 1 })).toBe(true);
    expect(isNullBarter({ berry: 3, stick: 1 }, { stick: 1, berry: 3 })).toBe(true);
    expect(isNullBarter({ berry: 1 }, { berry: 2 })).toBe(false);
  });
  it('does not treat empty offers as valid no-op trades', () => {
    expect(isNullBarter({}, {})).toBe(false);
    expect(isNullBarter({ berry: 1 }, {})).toBe(false);
  });
  it('conserves item quantities between the two participants', () => {
    const a = { berry: 5, stick: 1 }, b = { fish: 2, berry: 1 };
    const offer = { berry: 2 }, request = { fish: 1 };
    expect(canPay(a, offer) && canPay(b, request)).toBe(true);
    const delta = transferDelta(offer, request);
    const nA = applyDelta(a, delta), nB = applyDelta(b,
      Object.fromEntries(Object.entries(delta).map(([id, num]) => [id, -num])));
    for (const id of ['berry', 'stick', 'fish'])
      expect((nA[id] || 0) + (nB[id] || 0)).toBe((a[id] || 0) + (b[id] || 0));
    expect(nA.fish).toBe(1);
    expect(nB.berry).toBe(3);
  });
  it('rejects spending absent stock', () => {
    expect(canPay({ berry: 1 }, { berry: 2 })).toBe(false);
    expect(() => applyDelta({ berry: 1 }, { berry: -2 })).toThrow('Negative');
  });
  it('ignores invalid positive item quantities in normalization', () => {
    expect(transferDelta({ berry: 0, stick: 1 }, { fish: 1 })).toEqual({ stick: -1, fish: 1 });
  });
});
