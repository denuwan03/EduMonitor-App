import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import apiClient from '../../api/client';

const TaskDetailScreen = ({ route, navigation }) => {
  const { task } = route.params;
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [submissionData, setSubmissionData] = useState(null);
  const [fetching, setFetching] = useState(true);

  // FETCH SUBMISSION DETAILS (To get Marks/Feedback)
  const fetchSubmissionDetails = async () => {
    try {
      // We filter submissions by this specific task ID
      const response = await apiClient.get('/submissions');
      const mySubmission = response.data.find(s => s.task_id?._id === task._id || s.task_id === task._id);
      if (mySubmission) {
        setSubmissionData(mySubmission);
      }
    } catch (error) {
      console.error("Error fetching submission details:", error.message);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchSubmissionDetails();
  }, []);

  const pickDocument = async () => {
    try {
      let result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "application/zip", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        setSelectedFile(result.assets[0]);
      }
    } catch (err) {
      Alert.alert("Error", "Failed to pick document");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return Alert.alert("Error", "Select a file first");

    const formData = new FormData();
    formData.append('title', `Submission: ${task.title}`);
    formData.append('description', 'Uploaded via Mobile');
    formData.append('project_id', task.projectId?._id || task.projectId);
    formData.append('task_id', task._id);

    const fileObject = {
      uri: Platform.OS === 'android' ? selectedFile.uri : selectedFile.uri.replace('file://', ''),
      name: selectedFile.name || `sub_${Date.now()}.pdf`,
      type: selectedFile.mimeType || 'application/pdf', 
    };

    formData.append('file', fileObject);

    try {
      setUploading(true);
      await apiClient.post('/submissions', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        transformRequest: (data) => data, 
      });

      Alert.alert("Success", "Task submitted successfully!");
      fetchSubmissionDetails(); // Refresh to show "Submitted" state
    } catch (error) {
      Alert.alert("Upload Failed", "Could not connect to server.");
    } finally {
      setUploading(false);
    }
  };

  if (fetching) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#3498db" /></View>;
  }

  return (
    <ScrollView style={styles.container}>
      {/* TASK SECTION */}
      <View style={styles.section}>
        <Text style={styles.label}>Task Title:</Text>
        <Text style={styles.value}>{task.title}</Text>
        <Text style={styles.label}>Instructions:</Text>
        <Text style={styles.desc}>{task.description || "No description provided."}</Text>
      </View>

      {/* FEEDBACK SECTION (Shows when evaluated) */}
      {submissionData && submissionData.status === "Reviewed" && (
        <View style={styles.feedbackCard}>
          <View style={styles.feedbackHeader}>
            <Ionicons name="ribbon-outline" size={24} color="#e67e22" />
            <Text style={styles.feedbackTitle}>Supervisor Evaluation</Text>
          </View>
          
          <View style={styles.scoreRow}>
            <View style={styles.scoreBox}>
              <Text style={styles.scoreLabel}>Marks</Text>
              <Text style={styles.scoreValue}>{submissionData.marks}%</Text>
            </View>
            <View style={styles.scoreBox}>
              <Text style={styles.scoreLabel}>Grade</Text>
              <Text style={styles.scoreValue}>{submissionData.grade || 'N/A'}</Text>
            </View>
          </View>

          <Text style={styles.commentLabel}>Supervisor Comments:</Text>
          <Text style={styles.commentText}>{submissionData.comments || "No comments provided."}</Text>
        </View>
      )}

      {/* UPLOAD SECTION (Hidden if already reviewed to prevent overwriting) */}
      {submissionData?.status !== "Reviewed" ? (
        <View style={styles.uploadSection}>
          <Text style={styles.label}>Your Submission:</Text>
          <TouchableOpacity style={styles.picker} onPress={pickDocument}>
            <Ionicons name="document-attach" size={24} color="#3498db" />
            <Text style={styles.pickerText} numberOfLines={1}>
              {selectedFile ? `Selected: ${selectedFile.name}` : 
               submissionData ? `Already Submitted: ${submissionData.originalName}` : "📁 Select Document (PDF/ZIP)"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.submitBtn, (!selectedFile || uploading) && styles.disabledBtn]} 
            onPress={handleUpload}
            disabled={uploading || !selectedFile}
          >
            {uploading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>
              {submissionData ? "Resubmit Task" : "Submit Task"}
            </Text>}
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.completedBox}>
          <Ionicons name="checkmark-circle" size={20} color="#27ae60" />
          <Text style={styles.completedText}>This task is finalized and graded.</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  section: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 15 },
  label: { fontSize: 12, color: '#7f8c8d', marginBottom: 4, textTransform: 'uppercase', fontWeight: '700' },
  value: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#2c3e50' },
  desc: { fontSize: 15, color: '#34495e', lineHeight: 22 },
  
  // Feedback Styles
  feedbackCard: { backgroundColor: '#fff', padding: 20, borderRadius: 12, borderLeftWidth: 5, borderLeftColor: '#e67e22', marginBottom: 20, elevation: 3 },
  feedbackHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  feedbackTitle: { fontSize: 16, fontWeight: 'bold', color: '#e67e22', marginLeft: 10 },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 15, backgroundColor: '#fef5ec', padding: 10, borderRadius: 8 },
  scoreBox: { alignItems: 'center' },
  scoreLabel: { fontSize: 10, color: '#d35400' },
  scoreValue: { fontSize: 20, fontWeight: 'bold', color: '#e67e22' },
  commentLabel: { fontSize: 12, fontWeight: 'bold', color: '#7f8c8d', marginBottom: 5 },
  commentText: { fontSize: 14, color: '#2c3e50', fontStyle: 'italic' },

  picker: { borderStyle: 'dashed', borderWidth: 2, borderColor: '#3498db', padding: 20, borderRadius: 12, alignItems: 'center', backgroundColor: '#fff' },
  pickerText: { color: '#3498db', fontWeight: '600', marginTop: 10 },
  submitBtn: { backgroundColor: '#2ecc71', padding: 18, borderRadius: 12, marginTop: 20, alignItems: 'center' },
  disabledBtn: { backgroundColor: '#bdc3c7' },
  submitText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  completedBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 20 },
  completedText: { marginLeft: 10, color: '#27ae60', fontWeight: '600' }
});

export default TaskDetailScreen;