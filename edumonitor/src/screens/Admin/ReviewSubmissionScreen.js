import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, Linking } from 'react-native';
import apiClient from '../../api/client';

const ReviewSubmissionScreen = ({ route, navigation }) => {
  const { submission } = route.params; 
  
  const [form, setForm] = useState({
    marks: '',
    grade: '',
    comments: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (submission) {
      setForm({
        marks: submission.marks ? String(submission.marks) : '',
        grade: submission.grade || '',
        comments: submission.comments || '',
      });
    }
  }, [submission]);

  const handleGrade = async () => {
    if (!form.marks || !form.grade) {
      return Alert.alert("Required Fields", "Please provide both marks and a grade.");
    }

    setSubmitting(true);
    try {
      // Data format to match your evaluateSubmission controller
      const payload = {
        marks: Number(form.marks),
        grade: form.grade.trim().toUpperCase(),
        comments: form.comments.trim(),
      };

      console.log("Attempting evaluation on route: /submissions/evaluate/" + submission._id);

      // We use the route defined in your submissionRoute.js
      const response = await apiClient.put(`/submissions/evaluate/${submission._id}`, payload);

      if (response.status === 200 || response.status === 201) {
        Alert.alert("Success", "Submission evaluated successfully!");
        setTimeout(() => navigation.goBack(), 500);
      }
    } catch (error) {
      console.error("Evaluation Error:", error.response?.data || error.message);
      
      if (error.response?.status === 403) {
        Alert.alert(
          "Permission Denied", 
          "Your role is not authorized to evaluate. Ensure your backend allowRoles includes your specific role."
        );
      } else {
        const msg = error.response?.data?.message || "Failed to save evaluation.";
        Alert.alert("Error", msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const openFile = () => {
    const url = submission.file_url || submission.fileUrl;
    if (url) {
      Linking.openURL(url).catch(() => Alert.alert("Error", "Could not open file URL."));
    } else {
      Alert.alert("Error", "File URL not found.");
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.infoCard}>
        <Text style={styles.label}>Student</Text>
        <Text style={styles.value}>{submission.studentName || submission.student_id?.name || "N/A"}</Text>
        
        <Text style={styles.label}>Task Name</Text>
        <Text style={styles.value}>{submission.taskName || submission.task_id?.title || "Assignment"}</Text>

        <TouchableOpacity style={styles.fileBtn} onPress={openFile}>
          <Text style={styles.fileBtnText}>📎 View Submitted File</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Evaluation Form</Text>
        
        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={styles.inputLabel}>Marks</Text>
            <TextInput 
              style={styles.input} 
              keyboardType="numeric" 
              placeholder="0-100"
              value={form.marks}
              onChangeText={(t) => setForm({...form, marks: t})}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.inputLabel}>Grade</Text>
            <TextInput 
              style={styles.input} 
              autoCapitalize="characters"
              placeholder="A+"
              value={form.grade}
              onChangeText={(t) => setForm({...form, grade: t})}
            />
          </View>
        </View>

        <Text style={styles.inputLabel}>Comments</Text>
        <TextInput 
          style={[styles.input, styles.textArea]} 
          multiline 
          placeholder="Add supervisor feedback..."
          value={form.comments}
          onChangeText={(t) => setForm({...form, comments: t})}
        />

        <TouchableOpacity 
          style={[styles.submitBtn, submitting && styles.disabledBtn]} 
          onPress={handleGrade}
          disabled={submitting}
        >
          <Text style={styles.submitBtnText}>
            {submitting ? "Saving..." : "Submit Evaluation"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f9', padding: 15 },
  infoCard: { backgroundColor: '#fff', padding: 20, borderRadius: 15, marginBottom: 15, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5, elevation: 2 },
  label: { fontSize: 11, color: '#95a5a6', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: 2 },
  value: { fontSize: 16, fontWeight: 'bold', color: '#2c3e50', marginBottom: 15 },
  fileBtn: { backgroundColor: '#f0f7ff', padding: 12, borderRadius: 10, alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: '#3498db' },
  fileBtnText: { color: '#3498db', fontWeight: 'bold' },
  formCard: { backgroundColor: '#fff', padding: 20, borderRadius: 15, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5, elevation: 2 },
  formTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#e67e22' },
  row: { flexDirection: 'row', marginBottom: 15 },
  inputLabel: { fontSize: 14, color: '#34495e', marginBottom: 5, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#dcdde1', borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: '#fafafa' },
  textArea: { height: 80, textAlignVertical: 'top' },
  submitBtn: { backgroundColor: '#e67e22', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  disabledBtn: { backgroundColor: '#bdc3c7' },
  submitBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default ReviewSubmissionScreen;


