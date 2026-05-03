import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  SectionList, // Switched from FlatList to SectionList
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator, 
  RefreshControl 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../../api/client';

const MyTasks = ({ navigation }) => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Helper to group tasks by Project Title
  const groupTasksByProject = (tasksArray) => {
    const groups = tasksArray.reduce((acc, task) => {
      const projectTitle = task.projectId?.title || 'General Tasks';
      if (!acc[projectTitle]) {
        acc[projectTitle] = [];
      }
      acc[projectTitle].push(task);
      return acc;
    }, {});

    // Convert to SectionList format: [{ title: 'Project A', data: [...] }]
    return Object.keys(groups).map(title => ({
      title: title,
      data: groups[title]
    }));
  };

  const fetchTasks = async () => {
    try {
      const response = await apiClient.get('/tasks');
      const groupedData = groupTasksByProject(response.data);
      setSections(groupedData);
    } catch (error) {
      console.error("Fetch Tasks Error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTasks();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return '#2ecc71';
      case 'Submitted': return '#3498db';
      case 'In Progress': return '#f1c40f';
      default: return '#95a5a6';
    }
  };

  const renderTaskItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.taskCard}
      onPress={() => navigation.navigate('TaskDetails', { task: item })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.taskTitle} numberOfLines={1}>{item.title}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      
      <View style={styles.cardFooter}>
        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={14} color="#e74c3c" />
          <Text style={styles.dateText}>
            Due: {new Date(item.deadline).toLocaleDateString()}
          </Text>
        </View>
        
        {item.smartAssignment?.score > 0 && (
          <View style={styles.infoRow}>
            <Ionicons name="rocket-outline" size={14} color="#8e44ad" />
            <Text style={styles.matchText}>{item.smartAssignment.score}% Match</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item._id}
        renderItem={renderTaskItem}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
            <Ionicons name="folder-open" size={16} color="#3498db" />
            <Text style={styles.sectionTitle}>{title}</Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        stickySectionHeadersEnabled={true}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3498db']} />
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Ionicons name="clipboard-outline" size={50} color="#bdc3c7" />
            <Text style={styles.emptyText}>No tasks found.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { paddingBottom: 20 },
  sectionHeader: { 
    backgroundColor: '#f1f4f7', 
    paddingVertical: 10, 
    paddingHorizontal: 15, 
    flexDirection: 'row', 
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#dcdde1'
  },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#34495e', marginLeft: 8, textTransform: 'uppercase' },
  taskCard: { 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    padding: 16, 
    marginHorizontal: 15,
    marginTop: 12,
    elevation: 2, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  taskTitle: { fontSize: 16, fontWeight: 'bold', color: '#2c3e50', flex: 1, marginRight: 10 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  cardFooter: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    borderTopWidth: 1, 
    borderTopColor: '#f1f1f1', 
    paddingTop: 10,
    marginTop: 5
  },
  infoRow: { flexDirection: 'row', alignItems: 'center' },
  dateText: { marginLeft: 5, fontSize: 12, color: '#e74c3c', fontWeight: '500' },
  matchText: { marginLeft: 5, fontSize: 12, color: '#8e44ad', fontWeight: '500' },
  emptyText: { marginTop: 10, color: '#bdc3c7', fontSize: 16 },
});

export default MyTasks;