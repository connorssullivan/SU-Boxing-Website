import { getFirestore, doc, getDoc, collection, getDocs} from "firebase/firestore";
import { auth } from "../../firebase"; // Adjust the import path as necessary
import adminUserIds from "../AdminUsers";

const db = getFirestore();

//Fetch the current user
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

  const fetchAllUsers = async () => {
    try {
        const usersCollectionRef = collection(db, "users");
        const querySnapshot = await getDocs(usersCollectionRef);
        const users = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            uuid: doc.id // Add uuid property using document ID
        }));
        return users;
    } catch (error) {
        console.error("Error fetching all users:", error);
        return [];
    }
};


  //Get the users indormation from the uuid
  const findUser = async (uuid) => {
    try {
        const userDocRef = await doc(db, "users", uuid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const userData = userDoc.data()
            return userData
        }else {
            console.warn(`No user found with ${uuid}`)
            return null;
        }
    } catch (error) {
        console.error("Error With finding Uer", error)
        return null;
    }
  }

  export { fetchCurrentUserData, isAdminUser, fetchAllUsers, findUser };
