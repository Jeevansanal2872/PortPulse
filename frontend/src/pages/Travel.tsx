import React, { useState, useEffect, useRef, useCallback } from 'react';
import Layout from '../components/Layout';
import MapComponent from '../components/MapComponent';
import { MapPin, Navigation, Anchor, AlertTriangle, Zap, Search, X } from 'lucide-react';
import { gsap } from 'gsap';
import { api } from '../lib/api';
import axios from 'axios';

interface GeoSuggestion {
    display_name: string;
    lat: string;
    lon: string;
    place_id: number;
}

const Travel = () => {
    const [loadingMap, setLoadingMap] = useState(true);
    const [arrivalInput, setArrivalInput] = useState('');
    const [departureInput, setDepartureInput] = useState('');
    const [suggestions, setSuggestions] = useState<GeoSuggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [stats, setStats] = useState<any>(null);
    const [smartDivert, setSmartDivert] = useState(false);
    const [isRouteActive, setIsRouteActive] = useState(false);
    const [destinationCoords, setDestinationCoords] = useState<[number, number] | null>(null);
    const [destinationName, setDestinationName] = useState<string>('');
    const [geocodeError, setGeocodeError] = useState('');
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => setLoadingMap(false), 1500);
        handleGetCurrentLocation();
        return () => clearTimeout(timer);
    }, []);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleGetCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setDepartureInput(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
                },
                () => { setDepartureInput('Location unavailable'); }
            );
        }
    };

    // Debounced live search — India only (countrycodes=in)
    const handleArrivalChange = useCallback((value: string) => {
        setArrivalInput(value);
        setGeocodeError('');
        setShowSuggestions(false);

        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (value.trim().length < 2) { setSuggestions([]); return; }

        debounceRef.current = setTimeout(async () => {
            setSearchLoading(true);
            try {
                const res = await axios.get<GeoSuggestion[]>('https://nominatim.openstreetmap.org/search', {
                    params: {
                        q: value,
                        format: 'json',
                        limit: 6,
                        countrycodes: 'in',          // India only
                        'accept-language': 'en',
                        addressdetails: 1,
                    },
                    headers: { 'Accept-Language': 'en' }
                });
                setSuggestions(res.data || []);
                setShowSuggestions((res.data || []).length > 0);
            } catch {
                setSuggestions([]);
            } finally {
                setSearchLoading(false);
            }
        }, 400);
    }, []);

    const selectSuggestion = (s: GeoSuggestion) => {
        setArrivalInput(s.display_name.split(',').slice(0, 3).join(', '));
        setDestinationName(s.display_name.split(',').slice(0, 4).join(', '));
        setDestinationCoords([parseFloat(s.lat), parseFloat(s.lon)]);
        setShowSuggestions(false);
        setSuggestions([]);
        setGeocodeError('');
    };

    const clearArrival = () => {
        setArrivalInput('');
        setDestinationCoords(null);
        setDestinationName('');
        setSuggestions([]);
        setShowSuggestions(false);
        setGeocodeError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setGeocodeError('');

        // If user typed text but didn't pick a suggestion → auto-geocode once
        if (!destinationCoords && arrivalInput.trim()) {
            setSearchLoading(true);
            try {
                const res = await axios.get<GeoSuggestion[]>('https://nominatim.openstreetmap.org/search', {
                    params: {
                        q: arrivalInput.trim(),
                        format: 'json',
                        limit: 1,
                        countrycodes: 'in',
                        'accept-language': 'en',
                    }
                });
                if (res.data && res.data.length > 0) {
                    const first = res.data[0];
                    setDestinationCoords([parseFloat(first.lat), parseFloat(first.lon)]);
                    setDestinationName(first.display_name.split(',').slice(0, 4).join(', '));
                } else {
                    setGeocodeError(`"${arrivalInput}" not found. Try being more specific, e.g. "Mysore Railway Station, Karnataka".`);
                    setSearchLoading(false);
                    return;
                }
            } catch {
                setGeocodeError('Search failed. Please check your connection and try again.');
                setSearchLoading(false);
                return;
            }
            setSearchLoading(false);
        }

        setLoadingMap(true);

        try {
            const parts = departureInput.split(',').map(s => parseFloat(s.trim()));
            const lat = parts[0] || 9.9312;
            const lon = parts[1] || 76.2673;

            const data = await api.getPrediction("Cochin Port", lat, lon, 0, 10000);
            setStats({
                avgTime: `${data.predicted_wait_minutes} min`,
                driverCount: data.active_fleet_count,
                portStatus: data.traffic_level,
                bottleneck: 'Gate A',
                ...data
            });

            setLoadingMap(false);
            setIsRouteActive(true);

            if (data.traffic_level === 'HIGH' || data.traffic_level === 'CRITICAL') {
                setTimeout(() => {
                    setSmartDivert(true);
                    gsap.from(".smart-divert", { y: -50, opacity: 0, duration: 0.8, ease: "bounce.out" });
                }, 4000);
            }

            gsap.from(".stat-card", { y: 20, opacity: 0, stagger: 0.1, duration: 0.5 });

        } catch (error) {
            console.error("Prediction failed", error);
            setLoadingMap(false);
            setIsRouteActive(true);
        }
    };

    return (
        <Layout>
            <div className="relative h-[calc(100vh-80px)] w-full overflow-hidden">

                <div className="absolute inset-0 z-0">
                    <MapComponent destination={destinationCoords} destinationName={destinationName} />
                </div>

                {!isRouteActive && (
                    <div className="absolute inset-0 bg-white/30 backdrop-blur-sm z-10 pointer-events-none" />
                )}

                {/* Smart Divert */}
                {smartDivert && (
                    <div className="smart-divert absolute top-20 left-1/2 transform -translate-x-1/2 z-[10000] bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg max-w-md w-full mx-4">
                        <div className="flex justify-between items-start">
                            <div className="flex gap-3">
                                <div className="p-2 bg-red-200 rounded-full"><AlertTriangle className="w-5 h-5 text-red-600" /></div>
                                <div>
                                    <p className="font-bold">High Congestion: {stats?.bottleneck}</p>
                                    <p className="text-sm">Suggest rerouting to <span className="font-bold">Gate B</span>.</p>
                                    <p className="text-xs mt-1 font-mono bg-white/50 inline-block px-1 rounded">Save approx. $150 in demurrage.</p>
                                </div>
                            </div>
                            <button onClick={() => setSmartDivert(false)} className="text-sm underline hover:text-red-900">Dismiss</button>
                        </div>
                    </div>
                )}

                {/* Floating Route Planner */}
                {!isRouteActive && (
                    <div className="absolute bottom-6 left-6 z-[1000] w-full max-w-sm">
                        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/60 p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
                                <Zap className="w-5 h-5 text-yellow-500" /> Route Planner
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">

                                {/* Departure */}
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">
                                        <MapPin className="w-3 h-3 inline mr-1" />Departure
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            className="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-400"
                                            placeholder="Current location..."
                                            value={departureInput}
                                            onChange={e => setDepartureInput(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            onClick={handleGetCurrentLocation}
                                            title="GPS Sync"
                                            className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                                        >
                                            <Navigation className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Arrival with autocomplete */}
                                <div className="relative" ref={suggestionsRef}>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">
                                        <Anchor className="w-3 h-3 inline mr-1" />Destination (anywhere in India)
                                    </label>
                                    <div className="relative flex items-center">
                                        <Search className="absolute left-3 w-4 h-4 text-gray-400" />
                                        <input
                                            className="w-full bg-gray-100 rounded-lg pl-9 pr-9 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-400"
                                            placeholder="Chennai, Delhi, Shimla, JNPT..."
                                            value={arrivalInput}
                                            onChange={e => handleArrivalChange(e.target.value)}
                                            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                                            autoComplete="off"
                                        />
                                        {searchLoading && (
                                            <div className="absolute right-3 w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                                        )}
                                        {arrivalInput && !searchLoading && (
                                            <button type="button" onClick={clearArrival} className="absolute right-3 text-gray-400 hover:text-gray-600">
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>

                                    {/* Suggestions Dropdown */}
                                    {showSuggestions && suggestions.length > 0 && (
                                        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                                            {suggestions.map((s) => (
                                                <button
                                                    key={s.place_id}
                                                    type="button"
                                                    onClick={() => selectSuggestion(s)}
                                                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 border-b border-gray-50 last:border-b-0 flex items-start gap-2 transition-colors"
                                                >
                                                    <MapPin className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                                    <span className="line-clamp-2">{s.display_name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {/* Destination confirmed badge */}
                                    {destinationCoords && !showSuggestions && (
                                        <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                            <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                                            Destination set: {destinationName.split(',')[0]}
                                        </p>
                                    )}
                                </div>

                                {geocodeError && (
                                    <p className="text-red-500 text-xs flex items-start gap-1">
                                        <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" /> {geocodeError}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    disabled={loadingMap || searchLoading}
                                    className="w-full py-3 rounded-xl text-white bg-blue-600 hover:bg-blue-700 font-bold text-base shadow-lg shadow-blue-200 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                                >
                                    {loadingMap ? 'Calculating...' : 'Initiate Route →'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Reset button when route is active */}
                {isRouteActive && (
                    <button
                        onClick={() => { setIsRouteActive(false); setDestinationCoords(null); setArrivalInput(''); setDestinationName(''); }}
                        className="absolute bottom-6 left-6 z-[1000] bg-white text-gray-800 font-bold py-2 px-5 rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2 text-sm"
                    >
                        ← New Route
                    </button>
                )}
            </div>
        </Layout>
    );
};

export default Travel;
