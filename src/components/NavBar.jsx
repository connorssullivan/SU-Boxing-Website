import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BoxingLogo from "../assets/boxing_logo.jpg";
import { auth } from "../../firebase"; // Adjust based on your firebase setup
import {fetchCurrentUserData} from "../util/UsersUtil";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  // Monitor Authentication State
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const data = await fetchCurrentUserData();
        setUserData(data);
      } else {
        setUser(null);
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Sign Out Function
  const handleSignOut = async () => {
    try {
      await auth.signOut();
      console.log("User signed out.");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/">
          <img
            src={BoxingLogo}
            alt="Boxing Club Logo"
            className="w-12 hover:scale-105 transition-transform"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8 items-center font-semibold text-gray-800">
          <Link
            to="/"
            className="hover:bg-red-800 hover:text-white px-4 py-2 rounded-md transition-all"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="hover:bg-red-800 hover:text-white px-4 py-2 rounded-md transition-all"
          >
            About
          </Link>
          <Link
            to="/chat"
            className="hover:bg-red-800 hover:text-white px-4 py-2 rounded-md transition-all"
          >
            Chat
          </Link>
          <Link
            to="/caleder"
            className="hover:bg-red-800 hover:text-white px-4 py-2 rounded-md transition-all"
          >
            Calender
          </Link>
          <Link
            to="/contact"
            className="hover:bg-red-800 hover:text-white px-4 py-2 rounded-md transition-all"
          >
            Contact
          </Link>
          <Link
            to="/fights"
            className="hover:bg-red-800 hover:text-white px-4 py-2 rounded-md transition-all"
          >
            Upcoming Fights
          </Link>

          {/* User Authentication */}
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-700 font-medium">
                {userData
                  ? `${userData.firstName} ${userData.lastName}`
                  : "User"}
              </span>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-800 text-white rounded-md hover:bg-red-900 transition-all"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              to="/signin"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
            >
              Sign In
            </Link>
          )}
        </nav>

        {/* Hamburger Menu */}
        <button
          className="block md:hidden text-gray-800 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <i className="bx bx-menu text-3xl"></i>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`${
          isMenuOpen ? "block" : "hidden"
        } md:hidden bg-gray-50 shadow-md`}
      >
        <nav className="flex flex-col items-center gap-4 py-4">
          <Link
            to="/"
            className="hover:bg-red-800 hover:text-white px-4 py-2 rounded-md transition-all"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="hover:bg-red-800 hover:text-white px-4 py-2 rounded-md transition-all"
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
          <Link
            to="/chat"
            className="hover:bg-red-800 hover:text-white px-4 py-2 rounded-md transition-all"
            onClick={() => setIsMenuOpen(false)}
          >
            Chat
          </Link>
          <Link
            to="/caleder"
            className="hover:bg-red-800 hover:text-white px-4 py-2 rounded-md transition-all"
            onClick={() => setIsMenuOpen(false)}
          >
            Calendar
          </Link>
          <Link
            to="/contact"
            className="hover:bg-red-800 hover:text-white px-4 py-2 rounded-md transition-all"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </Link>
          <Link
            to="/fights"
            className="hover:bg-red-800 hover:text-white px-4 py-2 rounded-md transition-all"
            onClick={() => setIsMenuOpen(false)}
          >
            Upcoming Fights
          </Link>
          {user ? (
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-800 text-white rounded-md hover:bg-red-900 transition-all"
            >
              Sign Out
            </button>
          ) : (
            <Link
              to="/signin"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
            >
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
