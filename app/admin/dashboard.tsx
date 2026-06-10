// app/staff/dashboard.tsx
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";
import { useAppTheme } from '@/context/ThemeContext';
import { getAdminLogbookStats } from '@/Api/logbook';

type DashboardStats = {
  approved: number;
  pending: number;
  done: number;
  rejected: number;
};

type ActivityType = {
  id: string;
  title: string;
  time: string;
  status: "pending" | "completed" | "cancelled";
};

export default function StaffDashboard() {
  const router = useRouter();
  const { token, name } = useLocalSearchParams();
  const authToken = typeof token === "string" ? token : "";
  const staffName = typeof name === "string" ? name : "Staff User";
  const isDarkTheme = false;

  const backgroundColor = "#f5f5f5";
  const surfaceColor = "#fff";
  const cardColor = "#fff";
  const sectionColor = "#fff";
  const textColor = "#666";
  const titleColor = "#333";
  const borderColor = "#e2e8f0";

  const [stats, setStats] = useState<DashboardStats>({
    approved: 0,
    pending: 0,
    done: 0,
    rejected: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  const [recentActivities] = useState<ActivityType[]>([
    {
      id: "1",
      title: "New request received",
      time: "5 minutes ago",
      status: "completed",
    },
    {
      id: "2",
      title: "Staff account updated",
      time: "3 hours ago",
      status: "completed",
    },
    {
      id: "3",
      title: "Notification sent",
      time: "3 hours ago",
      status: "completed",
    },
    {
      id: "4",
      title: "Pending approval",
      time: "1 day ago",
      status: "pending",
    },
  ]);

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
    async function loadStats() {
      setLoadingStats(true);
      try {
        const fetchedStats = await getAdminLogbookStats();
        setStats(fetchedStats);
      } catch (error: any) {
        Alert.alert(
          "Unable to load dashboard",
          error?.message || "Please check your connection and try again."
        );
      } finally {
        setLoadingStats(false);
      }
    }

    loadStats();
  }, []);

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
          item.status === "completed" && styles.statusCompleted,
          item.status === "pending" && styles.statusPending,
          item.status === "cancelled" && styles.statusCancelled,
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
            title="Approved"
            value={loadingStats ? "..." : stats.approved}
            color="#4CAF50"
            onPress={() => router.push("/admin/approved")}
          />

          <StatCard
            title="Done"
            value={loadingStats ? "..." : stats.done}
            color="#2196F3"
            onPress={() => router.push("/admin/done")}
          />

          <StatCard
            title="Pending"
            value={loadingStats ? "..." : stats.pending}
            color="#FF9800"
            onPress={() => router.push("/admin/pending")}
          />

          <StatCard
            title="Rejected"
            value={loadingStats ? "..." : stats.rejected}
            color="#F44336"
            onPress={() => router.push("/admin/rejected")}
          />
        </View>

        <View style={[styles.section, { backgroundColor: sectionColor, borderColor }]}> 
          <Text style={[styles.sectionTitle, { color: titleColor }]}>Recent History</Text>

          <View style={[styles.activitiesList, { backgroundColor: cardColor, borderColor }]}> 
            {recentActivities.map((item) => (
              <ActivityCard key={item.id} item={item} />
            ))}
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
  statusPending: {
    backgroundColor: "#FF9800",
  },
  statusCancelled: {
    backgroundColor: "#F44336",
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
  },
});
