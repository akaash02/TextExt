import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { useRoute, useNavigation } from "@react-navigation/native";
import { CustomButton } from "../components";
import { createSummary } from "../lib/appwrite.js"; // Import the createSummary function

const ModuleDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { moduleName, moduleId } = route.params; // Retrieve module name and moduleId from navigation params
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [summaryId, setSummaryId] = useState(""); // For user input summary title

  const handleQuizzesPress = () => {
    console.log("Navigate to Quizzes page");
  };

  const handleSummariesPress = () => {
    console.log("Navigate to Summaries page");
  };

  const handleUpload = async () => {
    setIsUploading(true);
    try {
      const _result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });

      if (_result.canceled) {
        console.log("User cancelled the upload");
        return;
      }

      const file = _result.assets[0];
      const fileInfo = await FileSystem.getInfoAsync(file.uri);
      const maxSize = 10 * 1024 * 1024;

      if (fileInfo.size > maxSize) {
        Alert.alert("File Too Large", "Please select a PDF file smaller than 10MB");
        return;
      }

      const cachedFileUri = file.uri;

      // Placeholder for text extraction logic
      const extractedText = "Extracted text content placeholder";

      if (!extractedText) {
        Alert.alert("Error", "Failed to extract text from the PDF. Please try again.");
        return;
      }

      setSelectedFile({
        name: file.name,
        size: fileInfo.size,
        text: extractedText, // Save the extracted text for later use
      });

      Alert.alert("Success", `PDF processed: ${file.name}`);

    } catch (error) {
      console.error("Error processing the PDF:", error);
      Alert.alert("Error", "Failed to process the PDF. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveSummary = async () => {
    if (!summaryId.trim()) {
      Alert.alert("Error", "Please enter a summary title.");
      return;
    }
    if (!selectedFile || !selectedFile.text) {
      Alert.alert("Error", "No PDF file selected or text extracted.");
      return;
    }

    try {
      console.log("Saving summary with:", moduleName, summaryId, selectedFile.text);

      // Call the createSummary function with the extracted text
      await createSummary(moduleName, summaryId, selectedFile.text);

      Alert.alert("Success", "Summary saved successfully!");
      setSummaryId(""); // Reset summary title
      setSelectedFile(null); // Reset selected file
    } catch (error) {
      console.error("Error saving summary:", error);
      Alert.alert("Error", "Failed to save the summary. Please try again.");
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: "#1c1c1c", flex: 1 }}>
      <ScrollView style={{ paddingHorizontal: 16, paddingTop: 20 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} className="flex-row align-center">
          <Text className="text-4xl text-white mr-2">←</Text>
        </TouchableOpacity>

        <View style={{ marginTop: 20 }}>
          <Text className="text-2xl font-semibold text-gray-100">Module Details</Text>
          <Text className="text-3xl font-semibold text-white mt-2 mb-5">{moduleName}</Text>
        </View>

        <View className="space-y-4">
          <CustomButton
            title="Quizzes"
            handlePress={handleQuizzesPress}
            containerStyles={{ width: "100%", alignSelf: "stretch" }}
            textStyles={{ textAlign: "center" }}
            isLoading={false} // Pass true if loading state is required
          />
        </View>
        <View className="mt-4">
          <CustomButton
            title="Summaries"
            handlePress={handleSummariesPress}
            containerStyles={{
              width: "100%", alignSelf: "stretch",
            }}
            textStyles={{
              textAlign: "center"
            }}
          />
        </View>

        <View className="mt-4">
          <CustomButton
            title={selectedFile ? `PDF: ${selectedFile.name}` : "Upload PDF"}
            handlePress={handleUpload}
            containerStyles={{
              backgroundColor: "#6200EE",
              paddingVertical: 15,
              paddingHorizontal: 30,
              minWidth: 250,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 10,
              elevation: 5,
            }}
            textStyles={{ fontSize: 16, fontWeight: "bold" }}
            isLoading={isUploading}
          />
        </View>

        {selectedFile && (
          <View
            style={{
              backgroundColor: "#FFFFFF",
              padding: 15,
              borderRadius: 10,
              marginTop: 20,
            }}
          >
            <Text style={{ fontSize: 16, color: "#333" }}>
              Selected File: {selectedFile.name}
            </Text>
            <Text style={{ fontSize: 14, color: "#666" }}>
              Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </Text>
          </View>
        )}

        <View style={{ marginTop: 20 }}>
          <TextInput
            placeholder="Enter summary title"
            placeholderTextColor="#666"
            style={{
              backgroundColor: "#FFF",
              borderRadius: 10,
              padding: 15,
              fontSize: 16,
              color: "#333",
            }}
            value={summaryId}
            onChangeText={setSummaryId}
          />
        </View>

        <View className="mt-4">
          <CustomButton
            title="Save Summary"
            handlePress={handleSaveSummary}
            containerStyles={{
              backgroundColor: "#34A853",
              paddingVertical: 15,
              paddingHorizontal: 30,
              minWidth: 250,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 10,
              elevation: 5,
            }}
            textStyles={{ fontSize: 16, fontWeight: "bold" }}
            isLoading={isUploading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ModuleDetails;
