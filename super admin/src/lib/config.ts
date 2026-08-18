export function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    // If testing on localhost
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      return "http://localhost:4000";
    }
    // Production API
    return "https://api.niva.greatcampus.in";
  }
  return process.env.NEXT_PUBLIC_API_URL || "https://api.niva.greatcampus.in";
}
