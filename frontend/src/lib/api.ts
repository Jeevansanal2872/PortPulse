import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';


export interface WeatherData {
    main: { temp: number };
    weather: { main: string; description: string }[];
    visibility: number;
    rain?: { "1h": number };
}

export interface PredictionData {
    predicted_wait_minutes: number;
    demurrage_risk_usd: number;
    traffic_level: string;
    active_fleet_count: number;
    monsoon_mode: boolean;
    smart_divert?: string;
    traffic_segments?: { color: string; description: string }[];
}

export const api = {
    getWeather: async (lat: number, lon: number): Promise<WeatherData> => {
        const response = await axios.get(`${API_BASE_URL}/weather`, { params: { lat, lon } });
        return response.data;
    },
    getPrediction: async (portName: string, lat: number, lon: number, rain: number, visibility: number): Promise<PredictionData> => {
        const response = await axios.post(`${API_BASE_URL}/predict`, {
            port_name: portName, lat, lon, rain_1h: rain, visibility, truck_density: 120
        });
        return response.data;
    }
};
