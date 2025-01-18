import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { useRoute } from "@react-navigation/native"; // Import useRoute
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { images } from "../constants";

const ModuleDetails = () => {
  const route = useRoute(); // Access the route
  const { moduleId } = route.params; // Get moduleId from parameters

  const [loading, setLoading] = useState(true);
  const [moduleDetails, setModuleDetails] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

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
    } catch (error) {
      console.error("Error picking document:", error);
      Alert.alert("Error", "Failed to select PDF. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    const fetchModuleDetails = () => {
      setTimeout(() => {
        setModuleDetails({
          moduleName: "CS2102",
          description: "Introduction to Database Systems.",
          instructor: "Prof. John Doe",
          credits: 4,
        });
        setLoading(false);
      }, 2000);
    };

    fetchModuleDetails();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={{ backgroundColor: "#1c1c1c", flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="white" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <FlatList
        data={[]}
        ListHeaderComponent={() => (
          <View className="px-4 space-y-6" style={{ marginTop: 30 }}>
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-4xl font-semibold text-white">Module details</Text>
                <Text className="text-3xl font-semibold text-gray-100 mt-2 mb-5 ">
                  {moduleId} {/* Display the moduleId */}
                </Text>
              </View>
              <Image
                source={images.logoSmall}
                className="w-12 h-12"
                resizeMode="contain"
              />
            </View>
          </View>
        )}
        renderItem={null}
        keyExtractor={(item, index) => index.toString()}
      />
      <View style={{ marginTop: 30, gap: 16 }}>
          <TouchableOpacity
            onPress={handleQuizzesPress}
            style={{
              backgroundColor: "#0044cc",
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
            <Text style={{ fontSize: 20, fontWeight: "bold", color: "white" }}>Quizzes</Text>
          </TouchableOpacity>
          

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
    </SafeAreaView>
  );
};

export default ModuleDetails;
