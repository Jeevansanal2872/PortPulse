import React from 'react';
import { CloudRain, Droplets } from 'lucide-react';

const WeatherWidget = () => {
    return (
        <div className="absolute top-4 left-4 z-20 neumorphic p-4 bg-blue-50/80 backdrop-blur-sm border border-blue-100 max-w-[200px]">
            <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold text-blue-800 uppercase tracking-wider">Monsoon Sync</h4>
                <CloudRain className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex flex-col gap-1">
                <p className="text-2xl font-bold text-gray-800">24°C</p>
                <p className="text-xs text-blue-600 font-medium flex items-center gap-1">
                    <Droplets className="w-3 h-3" /> Heavy Rain Detected
                </p>
                <div className="mt-2 text-xs text-gray-500 border-t border-blue-200 pt-1">
                    <p>ETA Buffer: <span className="text-red-500 font-bold">+45m</span></p>
                </div>
            </div>
        </div>
    );
};

export default WeatherWidget;
