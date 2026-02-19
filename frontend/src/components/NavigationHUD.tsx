import React from 'react';
import { ArrowUp, ArrowLeft, ArrowRight, MapPin, Navigation } from 'lucide-react';

interface NavigationHUDProps {
    instruction: string;
    distance: number; // in meters
    nextRoad: string;
    isVisible: boolean;
}

const NavigationHUD: React.FC<NavigationHUDProps> = ({ instruction, distance, nextRoad, isVisible }) => {
    if (!isVisible) return null;

    // Determine Icon based on instruction text
    const getIcon = () => {
        const lower = instruction.toLowerCase();
        if (lower.includes('left')) return <ArrowLeft size={48} className="text-white" />;
        if (lower.includes('right')) return <ArrowRight size={48} className="text-white" />;
        if (lower.includes('arrive') || lower.includes('destination')) return <MapPin size={48} className="text-white" />;
        return <ArrowUp size={48} className="text-white" />;
    };

    return (
        <div className="absolute top-4 left-4 right-4 z-[9999] bg-green-600 rounded-xl shadow-2xl p-4 flex items-center justify-between animate-slide-down">
            {/* Maneuver Icon */}
            <div className="flex items-center gap-4">
                <div className="bg-white/20 p-2 rounded-full">
                    {getIcon()}
                </div>
                <div className="flex flex-col text-white">
                    <span className="text-4xl font-bold tracking-tight">
                        {distance < 1000 ? `${Math.round(distance)} m` : `${(distance/1000).toFixed(1)} km`}
                    </span>
                    <span className="text-lg font-medium opacity-90 leading-tight max-w-[200px] md:max-w-md">
                        {instruction}
                    </span>
                    <span className="text-sm font-light opacity-80 uppercase tracking-widest mt-1">
                        {nextRoad || "Follow Route"}
                    </span>
                </div>
            </div>

            {/* Sim Indicator or Extra Info */}
            <div className="hidden md:flex flex-col items-end text-white/80">
                <Navigation size={24} />
                <span className="text-xs uppercase font-bold">PortPulse Nav</span>
            </div>
        </div>
    );
};

export default NavigationHUD;
