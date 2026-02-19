import React from 'react';
import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-[#e0e5ec]/80 backdrop-blur-md">
            <div className="flex items-center gap-2">
                <Activity className="text-blue-500 w-6 h-6" />
                <Link to="/" className="text-xl font-bold text-gray-700 tracking-wide">
                    Port Pulse
                </Link>
            </div>
            <div className="flex gap-6">
                <Link to="/" className="neumorphic-btn px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-500">
                    Home
                </Link>
                <Link to="/travel" className="neumorphic-btn px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-500">
                    Travel
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
