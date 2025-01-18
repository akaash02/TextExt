
import { Client, Account, ID, Storage, Databases, Query } from 'react-native-appwrite';
import { PLATFORM, PROJECT_ID, STORAGE_ID, DATABASE_ID, USER_COLLECTION_ID } from '@env';

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: PLATFORM,
  projectId: PROJECT_ID,
  storageId: STORAGE_ID,
  databaseId: DATABASE_ID,
  userCollectionId: USER_COLLECTION_ID,
};

const client = new Client();
client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

const account = new Account(client);
const storage = new Storage(client);
const databases = new Databases(client);

// Register user
export async function createUser(email, password, username) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;


    await signIn(email, password);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
      }
    );

    return newUser;
  } catch (error) {
    throw new Error(error);
  }
}

// Sign In
export async function signIn(email, password) {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    throw new Error(error);
  }
}

// Get Current User
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

// Get Current User's Username
export async function getUsername() {
  try {
    const currentUser = await getCurrentUser();
    return currentUser ? currentUser.username : null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

/*
// Get Current User's Email
export async function getEmail() {
  try {
    const currentUser = await getCurrentUser();
    return currentUser ? currentUser.email : null;
  } catch (error) {
    console.log(error);
    return null;
  }
}


// Create a new Task with Assignees
export async function createTask(title, description, priority, dueDate, assignees, category) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error('No user logged in');

    const taskId = ID.unique(); // Generate a unique task ID

    console.log('Generated Task ID:', taskId); // Debug: Check the generated task ID

    // Create the new task document with a relation to the current user
    const newTask = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.tasksCollectionId,
      taskId, // Use the generated unique task ID as the document ID
      {
        taskId: taskId, // Add taskId as an attribute in the document body
        Title: title,
        Description: description,
        Priority: priority,
        Completed: false, // New task is initially incomplete
        DueDate: dueDate ? dueDate : null,
        Creator: currentUser.accountId,
        Assignees: assignees, // Add the assignees array
        Category: category,
      }
    );

    return newTask;
  } catch (error) {
    console.log('Error creating task:', error);
    throw new Error(error);
  }
}

// Filter tasks by category
export async function getTasksByCategory(category) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw Error;

    const tasks = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.tasksCollectionId,
      [
        Query.equal("Creator", currentUser.accountId),
        Query.equal("Category", category),
        Query.limit(1),
      ]
    );

    return tasks.documents;
  } catch (error) { 
    console.log('Error fetching tasks by category:', error);
    return [];
  }
}


// Mark a Task as Complete
export async function markTaskAsCompleted(taskId) {
  try {
    const updatedTask = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.tasksCollectionId,
      taskId,
      {
        Completed: true,
      }
    );

    return updatedTask;
  } catch (error) {
    console.log('Error marking task as completed:', error);
    throw new Error(error);
  }
}

// Edit a Task
export async function editTask(taskId, updatedFields) {
  try {
    const updatedTask = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.tasksCollectionId,
      taskId,
      updatedFields
    );

    return updatedTask;
  } catch (error) {
    console.log('Error editing task:', error);
    throw new Error(error);
  }
}

// Delete a Task
export async function deleteTask(taskId) {
  try {
    const deletedTask = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.tasksCollectionId,
      taskId
    );

    return deletedTask;
  } catch (error) {
    console.log('Error deleting task:', error);
    throw new Error(error);
  }
}


// Get Incomplete Tasks of the Current User
export async function getIncompleteTasks() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw Error;

    const tasks = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.tasksCollectionId,
      [
        Query.equal("Creator", currentUser.accountId),
        Query.equal("Completed", false)
      ]
    );

    return tasks.documents;
  } catch (error) {
    console.log('Error fetching incomplete tasks:', error);
    return [];
  }
}

// Fetch all tasks with optional filters
export async function getAllTasks(filters = {}) {
  
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User not authenticated");

    // Fetch all tasks for the current user
    const tasks = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.tasksCollectionId,
      [Query.equal("Creator", currentUser.accountId)]
    );

    // Group tasks by category
    const groupedTasks = tasks.documents.reduce((groups, task) => {
      const category = task.Category;
      if (!groups[category]) {
        groups[category] = task; // Add the first task of this category
      }
      return groups;
    }, {});

    // Convert grouped tasks to an array
    const uniqueTasks = Object.values(groupedTasks);

    return uniqueTasks;
  } catch (error) {
    console.error("Error fetching tasks by category:", error);
    return [];
  }
}

// Sign Out
export async function signOut() {
  try {
    const session = await account.deleteSession("current");

    return true;
  } catch (error) {
    throw new Error(error);
  }
}

// Create a new Meeting
export async function createMeeting(title, description, dueDate, attendees) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error('No user logged in');

    const meetingId = ID.unique(); // Generate a unique task ID

    console.log('Generated Meeting ID:', meetingId); // Debug: Check the generated task ID

    // Create the new meeting document with a relation to the current user
    const newMeeting = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.meetingsCollectionId,
      meetingId, // Use the generated unique meeting ID as the document ID
      {
        meetingId: meetingId, // Add taskId as an attribute in the document body
        Title: title,
        Description: description,
        DueDate: dueDate ? dueDate : null,
        Creator: currentUser.accountId, 
        Attendees: attendees
      }
    );

    return newMeeting;
  } catch (error) {
    console.log('Error creating meeting:', error);
    throw new Error(error);
  }
}

// View Meetings
export const viewMeetings = async () => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error('No user logged in');

    // Create queries to fetch meetings where the user is the Creator or in the Attendees list
    const queryCreator = Query.equal("Creator", currentUser.accountId);
    const queryAttendee = Query.search("Attendees", currentUser.accountId);

    // Combine the queries using an array
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.meetingsCollectionId,
      [queryCreator, queryAttendee] // Queries must be passed as an array
    );

    return response.documents;
  } catch (error) {
    console.error('Error fetching meetings:', error.message);
    throw error; // Rethrow the error for the calling component to handle.
  }
};


// Find username
export async function searchUsersByUsername(query) {
  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.search("username", query)]
    );

    if (!users) throw new Error("Something went wrong");

    return users.documents;
  } catch (error) {
    throw new Error(error);
  }
}

// Get All Meetings of the Current User
export async function getAllMeetings() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.accountId) {
      throw new Error("User not authenticated or invalid account ID");
    }

    // Fetch meetings created by the user
    const creatorMeetings = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.meetingsCollectionId,
      [Query.equal("Creator", currentUser.accountId)]
    );

    // Fetch meetings where the user is an attendee
    const attendeeMeetings = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.meetingsCollectionId,
      [Query.search("Attendees", currentUser.accountId)]
    );

    // Merge and return unique meetings
    const allMeetings = [
      ...creatorMeetings.documents,
      ...attendeeMeetings.documents,
    ];

    console.log("Fetched meetings:", allMeetings);
    return allMeetings;
  } catch (error) {
    console.error("Error fetching all meetings:", error);
    return [];
  }
}
*/


