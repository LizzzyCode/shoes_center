// Kosongkan NEXT_PUBLIC_API_URL saat memakai Vercel Services (vercel dev / production)
// karena frontend dan backend berada pada domain yang sama (/api/...).
// Isi dengan "http://localhost:5000" hanya jika menjalankan frontend & backend terpisah.
export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
