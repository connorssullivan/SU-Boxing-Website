import { useState } from 'react';
import BoxingLogo from '../assets/boxing_logo.jpg';
import { Link } from 'react-router-dom';

const NavBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    return (
        <header className='flex justify-between items-center text-black py-6 px-8 md:px-32 bg-white drop-shadow-md'>
                <a href=''>
                  <img src={BoxingLogo} alt='' className='w-10 hover:scale-105 transition-all'/>
                </a> 
        
                <ul className='hidden xl:flex items-center gap-12 font-semibold text-base'>
                  <li className='p-3 hover:bg-red-800 hover:text-white rounded-md transition-all'><Link to="/">Home</Link></li>
                  <li className='p-3 hover:bg-red-800 hover:text-white rounded-md transition-all'><Link to="/about">About</Link></li>
                  <li className='p-3 hover:bg-red-800 hover:text-white rounded-md transition-all'><Link to="/chat">Chat</Link></li>
                  <li className='p-3 hover:bg-red-800 hover:text-white rounded-md transition-all'>More Information</li>
                </ul>
        
                <div className='relative hidden md:flex
                items-center justify-center gap-3'> 
                <i className='bx bx-search absolute left-3 
                text-2xl text-gray-500'></i>
                  <input type="text" placeholder='Search...' 
                  className='py-2 pl-10 rounded-x1 border-2
                  border-blue-300 focus:bg-slate-100 focus:outline-sky-500'/>
                </div>
        
                <i className='bx bx-menu x1:hidden block
                text-5xl cursor-pointer ' onClick={() => setIsMenuOpen(!isMenuOpen)}></i>
        
                <div className={`absolute x1:hidden top-24
                  left-0 w-full bg-white flex flex-col 
                  items-center gap-6 font-semibold text-lg
                  transform transition-transform ${isMenuOpen ? 
                    "opacity-100" : "opacity-0"}`}
                    style={{transition: "transform 0.3s ease, opacity 0.3s ease"}}
                    >
                      <li className='list-none w-full text-center
                      pg-4 hover:bg-red-800 hover:text-white transition-all
                      cursor-pointer'>
                        <Link to="/">Home</Link>
                      </li>
                      <li className='list-none w-full text-center
                      pg-4 hover:bg-red-800 hover:text-white transition-all
                      cursor-pointer'>
                        <Link to="/about">About</Link>
                      </li>
                      <li className='list-none w-full text-center
                      pg-4 hover:bg-red-800 hover:text-white transition-all
                      cursor-pointer'>
                        <Link to="/chat">Chat</Link>
                      </li>
                      <li className='list-none w-full text-center
                      pg-4 hover:bg-red-800 hover:text-white transition-all
                      cursor-pointer'>
                        Contact
                      </li>
                      <li className='list-none w-full text-center
                      pg-4 hover:bg-red-800 hover:text-white transition-all
                      cursor-pointer'>
                        Upcoming Fights
                      </li>
                      <li className='list-none w-full text-center
                      pg-4 hover:bg-red-800 hover:text-white transition-all
                      cursor-pointer'>
                        Chat
                      </li>
                </div>
              </header>
    );
}

export default NavBar;