import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-[#e0e5ec] text-gray-700 font-sans">
            <Navbar />
            <main className="pt-20">
                {children}
            </main>
        </div>
    );
};

export default Layout;
