// Shared API base URL for all owner dashboard requests
export const API_BASE = "http://localhost:3000/api";

/**
 * Helper: fetch with ownerToken cookie credentials.
 * Throws on non-2xx responses; returns parsed JSON data.
 */
export const ownerFetch = async (path, options = {}) => {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include", // send ownerToken cookie
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }

  return data;
};
