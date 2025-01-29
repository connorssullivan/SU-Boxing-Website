import { getFirestore, doc, setDoc, getDoc, getDocs, updateDoc, arrayUnion, collection, increment, deleteDoc } from "firebase/firestore";
import { findUser } from "./UsersUtil";

const db = getFirestore();

const addPractice = async (date, dayOfWeek, startTime, endTime, attendanceSize = 0, rsvpSize = 0) => {
    const practiceDocRef = doc(db, "practices", date);

    try {
        await setDoc(practiceDocRef,
            {
                date,
                dayOfWeek,
                startTime,
                endTime,
                attendanceSize,
                attendees: [], 
                rsvp: [], 
                rsvpSize
            }
        );

        console.log("Practice on ${date} added succesfully")
    }catch (error){
        console.log("Error fetching practices")
    }
}

//This function updates the attendees
const addAttendeeToPractice = async (uuid, docName) => {
    try {
        const docRef = doc(db, "practices", docName);
        
        // Check if practice document exists
        const practiceDoc = await getDoc(docRef);
        if (!practiceDoc.exists()) {
            console.log(`No Practice on ${docName}`);
            return;
        }

        const attendanceList = practiceDoc.data();
        const attendeeArray = attendanceList.attendees || [];

        if (attendeeArray.includes(uuid)) {
            console.log(`User ${uuid} is already in attendance.`);
            return; 
        }

        // Update the practice document
        await updateDoc(docRef, {
            attendees: arrayUnion(uuid),
            attendanceSize: (attendanceList.attendanceSize || 0) + 1,
        });

        // Update the user's practicesMade field
        const userDocRef = doc(db, "users", uuid);
        await updateDoc(userDocRef, {
            practicesMade: increment(1), // Increment practicesMade by 1
        });

        console.log(`User ${uuid} added to practice and practicesMade updated.`);
    } catch (error) {
        console.error("Error adding attendee to practice:", error);
    }
};


//Remove attendee from practice
const removeAttendeeFromPractice = async (uuid, docName) => {
    try {
        const docRef = doc(db, "practices", docName);

        // Fetch the practice document
        const practiceDoc = await getDoc(docRef);

        if (!practiceDoc.exists()) {
            console.log(`No practice found on ${docName}`);
            return;
        }

        const data = practiceDoc.data();
        const attendees = data.attendees || []; // Ensure attendees is an array

        // Check if the user exists in the attendees list
        if (!attendees.includes(uuid)) {
            console.log(`User ${uuid} is not in the attendees list.`);
            return;
        }

        // Remove the user from the attendees list
        const updatedAttendees = attendees.filter((attendee) => attendee !== uuid);

        // Update the practice document
        await updateDoc(docRef, {
            attendees: updatedAttendees,
            attendanceSize: updatedAttendees.length, // Update the count
        });

        // Decrement the practicesMade field in the user's document
        const userDocRef = doc(db, "users", uuid);
        await updateDoc(userDocRef, {
            practicesMade: increment(-1), // Decrement by 1
        });

        console.log(`Successfully removed ${uuid} from attendees and decremented practicesMade.`);
    } catch (error) {
        console.error("Error removing attendee:", error);
    }
};



const addRsvpToPractice = async (uuid, date) => {
    try {
        // Reference to the practice document
        const practiceDocRef = doc(db, "practices", date);

        // Fetch the practice document
        const practiceDoc = await getDoc(practiceDocRef);

        if (practiceDoc.exists()) {
            const practiceData = practiceDoc.data();
            const currentRsvp = practiceData.rsvp || [];

            // Check if the user is already in the RSVP list
            if (currentRsvp.includes(uuid)) {
                console.log(`User ${uuid} has already RSVP'd.`);
                return; 
            }

            // Update the document with the new RSVP
            await updateDoc(practiceDocRef, {
                rsvp: arrayUnion(uuid), 
                rsvpSize: (practiceDoc.data().rsvpSize || 0) + 1, 
            });
            console.log("RSVP Added");
        } else {
            console.log(`Failed to add RSVP. Practice not found for date: ${date}`);
        }
    } catch (error) {
        console.error("Error RSVPing:", error);
    }
};

const removeRsvp = async (uuid, date) => {
    try {
        // Reference to the practice document
        const practiceDocRef = doc(db, "practices", date);

        // Fetch the practice document
        const practiceDoc = await getDoc(practiceDocRef);

        if (practiceDoc.exists()) {
            const practiceData = practiceDoc.data();
            const currentRsvp = practiceData.rsvp || [];

            // Check if the user is in the RSVP list
            if (!currentRsvp.includes(uuid)) {
                console.log(`User ${uuid} is not in the RSVP list.`);
                return;
            }

            // Update the document by removing the user from the RSVP list
            await updateDoc(practiceDocRef, {
                rsvp: currentRsvp.filter((id) => id !== uuid), // Remove the user ID from the list
                rsvpSize: Math.max((practiceData.rsvpSize || 0) - 1, 0), // Decrement RSVP size, ensuring it doesn't go below 0
            });

            console.log(`User ${uuid} removed from RSVP.`);
        } else {
            console.log(`Failed to remove RSVP. Practice not found for date: ${date}`);
        }
    } catch (error) {
        console.error("Error removing RSVP:", error);
    }
};

const checkForPractice = async (date) => {
    try{
        if (!date) {
            console.error("Invalid date provided.");
            return false;
        }
        const docRef = doc(db, "practices", date)

        //Check if the document exists
        const practiceRef = await getDoc(docRef);
        if (practiceRef.exists()) {
            const data = practiceRef.data(); // Get the document's data
            //console.log(`Practice Doc:`, data);
            //console.log(`Attendance Size: ${data.attendanceSize}`); // Access attendanceSize from data
            return true;
        } else {
            console.log("Failed to fetch Practice info");
            return false;
        }
        return practiceRef.exists();
    }catch(error) {
        console.error("Check for Practice Error",error)
        return false
    }
}

//Get the info from practice doc
const getPracticeInfo = async (date) => {
    if (!date){
        console.error("No practice today");
        return;
    }
    try {
        const docRef = await doc(db, "practices", date);

        const practiceDoc = await getDoc(docRef);
        if(practiceDoc.exists()){
            const data = practiceDoc.data()
            return data
        }else{
            console.error("No practice today");
            return
        }
    }catch (error) {

    }
} 

const fetchAndSetEvents = async () => {
    try {
      const practicesCollectionRef = collection(db, "practices");
      const querySnapshot = await getDocs(practicesCollectionRef);
  
      const events = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id, // Use document ID as the event ID
          title: `Practice: ${data.dayOfWeek || "No Title"}`, // Customize title with day or other info
          start: data.date, // Use the 'date' field for the event start date
          end: data.date, // Optionally, you can add an 'end' field if practices span multiple days
          extendedProps: {
            startTime: data.startTime,
            endTime: data.endTime,
            attendanceSize: data.attendanceSize,
            attendees: data.attendees,
          },
        };
      });
  
      return events; // Return the formatted events
    } catch (error) {
      console.error("Error fetching events:", error);
      return [];
    }
  };

const deletePractice = async (practiceId) => {
    try {
      const practiceRef = doc(db, "practices", practiceId);
      await deleteDoc(practiceRef);
      console.log(`Practice with ID ${practiceId} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting practice:", error);
      throw error;
    }
};


export {addPractice, addAttendeeToPractice, checkForPractice, getPracticeInfo, fetchAndSetEvents, addRsvpToPractice, removeRsvp, removeAttendeeFromPractice, deletePractice}