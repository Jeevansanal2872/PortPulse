import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { api, PredictionData, WeatherData } from '../lib/api';
import RiskHUD from './RiskHUD';
import DrivingStats from './DrivingStats';
import NavigationHUD from './NavigationHUD';
import EmergencyModal from './EmergencyModal';
import axios from 'axios';
import { Play, RotateCcw, Crosshair, Layers, Siren, Volume2, VolumeX } from 'lucide-react';

const createTruckIcon = (rotation: number) => L.divIcon({
    className: 'truck-icon',
    html: `<div style="transform: rotate(${rotation}deg); transition: transform 0.1s linear; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.4));"><svg width="64" height="64" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#3B82F6" fill-opacity="1"/><circle cx="12" cy="12" r="6" fill="#1E40AF" stroke="white" stroke-width="2"/><path d="M12 4L15 10H9L12 4Z" fill="#FFFFFF"/></svg></div>`,
    iconSize: [64, 64],
    iconAnchor: [32, 32],
});
const createDestIcon = () => L.divIcon({ className: 'dest-icon', html: `<div style="font-size:48px; filter: drop-shadow(0 4px 4px black);">🏁</div>`, iconSize: [48, 48], iconAnchor: [24, 48] });

const DEFAULT_DEST: [number, number] = [9.9667, 76.2667]; // Cochin Port (fallback)
const TOMTOM_KEY = import.meta.env.VITE_TOMTOM_KEY || '';

interface MapComponentProps {
    destination?: [number, number] | null;
    destinationName?: string;
}

// --- HELPERS ---
function MapCameraControl({ center, isFollowing }: { center: [number, number] | null, isFollowing: boolean }) {
  const map = useMap();
  useEffect(() => {
      if (center && isFollowing) map.setView(center, 16, { animate: true, duration: 0.2, easeLinearity: 0.8 });
  }, [center, isFollowing, map]);
  return null;
}

function MapInteractions({ onUserInteraction }: { onUserInteraction: () => void }) {
    useMapEvents({ dragstart: onUserInteraction });
    return null;
}

const MapComponent: React.FC<MapComponentProps> = ({ destination, destinationName }) => {
  const destCoords: [number, number] = destination || DEFAULT_DEST;
  const destLabel = destinationName || 'Gate A – Cochin Port';

  const [currentPos, setCurrentPos] = useState<[number, number] | null>(null);
  const [speed, setSpeed] = useState<number | null>(0);
  const [heading, setHeading] = useState<number | null>(0);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [routePolyline, setRoutePolyline] = useState<[number, number][]>([]);
  const [coloredSegments, setColoredSegments] = useState<{positions: [number, number][], color: string}[]>([]);
  const [navSteps, setNavSteps] = useState<any[]>([]);
  const [currentInstruction, setCurrentInstruction] = useState("Calibrating Route...");
  const [lastSpokenInstruction, setLastSpokenInstruction] = useState("");
  const [nextDistance, setNextDistance] = useState(0);

  const [isFollowing, setIsFollowing] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);
  const [mapStyle, setMapStyle] = useState<'Dark' | 'Street'>('Street');
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const simulationRef = useRef<number | null>(null);
  const simState = useRef({ step: 0, progress: 0, speed: 0.0005 });
  const watchId = useRef<number | null>(null);

  // 1. GPS
  useEffect(() => {
    if (navigator.geolocation && !isSimulating) {
      watchId.current = navigator.geolocation.watchPosition(
        (pos) => {
          if (isSimulating) return;
          setCurrentPos([pos.coords.latitude, pos.coords.longitude]);
          setSpeed(pos.coords.speed);
          setHeading(pos.coords.heading);
        },
        (err) => {
             console.error(err);
             if (!currentPos) setCurrentPos([9.9312, 76.2673]);
        },
        { enableHighAccuracy: true }
      );
    }
    return () => { if (watchId.current) navigator.geolocation.clearWatch(watchId.current); }
  }, [isSimulating]);

  // 2. Data
  useEffect(() => {
      if (!currentPos) return;
      const fetchData = async () => {
          try {
              const [lat, lon] = currentPos;
              const wData = await api.getWeather(lat, lon);
              setWeather(wData);
              const pred = await api.getPrediction("Cochin", lat, lon, wData.rain?.['1h']||0, wData.visibility);
              setPrediction(pred);
          } catch (e) { console.error(e); }
      };
      fetchData();
      const i = setInterval(fetchData, 15000);
      return () => clearInterval(i);
  }, [currentPos]);

  // 3. Routing — re-fires whenever origin OR destination changes
  useEffect(() => {
    if (!currentPos || isSimulating) return;
    const fetchRoute = async () => {
      try {
        const start = `${currentPos[1]},${currentPos[0]}`;
        const end   = `${destCoords[1]},${destCoords[0]}`;
        const res = await axios.get(
          `https://router.project-osrm.org/route/v1/driving/${start};${end}?overview=full&geometries=geojson&steps=true`
        );
        if (res.data.routes?.[0]) {
           const route = res.data.routes[0];
           const coords = route.geometry.coordinates;
           const path = coords.map((c: number[]) => [c[1], c[0]] as [number, number]);
           setRoutePolyline(path);
           setNavSteps(route.legs[0].steps);
           setColoredSegments([{ positions: path, color: '#3B82F6' }]);
        }
      } catch (e) { console.error(e); }
    };
    const t = setTimeout(fetchRoute, 300);
    return () => clearTimeout(t);
  }, [currentPos, isSimulating, destCoords[0], destCoords[1]]);

  // 4. Instructions & VOICE
  useEffect(() => {
      if (!isSimulating || !navSteps.length) return;
      const totalSteps = routePolyline.length;
      const currentIdx = simState.current.step;
      const progress = currentIdx / totalSteps;
      const stepIdx = Math.floor(progress * navSteps.length);
      const step = navSteps[stepIdx];
      if (step) {
          const text = step.maneuver.modifier ? `${step.maneuver.type} ${step.maneuver.modifier}` : step.maneuver.type;
          setCurrentInstruction(text);
          setNextDistance(step.distance || 100);
          if (!isMuted && text !== lastSpokenInstruction && 'speechSynthesis' in window) {
              const utterance = new SpeechSynthesisUtterance(text.replace('turn','Turn').replace('arrive','You have arrived at'));
              utterance.rate = 1.1;
              window.speechSynthesis.cancel();
              window.speechSynthesis.speak(utterance);
              setLastSpokenInstruction(text);
          }
      }
  }, [isSimulating, isMuted]);

  // 5. SMOOTH SIMULATION
  const animateFrames = () => {
      if (!isSimulating) return;
      const path = routePolyline;
      if (simState.current.step >= path.length - 1) { setIsSimulating(false); return; }
      const p1 = path[simState.current.step];
      const p2 = path[simState.current.step + 1];
      simState.current.progress += 0.05;
      if (simState.current.progress >= 1) { simState.current.step++; simState.current.progress = 0; }
      const lat = p1[0] + (p2[0] - p1[0]) * simState.current.progress;
      const lon = p1[1] + (p2[1] - p1[1]) * simState.current.progress;
      setCurrentPos([lat, lon]);
      const angle = Math.atan2(p2[0]-p1[0], p2[1]-p1[1]) * (180/Math.PI);
      if (!isNaN(angle)) setHeading(90 - angle);
      setSpeed(45 + Math.sin(Date.now() / 1000) * 5);
      simulationRef.current = requestAnimationFrame(animateFrames);
  };

  const startSim = () => {
    if (routePolyline.length < 2) return;
    setIsSimulating(true);
    setIsFollowing(true);
    simState.current = { step: 0, progress: 0, speed: 0.05 };
    simulationRef.current = requestAnimationFrame(animateFrames);
  };

  const stopSim = () => {
      setIsSimulating(false);
      if (simulationRef.current) cancelAnimationFrame(simulationRef.current);
  };

  return (
    <div className="relative w-full h-full bg-gray-900 overflow-hidden">

        <EmergencyModal isOpen={isEmergencyOpen} onClose={() => setIsEmergencyOpen(false)} currentPos={currentPos} />

        <div className="absolute top-0 w-full z-[9999]">
             <NavigationHUD instruction={currentInstruction} distance={nextDistance} nextRoad={destLabel} isVisible={true} />
        </div>
        <div className="absolute top-32 left-4 z-[9990]">
            <RiskHUD demurrageRisk={prediction?.demurrage_risk_usd||0} waitMinutes={prediction?.predicted_wait_minutes||0} smartDivert={null} />
        </div>
        <div className="absolute bottom-8 left-4 z-[9990]">
            <DrivingStats speed={speed} heading={heading} weather={weather?.weather[0]?.description||""} etaMinutes={prediction?.predicted_wait_minutes||20} delayMinutes={0} activePeers={prediction?.active_fleet_count||1} trafficLevel={'REAL-TIME'} />
        </div>

        {!isFollowing && (
            <div className="absolute bottom-40 left-1/2 transform -translate-x-1/2 z-[9999] animate-bounce-small">
                <button onClick={() => setIsFollowing(true)} className="bg-white text-blue-600 font-bold py-2 px-6 rounded-full shadow-2xl flex items-center gap-2 border-2 border-blue-500 hover:scale-105 transition-transform"><Crosshair size={20} /> RE-CENTER</button>
            </div>
        )}

        <div className="absolute bottom-32 right-4 z-[9990] flex flex-col gap-3">
             <button onClick={() => setIsEmergencyOpen(true)} className="bg-red-600 animate-pulse text-white font-bold p-3 rounded-full shadow-lg border-2 border-red-500 hover:bg-red-500"><Siren size={24} /></button>
             <button onClick={() => setIsMuted(!isMuted)} className={`font-bold p-3 rounded-full shadow-lg border-2 ${isMuted ? 'bg-gray-600 border-gray-500 text-gray-300' : 'bg-white border-gray-200 text-blue-600'}`}>
                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
             </button>
             <button onClick={() => setMapStyle(mapStyle === 'Dark' ? 'Street' : 'Dark')} className="bg-white text-gray-800 font-bold p-3 rounded-full shadow-lg border-2 border-gray-200 hover:bg-gray-50"><Layers size={24} /></button>
             <button onClick={isSimulating ? stopSim : startSim} className={`font-bold py-3 px-6 rounded-full shadow-lg flex items-center gap-2 ${isSimulating ? 'bg-red-600' : 'bg-green-600'} text-white`}>{isSimulating ? <><RotateCcw size={20}/> STOP</> : <><Play fill="white" size={20}/> GO</>}</button>
        </div>

        <MapContainer center={currentPos || [9.9312, 76.2673]} zoom={13} style={{height: "100%", width: "100%"}} zoomControl={false} attributionControl={false}>
            <MapInteractions onUserInteraction={() => setIsFollowing(false)} />
            <MapCameraControl center={currentPos} isFollowing={isFollowing} />

            {mapStyle === 'Dark' ? (
                 <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
            ) : (
                 <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
            )}

            {TOMTOM_KEY && <TileLayer url={`https://api.tomtom.com/traffic/map/4/tile/flow/relative0/{z}/{x}/{y}.png?key=${TOMTOM_KEY}`} opacity={0.7} zIndex={50} />}

            {coloredSegments.map((seg, i) => (
                <Polyline key={i} positions={seg.positions} pathOptions={{ color: '#3B82F6', weight: 8, opacity: 0.7, lineCap: 'round' }} />
            ))}

            {currentPos && <Marker position={currentPos} icon={createTruckIcon(heading||0)} zIndexOffset={1000} />}
            <Marker position={destCoords} icon={createDestIcon()}><Popup>{destLabel}</Popup></Marker>
        </MapContainer>
    </div>
  );
};

export default MapComponent;
