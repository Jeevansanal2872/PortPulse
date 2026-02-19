import React from 'react';
import { Activity, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#e0e5ec] py-12 border-t border-gray-200">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center gap-2 mb-4 md:mb-0">
                        <Activity className="text-blue-500 w-6 h-6" />
                        <span className="text-xl font-bold text-gray-700 tracking-wide">Port Pulse</span>
                    </div>
                    <div className="text-gray-500 text-sm">
                        &copy; {currentYear} Port Pulse AI. All rights reserved.
                    </div>
                    <div className="flex gap-4 mt-4 md:mt-0">
                        <a href="#" className="neumorphic-btn p-3 text-gray-600 hover:text-blue-500"><Github className="w-5 h-5" /></a>
                        <a href="#" className="neumorphic-btn p-3 text-gray-600 hover:text-blue-500"><Twitter className="w-5 h-5" /></a>
                        <a href="#" className="neumorphic-btn p-3 text-gray-600 hover:text-blue-500"><Linkedin className="w-5 h-5" /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
