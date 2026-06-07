const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

interface LogbookPayload {
  date: string;
  activity: string;
  address: string;
  contact_number: string;
  time_in?: string;
  time_out?: string;
}

export async function createLogbook(
  token: string,
  payload: LogbookPayload
): Promise<{ status: boolean; message: string }> {
  if (!BASE_URL) {
    throw new Error("API base URL is not configured");
  }

  if (!token) {
    throw new Error("Authentication token is required");
  }

  const response = await fetch(`${BASE_URL}/api/logbooks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(json?.message || "Failed to create booking");
  }

  return json;
}

export async function getUserLogbooks(token: string): Promise<any[]> {
  if (!BASE_URL) {
    throw new Error("API base URL is not configured");
  }

  if (!token) {
    throw new Error("Authentication token is required");
  }

  const response = await fetch(`${BASE_URL}/api/user/logbooks`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(json?.message || "Failed to fetch bookings");
  }

  return json;
}
