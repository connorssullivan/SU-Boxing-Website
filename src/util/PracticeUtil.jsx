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
            console.log(`No Practice on ${docName}`);
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

export {addPractice, addAttendeeToPractice, checkForPractice, getPracticeInfo}