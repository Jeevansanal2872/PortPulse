import React from 'react';
import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

const Navbar = () => {
    const [isDarkMode, setIsDarkMode] = React.useState(false);

    React.useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    return (
        <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-[var(--bg-color)]/80 backdrop-blur-md transition-colors duration-300">
            <div className="flex items-center gap-2">
                <Activity className="text-blue-500 w-6 h-6" />
                <Link to="/" className="text-xl font-bold text-[var(--text-color)] tracking-wide">
                    Port Pulse
                </Link>
            </div>
            <div className="flex items-center gap-6">
                <Link to="/" className="neumorphic-btn px-4 py-2 text-sm font-medium text-[var(--text-color)] hover:text-blue-500">
                    Home
                </Link>
                <Link to="/travel" className="neumorphic-btn px-4 py-2 text-sm font-medium text-[var(--text-color)] hover:text-blue-500">
                    Travel
                </Link>
                <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="neumorphic-btn p-2 rounded-full text-[var(--text-color)] hover:text-blue-500"
                    aria-label="Toggle Dark Mode"
                >
                    {isDarkMode ? '☀️' : '🌙'}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
