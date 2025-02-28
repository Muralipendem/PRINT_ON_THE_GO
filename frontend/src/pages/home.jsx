import React from 'react';
import { useNavigate } from 'react-router-dom';
import bgImage from '../assets/bgimage.jpg';


const Home = () => {
    const history = useNavigate();

    const navigateToLogin = () => {
        history('/login');
    };

    return (
        <div className="w-full">
            {/* Navbar */}
            <nav className="bg-gray-800 p-4 w-full fixed top-0 left-0">
                <div className="w-full flex justify-between items-center px-6">
                    <h1 className="text-5xl font-extrabold text-white tracking-wide uppercase bg-gradient-to-r from-red-500 to-green-400 text-transparent bg-clip-text">
                        Welcome To Print-On-The-Go
                    </h1>
                    <button 
                        onClick={navigateToLogin} 
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Login
                    </button>
                </div>
            </nav>
    
            {/* Background Image Section (fills screen after navbar) */}
            <div 
                className="w-full h-[calc(100vh-4rem)] bg-cover bg-center mt-[4rem]"
                style={{ backgroundImage: `url(${bgImage})` }}
            ></div>
        </div>
    );
    
};

export default Home;