import { useState, useEffect } from "react";
import { SafeAreaView, FlatList, Image, RefreshControl, Text, View, StyleSheet } from "react-native";
import { router } from "expo-router";
import { images } from "../../constants";
import { getUsername, getCourses } from "../../lib/appwrite"; // Import getCourses function
import { EmptyState, TaskCard, CustomButton } from "../../components";
import { requestNotificationPermission, scheduleNotification } from "../Notifications";
import { useNavigation } from "@react-navigation/native"; // For navigation to Create page

const Home = () => {
  const navigation = useNavigation(); // Hook for navigation to Create page
  const [username, setUsername] = useState('');
  const [courses, setCourses] = useState([]);  // Renamed tasks to courses
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    const fetchedUsername = await getUsername();
    setUsername(fetchedUsername || 'Guest');

    const fetchedCourses = await getCourses();  // Fetch the courses
    setCourses(fetchedCourses);

    fetchedCourses.forEach((course) => {
      if (course.dateOfCreation) {
        const creationDate = new Date(course.dateOfCreation);
        if (creationDate > new Date()) {
          scheduleNotification(
            `New Course Reminder: ${course.title || "Untitled Course"}`,
            `Created on ${creationDate.toDateString()}`,
            creationDate
          );
        }
      }
    });
  };

  useEffect(() => {
    const initialize = async () => {
      const hasPermission = await requestNotificationPermission();
      if (hasPermission) await fetchData();
    };
    initialize();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleCreateCourse = () => {
    navigation.navigate("create"); // Navigate to Create page on button click
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.welcomeText}>Welcome Back</Text>
            <Text style={styles.usernameText}>
              {username || 'Loading...'}
            </Text>
          </View>
          <Image source={images.logo} style={styles.logo} resizeMode="contain" />
        </View>
        <Text style={styles.tasksTitle}>Your Courses</Text>
      </View>

      <FlatList
        keyExtractor={(item) => item.$id}
        data={courses}  // Use courses here
        renderItem={({ item }) => (
          <View style={styles.taskCardContainer}>
            <TaskCard
              title={item.title || "Untitled Course"}  // Updated field name
              creator={item.creator || "Unknown"}  // Updated field name
              description={item.description || "No description available"}  // Updated field name
              dueDate={item.dueDate || "No due date"}  // Updated field name
              priority={item.priority || 0}  // Updated field name
              category={item.category}  // Updated field name
            />
          </View>
        )}
        ListEmptyComponent={
          <EmptyState
            title="No courses created"
            subtitle="Create a course to get started"
          />
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={courses.length === 0 ? styles.emptyListContainer : null}  // Updated to courses
      />

      <CustomButton
        title="Create a course"
        handlePress={handleCreateCourse} // OnPress will now navigate to the Create page
        containerStyles={styles.createTaskButton}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "#1e1e2e", // Dark canvas background

  },
  header: {
    padding: 16,
    backgroundColor: "#252535", // Slightly lighter background
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    marginTop: 40,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    color: '#f0f9ff',
  },
  usernameText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#f0f9ff',
  },
  logo: {
    width: 36,
    height: 40,
  },
  tasksTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f0f9ff',
  },
  taskCardContainer: {
    backgroundColor: "#2c2c3d", // Card background
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    overflow: "hidden",
    padding: 8,
  },
  createTaskButton: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    paddingVertical: 12,
    backgroundColor: "#6200EE", // Bright accent color
    borderRadius: 8,
    elevation: 4,
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Home;
