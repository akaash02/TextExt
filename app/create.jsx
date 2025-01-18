import React, { useState } from "react";
import { SafeAreaView, ScrollView, Text, View, TouchableOpacity, Alert } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useNavigation } from "@react-navigation/native"; // Import for navigation
import { CustomButton, FormField } from "../components";
import { createCourse } from "../lib/appwrite"; // Import Appwrite function

const Create = () => {
  const navigation = useNavigation(); // Hook for navigation
  const [newCategory, setNewCategory] = useState(""); // For new category input
  const [categories, setCategories] = useState([]); // To store existing categories
  const [selectedCategory, setSelectedCategory] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    dateOfCreation: new Date(),
  });
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const handleDateConfirm = (date) => {
    setForm({ ...form, dateOfCreation: date });
    setDatePickerVisible(false); // Hide the date picker modal after selecting a date
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      Alert.alert("Please enter a category name");
      return;
    }
    if (categories.includes(newCategory)) {
      Alert.alert("Category already exists");
      return;
    }

    setCategories([...categories, newCategory]);
    setSelectedCategory(newCategory); // Automatically select the newly added category
    setForm({ ...form, category: newCategory }); // Update the form with the new category
    setNewCategory(""); // Clear the input field
  };

  const handleCreateTask = async () => {
    if (!form.title || !form.description || !form.category) {
      return Alert.alert("Please fill in missing fields");
    }

    // Call the function to create the course in Appwrite
    try {
      await createCourse(form); // Pass the form data to your Appwrite function
      Alert.alert("Success", "Course created successfully!");
      setForm({
        title: "",
        description: "",
        category: "",
        dateOfCreation: new Date(),
      });
      // Optionally navigate back after creation
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to create course. Please try again.");
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
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

        {/* Description */}
        <FormField
          title="Description"
          value={form.description}
          placeholder="Enter the course description"
          handleChangeText={(e) => setForm({ ...form, description: e })}
          otherStyles="mt-7"
        />

        {/* Date of Creation */}
        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">Date of Creation</Text>
          <TouchableOpacity onPress={() => setDatePickerVisible(true)}>
            <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 flex justify-center items-center">
              <Text className="text-gray-100 font-pmedium">
                {form.dateOfCreation ? form.dateOfCreation.toLocaleString() : "Select Date"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          date={form.dateOfCreation}
          onConfirm={handleDateConfirm}
          onCancel={() => setDatePickerVisible(false)}
        />

        {/* New Category */}
        <FormField
          title="New Category"
          value={newCategory}
          placeholder="Enter a new category"
          handleChangeText={setNewCategory}
          otherStyles="mt-7"
        />
        <CustomButton title="Add Category" handlePress={handleAddCategory} containerStyles="mt-4" />

        {/* Select Category */}
        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">Select Category</Text>
          <TouchableOpacity>
            <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 flex justify-center">
              <Text className="text-gray-100 font-pmedium">
                {selectedCategory || "Select a category"}
              </Text>
            </View>
          </TouchableOpacity>
          {categories.length > 0 &&
            categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setSelectedCategory(category);
                  setForm({ ...form, category });
                }}
              >
                <View className="bg-gray-800 p-4 rounded-lg mb-2">
                  <Text className="text-gray-100">{category}</Text>
                </View>
              </TouchableOpacity>
            ))}
        </View>

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
