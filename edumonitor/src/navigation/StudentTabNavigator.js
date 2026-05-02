import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

import StudentDashboard from '../screens/Student/StudentDashboard';
import MyTasks from '../screens/Student/MyTasks';
import AnnouncementsScreen from '../screens/Shared/AnnouncementsScreen';
import ProfileScreen from '../screens/Shared/ProfileScreen';

const Tab = createBottomTabNavigator();

const StudentTabNavigator = ({ navigation }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 
            route.name === 'Home' ? (focused ? 'home' : 'home-outline') :
            route.name === 'Tasks' ? (focused ? 'clipboard' : 'clipboard-outline') :
            route.name === 'Updates' ? (focused ? 'notifications' : 'notifications-outline') :
            (focused ? 'person' : 'person-outline');
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3498db',
        headerTintColor: '#fff',
        headerStyle: { backgroundColor: '#3498db' },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={StudentDashboard} 
        options={{ 
          title: 'Dashboard',
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('RequestTopic')} style={{ marginRight: 15 }}>
              <Ionicons name="add-circle" size={26} color="#fff" />
            </TouchableOpacity>
          )
        }} 
      />
      <Tab.Screen name="Tasks" component={MyTasks} options={{ title: 'My Assignments' }} />
      <Tab.Screen name="Updates" component={AnnouncementsScreen} options={{ title: 'Announcements' }} />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('EditSkills')} style={{ marginRight: 15 }}>
              <Ionicons name="create-outline" size={24} color="#fff" />
            </TouchableOpacity>
          )
        }}
      />
    </Tab.Navigator>
  );
};

export default StudentTabNavigator;