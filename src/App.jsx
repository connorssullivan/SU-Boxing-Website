import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; 
import BoxingLogo from './assets/boxing_logo.jpg';
import NavBar from './components/NavBar';
import About from './pages/About';
import Chat from './pages/Chat'


function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="w-full h-screen bg-gradient-to-r from-red-800 to-gray-950 flex flex-col">
      <Router>
        <NavBar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </div>
        <footer className="bg-gray-800 text-white text-center py-4">
          <div>
            <button
              onClick={() => setCount((prevCount) => prevCount + 1)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              Count is {count}
            </button>
          </div>
        </footer>
      </Router>
    </div>
  );
}

export default App;
