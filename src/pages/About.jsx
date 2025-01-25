import React from "react";
import clubImage from "../assets/home-hero.jpg";
import coachImage1 from "../assets/coach_austin.jpeg";
import coachImage2 from "../assets/coach_connor.jpeg"; 
import coachImage3 from "../assets/coach_kyle.jpeg"; 

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Hero Section */}
      <div
        className="relative h-96 flex items-center justify-center"
        style={{
          backgroundImage: `url(${clubImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <h1 className="z-10 text-4xl md:text-6xl font-bold text-center">
          About Us
        </h1>
      </div>

      {/* Mission Section */}
      <section className="py-16 px-8 md:px-32 text-center">
        <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
        <p className="text-lg text-gray-300 leading-relaxed">
          At Salisbury University's Boxing & Kickboxing Club, we are committed
          to fostering a community of strength, discipline, and respect. Our
          mission is to empower individuals through the art of boxing and
          kickboxing, promoting fitness, confidence, and camaraderie.
        </p>
      </section>

      {/* History Section */}
      <section className="bg-gray-800 py-16 px-8 md:px-32 text-center">
        <h2 className="text-3xl font-bold text-white mb-6">Our History</h2>
        <p className="text-lg text-gray-300 leading-relaxed">
          Founded in 2018 from humble begginings, our club has grown from a small group of passionate
          fighters to a thriving community of athletes. We have grown the club tremendously over the past 
          few years, and we are proud to say we are working with SPY MMA to give our members the best expirience
        </p>
      </section>

      {/* Coaches Section */}
      <section className="py-16 px-8 md:px-32 text-center">
        <h2 className="text-3xl font-bold mb-6">OurStaff</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Coach 1 */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg text-left">
            <img
              src={coachImage1}
              alt="Coach 1"
              className="w-32 h-32 rounded-full mx-auto mb-4"
            />
            <h3 className="text-xl font-bold text-center">President Austin</h3>
            <p className="text-gray-300 mt-2">
              With over 1 year of mma experience, Coach Austin
              specializes in teaching technique. He’s dedicated to
              helping athletes achieve their full potential. He can 
              be your best friend, and your worst nightmare...
            </p>
          </div>

          {/* Coach 2 */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg text-left">
            <img
              src={coachImage2}
              alt="Coach 2"
              className="w-32 h-32 rounded-full mx-auto mb-4"
            />
            <h3 className="text-xl font-bold text-center">
              SGA Representative
            </h3>
            <p className="text-gray-300 mt-2">
              1 year of kickboxing experience. Coach Connor is here to help
              you learn the foundations of kickboxing in a fun and safe enviorment.
            </p>
          </div>
        </div>
        {/* Coach 3 */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg text-left">
            <img
              src={coachImage3}
              alt="Coach 2"
              className="w-32 h-32 rounded-full mx-auto mb-4"
            />
            <h3 className="text-xl font-bold text-center">
              Treasurer
            </h3>
            <p className="text-gray-300 mt-2">
              1 year of kickboxing experience. Coach Kyle will show you 
              some great kickboxing techniques and combos to advance in the sport.
            </p>
          </div>
       
      </section>
      

      {/* Core Values */}
      <section className="bg-gray-900 py-16 px-8 md:px-32 text-center">
        <h2 className="text-3xl font-bold text-white mb-6">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-300">
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-white">Discipline</h3>
            <p>We believe that discipline is the foundation of success.</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-white">Respect</h3>
            <p>Respect for yourself and others is at the heart of our club.</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-white">Community</h3>
            <p>
              Our strength lies in our unity. Together, we achieve greatness.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;