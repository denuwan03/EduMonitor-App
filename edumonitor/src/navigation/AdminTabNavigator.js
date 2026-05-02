import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

// Import Screens
import AdminDashboard from "../screens/Admin/AdminDashboard";
import SubmissionsListScreen from "../screens/Admin/SubmissionsListScreen";
import AnnouncementsScreen from "../screens/Shared/AnnouncementsScreen";
import ProfileScreen from "../screens/Shared/ProfileScreen";
import UserListScreen from "../screens/Admin/UserListScreen";
import AnalyticsScreen from "../screens/Admin/AnalyticsScreen";

const Tab = createBottomTabNavigator();

const AdminTabNavigator = ({ navigation }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          // Unified Icon Logic for all Tabs
          if (route.name === "Overview") {
            iconName = focused ? "grid" : "grid-outline";
          } else if (route.name === "Manage") {
            iconName = focused ? "file-tray-full" : "file-tray-full-outline";
          } else if (route.name === "Announcements") {
            iconName = focused ? "megaphone" : "megaphone-outline";
          } else if (route.name === "Students") {
            iconName = focused ? "people" : "people-outline";
          } else if (route.name === "Analytics") {
            iconName = focused ? "stats-chart" : "stats-chart-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person-circle" : "person-circle-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#e67e22",
        tabBarInactiveTintColor: "gray",
        headerStyle: { backgroundColor: "#e67e22" },
        headerTintColor: "#fff",
      })}
    >
      {/* 1. DASHBOARD OVERVIEW */}
      <Tab.Screen 
        name="Overview" 
        component={AdminDashboard} 
        options={{ title: "Dashboard" }} 
      />

      {/* 2. SUBMISSIONS MANAGEMENT */}
      <Tab.Screen
        name="Manage"
        component={SubmissionsListScreen}
        options={{ title: "Submissions" }}
      />

      {/* 3. ANNOUNCEMENTS */}
      <Tab.Screen
        name="Announcements"
        component={AnnouncementsScreen}
        options={{
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate("CreateAnnouncement")}
              style={{ marginRight: 15 }}
            >
              <Ionicons name="add-circle" size={28} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />

      {/* 4. USER DIRECTORY */}
      <Tab.Screen
        name="Students"
        component={UserListScreen}
        options={{ title: "Users" }}
      />

      {/* 5. VISUAL ANALYTICS */}
      <Tab.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{ title: "Insights" }}
      />

      {/* 6. PROFILE */}
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default AdminTabNavigator;