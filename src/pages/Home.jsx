import React from "react";
import heroImage from "../assets/home-hero.jpg"; // Replace with an actual image path
import logo from "../assets/boxing_logo.jpg"; // Replace with your logo path
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white">
      {/* Hero Section */}
      <div
        className="relative h-screen flex flex-col justify-center items-center text-center"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <img src={logo} alt="Boxing Logo" className="w-32 mb-4 z-10" />
        <h1 className="text-4xl md:text-6xl font-extrabold z-10">Salisbury University Boxing & Kickboxing Club</h1>
        <p className="text-lg md:text-xl mt-4 z-10">
          Train Hard. Fight Strong. Join the Community.
        </p>
        <button className="mt-8 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all z-10"
        onClick={ async () => {
          const currentUser = auth.currentUser;
          if (!currentUser){
            navigate("/signin");
          }else{
            alert("Your already Signed In")
          }
        }}
        >
          Join Now
        </button>
      </div>

      {/* About Section */}
      <section className="py-16 px-8 md:px-32 text-center">
        <h2 className="text-3xl font-bold mb-6">About Us</h2>
        <p className="text-lg text-gray-300 leading-relaxed">
          The Salisbury University Boxing & Kickboxing Club is a community of
          passionate fighters and fitness enthusiasts. Whether you're looking to
          learn self-defense, improve your fitness, or compete, we have a place
          for you. Join us to push your limits and grow stronger inside and out!
        </p>
      </section>

      {/* Classes Section */}
      <section className="bg-gray-800 py-16 px-8 md:px-32 text-center">
        <h2 className="text-3xl font-bold text-white mb-6">Our Classes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-700 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-4">Beginner Friendly</h3>
            <p>Learn the basics of boxing and kickboxing in a friendly, supportive environment.</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-4">High Intensity</h3>
            <p>Join our high intensity workouts, We guarentee you will improve your fitness</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-4">Real fighting Experience</h3>
            <p>Train for real fights, join in on LIVE SPARRING after every practice</p>
          </div>
        </div>
      </section>

      {/* What*/}
      <section className="py-16 px-8 md:px-32 text-center bg-gray-900 text-gray-300">
        <h2 className="text-3xl font-bold mb-6">What You Get</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4">Real Fighting Experience</h3>
            <p className="italic">We want you to be ready for real world scenerios. This means you get to HIT people.</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4">Real MMA Gym</h3>
            <p className="italic">Thanks to our president Austin, everyone in the club can get a membership at SPY MMA for just $25 a month.</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4">Train For An Actual Fight</h3>
            <p className="italic">We will give all members an oppurtunity to participate in a REAL FIGHT at the end of each semester</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
