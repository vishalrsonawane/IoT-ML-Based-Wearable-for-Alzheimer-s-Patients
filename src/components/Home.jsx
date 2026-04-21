import React from 'react';
import NavBar from './NavBar';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-white">
            <NavBar />
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between w-full mt-10 px-4 md:px-0">
                <div className="flex-1 text-left">
                    <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-4">Supporting<br/>Alzheimer's Patients<br/>and Caregivers</h1>
                    <p className="text-lg md:text-xl text-gray-700 mb-8">Our IoT and ML-powered solution provides real-time monitoring, intelligent alerts, and peace of mind for patients and caregivers.</p>
                    <button
                        className="flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-100 text-black font-semibold px-8 py-4 rounded-xl shadow text-lg"
                        onClick={() => navigate('/profile')}
                    >
                        <span className="material-icons">person</span> Patient Profile
                    </button>
                </div>
                <div className="flex-1 flex justify-center mt-8 md:mt-0">
                    <div className="relative w-full max-w-xl rounded-2xl shadow-xl overflow-hidden">
                        <img src="https://www.biospectrumindia.com/uploads/articles/2-9560.jpg" alt="Smart Care Technology" className="w-full h-72 object-cover" />
                        <div className="absolute bottom-6 left-6 bg-white bg-opacity-90 rounded-lg px-6 py-4 shadow-md">
                            
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">Smart Care Technology</h2>
                        <p className="text-gray-600 text-sm">Helping seniors live independently</p>
                    </div>
                </div>
            </div>
            <div className="mt-20 text-center">
                <h2 className="text-3xl font-bold mb-4">Key Features</h2>
                <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                    Our comprehensive solution helps manage Alzheimer's care with cutting-edge technology.
                </p>
            </div>
            
        </div>
    );
}

export default Home;