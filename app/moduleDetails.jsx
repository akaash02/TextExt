import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Link } from "expo-router";
import Quiz from "./quiz";
import { CustomButton } from "../components"


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

      const fileInfo = await FileSystem.getInfoAsync(file.uri);
      const maxSize = 10 * 1024 * 1024;

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
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className = "flex-row align-centre"
        >
          <Text className="text-4xl text-white mr-2">←</Text>
        </TouchableOpacity>

    <View style={{ marginTop: 20 }}>
    <Text className="text-2xl font-semibold text-gray-100" >
        Module Details
      </Text>
      <Text className="text-3xl font-semibold text-white mt-2 mb-5 " >
        {moduleName}
      </Text>
    </View>
        <View className=" space-y-4">
         <CustomButton
           title="Quizzes"
           handlePress={handleQuizzesPress}
           containerStyles={{ width: "100%", alignSelf: "stretch" }}
           textStyles={{ textAlign: "center" }}
           isLoading={false} // Pass `true` if loading state is required
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
    </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ModuleDetails;
