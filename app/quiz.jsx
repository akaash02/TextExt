import React from 'react';
import { ScrollView, Text, View, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Quiz = () => {
    const quizContentList = [
        { title: 'Math Quiz', description: 'Covers algebra, geometry, and trigonometry', creationDate: '2025-01-10' },
        { title: 'Science Quiz', description: 'Topics include physics and chemistry', creationDate: '2025-01-12' },
        { title: 'History Quiz', description: 'World War II and Cold War topics', creationDate: '2025-01-15' },
        { title: 'English Quiz', description: 'Focus on grammar and comprehension', creationDate: '2025-01-18' },
        { title: 'English Quiz', description: 'Focus on grammar and comprehension', creationDate: '2025-01-18' },
        { title: 'English Quiz', description: 'Focus on grammar and comprehension', creationDate: '2025-01-18' },
        { title: 'English Quiz', description: 'Focus on grammar and comprehension', creationDate: '2025-01-18' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Generated Quizzes</Text>
            </View>

            <ScrollView style={styles.scrollView}>
                {quizContentList.map((quiz, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.cardContainer}
                        onPress={() => Alert.alert(`Opening: ${quiz.title}`)}
                    >
                        <Text style={styles.cardTitle} numberOfLines={1}>
                            {quiz.title}
                        </Text>
                        <Text style={styles.cardDescription} numberOfLines={2}>
                            {quiz.description}
                        </Text>
                        <Text style={styles.cardText}>
                            Created on: <Text style={styles.cardDetail}>{quiz.creationDate}</Text>
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#161622",
    },
    header: {
        flex: 0.1,
        //        backgroundColor: "red",
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    headerText: {
        color: "white",
        fontSize: 30,
        fontWeight: "bold",
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    cardContainer: {
        borderWidth: 1,
        borderRadius: 10,
        borderColor: "#808080", // Default gray border
        backgroundColor: "#1E1E1E",
        padding: 16,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    cardTitle: {
        fontSize: 18,
        color: "white",
        fontWeight: "bold",
        marginBottom: 8,
    },
    cardDescription: {
        fontSize: 14,
        color: "#B0B0B0",
        marginBottom: 8,
    },
    cardText: {
        fontSize: 14,
        color: "#D3D3D3",
        marginBottom: 4,
    },
    cardDetail: {
        color: "#FFFFFF",
        fontWeight: "bold",
    },
});

export default Quiz;
