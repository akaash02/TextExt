import { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  FlatList,
  Image,
  RefreshControl,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { images } from "../../constants";
import { getUsername, getUserModules } from "../../lib/appwrite";
import { EmptyState, CustomButton } from "../../components";
import { scheduleNotification } from "../Notifications";

const Home = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [modules, setModules] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch user data (username and modules)
  const fetchData = async () => {
    try {
      const fetchedUsername = await getUsername();
      setUsername(fetchedUsername || "Guest");

      const fetchedModules = await getUserModules();
      setModules(fetchedModules);

      fetchedModules.forEach((moduleName) => {
        scheduleNotification(
          `Reminder: ${moduleName}`,
          `Check out your module: ${moduleName}`,
          new Date(Date.now() + 3600 * 1000)
        );
      });
    } finally {
      setRefreshing(false);
    }
  };

  // Re-fetch data when screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  // Pull-to-refresh functionality
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
  };

  // Navigate to create course page
  const handleCreateCourse = () => {
    navigation.navigate("create"); // Navigate to the create page
  };

  const handleModulePress = (moduleName) => {
    // Navigate to the 'ModuleDetails' page and pass the moduleName
    navigation.navigate("moduleDetails", { moduleName });
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        keyExtractor={(item, index) => index.toString()}
        data={modules}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleModulePress(item)}>
            <View className="w-full px-4 mb-4">
              <View className="bg-gray-100 shadow-lg rounded-lg p-4">
                <Text className="text-primary font-semibold text-lg text-center">
                  {item}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <EmptyState
            title="No modules found"
            subtitle="Create a module to get started"
          />
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={() => (
          <View className="px-4 space-y-6" style={{ marginTop: 30 }}>
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-2xl font-semibold text-white">
                  Welcome Back
                </Text>
                <Text className="text-2xl font-semibold text-white">
                  {username || "Loading..."}
                </Text>
                <Text className="text-lg font-semibold text-gray-100 mt-2 mb-5 ">
                  Your Modules
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
      />
      <CustomButton
        title="Create a module"
        handlePress={handleCreateCourse}
        containerStyles="absolute bottom-5 left-4 right-4 p-4 rounded-lg"
        textStyles="text-white font-bold"
      />
    </SafeAreaView>
  );
};

export default Home;
