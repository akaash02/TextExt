import React from "react";
import { SafeAreaView, View, Text, StyleSheet, Button } from "react-native";
import { router } from "expo-router"; // Assuming you're using Expo for routing

const Home = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome to TextExt</Text>
        <Text style={styles.subtitleText}>Upload your lecture notes for text extraction</Text>
      </View>

      <View style={styles.uploadSection}>
        <Text style={styles.uploadPrompt}>Choose a PDF file to extract text:</Text>
        <Button title="Upload PDF" onPress={() => {}} color="#6200EE" />
      </View>

      <View style={styles.footer}>
        <Button title="View Quizzes" onPress={() => router.push("/quizzes")} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  subtitleText: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
  },
  uploadSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    alignItems: "center",
  },
  uploadPrompt: {
    fontSize: 16,
    color: "#444",
    marginBottom: 20,
  },
  footer: {
    marginTop: 20,
    alignItems: "center",
  },
});

export default Home;
