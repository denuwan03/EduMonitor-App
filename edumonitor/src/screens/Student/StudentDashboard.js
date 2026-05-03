import React, { useEffect, useState, useContext, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import apiClient from '../../api/client';
import { AuthContext } from '../../context/AuthContext';
import RefreshWrapper from '../../components/RefreshWrapper';

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [myTopics, setMyTopics] = useState([]); // State for topics
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      // Fetch stats and student's specific topics simultaneously
      const [statsRes, topicsRes] = await Promise.all([
        apiClient.get('/users/dashboard-summary'),
        apiClient.get('/topics/my-requests') // Assuming this endpoint exists in your MERN backend
      ]);
      
      setStats(statsRes.data);
      setMyTopics(topicsRes.data);
    } catch (error) {
      console.error("Dashboard Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Helper to style the status badge
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Approved': return { color: '#2ecc71', bg: '#e8f8f0' };
      case 'Rejected': return { color: '#e74c3c', bg: '#fdedec' };
      default: return { color: '#f1c40f', bg: '#fef9e7' };
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <RefreshWrapper onRefreshCustom={fetchDashboardData}>
      <View style={styles.container}>
        <Text style={styles.welcome}>Hello, {user?.name} 👋</Text>
        <Text style={styles.subtitle}>Here is your project progress</Text>

        {/* 1. Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats?.totalTasks || 0}</Text>
            <Text style={styles.statLabel}>Total Tasks</Text>
          </View>
          <View style={[styles.statCard, styles.pendingBorder]}>
            <Text style={styles.statNumber}>{stats?.pendingTasks || 0}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={[styles.statCard, styles.completedBorder]}>
            <Text style={styles.statNumber}>{stats?.completedTasks || 0}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={[styles.statCard, styles.workloadBorder]}>
            <Text style={styles.statNumber}>{stats?.workload || 0}</Text>
            <Text style={styles.statLabel}>Workload</Text>
          </View>
        </View>

        {/* 2. Project Topic Status Section */}
        <Text style={styles.sectionTitle}>My Topic Requests</Text>
        {myTopics.length > 0 ? (
          myTopics.map((item) => {
            const statusStyle = getStatusStyle(item.status);
            return (
              <View key={item._id} style={styles.topicCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.topicTitle}>{item.projectTitle}</Text>
                  <Text style={styles.topicDate}>Submitted on {new Date(item.createdAt).toLocaleDateString()}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                  <Text style={[styles.statusText, { color: statusStyle.color }]}>{item.status}</Text>
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No topic requests yet.</Text>
          </View>
        )}
      </View>
    </RefreshWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  welcome: { fontSize: 24, fontWeight: 'bold', color: '#2c3e50' },
  subtitle: { fontSize: 14, color: '#7f8c8d', marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 30, marginBottom: 15, color: '#2c3e50' },
  
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 15, justifyContent: 'space-between' },
  statCard: { backgroundColor: '#fff', width: '47%', padding: 20, borderRadius: 15, elevation: 3 },
  statNumber: { fontSize: 28, fontWeight: 'bold', color: '#2c3e50' },
  statLabel: { fontSize: 12, color: '#94a3b8', marginTop: 5, fontWeight: '600' },
  
  pendingBorder: { borderLeftColor: '#f1c40f', borderLeftWidth: 4 },
  completedBorder: { borderLeftColor: '#2ecc71', borderLeftWidth: 4 },
  workloadBorder: { borderLeftColor: '#3498db', borderLeftWidth: 4 },

  // New Topic Card Styles
  topicCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
  },
  topicTitle: { fontSize: 16, fontWeight: '600', color: '#2c3e50' },
  topicDate: { fontSize: 12, color: '#95a5a6', marginTop: 4 },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  emptyCard: { padding: 20, alignItems: 'center', backgroundColor: '#f8f9fa', borderRadius: 12, borderStyle: 'dashed', borderWidth: 1, borderColor: '#dee2e6' },
  emptyText: { color: '#adb5bd' }
});

export default StudentDashboard;