import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SvgXml } from "react-native-svg";
import QRCodeGenerator from "qrcode-generator";
import { getBookingByQr } from "@/Api/logbook";

type Booking = {
  id?: number;
  qr_code?: string;
  booking_date?: string;
  booking_time?: string;
  purpose?: string;
  address?: string;
  contact_number?: string;
  status?: string;
  time_in?: string;
  time_out?: string;
};

export default function UserQr() {
  const router = useRouter();
  const { qrCode, token, name } = useLocalSearchParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [qrSvg, setQrSvg] = useState<string>("");

  const qrValue = typeof qrCode === "string" ? qrCode : "";
  const userName = typeof name === "string" ? name : "User";

  useEffect(() => {
    if (!qrValue) {
      return;
    }

    async function loadBooking() {
      setLoading(true);
      try {
        const response = await getBookingByQr(qrValue);
        if (response.status) {
          setBooking(response.data ?? null);
        } else {
          Alert.alert("Booking not found", response.message || "Unable to fetch booking.");
        }
      } catch (error: any) {
        Alert.alert("Error", error.message || "Unable to load booking.");
      } finally {
        setLoading(false);
      }
    }

    loadBooking();
  }, [qrValue]);

  useEffect(() => {
    if (!qrValue) {
      setQrSvg("");
      return;
    }

    try {
      const qr = QRCodeGenerator(0, "L");
      qr.addData(qrValue);
      qr.make();
      setQrSvg(qr.createSvgTag({ scalable: false, cellSize: 8 }));
    } catch (error: any) {
      console.warn("QR generation failed", error);
      setQrSvg("");
    }
  }, [qrValue]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Booking QR</Text>
      <Text style={styles.subtitle}>Hello, {userName}</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#3b82f6" />
      ) : qrValue ? (
        booking ? (
          <View style={styles.content}>
            <View style={styles.qrBox}>
              {qrSvg ? (
                <SvgXml xml={qrSvg} width={220} height={220} />
              ) : (
                <Text style={styles.emptyText}>Unable to render QR code.</Text>
              )}
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.label}>Booking ID</Text>
              <Text style={styles.value}>{booking.id}</Text>
              <Text style={styles.label}>Purpose</Text>
              <Text style={styles.value}>{booking.purpose}</Text>
              <Text style={styles.label}>Date</Text>
              <Text style={styles.value}>{booking.booking_date}</Text>
              <Text style={styles.label}>Time</Text>
              <Text style={styles.value}>{booking.booking_time}</Text>
              <Text style={styles.label}>Status</Text>
              <Text style={styles.status}>{booking.status}</Text>
              {booking.time_in ? (
                <Text style={styles.statusDetail}>Time In: {booking.time_in}</Text>
              ) : null}
              {booking.time_out ? (
                <Text style={styles.statusDetail}>Time Out: {booking.time_out}</Text>
              ) : null}
            </View>
          </View>
        ) : (
          <Text style={styles.emptyText}>Booking details are not available for this QR code.</Text>
        )
      ) : (
        <Text style={styles.emptyText}>No booking QR code was found. Please create a booking first.</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Back to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#0f172a",
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 4,
  },
  subtitle: {
    color: "#94a3b8",
    marginBottom: 20,
  },
  content: {
    flex: 1,
    alignItems: "center",
  },
  qrBox: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 24,
    marginBottom: 24,
  },
  infoCard: {
    width: "100%",
    backgroundColor: "#1e293b",
    borderRadius: 24,
    padding: 18,
  },
  label: {
    color: "#94a3b8",
    fontSize: 12,
    marginTop: 14,
  },
  value: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  status: {
    color: "#60a5fa",
    fontSize: 16,
    fontWeight: "700",
  },
  statusDetail: {
    color: "#cbd5e1",
    marginTop: 4,
    fontSize: 14,
  },
  emptyText: {
    color: "#94a3b8",
    marginTop: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#3b82f6",
    paddingVertical: 16,
    alignItems: "center",
    borderRadius: 16,
    marginTop: 24,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
