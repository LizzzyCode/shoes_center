// Kosongkan NEXT_PUBLIC_API_URL saat memakai Vercel Services (vercel dev / production)
// karena frontend dan backend berada pada domain yang sama (/api/...).
// Isi dengan "http://localhost:5000" hanya jika menjalankan frontend & backend terpisah.
export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");

/**
 * Safely parse a fetch Response as JSON. Returns null when the server responds
 * with non-JSON payloads (e.g. Vercel text/plain 500 or HTML 502/504 pages),
 * preventing SyntaxError from being misreported as a network failure.
 */
export async function parseJsonSafe<T = Record<string, any>>(res: Response): Promise<T | null> {
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return null;
  }
  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
}
