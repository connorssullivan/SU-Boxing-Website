import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

const db = getFirestore();

const addPractice = async (date, dayOfWeek, startTime, endTime, attendanceSize = 0) => {
    const practiceDocRef = doc(db, "practices", date);

    try {
        await setDoc(practiceDocRef,
            {
                date,
                dayOfWeek,
                startTime,
                endTime,
                attendanceSize,
                attendees: [], // Initialize an empty array for attendees
            }
        );

        console.log("Practice on ${date} added succesfully")
    }catch (error){
        console.log("Error fetching practices")
    }
}

//This function updates the attendees
const addAttendeeToPractice = async (uuid, docName) => {
    try{
        const docRef = doc(db, "practices", docName);
        
        // Check if doc exists
        const practiceDoc = await getDoc(docRef);
        if(!practiceDoc.exists()){
            console.log("No Practice on ${docName}");
            return;
        }

        //Update the document
        await updateDoc(practiceDoc, {
            attendees: arrayUnion(uuid),
            attendanceSize: practiceDocRef.data.attendees + 1
        })
    }catch(error){
        console.log(error)
    }
}

const checkForPractice = async (date) => {
    try{
        if (!date) {
            console.error("Invalid date provided.");
            return false;
        }
        const docRef = doc(db, "practices", date)

        //Check if the document exists
        const practiceRef = await getDoc(docRef);
        const msg = practiceRef.exists() ? "It DOes exist":"It doesnt exist";
        console.log(msg);
        return practiceRef.exists();
    }catch(error) {
        console.error("Check for Practice Error",error)
        return false
    }
}

export {addPractice, addAttendeeToPractice, checkForPractice}