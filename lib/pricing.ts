export type PriceInput = { qtyAvailable?: number | null; clientPrice?: number | null; basePrice?: number | null };

export function visiblePrice(input: PriceInput): number | null {
  if (!input.qtyAvailable || input.qtyAvailable <= 0) return null;
  return input.clientPrice ?? input.basePrice ?? null;
}
