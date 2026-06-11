import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getUserLogbooks } from "@/Api/logbook";

type Booking = {
  id?: number;
  booking_date?: string;
  booking_time?: string;
  purpose?: string;
  address?: string;
  contact_number?: string;
  status?: string;
  time_in?: string;
  time_out?: string;
};

export default function BookingHistory() {
  const { token } = useLocalSearchParams();
  const authToken = typeof token === "string" ? token : "";
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      setLoading(true);
      try {
        const data = await getUserLogbooks(authToken);
        setBookings(Array.isArray(data) ? data : []);
      } catch (error: any) {
        Alert.alert("Unable to load history", error.message || "Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, [authToken]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking History</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#3b82f6" />
      ) : bookings.length === 0 ? (
        <Text style={styles.emptyText}>No booking history available.</Text>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {bookings.map((booking) => (
            <View key={booking.id?.toString() ?? booking.booking_date} style={styles.card}>
              <Text style={styles.label}>{booking.purpose}</Text>
              <Text style={styles.text}>Date: {booking.booking_date}</Text>
              <Text style={styles.text}>Time: {booking.booking_time}</Text>
              <Text style={styles.text}>Status: {booking.status}</Text>
              <Text style={styles.text}>Time In: {booking.time_in ?? '-'}</Text>
              <Text style={styles.text}>Time Out: {booking.time_out ?? '-'}</Text>
            </View>
          ))}
        </ScrollView>
      )}
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
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
  },
  label: {
    color: "#60a5fa",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
  },
  text: {
    color: "#cbd5e1",
    fontSize: 14,
    marginBottom: 4,
  },
  emptyText: {
    color: "#94a3b8",
    marginTop: 20,
  },
});
