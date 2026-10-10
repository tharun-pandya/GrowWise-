/**
 * API Configuration for GrowWise
 * Uses VITE_API_BASE_URL if configured (e.g. Render Web Service URL in production),
 * otherwise defaults to '' for relative paths in local dev / same-origin proxy.
 */
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export function getApiUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
}
