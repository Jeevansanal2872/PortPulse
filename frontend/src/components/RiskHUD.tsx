import React from 'react';
import { BadgeDollarSign, AlertTriangle } from 'lucide-react';

interface RiskHUDProps {
    demurrageRisk: number;
    waitMinutes: number;
    smartDivert: string | null;
}

const RiskHUD: React.FC<RiskHUDProps> = ({ demurrageRisk, waitMinutes, smartDivert }) => {
    return (
        <div className="absolute top-4 right-4 z-50 flex flex-col items-end gap-2">
            {/* Demurrage Clock */}
            <div className={`bg-black/80 backdrop-blur-md p-4 rounded-xl border-l-4 shadow-2xl ${demurrageRisk > 0 ? 'border-red-500' : 'border-green-500'}`}>
                <div className="flex items-center gap-2 mb-1">
                    <BadgeDollarSign className={demurrageRisk > 0 ? "text-red-400" : "text-green-400"} size={24} />
                    <span className="text-gray-300 text-sm font-medium uppercase tracking-wider">Demurrage Risk</span>
                </div>
                <div className="text-4xl font-bold text-white tabular-nums">
                    ${demurrageRisk.toFixed(2)}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                    Est. Wait: <span className="text-white font-bold">{waitMinutes} min</span>
                </div>
            </div>

            {/* Smart Divert Notification */}
            {smartDivert && (
                <div className="bg-red-900/90 backdrop-blur-md p-4 rounded-xl border border-red-500 shadow-xl max-w-xs animate-pulse">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="text-yellow-400 shrink-0" size={24} />
                        <div>
                            <h3 className="text-white font-bold text-lg leading-none mb-1">Reroute Advised</h3>
                            <p className="text-red-100 text-sm leading-tight">{smartDivert}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RiskHUD;
