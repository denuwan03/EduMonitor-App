import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacity, 
  RefreshControl 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../../api/client';

const SubmissionsListScreen = ({ navigation }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSubmissions = async () => {
    try {
      // This calls the controller we worked on to get student files
      const response = await apiClient.get('/submissions');
      setSubmissions(response.data);
    } catch (error) {
      console.error("Fetch Error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchSubmissions();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('ReviewSubmission', { submission: item })}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.studentName}>{item.studentName || "Student"}</Text>
          <Text style={styles.projectName}>{item.projectName}</Text>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.taskName}><Ionicons name="document-text" /> {item.taskName}</Text>
        <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading && !refreshing) return <ActivityIndicator size="large" style={styles.loader} />;

  return (
    <View style={styles.container}>
      <FlatList
        data={submissions}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text style={styles.empty}>No student submissions found.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 10 },
  loader: { flex: 1, justifyContent: 'center' },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 10, elevation: 2 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  studentName: { fontSize: 16, fontWeight: 'bold', color: '#2c3e50' },
  projectName: { fontSize: 12, color: '#7f8c8d' },
  statusBadge: { backgroundColor: '#eaf4fb', padding: 5, borderRadius: 5 },
  statusText: { color: '#3498db', fontSize: 10, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10 },
  taskName: { fontSize: 13, color: '#34495e' },
  date: { fontSize: 11, color: '#bdc3c7' },
  empty: { textAlign: 'center', marginTop: 50, color: '#95a5a6' }
});

export default SubmissionsListScreen;