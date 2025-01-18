import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { viewMeetings } from '../lib/appwrite';

const ViewMeetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const userMeetings = await viewMeetings();
        setMeetings(userMeetings);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch meetings.');
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  const renderMeeting = ({ item }) => (
    <View style={{
      padding: 16,
      backgroundColor: '#333',
      marginBottom: 8,
      borderRadius: 8,
    }}>
      <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>{item.Title}</Text>
      <Text style={{ color: '#ccc', fontSize: 14, marginTop: 4 }}>{item.Description}</Text>
      <Text style={{ color: '#999', fontSize: 12, marginTop: 4 }}>
        Date: {new Date(item.DueDate).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1a1a1a' }}>
      <View style={{ padding: 16 }}>
        <Text style={{ color: '#22d3ee', fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Your Meetings</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#22d3ee" />
        ) : meetings.length > 0 ? (
          <FlatList
            data={meetings}
            keyExtractor={(item) => item.$id}
            renderItem={renderMeeting}
          />
        ) : (
          <Text style={{ color: '#ccc', fontSize: 16 }}>No meetings found.</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ViewMeetings;