import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { auth } from "../../firebase";
import { isAdminUser } from "../util/UsersUtil";

const db = getFirestore();

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const userDocs = await getDocs(collection(db, "users"));
      const userList = userDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setUsers(userList.sort((a, b) => b.pushUps - a.pushUps)); // Sort by pushUps descending
    };

    const fetchCurrentUser = async () => {
      const user = auth.currentUser;
      if (user) setCurrentUserId(user.uid);
    };

    fetchUsers();
    fetchCurrentUser();
  }, []);

  const updatePushUps = async (userId, increment) => {
    try {
      const isAdmin = await isAdminUser();
      if (!isAdmin) {
        alert("Only admins can update push-ups.");
        return;
      }

      const userRef = doc(db, "users", userId);
      const user = users.find((user) => user.id === userId);

      if (!user) {
        alert("User not found.");
        return;
      }

      const newPushUps = Math.max(0, (user.pushUps || 0) + increment); // Prevent negative push-ups
      await updateDoc(userRef, { pushUps: newPushUps });

      setUsers((prevUsers) =>
        prevUsers
          .map((u) =>
            u.id === userId ? { ...u, pushUps: newPushUps } : u
          )
          .sort((a, b) => b.pushUps - a.pushUps)
      );
    } catch (error) {
      console.error("Error updating push-ups:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Push-Up Leaderboard</h1>

      {users.length > 0 && (
        <div className="mb-4 p-4 bg-blue-100 rounded-lg">
          <h2 className="text-lg font-semibold text-blue-800">Leader</h2>
          <p className="text-gray-800">
            {users[0].firstName} {users[0].lastName}: <strong>{users[0].pushUps} push-ups</strong>
          </p>
        </div>
      )}

      <ul className="divide-y divide-gray-300">
        {users.map((user) => (
          <li key={user.id} className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-white bg-blue-600">
                    {user.firstName.charAt(0).toUpperCase()}
                    {user.lastName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <p className="font-medium text-gray-800">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-sm text-gray-600">{user.pushUps || 0} push-ups</p>
              </div>
            </div>
            {currentUserId !== user.id && (
              <div className="flex space-x-2">
                <button
                  onClick={() => updatePushUps(user.id, 1)}
                  className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  +1
                </button>
                <button
                  onClick={() => updatePushUps(user.id, -1)}
                  className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  -1
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;

