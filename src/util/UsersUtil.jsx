import { getFirestore, doc, getDoc } from "firebase/firestore";
import { auth } from "../../firebase"; // Adjust the import path as necessary
import adminUserIds from "../AdminUsers";
const db = getFirestore();

/**
 * Fetches the current user's data from the 'users' collection in Firestore.
 * @returns {Promise<Object|null>} The user data object if it exists, otherwise null.
 */
const fetchCurrentUserData = async () => {
  // Ensure a user is authenticated
  const currentUser = auth.currentUser;
  if (!currentUser) {
    console.error("No user is currently signed in.");
    return null;
  }

  try {
    // Reference to the user's document in the 'users' collection
    const userDocRef = doc(db, "users", currentUser.uid);

    // Retrieve the document snapshot
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      return userDocSnap.data(); // Return the user data
    } else {
      console.error("User document does not exist in Firestore.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

const isAdminUser = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.error("No user is currently signed in.");
      return false;
    }
  
    return adminUserIds.includes(currentUser.uid);
  };

  export { fetchCurrentUserData, isAdminUser };
