import React, { useState } from 'react';
import {  ScrollView, Text, View, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomButton, FormField } from '../components';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { createMeeting, searchUsersByUsername } from '../lib/appwrite';

const CreateMeetings = () => {
  const [uploading, setUploading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: new Date(),
    attendees: [], // <-- Correct key for meetings
  });
  
  const [isDatePickerVisible, setDatePickerVisible] = useState(false); // For showing/hiding the modal

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert("Please enter a username to search");
      return;
    }
  
    try {
      const users = await searchUsersByUsername(searchQuery);
      setSearchResults(users);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleAssignUser = (user) => {
    if (assignedUsers.some(assignedUser => assignedUser.accountId === user.accountId)) {
          Alert.alert("User already assigned");
          return;
        }

    setForm((prevForm) => ({
      ...prevForm,
      attendees: [...prevForm.attendees, user.accountId], // Update attendees
    }));
  
    setAssignedUsers((prevUsers) => [...prevUsers, user]); // Add selected user to the list of assigned users
  };

  const handleRemoveUser = (userToRemove) => {
    setAssignedUsers((prevUsers) => prevUsers.filter(user => user.accountId !== userToRemove.accountId)); // Remove the user from the list
    setForm((prevForm) => ({
      ...prevForm,
      attendees: prevForm.attendees.filter(accountId => accountId !== userToRemove.accountId), // Remove the user's accountId from the assignees list
    }));
  };
  
  
  const handleDateConfirm = (date) => {
    setForm({ ...form, dueDate: date });
    setDatePickerVisible(false); // Hide the date picker modal after selecting a date
  };

  const handleCreateMeeting = async () => {
    if (!form.title || !form.description) {
      return Alert.alert("Please provide both title and description");
    }
  
    setUploading(true);
  
    try {
      const dueDate = form.dueDate.toISOString();
      // Ensure you're passing attendees correctly
      await createMeeting(form.title, form.description, dueDate, form.attendees); 
  
      Alert.alert("Success", "Meeting created successfully!");
    } catch (error) {
      Alert.alert("Error", "An error occurred while creating the meeting.");
    } finally {
      setUploading(false);
      setForm({
        title: "",
        description: "",
        dueDate: new Date(),
        attendees: [],
      });
    }
  };
  

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <ScrollView className="px-4 my-6 flex-1">
        <Text className="text-2xl text-white font-psemibold">Create Meeting</Text>
  
        <FormField
          title="Meeting Title"
          value={form.title}
          placeholder="Enter the meeting title"
          handleChangeText={(e) => setForm({ ...form, title: e })}
          otherStyles="mt-10"
        />
  
        <FormField
          title="Description"
          value={form.description}
          placeholder="Enter the meeting description"
          handleChangeText={(e) => setForm({ ...form, description: e })}
          otherStyles="mt-7"
        />
        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">Due Date</Text>
          <TouchableOpacity onPress={() => setDatePickerVisible(true)}>
            <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 flex justify-center items-center">
              <Text className="text-gray-100 font-pmedium">
                {form.dueDate ? form.dueDate.toLocaleString() : "Select Date & Time"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* User Search */}

        <FormField
                  title="Assign Users"
                  value={searchQuery}
                  placeholder="Search users by username"
                  handleChangeText={(e) => setSearchQuery(e)}
                  onSubmitEditing={handleSearch}
                  otherStyles="mt-7"
                />
        
              {/* Search Results */}
                      <View className="mt-4">
                        {searchResults.map((user) => (
                          <TouchableOpacity key={user.accountId} onPress={() => handleAssignUser(user)}>
                            <View className="bg-gray-800 p-4 rounded-lg mb-2 flex-row items-center justify-between">
                              <Text className="text-gray-100">{user.username}</Text>
                              <Text className="text-gray-400">Tap to Assign</Text>
                            </View>
                          </TouchableOpacity>
                        ))}
                      </View>
        
              {/* Assigned Users List */}
                      <View className="mt-4">
                        {assignedUsers.map((user) => (
                          <View key={user.accountId} className="bg-white p-3 rounded-lg mb-2 flex-row items-center justify-between">
                            <Text className="text-gray-800">{user.username}</Text>
                            <TouchableOpacity onPress={() => handleRemoveUser(user)}>
                              <Text className="text-red-600">Remove</Text>
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="datetime"
          date={form.dueDate}
          onConfirm={handleDateConfirm}
          onCancel={() => setDatePickerVisible(false)}
        />
  
        <CustomButton
          title="Create Meeting"
          handlePress={handleCreateMeeting}
          containerStyles="mt-7"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateMeetings;
