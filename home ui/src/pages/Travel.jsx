import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import InputGroup from '../components/InputGroup';
import MapLoading from './MapLoading';
import EconomicHUD from '../components/EconomicHUD';
import WeatherWidget from '../components/WeatherWidget';
import { MapPin, Navigation, Clock, Truck, Anchor, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';
import { gsap } from 'gsap';

const Travel = () => {
    const [loadingMap, setLoadingMap] = useState(true);
    const [formData, setFormData] = useState({ arrival: '', departure: '' });
    const [stats, setStats] = useState(null);
    const [smartDivert, setSmartDivert] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setLoadingMap(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    const handleGetCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setFormData(prev => ({ ...prev, departure: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` }));
                },
                (error) => {
                    alert("Error getting location: " + error.message);
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoadingMap(true);
        setTimeout(() => {
            setLoadingMap(false);
            setStats({
                avgTime: '4h 30m',
                driverCount: 124,
                portStatus: 'Congested', // Changed to test smart divert
                bottleneck: 'Gate A'
            });

            // Trigger Smart Divert after a delay if congested
            setTimeout(() => {
                setSmartDivert(true);
                gsap.from(".smart-divert", { y: -50, opacity: 0, duration: 0.8, ease: "bounce.out" });
            }, 2000);

            gsap.from(".stat-card", { y: 20, opacity: 0, stagger: 0.1, duration: 0.5 });
        }, 1500);
    };

    if (loadingMap && !stats) return <MapLoading />;

    return (
        <Layout>
            <div className="relative h-[calc(100vh-80px)] w-full overflow-hidden">

                {/* Full Screen Map Background */}
                <div className="absolute inset-0 bg-gray-200 z-0">
                    <div className="w-full h-full bg-[url('https://mt1.google.com/vt/lyrs=m&x=10&y=10&z=5')] bg-cover opacity-60 grayscale-[30%]"></div>

                    {/* Mock Map Pins (Peer Visibility) */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="relative">
                            <div className="absolute -top-10 -left-20 animate-pulse text-blue-600"><Truck className="w-6 h-6 rotate-45" /></div>
                            <div className="absolute top-20 left-10 animate-pulse text-blue-600"><Truck className="w-6 h-6 -rotate-12" /></div>
                            <div className="absolute top-5 right-20 animate-pulse text-blue-600"><Truck className="w-6 h-6 rotate-90" /></div>
                            {/* User Pin */}
                            <div className="p-2 bg-blue-500 rounded-full shadow-lg border-4 border-white animate-bounce">
                                <Navigation className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* HUD Overlays */}
                <WeatherWidget />
                <EconomicHUD />

                {/* Smart Divert Notification */}
                {smartDivert && (
                    <div className="smart-divert absolute top-20 left-1/2 transform -translate-x-1/2 z-30 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg max-w-md w-full mx-4">
                        <div className="flex justify-between items-start">
                            <div className="flex gap-3">
                                <div className="p-2 bg-red-200 rounded-full"><AlertTriangle className="w-5 h-5 text-red-600" /></div>
                                <div>
                                    <p className="font-bold">High Congestion: {stats.bottleneck}</p>
                                    <p className="text-sm">Values suggest rerouting to <span className="font-bold">Gate B</span>.</p>
                                    <p className="text-xs mt-1 font-mono bg-white/50 inline-block px-1 rounded">Save approx. $150 in demurrage.</p>
                                </div>
                            </div>
                            <button onClick={() => setSmartDivert(false)} className="text-sm underline hover:text-red-900">Dismiss</button>
                            <button className="neumorphic-btn px-3 py-1 bg-white text-xs font-bold text-red-600 ml-2 shadow-sm">Reroute</button>
                        </div>
                    </div>
                )}

                {/* Floating Controls Panel */}
                <div className="absolute bottom-6 left-6 z-20 w-full max-w-sm">
                    <div className="neumorphic p-6 bg-white/90 backdrop-blur-md border border-white/50">
                        {!stats ? (
                            <>
                                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-yellow-500" /> Route Planner
                                </h2>
                                <form onSubmit={handleSubmit}>
                                    <InputGroup
                                        label="Departure"
                                        placeholder="Current Location..."
                                        icon={MapPin}
                                        value={formData.departure}
                                        onChange={(e) => setFormData({ ...formData, departure: e.target.value })}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleGetCurrentLocation}
                                        className="mb-4 text-xs text-blue-500 font-bold uppercase tracking-wide hover:text-blue-600 flex items-center gap-1"
                                    >
                                        <Navigation className="w-3 h-3" /> GPS Sync
                                    </button>

                                    <InputGroup
                                        label="Arrival (Port Gate)"
                                        placeholder="Select Terminal..."
                                        icon={Anchor}
                                        value={formData.arrival}
                                        onChange={(e) => setFormData({ ...formData, arrival: e.target.value })}
                                    />

                                    <button type="submit" className="neumorphic-btn w-full py-3 text-white bg-blue-600 hover:bg-blue-700 font-bold text-lg shadow-blue-300">
                                        Initiate Route &rarr;
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h2 className="text-xl font-bold text-gray-800">Live Metrics</h2>
                                    <button onClick={() => setStats(null)} className="text-xs text-gray-400 hover:text-gray-600">Reset</button>
                                </div>

                                <div className="stat-card flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                    <Clock className="text-blue-600 w-5 h-5" />
                                    <div>
                                        <p className="text-xs text-gray-500 font-bold uppercase">AI Prediction (ETA)</p>
                                        <p className="text-lg font-bold text-gray-800">{stats.avgTime}</p>
                                    </div>
                                </div>

                                <div className="stat-card flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
                                    <Truck className="text-orange-600 w-5 h-5" />
                                    <div>
                                        <p className="text-xs text-gray-500 font-bold uppercase">Traffic Density</p>
                                        <p className="text-lg font-bold text-gray-800">{stats.driverCount} Peers</p>
                                    </div>
                                </div>

                                <div className={`stat-card flex items-center gap-3 p-3 rounded-lg border ${stats.portStatus === 'Open' ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                                    <Anchor className={stats.portStatus === 'Open' ? 'text-green-600 w-5 h-5' : 'text-red-600 w-5 h-5'} />
                                    <div>
                                        <p className="text-xs text-gray-500 font-bold uppercase">Gate Status</p>
                                        <p className={`text-lg font-bold ${stats.portStatus === 'Open' ? 'text-green-800' : 'text-red-800'}`}>{stats.portStatus}</p>
                                    </div>
                                </div>

                                <div className="stat-card flex items-center gap-3 p-3 bg-teal-50 rounded-lg border border-teal-100">
                                    <ShieldCheck className="text-teal-600 w-5 h-5" />
                                    <div>
                                        <p className="text-xs text-gray-500 font-bold uppercase">Sustainability Score</p>
                                        <p className="text-lg font-bold text-teal-800 font-mono">98/100</p>
                                    </div>
                                </div>

                            </div>
                        )}
                    </div>
                </div>

            </div>
        </Layout >
    );
};

export default Travel;
