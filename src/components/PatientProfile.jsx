import React from 'react';
import NavBar from './NavBar';

const reminders = [
  {
    icon: 'notifications', // Changed from 'notifications_none'
    label: 'Medication Reminders',
    times: '8:00 AM, 12:00 PM, 6:00 PM',
  },
  {
    icon: 'water_drop', // Changed from 'local_drink'
    label: 'Hydration Reminders',
    times: '9:00 AM, 11:00 AM, 1:00 PM, 3:00 PM, 5:00 PM, 7:00 PM',
  },
  {
    icon: 'event_note', // Changed from 'event'
    label: 'Appointment Reminders',
    times: '10:00 AM',
  },
];

const PatientProfile = () => (
  <>
    <NavBar />
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-1">Patient Profile</h1>
      <p className="text-gray-700 mb-8">View and manage patient information</p>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Patient Card */}
        <div className="flex-1 bg-white rounded-2xl shadow p-8 min-w-[320px]">
          <div className="flex items-center gap-6 mb-6">
            <img
              src="https://media.cnn.com/api/v1/images/stellar/prod/gettyimages-1481568169-20250514205647120.jpg?c=16x9&q=h_833,w_1480,c_fill"
              alt="Patient"
              className="w-24 h-24 object-cover rounded-full border"
            />
            <div>
              <h2 className="text-2xl font-bold">Saksham Patil</h2>
              <div className="text-gray-600 text-lg">78 years old</div>
            </div>
          </div>
          <div className="mb-2 flex items-center gap-2 text-gray-700">
            <span className="material-icons text-base">home</span>
            123 Maple Street, Portland, OR 97205
          </div>
          <div className="mb-2 flex items-center gap-2 text-gray-700">
            <span className="material-icons text-base">phone</span>
            Primary Contact: Michael Johnson (503-555-1234)
          </div>
          <div className="mb-2 flex items-center gap-2 text-gray-700">
            <span className="material-icons text-base">calendar_today</span>
            Patient since: January 2025
          </div>
          <div className="flex justify-end mt-4">
            <button className="flex items-center gap-1 text-sm text-gray-700 hover:text-blue-600">
              <span className="material-icons text-base">edit_note</span> Edit Profile
            </button>
          </div>
        </div>
        {/* Reminders */}
        <div className="flex-1 bg-white rounded-2xl shadow p-8 min-w-[320px]">
          <h3 className="text-xl font-semibold mb-4">Reminder Settings</h3>
          <div className="space-y-6 mb-6">
            {reminders.map((rem, idx) => (
              <div key={rem.label} className="flex items-start gap-4"> {/* Ensure items-start for vertical alignment */}
                <span className="material-icons text-2xl mt-1">{rem.icon}</span>
                <div className="flex-grow"> {/* Allow text content to take available space */}
                  <div className="font-semibold">{rem.label}</div>
                  <div className="text-gray-700 text-sm">{rem.times}</div>
                </div>
                <span className="ml-auto material-icons text-gray-400">toggle_off</span>
              </div>
            ))}
          </div>
          <div className="flex gap-4">
            <button className="border rounded-lg px-4 py-2 text-sm font-medium">Customize Times</button>
            <button className="border rounded-lg px-4 py-2 text-sm font-medium">Add New Reminder</button>
          </div>
        </div>
      </div>
    </div>
  </>
);

export default PatientProfile;
