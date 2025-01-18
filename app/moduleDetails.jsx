import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Link } from "expo-router";
import Quiz from "./quiz";


const ModuleDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { moduleName } = route.params; // Retrieve module name from navigation params
  const [isUploading, setIsUploading] = useState(false); // Upload state
  const [selectedFile, setSelectedFile] = useState(null); // Selected PDF

  const handleQuizzesPress = () => {
    console.log("Navigate to Quizzes page");
  };

  const handleSummariesPress = () => {
    console.log("Navigate to Summaries page");
  };

  const handleUpload = async () => {
    setIsUploading(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        console.log("User cancelled the upload");
        return;
      }

      const file = result.assets[0];

      // Validate file size (10MB limit)
      const fileInfo = await FileSystem.getInfoAsync(file.uri);
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes

      if (fileInfo.size > maxSize) {
        Alert.alert("File Too Large", "Please select a PDF file smaller than 10MB");
        return;
      }

      setSelectedFile({
        name: file.name,
        size: fileInfo.size,
        uri: file.uri,
      });

      Alert.alert("Success", `PDF selected: ${file.name}`);

      // Upload file logic can go here
    } catch (error) {
      console.error("Error picking document:", error);
      Alert.alert("Error", "Failed to select PDF. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: "#1c1c1c", flex: 1 }}>
      <ScrollView style={{ paddingHorizontal: 16, paddingTop: 20 }}>
        {/* Back Button */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 24, color: "#007aff", fontWeight: "bold" }}>← Back</Text>
        </TouchableOpacity>

        {/* Module Header */}
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 32, color: "white", fontWeight: "600" }}>
            {moduleName || "Module Name"}
          </Text>
        </View>

        {/* Quizzes and Summaries Buttons */}
        <View style={{ marginTop: 30, gap: 16 }}>
          <Link href={"/quiz"}>
            <View
              style={{
                backgroundColor: "#007aff",
                paddingVertical: 18,
                borderRadius: 12,
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 10,
                elevation: 5,
                width: "100%", // Make the View extend across the screen
                alignSelf: "stretch", // Ensure it stretches horizontally
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: "bold", color: "white", textAlign: "center" }}>
                Quizzes
              </Text>
            </View>
          </Link>
          <TouchableOpacity
            onPress={handleSummariesPress}
            style={{
              backgroundColor: "#007aff",
              paddingVertical: 18,
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 10,
              elevation: 5,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold", color: "white" }}>Summaries</Text>
          </TouchableOpacity>
        </View>

        {/* Upload PDF Button */}
        <View style={{ marginTop: 30 }}>
          <TouchableOpacity
            onPress={handleUpload}
            style={{
              backgroundColor: "#6200EE",
              paddingVertical: 15,
              paddingHorizontal: 30,
              borderRadius: 10,
              minWidth: 250,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 10,
              elevation: 5,
            }}
            disabled={isUploading}
          >
            {isUploading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "bold" }}>
                {selectedFile ? `PDF: ${selectedFile.name}` : "Upload PDF"}
              </Text>
            )}
          </TouchableOpacity>

          {selectedFile && (
            <View style={{ backgroundColor: "#FFFFFF", padding: 15, borderRadius: 10, marginTop: 20 }}>
              <Text style={{ fontSize: 16, color: "#333" }}>Selected File: {selectedFile.name}</Text>
              <Text style={{ fontSize: 14, color: "#666" }}>
                Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ModuleDetails;
