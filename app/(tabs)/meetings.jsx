import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, TouchableOpacity, Alert, Image, RefreshControl , StyleSheet} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import { CustomButton } from '../../components';
import { router } from 'expo-router';
import { getAllMeetings } from '../../lib/appwrite';

const Meetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch all meetings
  const fetchMeetings = async () => {
    try {
      const meetingsData = await getAllMeetings();
      setMeetings(meetingsData);
    } catch (error) {
      console.error('Error fetching meetings:', error);
    }
  };

  // Trigger refresh when user pulls to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMeetings();
    setRefreshing(false);
  };

  // Fetch meetings when the component loads
  useEffect(() => {
    fetchMeetings();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <View className="my-8 px-4">
        <Text className="text-white text-xl font-psemibold mb-4"></Text>
        <Calendar
          theme={{
            backgroundColor: 'transparent',
            calendarBackground: 'transparent',
            todayTextColor: '#22d3ee',
            selectedDayBackgroundColor: 'blue',
            arrowColor: 'white',
            textDayFontFamily: 'Poppins-Regular',
            textMonthFontFamily: 'Poppins-SemiBold',
            textDayHeaderFontFamily: 'Poppins-Medium',
            textSectionTitleColor: 'white', // Day names (e.g., Sun, Mon, Tue)
            dayTextColor: 'white',         // Days on the calendar
            monthTextColor: 'white',       // Month name (e.g., January 2025)
            textDisabledColor: '#000',  
          }}
          style={{
            backgroundColor: 'transparent',
          }}
        />
      </View>

      {/* Meetings List */}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        className="flex-1"
      >
        {meetings.map((meeting) => (
          <View key={meeting.$id} style={{ marginBottom: 16 }}>
            <TouchableOpacity onPress={() => Alert.alert('Meeting Details', meeting.Title)}>
              <View style={{ backgroundColor: '#222', padding: 16, borderRadius: 8 }}>
                <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>
                  {meeting.Title || 'Untitled Meeting'}
                </Text>
                <Text style={{ color: '#aaa', fontSize: 14 }}>
                  {meeting.Description || 'No description available'}
                </Text>
                <Text style={{ color: '#fff', fontSize: 14, marginTop: 8 }}>
                  {meeting.DueDate || 'No time set'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Create Meeting Button */}
      <View style={styles.fixedButtonContainer}>
      <CustomButton
        title="Schedule Meeting"
        handlePress={() => router.push("/createMeeting")}
        containerStyles="w-full my-5"
      />
      </View>
      <View style={styles.fixedButtonContainer}>
      <CustomButton
        title="View Meetings"
        handlePress={() => router.push("/viewMeetings")}
        containerStyles="w-full my-5"
      />
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  fixedButtonContainer: {
    padding: 16,
    backgroundColor: 'transparent',
  },
  createTaskButton: {
    width: '100%',
    paddingVertical: 1,
  },
});


export default Meetings;


