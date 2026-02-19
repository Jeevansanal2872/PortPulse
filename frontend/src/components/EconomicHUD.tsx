import React, { useState, useEffect } from 'react';
import { DollarSign, Clock } from 'lucide-react';

const EconomicHUD = () => {
    const [penaltyTime, setPenaltyTime] = useState(7200); // 2 hours in seconds
    const [financialRisk, setFinancialRisk] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setPenaltyTime(prev => (prev > 0 ? prev - 1 : 0));
            setFinancialRisk(prev => prev + 0.45); // Simulate money lost over time
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h}h ${m}m ${s}s`;
    };

    return (
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-3">
            {/* Penalty Clock */}
            <div className="neumorphic px-4 py-3 flex items-center gap-3 bg-red-50 border border-red-100">
                <div className="p-2 rounded-full bg-red-500 text-white animate-pulse">
                    <Clock className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-xs text-red-600 font-bold uppercase tracking-wider">Penalty Clock</p>
                    <p className="text-xl font-mono font-bold text-red-800">{formatTime(penaltyTime)}</p>
                </div>
            </div>

            {/* Financial Risk HUD */}
            <div className="neumorphic px-4 py-3 flex items-center gap-3 bg-gray-50">
                <div className="p-2 rounded-full bg-gray-200 text-gray-600">
                    <DollarSign className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Risk / Demurrage</p>
                    <p className="text-xl font-mono font-bold text-gray-800">-${financialRisk.toFixed(2)}</p>
                </div>
            </div>
        </div>
    );
};

export default EconomicHUD;
