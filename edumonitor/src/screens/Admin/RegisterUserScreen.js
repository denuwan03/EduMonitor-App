import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator
} from "react-native";
import apiClient from "../../api/client";

const RegisterUserScreen = ({ route, navigation }) => {
  // 1. Check if we are in Edit Mode
  const { editUser } = route.params || {};
  const isEditMode = !!editUser;

  const [form, setForm] = useState({
    name: editUser?.name || "",
    email: editUser?.email || "",
    password: "", // Leave empty for security during update
    role: editUser?.role || "Student",
    status: editUser?.status || "Active",
  });
  
  const [loading, setLoading] = useState(false);

  // Set the Header title based on mode
  useEffect(() => {
    navigation.setOptions({ title: isEditMode ? "Update User" : "Register New User" });
  }, [isEditMode]);

  const handleSubmit = async () => {
    // Basic Validation
    if (!form.name || !form.email || (!isEditMode && !form.password)) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      if (isEditMode) {
        // --- UPDATE LOGIC ---
        // We use your backend route: PUT /users/:id
        await apiClient.put(`/users/${editUser._id}`, form);
        Alert.alert("Success", "User details updated successfully!");
      } else {
        // --- CREATE LOGIC ---
        // We use your backend route: POST /users/create
        await apiClient.post('/users/create', form);
        Alert.alert("Success", `New ${form.role} added successfully!`);
      }
      navigation.goBack();
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Operation failed. Check permissions.";
      Alert.alert(isEditMode ? "Update Failed" : "Registration Denied", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter full name"
        value={form.name}
        onChangeText={(t) => setForm({ ...form, name: t })}
      />

      <Text style={styles.label}>Email Address</Text>
      <TextInput
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder="user@example.com"
        value={form.email}
        onChangeText={(t) => setForm({ ...form, email: t })}
      />

      {!isEditMode && (
        <>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            placeholder="Min 6 characters"
            value={form.password}
            onChangeText={(t) => setForm({ ...form, password: t })}
          />
        </>
      )}

      <Text style={styles.label}>User Role</Text>
      <View style={styles.pickerContainer}>
        {["Student", "Supervisor", "Admin"].map((r) => (
          <TouchableOpacity
            key={r}
            style={[styles.pickerBtn, form.role === r && styles.roleBtnActive]}
            onPress={() => setForm({ ...form, role: r })}
          >
            <Text style={[styles.pickerBtnText, form.role === r && styles.textWhite]}>{r}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Show Status toggle only in Edit Mode */}
      {isEditMode && (
        <>
          <Text style={styles.label}>Account Status</Text>
          <View style={styles.pickerContainer}>
            {["Active", "Inactive"].map((s) => (
              <TouchableOpacity
                key={s}
                style={[
                  styles.pickerBtn, 
                  form.status === s && (s === "Active" ? styles.activeStatus : styles.inactiveStatus)
                ]}
                onPress={() => setForm({ ...form, status: s })}
              >
                <Text style={[styles.pickerBtnText, form.status === s && styles.textWhite]}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      <TouchableOpacity
        style={[styles.submitBtn, isEditMode && styles.updateBtn]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitBtnText}>
            {isEditMode ? "Update User Information" : "Create User Account"}
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  label: { fontWeight: "bold", color: "#34495e", marginTop: 20, marginBottom: 5 },
  input: {
    borderBottomWidth: 1,
    borderColor: "#dcdde1",
    paddingVertical: 10,
    fontSize: 16,
    color: "#2c3e50"
  },
  pickerContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  pickerBtn: { flex: 0.3, padding: 10, borderWidth: 1, borderColor: "#dcdde1", borderRadius: 8, alignItems: "center" },
  roleBtnActive: { backgroundColor: "#e67e22", borderColor: "#e67e22" },
  activeStatus: { backgroundColor: "#2ecc71", borderColor: "#2ecc71" },
  inactiveStatus: { backgroundColor: "#e74c3c", borderColor: "#e74c3c" },
  pickerBtnText: { color: "#7f8c8d", fontWeight: "bold", fontSize: 12 },
  textWhite: { color: "#fff" },
  submitBtn: {
    backgroundColor: "#2ecc71",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 40,
    elevation: 3
  },
  updateBtn: { backgroundColor: "#3498db" },
  submitBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

export default RegisterUserScreen;