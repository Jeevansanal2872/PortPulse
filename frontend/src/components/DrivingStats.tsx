import React from 'react';
import { Navigation, Wind, Clock, Users, AlertCircle } from 'lucide-react';

interface DrivingStatsProps {
    speed: number | null;
    heading: number | null;
    weather: string | null;
    etaMinutes: number | null;
    delayMinutes: number | null;
    activePeers: number;
    trafficLevel: string; // LOW, MODERATE, HIGH, CRITICAL
}

const DrivingStats: React.FC<DrivingStatsProps> = ({ 
    speed, 
    heading, 
    weather, 
    etaMinutes, 
    delayMinutes, 
    activePeers,
    trafficLevel
}) => {
    // Calculate Arrival Time
    const arrivalTime = new Date();
    if (etaMinutes) arrivalTime.setMinutes(arrivalTime.getMinutes() + etaMinutes);
    const arrivalString = arrivalTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const getTrafficColor = (level: string) => {
        switch(level) {
            case 'CRITICAL': return 'bg-red-600';
            case 'HIGH': return 'bg-orange-500';
            case 'MODERATE': return 'bg-yellow-400';
            default: return 'bg-green-500';
        }
    };

    return (
        <div className="absolute bottom-8 left-4 z-50 flex flex-col gap-3">
            
            {/* Main Dashboard Row */}
            <div className="flex gap-4 items-end">
                {/* Speedometer */}
                <div className="bg-black/80 backdrop-blur-md p-4 rounded-full w-28 h-28 flex flex-col items-center justify-center border-4 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                    <span className="text-4xl font-black text-white tabular-nums tracking-tighter">
                        {speed ? Math.round(speed * 3.6) : 0} 
                    </span>
                    <span className="text-[10px] text-blue-300 font-bold uppercase tracking-widest">km/h</span>
                </div>

                {/* Info Stack */}
                <div className="flex flex-col gap-2">
                    
                    {/* ETA & Delay */}
                    <div className="bg-black/80 backdrop-blur-md px-5 py-3 rounded-xl border border-gray-700 flex items-center gap-4 shadow-lg">
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-400 font-bold uppercase">Arrival</span>
                            <span className="text-2xl font-bold text-white">{arrivalString}</span>
                        </div>
                        
                        {delayMinutes && delayMinutes > 5 && (
                             <div className="flex items-center gap-1 text-red-500 animate-pulse bg-red-950/50 px-2 py-1 rounded">
                                <AlertCircle size={14} />
                                <span className="text-sm font-bold">+{delayMinutes} min</span>
                             </div>
                        )}
                        
                        <div className="h-8 w-px bg-gray-600 mx-1"></div>
                        
                        <div className="flex flex-col">
                             <span className="text-xs text-gray-400 font-bold uppercase">Time Rem.</span>
                             <div className="flex items-baseline gap-1">
                                <span className="text-white font-bold">{etaMinutes}</span>
                                <span className="text-xs text-gray-400">min</span>
                             </div>
                        </div>
                    </div>

                    {/* Environment Row */}
                    <div className="flex gap-2">
                        <div className="bg-black/60 backdrop-blur-sm px-3 py-2 rounded-lg flex items-center gap-2 border border-gray-700">
                            <Wind className="text-cyan-400" size={16} />
                            <span className="text-white text-sm font-medium">{weather || "--"}</span>
                        </div>
                        <div className="bg-black/60 backdrop-blur-sm px-3 py-2 rounded-lg flex items-center gap-2 border border-gray-700">
                            <Users className="text-purple-400" size={16} />
                            <span className="text-white text-sm font-medium">{activePeers} Online</span>
                        </div>
                    </div>

                </div>
            </div>

            {/* Traffic Integrity Bar */}
            <div className="bg-black/80 backdrop-blur-md p-3 rounded-xl border border-gray-700 w-80">
                <div className="flex justify-between text-xs text-gray-400 mb-1 font-bold uppercase">
                    <span>Traffic Integrity</span>
                    <span className={trafficLevel === 'CRITICAL' ? 'text-red-500' : 'text-green-500'}>{trafficLevel}</span>
                </div>
                <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden flex">
                    {/* Dynamic Traffic Bar */}
                    <div className={`h-full ${getTrafficColor(trafficLevel)} transition-all duration-1000`} style={{ width: '100%' }}></div>
                </div>
            </div>

        </div>
    );
};

export default DrivingStats;
