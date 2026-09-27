/**
 * Precision Metrology Number, Date, and Export Formatting Utilities
 */

export function getDecimalPlacesFromE(e: number): number {
  if (e <= 0) return 3;
  const str = e.toString();
  if (str.includes('e-')) {
    return parseInt(str.split('e-')[1], 10) + 1;
  }
  const parts = str.split('.');
  // Add 1 extra decimal place for 0.1e changeover point resolution
  return parts.length > 1 ? Math.min(parts[1].length + 1, 6) : 2;
}

export function formatMassValue(value: number, e: number): string {
  const decimals = getDecimalPlacesFromE(e);
  return value.toFixed(decimals);
}

export function formatSignedError(value: number, e: number): string {
  const decimals = getDecimalPlacesFromE(e);
  const formatted = Math.abs(value).toFixed(decimals);
  if (Math.abs(value) < 1e-9) return `±${formatted}`;
  return value > 0 ? `+${formatted}` : `−${formatted}`;
}

export function formatIsoDate(isoString: string): string {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toISOString().slice(0, 10);
  } catch {
    return isoString;
  }
}

export function downloadTextFile(filename: string, content: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
