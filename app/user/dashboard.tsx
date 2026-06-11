import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { createBooking, getUserLogbooks } from "../../Api/logbook";

type Booking = {
  id?: number;
  qr_code?: string;
  qrCode?: string;
  booking_date: string;
  booking_time?: string;
  purpose: string;
  address: string;
  contact_number: string;
  status?: string;
  time_in?: string;
  time_out?: string;
};

export default function UserDashboard() {
  const { token, name } = useLocalSearchParams();
  const router = useRouter();
  const authToken = typeof token === "string" ? token : "";
  const userName = typeof name === "string" ? name : "User";

  const [date, setDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [purpose, setPurpose] = useState("");
  const [address, setAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const getQrCode = (booking?: Booking) => booking?.qr_code || booking?.qrCode || "";
  const latestQrBooking = bookings.find((booking) => Boolean(getQrCode(booking)));

  useEffect(() => {
    if (authToken) {
      loadBookings();
    }
  }, [authToken]);

  const loadBookings = async () => {
    setIsLoadingBookings(true);
    try {
      const data = await getUserLogbooks(authToken);
      setBookings(Array.isArray(data) ? data : []);
    } catch (error: any) {
      Alert.alert("Unable to load bookings", error.message || "Please try again");
    } finally {
      setIsLoadingBookings(false);
    }
  };

  const handleSubmitBooking = async () => {
    if (!authToken) {
      Alert.alert("Please sign in", "You must be logged in to create a booking.");
      router.replace("/");
      return;
    }

    if (!date || !purpose.trim() || !address.trim() || !contactNumber.trim()) {
      Alert.alert("Validation Error", "All fields are required.");
      return;
    }

    if (contactNumber.length < 7) {
      Alert.alert("Validation Error", "Contact number is too short.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        date,
        activity: purpose.trim(),
        address: address.trim(),
        contact_number: contactNumber.trim(),
      };

      const response = await createBooking(authToken, payload);
      if (response.status) {
        Alert.alert("Booked", response.message || "Booking request sent successfully.");
        setBookings((current) => [
          {
            id: response.data?.id ?? Date.now(),
            qr_code: response.data?.qr_code,
            booking_date: response.data?.booking_date ?? date,
            purpose: purpose.trim(),
            address: address.trim(),
            contact_number: contactNumber.trim(),
            status: "pending",
          },
          ...current,
        ]);
        setPurpose("");
        setAddress("");
        setContactNumber("");
      }
    } catch (error: any) {
      Alert.alert("Booking failed", error.message || "Could not create booking.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openQrCode = (booking?: Booking) => {
    const qrCode = getQrCode(booking);

    if (!booking) {
      Alert.alert("No booking", "Please create a booking first.");
      return;
    }

    if (!qrCode) {
      Alert.alert("No QR code", "This booking does not have a QR code yet.");
      return;
    }

    router.push(
      `/user/qr?qrCode=${encodeURIComponent(
        qrCode
      )}&token=${encodeURIComponent(authToken)}&name=${encodeURIComponent(
        userName
      )}`
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Hello,</Text>
          <Text style={styles.userName}>{userName}</Text>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => router.replace("/")}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => openQrCode(latestQrBooking)}
        >
          <Text style={styles.secondaryButtonText}>My QR Code</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() =>
            router.push(
              `/user/history?token=${encodeURIComponent(authToken)}&name=${encodeURIComponent(
                userName
              )}`
            )
          }
        >
          <Text style={styles.secondaryButtonText}>Booking History</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Book a Log Entry</Text>
        <TextInput
          style={styles.input}
          value={date}
          onChangeText={setDate}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#9ca3af"
        />
        <TextInput
          style={styles.input}
          value={purpose}
          onChangeText={setPurpose}
          placeholder="Purpose"
          placeholderTextColor="#9ca3af"
        />
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="Address"
          placeholderTextColor="#9ca3af"
        />
        <TextInput
          style={styles.input}
          value={contactNumber}
          onChangeText={setContactNumber}
          placeholder="Contact Number"
          placeholderTextColor="#9ca3af"
          keyboardType="phone-pad"
        />

        <TouchableOpacity
          style={[styles.button, isSubmitting && styles.buttonDisabled]}
          onPress={handleSubmitBooking}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Submit Booking</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Bookings</Text>
        {isLoadingBookings ? (
          <ActivityIndicator size="large" color="#3b82f6" />
        ) : bookings.length === 0 ? (
          <Text style={styles.emptyText}>No bookings yet. Create one now.</Text>
        ) : (
          bookings.map((booking) => (
            <TouchableOpacity
              key={booking.id?.toString() ?? booking.booking_date}
              style={[
                styles.bookingCard,
                getQrCode(booking) && styles.bookingCardPressable,
              ]}
              onPress={() => openQrCode(booking)}
              activeOpacity={0.85}
            >
              <View style={styles.bookingRow}>
                <Text style={styles.bookingLabel}>Date</Text>
                <Text style={styles.bookingValue}>{booking.booking_date}</Text>
              </View>
              <View style={styles.bookingRow}>
                <Text style={styles.bookingLabel}>Purpose</Text>
                <Text style={styles.bookingValue}>{booking.purpose}</Text>
              </View>
              <View style={styles.bookingRow}>
                <Text style={styles.bookingLabel}>Contact</Text>
                <Text style={styles.bookingValue}>{booking.contact_number}</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{booking.status ?? "pending"}</Text>
              </View>
              {getQrCode(booking) ? (
                <Text style={styles.qrHint}>Tap to view QR code</Text>
              ) : null}
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  welcome: {
    color: "#94a3b8",
    fontSize: 14,
  },
  userName: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
  },
  logoutButton: {
    backgroundColor: "#db2777",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "700",
  },
  section: {
    backgroundColor: "#1e293b",
    borderRadius: 24,
    padding: 18,
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#0f172a",
    borderColor: "#334155",
    borderWidth: 1,
    borderRadius: 14,
    color: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#3b82f6",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: "#64748b",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#1d4ed8",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginRight: 10,
  },
  secondaryButtonDisabled: {
    backgroundColor: "#475569",
  },
  secondaryButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  emptyText: {
    color: "#94a3b8",
    fontSize: 14,
  },
  bookingCard: {
    backgroundColor: "#0f172a",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  bookingCardPressable: {
    borderColor: "#3b82f6",
  },
  bookingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  bookingLabel: {
    color: "#94a3b8",
    fontSize: 12,
  },
  bookingValue: {
    color: "#fff",
    fontSize: 14,
    flex: 1,
    textAlign: "right",
  },
  statusBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#2563eb",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  statusText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },
  qrHint: {
    color: "#60a5fa",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 10,
  },
});
