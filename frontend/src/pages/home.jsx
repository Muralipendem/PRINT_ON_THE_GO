import React from 'react';
import { useNavigate } from 'react-router-dom';
import bgImage from '../../public/bgImage.jpg';


const Home = () => {
    const history = useNavigate();

    const navigateToLogin = () => {
        history('/login');
    };

    return (
        <div className="min-h-screen bg-cover bg-center w-[100%]" style={{ backgroundImage: "url(" + bgImage + ")"

         }}>
            <nav className="bg-gray-800 p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="text-white text-lg font-bold">PrintOnGo</div>
                    <button 
                        onClick={navigateToLogin} 
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Login
                    </button>
                </div>
            </nav>
            <div className="flex items-center justify-center h-full">
                <h1 className=" text-5xl font-bold mt-[15%] text-yellow-500">Welcome to PrintOnGo</h1>
            </div>
        </div>
    );
};

export default Home;