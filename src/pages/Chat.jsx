import React, { useState, useEffect, useRef } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  setDoc,
  getFirestore,
  onSnapshot,
  addDoc,
  orderBy,
  query,
  serverTimestamp,
  collection,
} from "firebase/firestore";
import SignUp from "../components/SignUp.jsx";
import SignIn from "../components/SignIn.jsx";
import { auth, app } from "../../firebase.js";
import {fetchCurrentUserData} from "../util/UsersUtil.jsx";
import { data } from "autoprefixer";
import DefaultPic from "../assets/default_profilePic.jpg";


const db = getFirestore(app);

const Chat = ({ setToggleSignInFn }) => {
  const [signingUp, setSigningUp] = useState(true);
  const [signingIn, setSigningIn] = useState(false);

  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [group, setGroup] = useState("general"); // Default group
  const [userData, setUserData] = useState(null);

  const messagesEndRef = useRef(null);

  // Scroll to the bottom of the messages
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  };

  useEffect(() => {
    if (setToggleSignInFn) {
      setToggleSignInFn(() => toggleSignIn); // Expose toggleSignIn to parent
    }
  }, [setToggleSignInFn]);

  // Fetch messages for the current group
  useEffect(() => {
    const loadUserData = async () => {
        const data = await fetchCurrentUserData()
        if(data){
            setUserData(data);
        }
            
    }
    loadUserData();
    const q = query(
      collection(db, `groups/${group}/messages`), // Group-specific messages
      orderBy("timestamp","desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });
    return unsubscribe;
  }, [group]); // Re-run whenever the group changes

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.emailVerified) {
          setUser(user);
        } else {
          console.error("Email is not verified.");
          auth.signOut(); // Sign out if email is not verified
          alert("Please verify your email address to continue.");
        }
      } else {
        setUser(null);
      }
    });
  
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (auth.currentUser) {
        await auth.currentUser.reload(); // Refresh user data
        if (auth.currentUser.emailVerified) {
          setUser(auth.currentUser); // Update user state
          clearInterval(interval); // Stop checking once verified
        }
      }
    }, 3000); // Check every 3 seconds
  
    return () => clearInterval(interval);
  }, []);

  // Send a message to the current group
  const sendMessage = async () => {
    if (newMessage.trim() === "") return; // Prevent sending empty messages

    try {
      await addDoc(collection(db, `groups/${group}/messages`), {
        uid: user.uid,
        photoURL: userData.photoURL || DefaultPic,
        displayName: userData.firstName + ' ' + userData.lastName || "Anonymous",
        text: newMessage,
        timestamp: serverTimestamp(),
      });

      console.log("Message Sent");
      setNewMessage("");
      scrollToBottom();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const toggleSignIn = () => {
    setSigningIn(true);
    setSigningUp(false);
  };

  const toggleSignUp = () => {
    setSigningIn(false);
    setSigningUp(true);
  };

  const checkForSignInStatus = () => {
    if (signingIn) {
      return <SignIn toggleSignUp={toggleSignUp}></SignIn>;
    }
    if (signingUp) {
      return <SignUp toggleSignIn={toggleSignIn}></SignUp>;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {user ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold">Group Chat: {group}</h1>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              onClick={() => auth.signOut()}
            >
              Logout
            </button>
          </div>

          {/* Group Selector */}
          <div className="mb-4">
            <label className="block mb-2">Select Group:</label>
            <select
              className="w-full p-2 border rounded"
              value={group}
              onChange={(e) => setGroup(e.target.value)}
            >
              <option value="general">General</option>
              <option value="sports">Sports</option>
              <option value="tech">Tech</option>
            </select>
          </div>

          {/* Messages */}
{/* Messages */}
<div className="mb-4 bg-white p-4 rounded shadow-md h-64 overflow-y-auto">
  {messages.map((msg) => (
    <div key={msg.id} className="flex items-start mb-4">
      {/* Profile Picture or Default */}
      <div className="w-10 h-10 flex-shrink-0 rounded-full bg-gray-300 flex items-center justify-center mr-4 overflow-hidden">
        {msg.data.photoURL ? (
          <img
            src={msg.data.photoURL}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-white font-bold">
            {msg.data.displayName
              .split(" ")
              .map((name) => name.charAt(0).toUpperCase())
              .join("")}
          </span>
        )}
      </div>
      {/* Message Details */}
      <div>
        <span className="font-bold">{msg.data.displayName}</span>
        <p className="text-gray-700">{msg.data.text}</p>
        <span className="text-sm text-gray-500">
          {msg.data.timestamp
            ? new Date(msg.data.timestamp.toDate()).toLocaleString()
            : "Just now"}
        </span>
      </div>
    </div>
    ))}
    </div>


          {/* New Message Input */}
          <div className="flex items-center">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow p-2 border rounded"
            />
            <button
              className="ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        </>
      ) : (
        checkForSignInStatus()
      )}
    </div>
  );
};

export default Chat;
