export const API_URL = `${import.meta.env.VITE_API_BASE ?? "http://localhost:5000"}/api`;

export const getAuthHeaders = () => {
  const isBrowser = typeof window !== "undefined";
  const token = isBrowser ? localStorage.getItem("token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_URL}${endpoint}`;

  const headers = {
    ...getAuthHeaders(),
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 401) {
      // Handle unauthorized (clear token, redirect to login)
      localStorage.removeItem("token");
      window.dispatchEvent(new Event("auth-error"));
    }
    throw new Error(data.message || data.error || "An error occurred");
  }

  return data;
};
