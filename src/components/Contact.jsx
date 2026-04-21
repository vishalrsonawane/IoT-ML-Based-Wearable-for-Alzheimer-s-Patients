import React from 'react';
import NavBar from './NavBar';

const Contact = () => {
    return (
        <div className="min-h-screen bg-white">
            <NavBar />
            <div className="max-w-3xl mx-auto mt-12 px-4 text-center">
                <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
                <p className="text-lg text-gray-700 mb-4">
                    Have questions or need support? We're here to help! Reach out to us using the information below:
                </p>
                <div className="text-left mt-8">
                    <p className="mb-2"><span className="font-semibold">Email:</span> support@alzheimercare.com</p>
                    <p className="mb-2"><span className="font-semibold">Phone:</span> +1 (800) 123-4567</p>
                    <p className="mb-2"><span className="font-semibold">Address:</span> 123 Health St, Wellness City, Country</p>
                </div>
            </div>
        </div>
    );
}

export default Contact;
