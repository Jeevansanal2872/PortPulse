import pandas as pd
import numpy as np
import random

# Indian Port Locations & Hubs (Lat, Lon, Base Wait Time Multiplier)
LOCATIONS = [
    # Kerala Ports & Hubs
    {"name": "Cochin Port (Vallarpadam)", "state": "Kerala", "district": "Ernakulam", "lat": 9.9667, "lon": 76.2667, "congestion_factor": 1.5},
    {"name": "Vizhinjam International Seaport", "state": "Kerala", "district": "Thiruvananthapuram", "lat": 8.3667, "lon": 76.9967, "congestion_factor": 1.2},
    {"name": "Kollam Port", "state": "Kerala", "district": "Kollam", "lat": 8.8853, "lon": 76.5864, "congestion_factor": 1.1},
    {"name": "Beypore Port", "state": "Kerala", "district": "Kozhikode", "lat": 11.1667, "lon": 75.8000, "congestion_factor": 1.0},
    
    # Major Indian Ports
    {"name": "Jawaharlal Nehru Port Trust (JNPT)", "state": "Maharashtra", "district": "Mumbai", "lat": 18.9500, "lon": 72.9500, "congestion_factor": 1.8}, # Highly Congested
    {"name": "Chennai Port", "state": "Tamil Nadu", "district": "Chennai", "lat": 13.0850, "lon": 80.2900, "congestion_factor": 1.6},
    {"name": "Visakhapatnam Port", "state": "Andhra Pradesh", "district": "Visakhapatnam", "lat": 17.6900, "lon": 83.2900, "congestion_factor": 1.3},
    {"name": "Kolkata Port (Syama Prasad Mookerjee)", "state": "West Bengal", "district": "Kolkata", "lat": 22.5400, "lon": 88.3000, "congestion_factor": 1.4},
    {"name": "Mundra Port", "state": "Gujarat", "district": "Kutch", "lat": 22.8400, "lon": 69.7000, "congestion_factor": 1.4},
]

def generate_synthetic_data(num_samples=50000): # Increased sample size
    """
    Generates synthetic data for India-specific Port Pulse AI.
    """
    print(f"Generating {num_samples} samples across {len(LOCATIONS)} Indian locations...")
    
    data = []
    
    for _ in range(num_samples):
        # 1. Select Location
        loc = random.choice(LOCATIONS)
        
        # 2. Temporal Features
        hour = random.randint(0, 23)
        day_of_week = random.randint(0, 6) # 0=Mon, 6=Sun
        month = random.randint(1, 12)
        
        # 3. Weather (Monsoon Engine - Specific to India)
        # Southwest Monsoon (June-Sept) - Heavy Rain in Kerala/Mumbai
        is_monsoon_season = month in [6, 7, 8, 9]
        # Northeast Monsoon (Oct-Dec) - Heavy Rain in Chennai
        is_ne_monsoon = (loc['state'] == 'Tamil Nadu') and (month in [10, 11, 12])
        
        if is_monsoon_season or is_ne_monsoon:
            rain_prob = 0.6 if loc['state'] == 'Kerala' or loc['state'] == 'Maharashtra' else 0.4
            if random.random() < rain_prob:
                rain_1h = random.expovariate(1/10) # Heavy rain
                rain_1h = min(rain_1h, 80) 
            else:
                rain_1h = 0
                
            visibility = random.randint(500, 4000) if rain_1h > 0 else random.randint(4000, 8000)
        else:
            rain_1h = 0 if random.random() > 0.1 else random.uniform(0, 5)
            visibility = random.randint(8000, 10000)

        # 4. Traffic & Congestion
        # Peak: 8-11 AM, 5-8 PM
        is_peak = (8 <= hour <= 11) or (17 <= hour <= 20)
        
        base_density = 300 if is_peak else 80
        truck_density = int(np.random.normal(base_density, 50))
        truck_density = max(20, truck_density) * loc['congestion_factor']
        
        # Gate Health (Simulate inefficiency occasionally)
        gate_health = random.randint(300, 1500)
        
        # 5. TARGET: Total Seconds to Clear
        base_time = 900 # 15 mins
        
        # Factors
        density_penalty = truck_density * 3.5 # Slower processing per truck
        weather_penalty = (rain_1h * 90) if rain_1h > 5 else 0 # 1.5 min per mm rain
        
        # Random Incident (Breakdown, Shift Change)
        incident_penalty = 0
        if random.random() < 0.05: # 5% chance of incident
            incident_penalty = random.randint(1800, 3600) # 30-60 mins lost
            
        total_seconds = (base_time + density_penalty + weather_penalty + incident_penalty) * loc['congestion_factor']
        
        data.append({
            'port_name': loc['name'],
            'state': loc['state'],
            'district': loc['district'],
            'lat': loc['lat'],
            'lon': loc['lon'],
            'hour': hour,
            'day_of_week': day_of_week,
            'month': month,
            'rain_1h': round(rain_1h, 2),
            'visibility': visibility,
            'truck_density': int(truck_density),
            'gate_health': gate_health,
            'total_seconds_to_clear_gate': int(total_seconds)
        })
        
    df = pd.DataFrame(data)
    print("Data generation complete.")
    return df

if __name__ == "__main__":
    df = generate_synthetic_data()
    df.to_csv("indian_port_data.csv", index=False)
    print("Saved to indian_port_data.csv")
