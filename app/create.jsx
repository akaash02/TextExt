import React, { useState } from "react";
import { SafeAreaView, ScrollView, Text, View, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native"; // Import for navigation
import { CustomButton, FormField } from "../components";
import { createCourse } from "../lib/appwrite"; // Import Appwrite function

const Create = () => {
  const navigation = useNavigation(); // Hook for navigation
  const [form, setForm] = useState({
    title: ""
  });

  const handleCreateTask = async () => {
    if (!form.title.trim()) {
      return Alert.alert("Validation Error", "Please enter a valid course title.");
    }
  
    try {
      await createCourse(form.title.trim()); // Pass the sanitized title
      Alert.alert("Success", "Course created successfully!");
      setForm({ title: "" }); // Reset the form
      navigation.goBack(); // Navigate back
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to create course. Please try again.");
    }
  };
  

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4">
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 20,
            marginBottom: 10,
          }}
        >
          <Text style={{ fontSize: 36, color: "white", marginRight: 4 }}>←</Text>
          <Text style={{ fontSize: 20, color: "white", marginTop: 20, marginBottom: 10 }}>Back</Text>
        </TouchableOpacity>

        <Text className="text-2xl text-white font-psemibold">Create Course</Text>

        {/* Course Title */}
        <FormField
          title="Course Title"
          value={form.title}
          placeholder="Enter the course title"
          handleChangeText={(e) => setForm({ ...form, title: e })}
          otherStyles="mt-10"
        />
        <CustomButton
          title="Create Course"
          handlePress={handleCreateTask}
          containerStyles="mt-7"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
