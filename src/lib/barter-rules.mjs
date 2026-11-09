// Pure utilities for the staged extraction of the legacy inline game.
// The CURRENT runtime still contains a copy of the no-op guard; Playwright
// integration tests verify actual behavior independently of these unit tests.
export function normalizedGoods(goods = {}) {
  return Object.fromEntries(Object.entries(goods)
    .filter(([id, count]) => id && Number.isInteger(count) && count > 0)
    .map(([id, count]) => [id, count]));
}

export function isNullBarter(offered = {}, requested = {}) {
  const left = normalizedGoods(offered);
  const right = normalizedGoods(requested);
  const keys = new Set([...Object.keys(left), ...Object.keys(right)]);
  return keys.size > 0 && [...keys].every(id => (left[id] || 0) === (right[id] || 0));
}

export function transferDelta(offered = {}, requested = {}) {
  const left = normalizedGoods(offered), right = normalizedGoods(requested);
  const keys = new Set([...Object.keys(left), ...Object.keys(right)]);
  return Object.fromEntries([...keys].map(id => [id, (right[id] || 0) - (left[id] || 0)])
    .filter(([, amount]) => amount !== 0));
}

export function canPay(inventory, goods) {
  return Object.entries(normalizedGoods(goods))
    .every(([id, count]) => Number.isInteger(inventory[id] || 0) && (inventory[id] || 0) >= count);
}

export function applyDelta(inventory, delta) {
  const next = { ...inventory };
  for (const [id, count] of Object.entries(delta)) {
    if (!Number.isInteger(count)) throw new Error('Noninteger item transaction');
    next[id] = (next[id] || 0) + count;
    if (next[id] < 0) throw new Error('Negative inventory quantity');
  }
  return next;
}
