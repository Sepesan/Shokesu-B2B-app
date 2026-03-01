import { describe, expect, it } from "vitest";
import { computeAllocatedQty, resolveVisiblePrice, shouldCreateNotify } from "@/lib/domain";

describe("price visibility rule", () => {
  it("hides price when out of stock", () => {
    expect(resolveVisiblePrice(0, 88, 50)).toBeNull();
  });
  it("shows client price if in stock", () => {
    expect(resolveVisiblePrice(2, 88, 50)).toBe(88);
  });
});

describe("request approval allocation", () => {
  it("decrements inventory by allocated capped at available", () => {
    const allocated = computeAllocatedQty(10, 8, 5);
    const remaining = 5 - allocated;
    expect(allocated).toBe(5);
    expect(remaining).toBe(0);
  });
});

describe("notify idempotent", () => {
  it("does not create second notification", () => {
    expect(shouldCreateNotify(true)).toBe(false);
    expect(shouldCreateNotify(false)).toBe(true);
  });
});
