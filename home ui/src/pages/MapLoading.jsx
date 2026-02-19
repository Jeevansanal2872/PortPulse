import React from 'react';
import { Truck } from 'lucide-react';

const MapLoading = () => {
    return (
        <div className="fixed inset-0 bg-[#e0e5ec] z-50 flex flex-col items-center justify-center">
            <div className="relative">
                <div className="absolute inset-0 animate-ping rounded-full bg-blue-400 opacity-20"></div>
                <div className="neumorphic p-6 rounded-full">
                    <Truck className="w-12 h-12 text-blue-600 animate-pulse" />
                </div>
            </div>
            <h2 className="mt-8 text-2xl font-bold text-gray-700 tracking-wider">LOADING ROUTE</h2>
            <div className="w-64 h-2 bg-gray-300 rounded-full mt-4 overflow-hidden">
                <div className="h-full bg-blue-500 animate-[loading_1.5s_ease-in-out_infinite] w-1/2 rounded-full"></div>
            </div>
            <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
        </div>
    );
};

export default MapLoading;
