import { useState, useEffect } from "react";
import {
  SafeAreaView,
  FlatList,
  Image,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native"; // For navigation
import { images } from "../../constants";
import { getUsername, getUserModules } from "../../lib/appwrite"; // Updated import for fetching user modules
import { EmptyState, InfoBox, CustomButton } from "../../components";
import { requestNotificationPermission, scheduleNotification } from "../Notifications";

const Home = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [modules, setModules] = useState([]); // Updated to reflect user modules
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const fetchedUsername = await getUsername();
      setUsername(fetchedUsername || "Guest");

      const fetchedModules = await getUserModules(); // Fetch user modules
      setModules(fetchedModules);

      fetchedModules.forEach((moduleName) => {
        scheduleNotification(
          `Reminder: ${moduleName}`,
          `Check out your module: ${moduleName}`,
          new Date(Date.now() + 3600 * 1000) // Example: Notify in 1 hour
        );
      });
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      const hasPermission = await requestNotificationPermission();
      if (hasPermission) await fetchData();
    };
    initialize();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
  };

  const handleCreateCourse = () => {
    navigation.navigate("create"); // Navigate to the create page
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        keyExtractor={(item, index) => index.toString()} // Modules are strings, so use index as key
        data={modules} // Use modules as the data source
        renderItem={({ item }) => (
          <View className="flex-1 justify-center items-center bg-primary p-4">
           <InfoBox
            title={item} // Dynamic title
            containerStyles="bg-gray-100 rounded-xl min-h-[62px] flex flex-row justify-center items-center" // Style for the InfoBox container
            titleStyles="text-primary font-psemibold absolute bottom-5 left-4 right-4 p-4 rounded-lg" // Center the title text
           />
          </View>

        )}
        ListEmptyComponent={
          <EmptyState title="No modules found" subtitle="Create a course to get started" />
        }
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={() => (
          <View className="flex-start px-4 space-y-6 mt-2">
            <View className="flex-start justify-between flex-row mb-6">
              <View>
                <Text className="text-2xl font-semibold text-white">Welcome Back</Text>
                <Text className="text-2xl font-semibold text-white">{username || "Loading..."}</Text>
                <Text className="text-lg font-semibold text-gray-100 mt-2">Your Modules</Text>
              </View>
              <View className="mt-1.5">
                <Image
                  source={images.logoSmall}
                  className="w-12 h-12 items-end"
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>
        )}
      />
      <CustomButton
        title="Create a course"
        handlePress={handleCreateCourse}
        containerStyles="absolute bottom-5 left-4 right-4 p-4 rounded-lg"
      />
    </SafeAreaView>
  );
};

export default Home;
