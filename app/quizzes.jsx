import React, { useState, useEffect } from "react";
import { SafeAreaView, ScrollView, Text, View, TouchableOpacity, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native"; // Import for navigation
import { CustomButton, FormField } from "../components"; // Assuming these are your reusable components
import { getQuizzes } from "../lib/appwrite"; // Assuming this function fetches quizzes

const Quizzes = () => {
  const navigation = useNavigation(); // Hook for navigation
  const route = useRoute(); // Hook to access route params
  const { moduleName } = route.params; // Get the moduleName from params
  const [quizzes, setQuizzes] = useState([]); // State for storing quizzes

  // Fetch quizzes for the given module
  const fetchQuizzes = async () => {
    try {
      const quizzesData = await getQuizzes(moduleName); // Fetch quizzes based on the module
      setQuizzes(quizzesData);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch quizzes. Please try again.");
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [moduleName]); // Re-fetch when moduleName changes

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

        <Text className="text-2xl text-white font-psemibold">Quizzes for {moduleName}</Text>

        {/* Quizzes List */}
        {quizzes.length > 0 ? (
          quizzes.map((quiz, index) => (
            <View key={index} className="mt-4 bg-gray-100 p-4 rounded-lg shadow-lg">
              <Text className="text-lg font-semibold">{quiz.title}</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("quizDetails", { quizId: quiz.id })}
                className="mt-2 bg-secondary p-2 rounded-lg"
              >
                <Text className="text-white text-center">Start Quiz</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text className="text-white mt-4">No quizzes available for this module.</Text>
        )}

      </ScrollView>
    </SafeAreaView>
  );
};

export default Quizzes;
