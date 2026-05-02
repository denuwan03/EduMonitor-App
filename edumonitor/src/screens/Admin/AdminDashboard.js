import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator, 
  ScrollView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../../api/client';
import RefreshWrapper from '../../components/RefreshWrapper';

const AdminDashboard = ({ navigation }) => {
  const [data, setData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    try {
      const [reportRes, projectRes] = await Promise.all([
        apiClient.get('/reports'),
        apiClient.get('/projects')
      ]);
      
      setData(reportRes.data);
      setProjects(projectRes.data);
    } catch (error) {
      console.error("Admin Dashboard Load Error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#e67e22" />
      </View>
    );
  }

  return (
    <RefreshWrapper onRefreshCustom={loadDashboardData}>
      <View style={styles.container}>
        
        {/* --- 1. URGENT NOTIFICATION (TOPIC APPROVALS) --- */}
        {data?.systemSummary?.pendingTopics > 0 && (
          <TouchableOpacity 
            style={styles.alertCard} 
            onPress={() => navigation.navigate('TopicApproval')}
          >
            <View style={styles.alertIconBg}>
              <Ionicons name="notifications" size={22} color="#fff" />
            </View>
            <View style={styles.alertTextContent}>
              <Text style={styles.alertTitle}>New Topic Requests</Text>
              <Text style={styles.alertSub}>You have {data.systemSummary.pendingTopics} requests to review</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#e67e22" />
          </TouchableOpacity>
        )}

        <Text style={styles.header}>Overview</Text>

        {/* --- 2. STATS SUMMARY --- */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{data?.systemSummary?.users || 0}</Text>
            <Text style={styles.statLabel}>System Users</Text>
          </View>
          <View style={[styles.statBox, { borderLeftWidth: 4, borderLeftColor: '#e67e22' }]}>
            <Text style={styles.statVal}>{projects.length}</Text>
            <Text style={styles.statLabel}>Managed Projects</Text>
          </View>
        </View>

        {/* --- 3. MANAGED PROJECTS LIST --- */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>My Managed Projects</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Manage')}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        {projects.length > 0 ? (
          projects.map((item) => (
            <TouchableOpacity 
              key={item._id} 
              style={styles.projectCard}
              // UPDATED: Navigates to CreateSmartTask with params to auto-fill project info
              onPress={() => navigation.navigate('CreateSmartTask', { 
                projectId: item._id, 
                projectTitle: item.title 
              })}
            >
              <View style={styles.projectMain}>
                <View style={styles.projectIcon}>
                  <Ionicons name="briefcase" size={20} color="#e67e22" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.projectTitle} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.projectStudents}>
                    {item.teamMembers?.length || 0} Students Assigned
                  </Text>
                </View>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.status || 'Active'}</Text>
                </View>
              </View>
              
              <View style={styles.actionHint}>
                <Text style={styles.actionHintText}>Tap to add/manage tasks</Text>
                <Ionicons name="add-circle-outline" size={16} color="#e67e22" />
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="folder-open-outline" size={40} color="#bdc3c7" />
            <Text style={styles.emptyText}>No active projects found.</Text>
          </View>
        )}
      </View>
    </RefreshWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f4f6f9' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 26, fontWeight: 'bold', color: '#2c3e50', marginBottom: 20 },
  alertCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    elevation: 4,
    borderLeftWidth: 6,
    borderLeftColor: '#e67e22',
  },
  alertIconBg: { backgroundColor: '#e67e22', padding: 8, borderRadius: 10 },
  alertTextContent: { flex: 1, marginLeft: 15 },
  alertTitle: { fontSize: 16, fontWeight: 'bold', color: '#2c3e50' },
  alertSub: { fontSize: 12, color: '#7f8c8d' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  statBox: { backgroundColor: '#fff', width: '48%', padding: 20, borderRadius: 15, elevation: 2, alignItems: 'center' },
  statVal: { fontSize: 24, fontWeight: 'bold', color: '#2c3e50' },
  statLabel: { fontSize: 12, color: '#95a5a6', marginTop: 4 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#34495e' },
  viewAll: { color: '#e67e22', fontWeight: '600' },
  projectCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
  },
  projectMain: { flexDirection: 'row', alignItems: 'center' },
  projectIcon: { backgroundColor: '#fef5ec', padding: 10, borderRadius: 10, marginRight: 15 },
  projectTitle: { fontSize: 16, fontWeight: 'bold', color: '#2c3e50' },
  projectStudents: { fontSize: 12, color: '#7f8c8d', marginTop: 2 },
  badge: { backgroundColor: '#fdf2e9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { color: '#e67e22', fontSize: 10, fontWeight: 'bold' },
  actionHint: { 
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    alignItems: 'center', 
    marginTop: 10, 
    borderTopWidth: 1, 
    borderTopColor: '#f1f1f1', 
    paddingTop: 8 
  },
  actionHintText: { fontSize: 11, color: '#e67e22', marginRight: 5, fontWeight: '500' },
  emptyState: { alignItems: 'center', padding: 40, backgroundColor: '#fff', borderRadius: 15, borderStyle: 'dashed', borderWidth: 1, borderColor: '#bdc3c7' },
  emptyText: { color: '#bdc3c7', marginTop: 10 }
});

export default AdminDashboard;