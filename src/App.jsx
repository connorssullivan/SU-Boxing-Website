import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; 
import BoxingLogo from './assets/boxing_logo.jpg';
import NavBar from './components/NavBar';
import About from './pages/About';
import Chat from './pages/Chat'
import Footer from './components/Footer'
import Calendar from './pages/Calender';


function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="w-full min-h-screen bg-gradient-to-r from-red-800 to-gray-950 flex flex-col">
      <Router>
        <NavBar />
        <div className="flex-grow  ">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/chat" element={<div style={{ outline: "2px solid red" }}>
                                            <Chat />
                                        </div>} />
            <Route path="/caleder" element={<Calendar />} />             
          </Routes>
        </div>
        <Footer/>
      </Router>
    </div>
  );
}

export default App;
