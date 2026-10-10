/**
 * API Configuration for GrowWise
 * Supports both VITE_API_URL and VITE_API_BASE_URL.
 * If neither is provided, defaults to empty string '' for relative URLs
 * (which works in local development and reverse-proxy setups).
 */
export const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  ''
).replace(/\/$/, '');

export function getApiUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
}
