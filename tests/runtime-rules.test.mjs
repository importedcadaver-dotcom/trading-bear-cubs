import { describe, expect, it } from "vitest";
import { isBlocked } from "../src/lib/collision-rules.mjs";
import { prepareImportedSave } from "../src/lib/save-migrations.mjs";
import { exchange } from "../src/lib/inventory-rules.mjs";

const rules = {
  items: { berry: {} },
  locations: { post: {}, den: {} },
  origins: { post: [193, 346], den: [348, 326] },
  cubs: [{ id: "fern", name: "Fern", title: "Collector", quote: "I like stories." }],
  migrateV2: () => {},
  migrateV3: () => {},
  migrateV4: () => {},
  migrateV5: () => {},
};
function save() {
  return { version: 1, day: 1, inv: { berry: 2 }, npcs: [
    { id: "fern", name: "Old label", inv: { berry: 1 }, reservedInv: { berry: true } },
  ] };
}

describe("production runtime rules", () => {
  it("compares both inventories before applying a reciprocal transfer", () => {
    const first = { berry: 2 };
    const second = { stick: 1 };
    expect(exchange(first, second, { berry: 1 }, { stick: 2 })).toBe(false);
    expect(first).toEqual({ berry: 2 });
    expect(second).toEqual({ stick: 1 });
    expect(exchange(first, second, { berry: 1 }, { stick: 1 })).toBe(true);
    expect(first).toEqual({ berry: 1, stick: 1 });
    expect(second).toEqual({ berry: 1 });
  });
  it("shares scenery boundaries across actor types", () => {
    expect(isBlocked("den", 410, 290)).toBe(true);
    expect(isBlocked("post", 270, 345)).toBe(true);
    expect(isBlocked("woods", 270, 345)).toBe(false);
    expect(isBlocked("den", 20, 200)).toBe(true);
  });

  it("migrates the reservation format still written by older games", () => {
    const original = save();
    const candidate = prepareImportedSave(original, rules);
    expect(candidate.npcs[0].reservedInv.berry).toBe(1);
    expect(candidate.npcs[0].name).toBe("Fern");
    expect(candidate.npcs[0].inv.berry).toBe(1);
    expect(original.npcs[0].reservedInv.berry).toBe(true);
    expect(original.npcs[0].name).toBe("Old label");
  });

  it("rejects an invalid quantity without altering the supplied save", () => {
    const original = save();
    original.inv.berry = -1;
    expect(() => prepareImportedSave(original, rules)).toThrow(/invalid item quantities/);
    expect(original.inv.berry).toBe(-1);
  });
});
