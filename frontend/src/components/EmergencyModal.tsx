import React, { useState, useEffect } from 'react';
import { Siren, Phone, MapPin, CheckCircle, X, MessageSquare, AlertTriangle } from 'lucide-react';

interface EmergencyModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentPos: [number, number] | null;
}

const EMERGENCY_PHONE = "8848932872";

const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose, currentPos }) => {
    const [step, setStep] = useState<'confirm' | 'locating' | 'sent'>('confirm');
    
    useEffect(() => {
        if (isOpen) setStep('confirm');
    }, [isOpen]);

    const handleConfirmEmergency = () => {
        // 1. Construct SMS Link with Location
        const lat = currentPos ? currentPos[0].toFixed(5) : 'Unknown';
        const lon = currentPos ? currentPos[1].toFixed(5) : 'Unknown';
        const smsBody = `SOS! I need HELP. heavy traffic/accident at location: https://www.google.com/maps?q=${lat},${lon}`;
        
        // Try to open SMS app in background/new tab
        window.open(`sms:${EMERGENCY_PHONE}?&body=${encodeURIComponent(smsBody)}`, '_blank');
        
        // 2. Trigger Phone Call (Main Action)
        setTimeout(() => {
            window.location.href = `tel:${EMERGENCY_PHONE}`;
        }, 500); // Small delay to let SMS window trigger first

        setStep('sent');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in">
            <div className="bg-gray-900 border-4 border-red-600 rounded-3xl w-full max-w-md p-8 shadow-[0_0_100px_rgba(220,38,38,0.8)] relative overflow-hidden flex flex-col items-center text-center">
                
                {/* Close Button */}
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white bg-gray-800 rounded-full p-2">
                    <X size={24} />
                </button>

                {step === 'confirm' && (
                    <div className="w-full flex flex-col items-center gap-6">
                        <div className="bg-red-600 p-6 rounded-full animate-pulse-fast shadow-xl">
                            <AlertTriangle size={64} className="text-white" />
                        </div>
                        
                        <div className="flex flex-col gap-2">
                            <h2 className="text-3xl font-black text-white uppercase tracking-wider">EMERGENCY SOS</h2>
                            <p className="text-red-300 font-bold text-lg">ARE YOU SURE?</p>
                            <p className="text-gray-400 text-sm max-w-xs mx-auto">
                                This will instantly call <b>{EMERGENCY_PHONE}</b> and send your GPS location via SMS.
                            </p>
                        </div>
                        
                        <div className="w-full flex flex-col gap-4 mt-4">
                            {/* CONFIRM BUTTON */}
                            <button 
                                onClick={handleConfirmEmergency}
                                className="bg-red-600 hover:bg-red-700 text-white w-full py-6 rounded-2xl font-black text-2xl shadow-[0_10px_0_rgb(153,27,27)] active:shadow-none active:translate-y-[10px] transition-all flex items-center justify-center gap-3 animate-pulse-slow"
                            >
                                <Siren size={32} />
                                YES, SEND HELP!
                            </button>

                            {/* CANCEL BUTTON */}
                            <button 
                                onClick={onClose}
                                className="bg-gray-800 hover:bg-gray-700 text-gray-200 w-full py-4 rounded-xl font-bold text-lg border border-gray-600"
                            >
                                CANCEL
                            </button>
                        </div>
                    </div>
                )}

                {step === 'sent' && (
                    <div className="flex flex-col items-center text-center gap-6 py-4">
                        <CheckCircle size={80} className="text-green-500 animate-bounce-small" />
                        <h2 className="text-3xl font-black text-white">ACTIONS TRIGGERED</h2>
                        
                        <div className="flex flex-col gap-4 w-full">
                            <div className="bg-gray-800 p-4 rounded-xl flex items-center gap-4 border border-green-500/50">
                                <Phone className="text-green-400" size={24} />
                                <div className="text-left">
                                    <h3 className="text-white font-bold">Calling {EMERGENCY_PHONE}...</h3>
                                    <p className="text-gray-400 text-xs">Dialer Opened</p>
                                </div>
                            </div>

                            <div className="bg-gray-800 p-4 rounded-xl flex items-center gap-4 border border-green-500/50">
                                <MessageSquare className="text-green-400" size={24} />
                                <div className="text-left">
                                    <h3 className="text-white font-bold">SMS Drafted</h3>
                                    <p className="text-gray-400 text-xs text-wrap break-all pr-4">
                                        Location: {currentPos ? `${currentPos[0].toFixed(5)}, ${currentPos[1].toFixed(5)}` : "..."}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <button 
                            onClick={onClose}
                            className="bg-gray-700 hover:bg-gray-600 text-white w-full py-4 rounded-xl font-bold mt-4"
                        >
                            CLOSE
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default EmergencyModal;
