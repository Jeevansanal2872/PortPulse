from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib
import time
from datetime import datetime
import random

app = Flask(__name__)
CORS(app)

# Load AI Model
try:
    print("Loading AI Model...")
    model = joblib.load('indian_port_model.joblib')
    print("Model loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

# Peer-to-Peer State
ACTIVE_TRUCKS = {}

def cleanup_inactive_trucks():
    now = time.time()
    to_remove = [tid for tid, data in ACTIVE_TRUCKS.items() if now - data['last_updated'] > 300]
    for tid in to_remove:
        del ACTIVE_TRUCKS[tid]

def calculate_demurrage(wait_time_minutes, free_time=60, rate_per_hour=50):
    if wait_time_minutes <= free_time: return 0
    overtime = wait_time_minutes - free_time
    return round((overtime / 60) * rate_per_hour, 2)

@app.route('/update_location', methods=['POST'])
def update_location():
    data = request.json
    ACTIVE_TRUCKS[data.get('truck_id', 'unknown')] = {
        "lat": data.get('lat'),
        "lon": data.get('lon'),
        "heading": data.get('heading', 0),
        "last_updated": time.time()
    }
    cleanup_inactive_trucks()
    return jsonify({"status": "success", "active_peers": len(ACTIVE_TRUCKS)})

@app.route('/predict', methods=['POST'])
def predict_wait_time():
    """
    Returns AI-Predicted Traffic & Wait Times.
    """
    if not model: return jsonify({"error": "Model not loaded"}), 500
    data = request.json
    
    # 1. Inputs
    now = datetime.now()
    hour = now.hour
    is_peak = (8 <= hour <= 11) or (17 <= hour <= 20)
    
    rain = data.get('rain_1h', 0)
    is_monsoon = rain > 5
    
    real_time_density = len(ACTIVE_TRUCKS)
    if real_time_density < 10: real_time_density = data.get('truck_density', 100)

    # 2. Model Prediction
    input_data = pd.DataFrame([{
        'port_name': data.get('port_name', 'Cochin Port'),
        'state': data.get('state', 'Kerala'),
        'district': data.get('district', 'Ernakulam'),
        'hour_sin': np.sin(2 * np.pi * hour/24),
        'hour_cos': np.cos(2 * np.pi * hour/24),
        'day_of_week': now.weekday(),
        'rain_1h': rain,
        'visibility': data.get('visibility', 10000),
        'truck_density': real_time_density,
        'gate_health': 600, 
        'is_monsoon': 1 if is_monsoon else 0
    }])
    
    prediction_seconds = model.predict(input_data)[0]
    wait_minutes = int(prediction_seconds / 60)

    # 3. AI-GENERATED TRAFFIC SEGMENTS
    # Since we can't get real traffic from networks without $$$, we use our AI
    # to "Paint" the route based on probability.
    
    # Segment 1: Highway (Far from port)
    # Usually Green, unless Monsooon
    seg1_color = '#4ade80' # Green
    if is_monsoon: seg1_color = '#fbbf24' # Yellow (Caution)

    # Segment 2: City Approach (Mid distance)
    # Yellow during peak hours
    seg2_color = '#fbbf24' if is_peak else '#4ade80'
    if is_monsoon: seg2_color = '#ef4444' # Red (City flood risk)

    # Segment 3: The "Black Hole" (Port Gate)
    # Controlled by our XGBoost Model
    if wait_minutes > 90: seg3_color = '#7f1d1d' # Deep Red (Critical)
    elif wait_minutes > 45: seg3_color = '#ef4444' # Red
    else: seg3_color = '#fbbf24' # Yellow (Always busy)

    traffic_segments = [
        {"color": seg1_color, "description": "Highway: Moving Well"},
        {"color": seg2_color, "description": "City Approach: Moderate"},
        {"color": seg3_color, "description": f"Port Gate: {wait_minutes} min wait"}
    ]
    
    # Traffic Level Summary
    traffic_level = "LOW"
    if wait_minutes > 120: traffic_level = "CRITICAL"
    elif wait_minutes > 60: traffic_level = "HIGH"
    elif wait_minutes > 30: traffic_level = "MODERATE"

    return jsonify({
        "predicted_wait_minutes": wait_minutes,
        "demurrage_risk_usd": calculate_demurrage(wait_minutes),
        "traffic_level": traffic_level,
        "active_fleet_count": len(ACTIVE_TRUCKS),
        "monsoon_mode": is_monsoon,
        "traffic_segments": traffic_segments
    })

@app.route('/weather', methods=['GET'])
def get_weather():
    # Mocking Monsoon for demo based on location
    lat = float(request.args.get('lat', 0))
    # Fake Logic: If close to Cochin, random rain chance for demo dynamics
    is_rainy = random.random() > 0.7 
    
    if is_rainy:
        return jsonify({
            "main": {"temp": 28.0},
            "weather": [{"main": "Rain", "description": "monsoon showers"}],
            "visibility": 3000,
            "rain": {"1h": 15.0}
        })
    else:
        return jsonify({
            "main": {"temp": 32.0},
            "weather": [{"main": "Clear", "description": "clear sky"}],
            "visibility": 10000,
            "rain": {}
        })

import os

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    debug = os.environ.get('FLASK_ENV') == 'development'
    app.run(host='0.0.0.0', port=port, debug=debug)
