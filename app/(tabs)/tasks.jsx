import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, Text, View, StyleSheet, TouchableOpacity, Alert, Image } from "react-native";
import { getAllTasks, markTaskAsCompleted, deleteTask } from "../../lib/appwrite";
import { EmptyState, TaskCard } from "../../components";
import { images } from "../../constants";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch all tasks for the signed-in user
  const fetchTasks = async () => {
    try {
      const fetchedTasks = await getAllTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Mark task as completed
  const completeTask = async (taskId) => {
    try {
      await markTaskAsCompleted(taskId);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.$id === taskId ? { ...task, Completed: true } : task
        )
      );
    } catch (error) {
      console.error("Error marking task as completed:", error);
    }
  };

   // Delete task
   const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks((prevTasks) => prevTasks.filter((task) => task.$id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Handle tapping on completed task
  const onTaskTap = (taskId) => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Yes", onPress: () => handleDeleteTask(taskId) },
      ],
      { cancelable: true }
    );
  };

  // Refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  };

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
                    <View style={styles.header}>
                      <View style={styles.headerContent}>
                        <View>
                          <Text style={styles.usernameText}>
                        
                          </Text>
                        </View>
                        <View>
                         
                        </View>
                      </View>

                    </View>
        <FlatList
          keyExtractor={(item) => item.$id}
          data={tasks}
          renderItem={({ item }) => (
            <View style={styles.taskContainer}>
              <TouchableOpacity
                onPress={() => item.Completed && onTaskTap(item.$id)}
                activeOpacity={item.Completed ? 0.7 : 1}
              >
                <TaskCard
                  title={item.Title || "Untitled Task"}
                  creator={item.Creator || "Unknown"}
                  description={item.Description || "No description available"}
                  dueDate={item.DueDate || "No due date"}
                  priority={item.Priority || 0}   
                  category={item.Category}             
                />
                {item.Completed && (
                  <View style={styles.completedBanner}>
                    <Text style={styles.completedText}>Completed</Text>
                  </View>
                )}
                
              </TouchableOpacity>
              {!item.Completed && (
                <TouchableOpacity
                  style={styles.completeButton}
                  onPress={() => completeTask(item.$id)}
                >
                  <Text style={styles.completeButtonText}>Mark as Completed</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          ListEmptyComponent={() => (
            <EmptyState
              title="No tasks available"
              subtitle="You're all caught up!"
            />
          )}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#161622",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
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
    color: '#aaa',
  },
  usernameText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
  },
  logo: {
    width: 36,
    height: 40,
  },
  taskContainer: {
    marginBottom: 16,
    position: "relative",
  },
  completeButton: {
    backgroundColor: "#28a745",
    paddingVertical: 8,
    borderRadius: 4,
    alignItems: "center",
    width: '90%',
    alignSelf: 'center'
  },
  completeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  completedBanner: {
    position: "absolute",
    top: 8,
    right: 25,
    backgroundColor: "#28a745",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  completedText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default Tasks;

