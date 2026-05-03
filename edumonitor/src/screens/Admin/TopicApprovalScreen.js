import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import apiClient from '../../api/client';

const TopicApprovalScreen = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTopics = async () => {
    try {
      const response = await apiClient.get('/topics');
      // Filter for only Pending ones for the approval queue
      setTopics(response.data.filter(t => t.status === 'Pending'));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTopics(); }, []);

  const handleReview = async (id, status) => {
    try {
      await apiClient.put(`/topics/${id}/review`, { status });
      Alert.alert("Success", `Topic ${status.toLowerCase()} successfully.`);
      fetchTopics(); // Refresh list
    } catch (error) {
      Alert.alert("Error", "Action failed");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.topicTitle}>{item.projectTitle}</Text>
      <Text style={styles.studentName}>By: {item.studentId?.name}</Text>
      <Text style={styles.desc}>{item.description}</Text>
      
      <View style={styles.actionRow}>
        <TouchableOpacity 
          style={[styles.btn, styles.approveBtn]} 
          onPress={() => handleReview(item._id, 'Approved')}
        >
          <Text style={styles.btnText}>Approve</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.btn, styles.rejectBtn]} 
          onPress={() => handleReview(item._id, 'Rejected')}
        >
          <Text style={styles.btnText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={topics}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        onRefresh={fetchTopics}
        refreshing={loading}
        ListEmptyComponent={<Text style={styles.empty}>No pending topic requests.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7f6', padding: 15 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 15, elevation: 3 },
  topicTitle: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50' },
  studentName: { fontSize: 13, color: '#3498db', marginBottom: 10 },
  desc: { fontSize: 14, color: '#7f8c8d', marginBottom: 15 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between' },
  btn: { flex: 0.48, padding: 12, borderRadius: 8, alignItems: 'center' },
  approveBtn: { backgroundColor: '#2ecc71' },
  rejectBtn: { backgroundColor: '#e74c3c' },
  btnText: { color: '#fff', fontWeight: 'bold' },
  empty: { textAlign: 'center', marginTop: 50, color: '#95a5a6' }
});

export default TopicApprovalScreen;