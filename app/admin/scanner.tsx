import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { CameraView, useCameraPermissions, type BarcodeScanningResult } from "expo-camera";
import { useRouter } from "expo-router";
import { scanBooking, updateBookingStatus } from "@/Api/logbook";

type Booking = {
  id?: number;
  qr_code?: string;
  purpose?: string;
  booking_date?: string;
  booking_time?: string;
  address?: string;
  contact_number?: string;
  status?: string;
  time_in?: string;
  time_out?: string;
  user?: { name?: string };
};

export default function Scanner() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [lastResult, setLastResult] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);

  const handleScanQr = async (qrCode: string) => {
    if (!qrCode.trim() || scanned || loading) {
      return;
    }

    setScanned(true);
    setLoading(true);

    try {
      const response = await scanBooking(qrCode.trim());

      if (response.status) {
        setLastResult(response.data ?? null);
        Alert.alert("Scan successful", response.message || "Booking scanned successfully.");
      } else {
        setLastResult(null);
        Alert.alert("Scan error", response.message || "Unable to process this QR code.");
      }
    } catch (error: any) {
      setLastResult(null);
      Alert.alert("Scan failed", error.message || "Unable to process QR code.");
    } finally {
      setLoading(false);
      setTimeout(() => setScanned(false), 2000);
    }
  };

  const handleBarcodeScanned = ({ data }: BarcodeScanningResult) => {
    handleScanQr(data);
  };

  const handleUpdateStatus = async (id?: number, status?: string) => {
    if (!id || !status) {
      return;
    }

    setLoading(true);
    try {
      const response = await updateBookingStatus(id, status);
      if (response.status) {
        Alert.alert("Success", response.message || "Booking status updated.");
        setLastResult(response.data ?? null);
      } else {
        Alert.alert("Error", response.message || "Unable to update status.");
      }
    } catch (error: any) {
      Alert.alert("Update failed", error.message || "Unable to update status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Staff QR Scanner</Text>
      <Text style={styles.subtitle}>Point the camera at a booking QR code</Text>

      <View style={styles.scannerCard}>
        {!permission ? (
          <View style={styles.cameraFallback}>
            <ActivityIndicator size="large" color="#3b82f6" />
          </View>
        ) : !permission.granted ? (
          <View style={styles.cameraFallback}>
            <Text style={styles.emptyText}>Camera access is required to scan booking QR codes.</Text>
            <TouchableOpacity style={styles.button} onPress={requestPermission}>
              <Text style={styles.buttonText}>Allow Camera</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <CameraView
            style={styles.camera}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            onBarcodeScanned={scanned || loading ? undefined : handleBarcodeScanned}
          >
            <View style={styles.scanOverlay}>
              <View style={styles.scanFrame} />
              <Text style={styles.scanHint}>{loading ? "Scanning..." : "Scan QR code"}</Text>
            </View>
          </CameraView>
        )}
      </View>

      {loading ? <ActivityIndicator size="large" color="#3b82f6" style={{ marginVertical: 20 }} /> : null}
      {lastResult ? (
        <View style={styles.resultCard}>
          <Text style={styles.label}>Booking ID</Text>
          <Text style={styles.value}>{lastResult.id}</Text>
          <Text style={styles.label}>User</Text>
          <Text style={styles.value}>{lastResult.user?.name ?? "Unknown"}</Text>
          <Text style={styles.label}>Purpose</Text>
          <Text style={styles.value}>{lastResult.purpose}</Text>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>{lastResult.booking_date}</Text>
          <Text style={styles.label}>Time</Text>
          <Text style={styles.value}>{lastResult.booking_time}</Text>
          <Text style={styles.label}>Status</Text>
          <Text style={[styles.value, styles.statusValue]}>{lastResult.status}</Text>
          {lastResult.time_in ? <Text style={styles.detail}>Time In: {lastResult.time_in}</Text> : null}
          {lastResult.time_out ? <Text style={styles.detail}>Time Out: {lastResult.time_out}</Text> : null}

          {lastResult.status === "pending" ? (
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.actionButton, styles.doneButton]}
                onPress={() => handleUpdateStatus(lastResult.id, "done")}
              >
                <Text style={styles.actionText}>Done</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.rejectButton]}
                onPress={() => handleUpdateStatus(lastResult.id, "rejected")}
              >
                <Text style={styles.actionText}>Reject</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      ) : null}
      <TouchableOpacity style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Back</Text>
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
    marginBottom: 8,
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: 14,
    marginBottom: 24,
  },
  scannerCard: {
    backgroundColor: "#1e293b",
    borderRadius: 18,
    height: 360,
    overflow: "hidden",
    marginBottom: 24,
  },
  camera: {
    flex: 1,
  },
  cameraFallback: {
    flex: 1,
    justifyContent: "center",
    gap: 18,
    padding: 18,
  },
  scanOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(15, 23, 42, 0.18)",
  },
  scanFrame: {
    width: 230,
    height: 230,
    borderWidth: 3,
    borderColor: "#60a5fa",
    borderRadius: 18,
    backgroundColor: "transparent",
  },
  scanHint: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "rgba(15, 23, 42, 0.72)",
    overflow: "hidden",
  },
  label: {
    color: "#94a3b8",
    fontSize: 12,
    marginBottom: 10,
    fontWeight: "600",
  },
  resultCard: {
    backgroundColor: "#1e293b",
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
  },
  value: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  statusValue: {
    color: "#60a5fa",
  },
  detail: {
    color: "#cbd5e1",
    marginTop: 6,
  },
  button: {
    backgroundColor: "#3b82f6",
    paddingVertical: 16,
    alignItems: "center",
    borderRadius: 16,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginHorizontal: 4,
  },
  doneButton: {
    backgroundColor: "#16a34a",
  },
  rejectButton: {
    backgroundColor: "#dc2626",
  },
  actionText: {
    color: "#fff",
    fontWeight: "700",
  },
  emptyText: {
    color: "#cbd5e1",
    fontSize: 15,
    textAlign: "center",
  },
});
