import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { getUsername, getIncompleteTasks, getAllMeetings, getEmail, signOut  } from "../../lib/appwrite";
import React from 'react';
import { router } from "expo-router";

const Profile = () => {
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState([]);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const name = await getUsername();
        const email = await getEmail();
        setUsername(name);
        setEmail(email);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    }

    fetchData();
  }, []);


  const handleSignOut = async () => {
    try {
      await signOut();
      Alert.alert('Success', 'You have been signed out.');
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out. Please try again.');
      console.error('Sign out error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <Text style={styles.username}>{username || 'Guest'}</Text>
        <Text style={styles.email}>{email}</Text>

         {/* Sign Out Button */}
         <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}  handlePress={() => router.push("../index")}>
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#161622',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
  },
  profilePicture: {
    width: 110,
    height: 130,
    borderRadius: 10,
    backgroundColor: '#60a5fa', // Bright blue
    justifyContent: 'center',
    alignItems: 'center',
  },
  username: {
    fontSize: 40,
    fontWeight: 'bold',
    color: "white",
    padding: 40,
  },
  taskCount: {
    fontSize: 24,
    marginTop: 20,
    color: "white"
  },
  email: {

    fontSize: 20,
    fontWeight: 'bold',
    color: "white"
  },
  signOutButton: {
    backgroundColor: '#f44336', // Red color
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
  },
  signOutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Profile;


/*const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161622', // Dark blue background
    paddingTop: 60, // Shift all content down
    paddingHorizontal: 20,
  },
  profileSection: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  leftSection: {
    alignItems: 'center',
    marginRight: 20,
  },
  profilePicture: {
    width: 110,
    height: 130,
    borderRadius: 10,
    backgroundColor: '#60a5fa', // Bright blue
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontSize: 14,
    color: '#FFFFFF', // White text
    fontWeight: 'bold',
    textAlign: 'center',
  },
  profileName: {
    fontSize: 20,
    color: '#FFFFFF', // White text
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
    paddingLeft: 5,
  },
  rightSection: {
    flex: 1,
    justifyContent: 'center',
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    marginRight: 20,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00FFFF', // Cyan text
  },
  statLabel: {
    fontSize: 14,
    color: '#CCCCFF', // Light cyan
  },
  infoSection: {
    backgroundColor: '#1A1A2E', // Darker blue
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 14,
    color: '#00FFFF', // Cyan text
    marginBottom: 10,
  },
});
*/