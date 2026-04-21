import React from 'react';
import NavBar from './NavBar';

const About = () => {
    return (
        <div className="min-h-screen bg-white">
            <NavBar />
            <div className="max-w-3xl mx-auto mt-12 px-4 text-center">
                <h1 className="text-4xl font-bold mb-6">About Us</h1>
                <p className="text-lg text-gray-700 mb-4">
                    Our mission is to empower Alzheimer's patients and their caregivers through innovative technology. By integrating IoT devices and machine learning, we provide real-time monitoring, intelligent alerts, and actionable insights to improve quality of life and safety.
                </p>
                <p className="text-lg text-gray-700 mb-4">
                    Our team consists of healthcare professionals, engineers, and caregivers dedicated to making a positive impact in the Alzheimer's community. We believe technology can bridge the gap between care and independence.
                </p>
            </div>
        </div>
    );
}

export default About;
