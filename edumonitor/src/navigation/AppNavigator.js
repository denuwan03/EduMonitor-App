import React, { useContext } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// 1. Context
import { AuthContext } from "../context/AuthContext";

// 2. Auth & Shared Screens
import LoginScreen from "../screens/LoginScreen";
import EditSkillsScreen from "../screens/Shared/EditSkillsScreen";

// 3. Root Navigators (Tabs)
import StudentTabNavigator from "./StudentTabNavigator";
import AdminTabNavigator from "./AdminTabNavigator";

// 4. Student Action Screens
import TaskDetailScreen from "../screens/Student/TaskDetailScreen";
import RequestTopicScreen from "../screens/Student/RequestTopicScreen";

// 5. Admin/Supervisor Action Screens
import CreateAnnouncement from "../screens/Admin/CreateAnnouncement";
import CreateSmartTaskScreen from "../screens/Admin/CreateSmartTaskScreen";
import TopicApprovalScreen from "../screens/Admin/TopicApprovalScreen";
import ReviewSubmissionScreen from "../screens/Admin/ReviewSubmissionScreen"; // ADDED THIS
import RegisterUserScreen from "../screens/Admin/RegisterUserScreen";
// Add this line near your other screen imports
import SubmissionsListScreen from "../screens/Admin/SubmissionsListScreen";

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <>
            {user.role === "Student" ? (
              // --- STUDENT STACK ---
              <>
                <Stack.Screen
                  name="StudentRoot"
                  component={StudentTabNavigator}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="TaskDetails"
                  component={TaskDetailScreen}
                  options={{
                    title: "Submit Task",
                    headerStyle: { backgroundColor: "#3498db" },
                    headerTintColor: "#fff",
                  }}
                />
                <Stack.Screen
                  name="RequestTopic"
                  component={RequestTopicScreen}
                  options={{
                    title: "New Topic Request",
                    headerStyle: { backgroundColor: "#3498db" },
                    headerTintColor: "#fff",
                  }}
                />
                <Stack.Screen
                  name="EditSkills"
                  component={EditSkillsScreen}
                  options={{
                    title: "Update My Skills",
                    headerStyle: { backgroundColor: "#3498db" },
                    headerTintColor: "#fff",
                  }}
                />
              </>
            ) : (
              // --- ADMIN / SUPERVISOR STACK ---
              <>
                <Stack.Screen
                  name="AdminRoot"
                  component={AdminTabNavigator}
                  options={{ headerShown: false }}
                />
                {/* THIS WAS THE MISSING PIECE CAUSING YOUR ERROR */}
                <Stack.Screen
                  name="ReviewSubmission"
                  component={ReviewSubmissionScreen}
                  options={{
                    title: "Evaluate Submission",
                    headerStyle: { backgroundColor: "#e67e22" },
                    headerTintColor: "#fff",
                  }}
                />
                <Stack.Screen
                  name="CreateAnnouncement"
                  component={CreateAnnouncement}
                  options={{
                    title: "New Announcement",
                    headerStyle: { backgroundColor: "#e67e22" },
                    headerTintColor: "#fff",
                  }}
                />
                <Stack.Screen
                  name="CreateSmartTask"
                  component={CreateSmartTaskScreen}
                  options={{
                    title: "Smart Tasking",
                    headerStyle: { backgroundColor: "#e67e22" },
                    headerTintColor: "#fff",
                  }}
                />
                <Stack.Screen
                  name="TopicApproval"
                  component={TopicApprovalScreen}
                  options={{
                    title: "Review Topics",
                    headerStyle: { backgroundColor: "#e67e22" },
                    headerTintColor: "#fff",
                  }}
                />
                <Stack.Screen
                  name="EditSkills"
                  component={EditSkillsScreen}
                  options={{
                    title: "Update Staff Info",
                    headerStyle: { backgroundColor: "#e67e22" },
                    headerTintColor: "#fff",
                  }}
                />
                <Stack.Screen
                  name="RegisterUser"
                  component={RegisterUserScreen}
                  options={{
                    title: "Register New User",
                    headerStyle: { backgroundColor: "#2ecc71" },
                    headerTintColor: "#fff",
                  }}
                />
                <Stack.Screen 
  name="SubmissionsList" 
  component={SubmissionsListScreen} 
  options={{ title: "Project Workload" }} 
/>
                
              </>
            )}
          </>
        ) : (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

export default AppNavigator;
