export function normalizeName(value: string): string {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

export function cleanDescription(value: string | undefined): string {
  if (!value) return "";
  const beforeDelimiter = value.split("//////////")[0] ?? "";
  return beforeDelimiter.replace(/#[^\s#]+/g, "").trim();
}
