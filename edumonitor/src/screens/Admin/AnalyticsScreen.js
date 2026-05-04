import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, ScrollView } from 'react-native';
import { PieChart, BarChart } from "react-native-chart-kit";
import apiClient from '../../api/client';
import RefreshWrapper from '../../components/RefreshWrapper';

const screenWidth = Dimensions.get("window").width;

const AnalyticsScreen = () => {
  const [performanceData, setPerformanceData] = useState(null);
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAllData = useCallback(async () => {
    try {
      // Calling your specific backend routes
      const [perfRes, projRes] = await Promise.all([
        apiClient.get('/analytics/performance'),
        apiClient.get('/analytics/project-status')
      ]);

      setPerformanceData(perfRes.data);
      setProjectData(projRes.data);
    } catch (error) {
      console.error("Analytics Error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  if (loading) return <ActivityIndicator size="large" color="#e67e22" style={{ flex: 1 }} />;

  // Prepare Pie Chart Data for Task Status (from taskCompletion)
  const taskStats = performanceData?.taskCompletion;
  const pieData = [
    { name: "Pending", population: taskStats?.pending || 0, color: "#f1c40f", legendFontColor: "#7f8c8d", legendFontSize: 12 },
    { name: "In Progress", population: taskStats?.inProgress || 0, color: "#3498db", legendFontColor: "#7f8c8d", legendFontSize: 12 },
    { name: "Completed", population: taskStats?.completed || 0, color: "#2ecc71", legendFontColor: "#7f8c8d", legendFontSize: 12 },
    { name: "Submitted", population: taskStats?.submitted || 0, color: "#9b59b6", legendFontColor: "#7f8c8d", legendFontSize: 12 },
  ];

  // Prepare Bar Chart Data for Top Students (Performance Score)
  const topStudents = performanceData?.performance?.slice(0, 5) || [];
  const barData = {
    labels: topStudents.map(s => s.studentName.split(' ')[0]), // First name only
    datasets: [{ data: topStudents.map(s => s.performanceScore || 0) }]
  };

  return (
    <RefreshWrapper onRefreshCustom={fetchAllData}>
      <View style={styles.container}>
        <Text style={styles.header}>Admin Analytics</Text>

        {/* 1. Project Status Overview */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Project Status Summary</Text>
          <View style={styles.statsRow}>
            <StatBox label="Ongoing" value={projectData?.ongoing} color="#3498db" />
            <StatBox label="Completed" value={projectData?.completed} color="#2ecc71" />
            <StatBox label="Delayed" value={projectData?.delayed} color="#e74c3c" />
          </View>
        </View>

        {/* 2. Task Distribution Pie Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Task Completion Distribution</Text>
          <PieChart
            data={pieData}
            width={screenWidth - 60}
            height={200}
            chartConfig={chartConfig}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={"15"}
            absolute
          />
        </View>

        {/* 3. Top Performers Bar Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Top 5 Performance Scores</Text>
          <BarChart
            data={barData}
            width={screenWidth - 60}
            height={220}
            yAxisLabel=""
            chartConfig={chartConfig}
            verticalLabelRotation={30}
            fromZero
          />
        </View>
      </View>
    </RefreshWrapper>
  );
};

const StatBox = ({ label, value, color }) => (
  <View style={[styles.statBox, { borderTopColor: color }]}>
    <Text style={styles.statValue}>{value || 0}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const chartConfig = {
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(230, 126, 34, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(44, 62, 80, ${opacity})`,
  style: { borderRadius: 16 },
  propsForDots: { r: "6", strokeWidth: "2", stroke: "#ffa726" }
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#f4f6f9' },
  header: { fontSize: 24, fontWeight: 'bold', color: '#2c3e50', marginBottom: 20 },
  chartCard: { backgroundColor: '#fff', borderRadius: 15, padding: 15, marginBottom: 20, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  chartTitle: { fontSize: 16, fontWeight: 'bold', color: '#34495e', marginBottom: 15 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statBox: { backgroundColor: '#f8f9fa', width: '30%', padding: 10, borderRadius: 10, alignItems: 'center', borderTopWidth: 4 },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#2c3e50' },
  statLabel: { fontSize: 10, color: '#7f8c8d', textTransform: 'uppercase', marginTop: 4 }
});

export default AnalyticsScreen;