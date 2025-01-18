import { View, Text, StyleSheet } from "react-native";

const TaskCard = ({ title, creator, description, dueDate, priority, category }) => {
  // Determine background color based on priority
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 3:
        return "#FF0000"; // Red for priority 3
      case 2:
        return "#FFB300"; // Yellow for priority 2
      case 1:
        return "#28a745"; // Green for priority 1
      default:
        return "#808080"; // Default gray if no priority
    }
  };

  return (
    <View
      className="flex flex-col px-4 py-3 mb-4"
      style={[styles.cardContainer, { borderColor: getPriorityColor(priority) }]}
    >
      {/* Task Title */}
      <Text className="font-psemibold text-lg text-white mb-2" numberOfLines={1}>
        {title}
      </Text>



      {/* Description */}
      <Text className="text-sm text-gray-300 mb-2" numberOfLines={2}>
        {description}
      </Text>

      {/* Due Date */}
      <Text className="text-sm text-gray-100 mb-2">
        Due on: {dueDate}
      </Text>

      {/* Category */}
      <Text className="text-sm text-gray-100 mb-2">
        Category: {category}
      </Text>

      {/* Priority */}
      <Text className="text-sm text-gray-100">
        Priority:{" "}
        <Text style={{ color: getPriorityColor(priority), fontWeight: "bold" }}>
          {priority === 3 ? "High" : priority === 2 ? "Medium" : "Low"}
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "#1E1E1E", // Dark background for contrast
    padding: 16,
    width: '90%', 
    justifyContent: 'center',
    alignSelf: 'center',
  },
});

export default TaskCard;
