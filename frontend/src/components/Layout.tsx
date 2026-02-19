import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children, showNavbar = true }: { children: React.ReactNode, showNavbar?: boolean }) => {
    return (
        <div className="min-h-screen bg-[#e0e5ec] text-gray-700 font-sans">
            {showNavbar && <Navbar />}
            <main className={showNavbar ? "pt-20" : ""}>
                {children}
            </main>
        </div>
    );
};

export default Layout;
