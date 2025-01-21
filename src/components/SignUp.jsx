import { auth } from "../../firebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import React, { useState } from "react";


const SignUp = ({ toggleSignIn }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
  
    const handleSignUp = async (e) => {
      e.preventDefault();
      setError("");
      setMessage("");
  
      try {
        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
  
        // Send email verification
        await sendEmailVerification(user);
  
        setMessage("Sign up successful! Please check your email for verification.");
      } catch (err) {
        setError(err.message);
      }
    };
  
    return (
      <div className="flex flex-col items-center justify-center min-h-screen ">
        <div className="w-full max-w-sm p-6 bg-white shadow-md rounded-md">
          <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {message && <p className="text-green-500 mb-4">{message}</p>}
          <form onSubmit={handleSignUp}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Password</label>
              <input
                type="password"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
            >
              Sign Up
            </button>
          </form>
          <button
              onClick={toggleSignIn}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
            >
              Login
        </button>
        </div>
      </div>
    );
  };
  
  export default SignUp;