import React, { useState, useEffect, useRef } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getFirestore,
  onSnapshot,
  addDoc,
  orderBy,
  query,
  serverTimestamp,
  collection,
} from "firebase/firestore";
import { auth, app } from "../../firebase.js";
import { fetchCurrentUserData } from "../util/UsersUtil.jsx";
import DefaultPic from "../assets/default_profilePic.jpg";

const db = getFirestore(app);

const Chat = () => {
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

  // Fetch messages for the current group
  useEffect(() => {
    const loadUserData = async () => {
      const data = await fetchCurrentUserData();
      if (data) {
        setUserData(data);
      }
    };

    loadUserData();

    const q = query(
      collection(db, `groups/${group}/messages`),
      orderBy("timestamp", "desc")
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
  }, [group]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  // Send a message to the current group
  const sendMessage = async () => {
    if (!user) {
      alert("Please sign in to send a message.");
      return;
    }

    if (newMessage.trim() === "") return; // Prevent sending empty messages

    try {
      await addDoc(collection(db, `groups/${group}/messages`), {
        uid: user.uid,
        photoURL: userData?.photoURL || DefaultPic,
        displayName: `${userData?.firstName || "Anonymous"} ${
          userData?.lastName || ""
        }`.trim(),
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

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Group Chat: {group}</h1>
        {user ? (
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={() => auth.signOut()}
          >
            Logout
          </button>
        ) : (
          <p className="text-red-600 font-bold">Please sign in to chat</p>
        )}
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
          <option value="Callouts">Callouts</option>
          <option value="Misc">Misc</option>
        </select>
      </div>

      {/* Messages */}
      <div className="mb-4 bg-white p-4 rounded shadow-md h-96 overflow-y-auto">
        {messages.map((msg) => {
          const isCurrentUser = msg.data.uid === user?.uid;

          return (
            <div
              key={msg.id}
              className={`flex items-start mb-4 ${
                isCurrentUser ? "justify-end" : "justify-start"
              }`}
            >
              {!isCurrentUser && (
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
              )}

              <div
                className={`max-w-sm p-3 rounded-lg shadow-md ${
                  isCurrentUser
                    ? "bg-blue-300 text-black"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {!isCurrentUser && (
                  <span className="block font-bold text-sm">{msg.data.displayName}</span>
                )}
                <p>{msg.data.text}</p>
                <span className="text-xs text-gray-500 block mt-1">
                  {msg.data.timestamp
                    ? new Date(msg.data.timestamp.toDate()).toLocaleString()
                    : "Just now"}
                </span>
              </div>

              {isCurrentUser && (
                <div className="w-10 h-10 flex-shrink-0 rounded-full bg-gray-300 flex items-center justify-center ml-4 overflow-hidden">
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
              )}
            </div>
          );
        })}
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
    </div>
  );
};

export default Chat;
