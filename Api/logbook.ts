const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export interface BookingPayload {
  booking_date: string;
  booking_time: string;
  purpose: string;
  address: string;
  contact_number: string;
}

export interface Booking {
  id?: number;
  qr_code?: string;
  user_id?: number;
  purpose?: string;
  booking_date?: string;
  booking_time?: string;
  address?: string;
  contact_number?: string;
  status?: string;
  time_in?: string;
  time_out?: string;
  user?: {
    name?: string;
  };
}

export async function createBooking(
  token: string,
  payload: BookingPayload
): Promise<{ status: boolean; message: string; data?: Booking }> {
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

export async function getBookingByQr(qrCode: string): Promise<{ status: boolean; data?: Booking; message?: string }> {
  if (!BASE_URL) {
    throw new Error("API base URL is not configured");
  }

  const response = await fetch(`${BASE_URL}/api/logbooks/qr/${encodeURIComponent(qrCode)}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(json?.message || "Failed to fetch booking by QR");
  }

  return json;
}

export async function scanBooking(qrCode: string): Promise<{ status: boolean; data?: Booking; message?: string }> {
  if (!BASE_URL) {
    throw new Error("API base URL is not configured");
  }

  const response = await fetch(`${BASE_URL}/api/logbooks/scan`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ qr_code: qrCode }),
  });

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(json?.message || "Failed to scan booking");
  }

  return json;
}

export async function updateBookingStatus(id: number, status: string): Promise<{ status: boolean; message: string; data?: Booking }> {
  if (!BASE_URL) {
    throw new Error("API base URL is not configured");
  }

  const response = await fetch(`${BASE_URL}/api/logbooks/${id}/status`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ status }),
  });

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(json?.message || "Failed to update booking status");
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

export async function getAdminLogbooks(): Promise<any[]> {
  if (!BASE_URL) {
    throw new Error("API base URL is not configured");
  }

  const response = await fetch(`${BASE_URL}/api/logbooks`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(json?.message || "Failed to fetch admin logbooks");
  }

  return json;
}

export async function getAdminLogsByStatus(status: string): Promise<any[]> {
  const logs = await getAdminLogbooks();
  return logs.filter(
    (log) => typeof log.status === "string" && log.status.toLowerCase() === status.toLowerCase()
  );
}

export async function getAdminLogbookStats(): Promise<{
  pending: number;
  approved: number;
  done: number;
  rejected: number;
}> {
  const logs = await getAdminLogbooks();

  return logs.reduce(
    (acc, log) => {
      const status = typeof log.status === "string" ? log.status.toLowerCase() : "";

      if (status === "pending") acc.pending += 1;
      if (status === "approved") acc.approved += 1;
      if (status === "done") acc.done += 1;
      if (status === "rejected") acc.rejected += 1;

      return acc;
    },
    { pending: 0, approved: 0, done: 0, rejected: 0 }
  );
}
