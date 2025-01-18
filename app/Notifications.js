import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Request permission for notifications
export const requestNotificationPermission = async () => {
  const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
  return status === 'granted';
};

// Schedule a notification
export const scheduleNotification = async (title, body, date) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
    },
    trigger: { date }, // Date for notification trigger
  });
};
