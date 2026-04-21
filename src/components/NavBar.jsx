import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NavBar = () => {
  const navigate = useNavigate();
  const notificationCount = 2;

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white w-full shadow-sm">
      <div className="flex items-center gap-2 text-2xl font-bold cursor-pointer" onClick={() => navigate('/')}>CareConnect</div>
      <div className="flex items-center gap-8 text-lg font-medium">
        <Link to="/" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
          <span className="material-icons">home</span> Home
        </Link>
        <Link to="/dashboard" className="flex items-center gap-1 hover:text-blue-600 transition-colors relative">
          <span className="material-icons">dashboard</span> Dashboard
          {notificationCount > 0 && (
            <span className="absolute -top-2 -right-4 bg-blue-600 text-white text-xs rounded-full px-2">{notificationCount}</span>
          )}
        </Link>
        <Link to="/profile" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
          <span className="material-icons">person</span> Profile
        </Link>
        <Link to="/device" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
          <span className="material-icons">devices</span> Device Information
        </Link>
        <Link to="/about" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
          <span className="material-icons">info</span> About
        </Link>
        <Link to="/contact" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
          <span className="material-icons">contact_support</span> Contact
        </Link>
       
      </div>
    </nav>
  );
};

export default NavBar;
