import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, Image, RefreshControl, Text, View, StyleSheet } from "react-native";
import { router } from "expo-router";
import { images } from "../../constants";
import { getUsername, getIncompleteTasks } from "../../lib/appwrite";
import { EmptyState, TaskCard, CustomButton } from "../../components";
import { requestNotificationPermission, scheduleNotification } from "../Notifications";

const Home = () => {
  const [username, setUsername] = useState('');
  const [tasks, setTasks] = useState([]); // State to store incomplete tasks
  const [refreshing, setRefreshing] = useState(false);

  // Fetch username and tasks
  
  const fetchData = async () => {
    const fetchedUsername = await getUsername(); // Get username
    if (fetchedUsername) {
      setUsername(fetchedUsername);
    } else {
      setUsername('Guest');
    }

    const fetchedTasks = await getIncompleteTasks(); // Get incomplete tasks
    setTasks(fetchedTasks); // Store tasks in state

    // Schedule notifications for tasks
    fetchedTasks.forEach((task) => {
      if (task.DueDate) {
        const dueDate = new Date(task.DueDate); // Parse DueDate into a Date object
        if (dueDate > new Date()) {
          scheduleNotification(
            `Task Reminder: ${task.Title || "Untitled Task"}`,
            `Due on ${dueDate.toDateString()} at ${dueDate.toLocaleTimeString()}`,
            dueDate
          );
        }
      }
    });
  };

  // Fetch data on component mount
  useEffect(() => {
    const initialize = async () => {
      const hasPermission = await requestNotificationPermission();
      if (hasPermission) {
        await fetchData();
      }
    };
    initialize();
  }, []);

  // Refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData(); // Refetch username and tasks
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <FlatList
          keyExtractor={(item) => item.$id}
          data={tasks} // Pass tasks data to FlatList
          renderItem={({ item }) => (
            <TaskCard
              title={item.Title || "Untitled Task"}
              creator={item.Creator || "Unknown"}
              description={item.Description || "No description available"}
              dueDate={item.DueDate || "No due date"}
              priority={item.Priority || 0}
              category={item.Category}
            />
          )}
          ListHeaderComponent={() => (
            <View style={styles.header}>
              <View style={styles.headerContent}>
                <View>
                  <Text style={styles.welcomeText}>Welcome Back</Text>
                  <Text style={styles.usernameText}>
                    {username ? username : 'Loading...'}
                  </Text>
                </View>
                <View>
                  <Image
                    source={images.logo}
                    style={styles.logo}
                    resizeMode="contain"
                  />
                </View>
                </View>
              
              <View style={styles.tasksTitleContainer}>
                <Text style={styles.tasksTitle}>Your Tasks</Text>
              </View>
            </View>
          )}
          ListEmptyComponent={() => (
            <EmptyState
              title="No pending tasks"
              subtitle="Create a task to get started"
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
      <View style={styles.fixedButtonContainer}>
        <CustomButton
          title="Create a task"
          handlePress={() => router.push("/create")}
          containerStyles={styles.createTaskButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#060606",  },
  content: {
    flex: 1,
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 14,
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
  tasksTitleContainer: {
    marginTop: 20,
  },
  tasksTitle: {
    fontSize: 18,
    color: '#f0f9ff',
    marginBottom: 8,
  },
  fixedButtonContainer: {
    padding: 16,
    backgroundColor: 'transparent',
  },
  createTaskButton: {
    width: '100%',
    paddingVertical: 10,
  },
});

export default Home;
