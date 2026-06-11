// app/staff/dashboard.tsx
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";
import { getAdminLogbooks, type Booking } from '@/Api/logbook';

type DashboardStats = {
  pending: number;
  approved: number;
  done: number;
  rejected: number;
};

type ActivityType = {
  id: string;
  title: string;
  time: string;
  status: string;
};

export default function StaffDashboard() {
  const router = useRouter();
  const { name } = useLocalSearchParams();
  const staffName = typeof name === "string" ? name : "Staff User";

  const backgroundColor = "#f5f5f5";
  const surfaceColor = "#fff";
  const cardColor = "#fff";
  const sectionColor = "#fff";
  const textColor = "#666";
  const titleColor = "#333";
  const borderColor = "#e2e8f0";

  const [stats, setStats] = useState<DashboardStats>({
    pending: 0,
    approved: 0,
    done: 0,
    rejected: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [recentActivities, setRecentActivities] = useState<ActivityType[]>([]);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: () => router.replace("/"),
      },
    ]);
  };

  useEffect(() => {
    async function loadDashboard() {
      setLoadingStats(true);
      try {
        const logs = await getAdminLogbooks();
        const nextStats = logs.reduce(
          (acc: DashboardStats, log: Booking) => {
            const status = typeof log.status === "string" ? log.status.toLowerCase() : "";

            if (status === "pending") acc.pending += 1;
            if (status === "approved") acc.approved += 1;
            if (status === "done" || status === "completed") acc.done += 1;
            if (status === "rejected") acc.rejected += 1;

            return acc;
          },
          { pending: 0, approved: 0, done: 0, rejected: 0 }
        );

        setStats(nextStats);
        setRecentActivities(logs.slice(0, 5).map(mapLogToActivity));
      } catch (error: any) {
        Alert.alert(
          "Unable to load dashboard",
          error?.message || "Please check your connection and try again."
        );
      } finally {
        setLoadingStats(false);
      }
    }

    loadDashboard();
  }, []);

  const formatLogDate = (log: Booking) => {
    const rawDate = (log as any).created_at ?? log.booking_date;

    if (!rawDate) {
      return "No date";
    }

    const date = new Date(rawDate);

    if (Number.isNaN(date.getTime())) {
      return String(rawDate);
    }

    return date.toLocaleString();
  };

  const mapLogToActivity = (log: Booking): ActivityType => {
    const userName = log.user?.name ?? "Unknown user";
    const purpose = log.purpose ?? (log as any).activity ?? "Logbook request";

    return {
      id: String(log.id ?? log.qr_code ?? `${userName}-${purpose}`),
      title: `${userName} - ${purpose}`,
      time: formatLogDate(log),
      status: log.status ?? "pending",
    };
  };

  const getStatusStyle = (status: string) => {
    const normalized = status.toLowerCase();

    if (normalized === "pending") return styles.statusPending;
    if (normalized === "approved") return styles.statusApproved;
    if (normalized === "done") return styles.statusDone;
    if (normalized === "rejected") return styles.statusRejected;

    return styles.statusCompleted;
  };

  const StatCard = ({
    title,
    value,
    color,
    onPress,
  }: {
    title: string;
    value: number | string;
    color: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.statCard, { borderLeftColor: color, backgroundColor: cardColor, borderColor }]}
    >
      <Text style={[styles.statValue, { color: titleColor }]}>{value}</Text>
      <Text style={[styles.statTitle, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );

  const ActivityCard = ({ item }: { item: ActivityType }) => (
    <View style={[styles.activityItem, { backgroundColor: cardColor, borderBottomColor: borderColor }]}> 
      <View style={styles.activityContent}>
        <Text style={[styles.activityTitle, { color: titleColor }]}>{item.title}</Text>
        <Text style={[styles.activityTime, { color: textColor }]}>{item.time}</Text>
      </View>

      <View
        style={[
          styles.statusBadge,
          getStatusStyle(item.status),
        ]}
      >
        <Text style={styles.statusText}>{item.status}</Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor }]}> 
      {/* HEADER */}
      <View style={[styles.header, { backgroundColor: surfaceColor, borderBottomColor: borderColor }]}> 
        <View>
          <Text style={[styles.welcomeText, { color: textColor }]}>Welcome back,</Text>
          <Text style={[styles.staffName, { color: titleColor }]}>{staffName}</Text>
        </View>

        <TouchableOpacity
          onPress={handleLogout}
          style={styles.logoutButton}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.statsGrid}>
          <StatCard
            title="Pending"
            value={loadingStats ? "..." : stats.pending}
            color="#FF9800"
            onPress={() => router.push("/admin/pending")}
          />

          <StatCard
            title="Approved"
            value={loadingStats ? "..." : stats.approved}
            color="#16a34a"
            onPress={() => router.push("/admin/approved")}
          />

          <StatCard
            title="Done"
            value={loadingStats ? "..." : stats.done}
            color="#2196F3"
            onPress={() => router.push("/admin/done")}
          />

          <StatCard
            title="Rejected"
            value={loadingStats ? "..." : stats.rejected}
            color="#F44336"
            onPress={() => router.push("/admin/rejected")}
          />
        </View>

        <View style={[styles.scanSection, { backgroundColor: sectionColor, borderColor }]}> 
          <Text style={[styles.sectionTitle, { color: titleColor }]}>Staff Actions</Text>
          <TouchableOpacity
            style={[styles.scanButton, { backgroundColor: '#2563eb' }]}
            onPress={() => router.push('/admin/scanner')}
          >
            <Text style={styles.scanButtonText}>Open QR Scanner</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.section, { backgroundColor: sectionColor, borderColor }]}> 
          <Text style={[styles.sectionTitle, { color: titleColor }]}>Recent History</Text>

          <View style={[styles.activitiesList, { backgroundColor: cardColor, borderColor }]}> 
            {loadingStats ? (
              <ActivityIndicator size="small" color="#2563eb" style={styles.historyLoader} />
            ) : recentActivities.length > 0 ? (
              recentActivities.map((item) => (
                <ActivityCard key={item.id} item={item} />
              ))
            ) : (
              <Text style={[styles.emptyHistory, { color: textColor }]}>No recent history yet.</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },

  header: {
    backgroundColor: "#fff",
    padding: 24,
    paddingTop: 64,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  welcomeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6b7280",
    letterSpacing: 0.5,
  },
  staffName: {
    fontSize: 30,
    fontWeight: "800",
    color: "#111827",
    marginTop: 4,
    lineHeight: 38,
  },

  logoutButton: {
    backgroundColor: "#ff4444",
    padding: 8,
    borderRadius: 8,
  },

  logoutText: { color: "#fff" },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 10,
  },

  statCard: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
  },

  statValue: { fontSize: 24, fontWeight: "bold" },
  statTitle: { color: "#666" },

  section: { padding: 20 },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },

  actionsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  
  actionButton: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },

  actionIcon: { fontSize: 28 },
  actionText: { marginTop: 5 },
  scanSection: {
    marginHorizontal: 15,
    marginBottom: 18,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  scanButton: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  scanButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  activitiesList: {
    backgroundColor: "#fff",
    borderRadius: 10,
  },

  activityItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  activityContent: { flex: 1 },

  activityTitle: { fontSize: 14 },
  activityTime: {
    fontSize: 12,
    color: "#999",
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusCompleted: {
    backgroundColor: "#4CAF50",
  },
  statusApproved: {
    backgroundColor: "#16a34a",
  },
  statusDone: {
    backgroundColor: "#2196F3",
  },
  statusPending: {
    backgroundColor: "#FF9800",
  },
  statusRejected: {
    backgroundColor: "#F44336",
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
  },
  historyLoader: {
    paddingVertical: 18,
  },
  emptyHistory: {
    padding: 15,
    fontSize: 14,
    textAlign: "center",
  },
});
