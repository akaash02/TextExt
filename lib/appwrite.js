import { Client, Account, ID, Storage, Databases, Query } from 'react-native-appwrite';
import { PLATFORM, PROJECT_ID, STORAGE_ID, DATABASE_ID, USER_COLLECTION_ID, NOTES_COLLECTION_ID, SUMMARIES_COLLECTION_ID, QUIZZES_COLLECTION_ID } from '@env';

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: PLATFORM,
  projectId: PROJECT_ID,
  storageId: STORAGE_ID,
  databaseId: DATABASE_ID,
  userCollectionId: USER_COLLECTION_ID,
  notesCollectionId: NOTES_COLLECTION_ID,
  summariesCollectionId: SUMMARIES_COLLECTION_ID,
  quizzesCollectionId: QUIZZES_COLLECTION_ID,
};

const client = new Client();
client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

const account = new Account(client);
const storage = new Storage(client);
const databases = new Databases(client);

// Register User
export async function createUser(email, password, username) {
  try {
    const newAccount = await account.create(ID.unique(), email, password, username);
    if (!newAccount) throw Error;

    await signIn(email, password);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        password,
        modules: [], // Initialize with an empty array of modules
      }
    );

    return newUser;
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

// Get Current User's Modules
export async function getUserModules() {
  try {
    const currentUser = await getCurrentUser();
    return currentUser ? currentUser.modules : [];
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function createCourse(moduleName) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User not found");

    // Validate that moduleName is a string
    if (typeof moduleName !== "string" || moduleName.trim() === "") {
      throw new Error("Invalid module name. It must be a non-empty string.");
    }

    // Update the user's document to include the new module
    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      currentUser.$id,
      {
        modules: [...currentUser.modules, moduleName.trim()], // Add the module name to the array
      }
    );

    return updatedUser; // Optionally return the updated user document
  } catch (error) {
    console.error("Error in createCourse:", error.message);
    throw new Error(error.message);
  }
}



// Get Current User's Email
export async function getEmail() {
  try {
    const currentUser = await getCurrentUser();
    return currentUser ? currentUser.email : null;
  } catch (error) {
    console.log(error);
    return null;

    return [];

  }
}

// Update User's Modules
export async function addModuleToUser(moduleId) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw Error;

    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      currentUser.$id,
      {
        modules: [...currentUser.modules, moduleId],
      }
    );

    return updatedUser;
  } catch (error) {
    console.log(error);
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

// Create a Note
export async function createNote(moduleId, title, fileUrl) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw Error;

    const newNote = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.notesCollectionId,
      ID.unique(),
      {
        accountId: currentUser.accountId,
        moduleId,
        title,
        fileUrl,
        description: "", // Add optional description
        timestamp: new Date().toISOString(),
        status: "uploaded", // Default status
      }
    );

    return newNote;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

// Get Notes for a Module
export async function getNotesByModule(moduleId) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw Error;

    const notes = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.notesCollectionId,
      [Query.equal("moduleId", moduleId)]
    );

    return notes.documents;
  } catch (error) {
    console.log(error);
    return [];
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

// Create a Summary
export async function createSummary(moduleId, noteId, summaryText) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw Error;

    const newSummary = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.summariesCollectionId,
      ID.unique(),
      {
        accountId: currentUser.accountId,
        moduleId,
        noteId,
        summaryText,
        generatedAt: new Date().toISOString(),
      }
    );

    return newSummary;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

// Get Summaries for a Module
export async function getSummariesByModule(moduleId) {
  try {
    const summaries = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.summariesCollectionId,
      [Query.equal("moduleId", moduleId)]
    );

    return summaries.documents;
  } catch (error) {
    console.log(error);
    return [];
  }
}

// Create a Quiz
export async function createQuiz(moduleId, noteId, questions) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw Error;

    const newQuiz = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.quizzesCollectionId,
      ID.unique(),
      {
        accountId: currentUser.accountId,
        moduleId,
        noteId,
        questions, // Array of question objects
        generatedAt: new Date().toISOString(),
      }
    );

    return newQuiz;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

// Get Quizzes for a Module
export async function getQuizzesByModule(moduleId) {
  try {
    const quizzes = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.quizzesCollectionId,
      [Query.equal("moduleId", moduleId)]
    );

    return quizzes.documents;
  } catch (error) {
    console.log(error);
    return [];
  }
}

// Create a Module
export async function createModule(moduleName) {
  try {
    const newModule = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.modulesCollectionId,
      ID.unique(),
      {
        name: moduleName,
      }
    );

    return newModule;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

// Get All Modules
export async function getAllModules() {
  try {
    const modules = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.modulesCollectionId
    );

    return modules.documents;
  } catch (error) {
    console.log(error);
    return [];
  }
}

// Get Items by Module (Generic)
export async function getItemsByModule(collectionId, moduleId) {
  try {
    const items = await databases.listDocuments(
      appwriteConfig.databaseId,
      collectionId,
      [Query.equal("moduleId", moduleId)]
    );

    return items.documents;
  } catch (error) {
    console.log(error);
    return [];
  }
}