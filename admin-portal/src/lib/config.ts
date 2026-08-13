export const getApiBaseUrl = () => {
  if (typeof window !== "undefined") {
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      return "http://localhost:4000";
    }
    if (window.location.hostname.includes("greatcampus.in")) {
      return "https://api.niva.greatcampus.in";
    }
  }
  return process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "https://api.niva.greatcampus.in";
};
