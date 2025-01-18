import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, TouchableOpacity, Alert, Image, RefreshControl, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import { CustomButton } from '../../components';
import { router } from 'expo-router';

const Quiz = () => {

    return (
        <SafeAreaView style={styles.container}>
            <Text>
                Hi
            </Text>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#161622",
    }
})

export default Quiz;
