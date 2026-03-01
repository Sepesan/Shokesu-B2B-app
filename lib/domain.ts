import { visiblePrice } from "@/lib/pricing";

export function computeAllocatedQty(requested: number, allocated: number | null | undefined, available: number): number {
  return Math.max(0, Math.min(allocated ?? requested, available));
}

export function shouldCreateNotify(existing: boolean): boolean {
  return !existing;
}

export function resolveVisiblePrice(qtyAvailable: number, clientPrice?: number | null, basePrice?: number | null): number | null {
  return visiblePrice({ qtyAvailable, clientPrice: clientPrice ?? null, basePrice: basePrice ?? null });
}
