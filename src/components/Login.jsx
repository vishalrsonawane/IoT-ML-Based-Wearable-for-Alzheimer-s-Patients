import React, { useState, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// Regex patterns for validation
const EMAIL_REGEX = /^[\w.-]+@[\w.-]+\.\w{2,}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [deviceId, setDeviceId] = useState('');
    const [patientName, setPatientName] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Remove this effect to prevent redirect loop on login page
    }, []);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (isLogin) {
            if (!email || !password) {
                toast.error('Please fill all fields');
                return;
            }
        } else {
            if (!email || !password || !name || !deviceId || !patientName) {
                toast.error('Please fill all fields');
                return;
            }
            if (!EMAIL_REGEX.test(email)) {
                toast.error('Invalid email format');
                return;
            }
            if (!PASSWORD_REGEX.test(password)) {
                toast.error('Password must be at least 8 characters, include uppercase, lowercase, number, and special character!');
                return;
            }
            if (!otpSent) {
                // Send OTP to email
                setLoading(true);
                try {
                    const res = await fetch('/api/send-otp', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email })
                    });
                    const data = await res.json();
                    if (res.ok) {
                        toast.success('OTP sent to your email');
                        setOtpSent(true);
                    } else {
                        toast.error(data.message || 'Failed to send OTP');
                    }
                } catch (err) {
                    toast.error('Network error');
                }
                setLoading(false);
                return;
            } else if (!otp) {
                toast.error('Please enter the OTP sent to your email');
                return;
            }
        }
        setLoading(true);
        const endpoint = isLogin ? '/api/login' : '/api/register';
        const userData = {
            email,
            password,
            ...(isLogin ? {} : { name, device_id: deviceId, patient_name: patientName, otp }),
        };
        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(userData)
            });
            const data = await res.json();
            if (res.ok) {
                if (isLogin) {
                    toast.success('Login successful!');
                    // Wait for cookie to be set before redirect
                    setTimeout(() => navigate('/'), 300);
                } else {
                    toast.success('Account created successfully!');
                    setIsLogin(true);
                    setOtpSent(false);
                    setOtp('');
                }
            } else {
                toast.error(data.message || 'Something went wrong');
            }
        } catch (err) {
            toast.error('Network error');
        }
        setLoading(false);
    };
    const loginSignupHandler = () => {
        setIsLogin(!isLogin);
        setEmail('');
        setPassword('');
        setName('');
        setDeviceId('');
        setPatientName('');
        setOtpSent(false);
        setOtp('');
    };
    return (
        <div className='min-h-screen w-screen flex items-center justify-center bg-blue-50 overflow-hidden'>
          <div className='flex flex-col md:flex-row items-center justify-center w-[95%] max-w-5xl bg-white rounded-xl shadow-lg p-5 md:p-8'>
            <div className='hidden md:block md:w-1/2 p-4 flex flex-col items-center'>
              <img className='w-full max-w-md mx-auto' src="https://img.freepik.com/free-vector/healthcare-background-with-medical-symbols-geometric-style_1017-26363.jpg" alt="alzheimer-care-logo" />
              <h2 className='text-center text-xl font-semibold text-blue-600 mt-4'>CareConnect: Caretaker Portal</h2>
            </div>
            <div className='w-full md:w-1/2 px-4 flex flex-col items-center md:items-start'>
              <div className='my-5 text-center md:text-left w-full max-w-md'>
                <h1 className='font-bold text-4xl md:text-5xl text-blue-800'>CareConnect</h1>
                <p className='text-gray-600 mt-2'>Monitor and care for your loved ones with Alzheimer's</p>
              </div>
              <h1 className='mt-6 mb-3 text-2xl font-bold text-gray-700 text-center md:text-left w-full max-w-md'>{isLogin ? "Caretaker Login" : "Register as Caretaker"}</h1>
              <form onSubmit={submitHandler} className='flex flex-col w-full max-w-md'>
                {
                  !isLogin && (
                    <>
                      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder='Caretaker Name' className="outline-blue-500 border border-gray-300 px-4 py-3 rounded-lg my-2 font-medium" />
                      <input type="text" value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder='Patient Name' className="outline-blue-500 border border-gray-300 px-4 py-3 rounded-lg my-2 font-medium" />
                      <input type="text" value={deviceId} onChange={(e) => setDeviceId(e.target.value)} placeholder='Device ID' className="outline-blue-500 border border-gray-300 px-4 py-3 rounded-lg my-2 font-medium" />
                      {otpSent && (
                        <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder='Enter OTP' className="outline-blue-500 border border-gray-300 px-4 py-3 rounded-lg my-2 font-medium" />
                      )}
                    </>
                  )
                }
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email' className="outline-blue-500 border border-gray-300 px-4 py-3 rounded-lg my-2 font-medium" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' className="outline-blue-500 border border-gray-300 px-4 py-3 rounded-lg my-2 font-medium" />
                <button className='bg-blue-600 hover:bg-blue-700 transition-colors border-none py-3 my-4 rounded-lg text-lg text-white font-semibold shadow-md w-full' disabled={loading}> 
                  {loading ? <ClipLoader size={24} color={"#ffffff"} /> : (isLogin ? "Login" : "Create Account")}
                </button>
                <p className='text-gray-600 text-center'>{isLogin ? "Don't have an account?" : "Already have an account?"} <span onClick={loginSignupHandler} className='font-bold text-blue-600 cursor-pointer hover:underline'>{isLogin ? "Register" : "Login"}</span></p>
              </form>
            </div>
          </div>
        </div>
    );
}

export default Login;
