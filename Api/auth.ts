const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthResponse {
  status: boolean;
  message: string;
  user: User;
  token: string;
  role?: string;
}

export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  if (!BASE_URL) {
    throw new Error("API base URL is not configured");
  }

  // Validate input
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const response = await fetch(`${BASE_URL}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(json?.message || "Invalid email or password");
  }

  return json;
}

export async function register(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  if (!BASE_URL) {
    throw new Error("API base URL is not configured");
  }

  // Validate input
  if (!name || !email || !password) {
    throw new Error("Name, email, and password are required");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  const response = await fetch(`${BASE_URL}/api/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(json?.message || "Registration failed");
  }

  return json;
}

export async function logout(token: string): Promise<{ status: boolean; message: string }> {
  if (!BASE_URL) {
    throw new Error("API base URL is not configured");
  }

  if (!token) {
    throw new Error("Token is required");
  }

  const response = await fetch(`${BASE_URL}/api/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(json?.message || "Logout failed");
  }

  return json;
}