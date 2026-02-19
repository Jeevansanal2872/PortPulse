<!-- Header -->
<div align="center">

  <h1>🛸 PortPulse AI</h1>
  <p><strong>Smart & Sustainable Port Logistics Hub</strong></p>
  <p>A predictive logistics engine that eliminates the "Black Hole" of data between city traffic and port gates — powered by XGBoost, Real-time GPS, and Monsoon-aware Climate Data.</p>

  ![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react)
  ![Python](https://img.shields.io/badge/Backend-Python%20%2B%20Flask-3776AB?style=for-the-badge&logo=python)
  ![XGBoost](https://img.shields.io/badge/AI-XGBoost-FF6600?style=for-the-badge)
  ![Supabase](https://img.shields.io/badge/Database-Supabase-3ECF8E?style=for-the-badge&logo=supabase)
  ![License](https://img.shields.io/badge/License-MIT-brightgreen?style=for-the-badge)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Backend Setup](#2-backend-setup-flask--ai-model)
  - [3. Frontend Setup](#3-frontend-setup-react--vite)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup-supabase)
- [How It Works](#-how-it-works)
- [Features](#-features)
- [Contributing](#-contributing)

---

## 🛸 About

PortPulse AI prevents port congestion and protects small businesses from expensive demurrage fines by merging:

- 📡 **Real-time GPS** — Live truck positions via Supabase Realtime
- 🧠 **XGBoost ML** — Predicts wait times using distance, traffic density, and monsoon data
- 🌧️ **OpenWeatherMap** — Monsoon-recalibration to avoid chain-reaction delays

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js + Vite + Tailwind CSS |
| Backend | Python 3 + Flask |
| Database | PostgreSQL via Supabase (Realtime) |
| AI/ML | XGBoost + Scikit-Learn + Joblib |
| Maps | Leaflet.js + OpenStreetMap + OSRM Routing |
| Geocoding | Nominatim (free, no key needed) |
| Weather | OpenWeatherMap API |
| Deployment | Vercel (frontend) + Render (backend) |

---

## ✅ Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) `v18.0.0`+
- [Python](https://www.python.org/) `3.9.0`+
- [Git](https://git-scm.com/)
- [pip](https://pip.pypa.io/en/stable/)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Jeevansanal2872/PortPulse.git
cd PortPulse
```

---

### 2. Backend Setup (Flask + AI Model)

```bash
# Navigate to the backend folder
cd backend

# Create a Python virtual environment
python -m venv venv

# Activate the virtual environment
# Windows:
venv\Scripts\activate
# macOS / Linux:
source venv/bin/activate

# Install all Python dependencies
pip install -r requirements.txt
```

**Generate training data and train the AI model** *(run once)*:

```bash
python synthetic_data.py
python train_model.py
```

**Start the Flask API server:**

```bash
python app.py
```

> The backend will be running at **http://localhost:5000**

---

### 3. Frontend Setup (React + Vite)

Open a **new terminal window** and run:

```bash
# Navigate to the frontend folder
cd frontend

# Install Node.js dependencies
npm install

# Start the development server
npm run dev
```

> The app will be running at **http://localhost:5173**

**To build for production:**

```bash
npm run build
```

---

## 🔐 Environment Variables

### Backend — create `/backend/.env`

```env
OPENWEATHER_API_KEY=your_openweathermap_api_key
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your_supabase_anon_key
```

### Frontend — create `/frontend/.env`

```env
VITE_BACKEND_URL=http://localhost:5000
VITE_TOMTOM_KEY=your_tomtom_api_key
```

> **Note:** `VITE_TOMTOM_KEY` is optional. It enables live traffic tile overlays. The app works fully without it.

| Variable | Where to get it |
|----------|----------------|
| `OPENWEATHER_API_KEY` | [openweathermap.org/api](https://openweathermap.org/api) → Free tier |
| `SUPABASE_URL` | Supabase Dashboard → Project Settings → API |
| `SUPABASE_KEY` | Supabase Dashboard → Project Settings → API → `anon public` key |
| `VITE_TOMTOM_KEY` | [developer.tomtom.com](https://developer.tomtom.com) → Free tier |

---

## 🗄️ Database Setup (Supabase)

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the following:

```sql
-- Create the trucks table
CREATE TABLE trucks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    penalty_deadline TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'on-route',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Realtime on the trucks table
ALTER PUBLICATION supabase_realtime ADD TABLE trucks;
```

---

## 🏗️ How It Works

```
🚛  Driver opens app → selects gate + sets penalty deadline
       ↓
📡  GPS position sent to Supabase → nearby trucks show as "Pulse Pins"
       ↓
🧠  XGBoost AI queries OpenWeather → calculates ETA with monsoon factor
       ↓
📊  Driver sees Predicted Wait Time + Financial Risk Meter on HUD
       ↓
🔀  Bottleneck detected? AI suggests a "Green Slot" to avoid fines
```

---

## 🌟 Features

- 🗺️ **India-Wide Routing** — Real road directions to any place in India (Nominatim + OSRM, no API key)
- 🌧️ **Monsoon-Recalibration** — Auto time buffer during heavy rainfall
- ⏰ **Penalty Clock** — Live countdown before demurrage charges begin
- 🚨 **SOS Emergency** — One-tap alert with GPS location sharing
- 🎙️ **Voice Navigation** — Text-to-speech turn-by-turn directions
- 🌱 **Sustainability Score** — Shows CO₂ saved by avoiding idle time
- 📍 **Pulse Pins** — See anonymous nearby truck drivers in real time

---

## 🤝 Contributing

Pull requests are welcome!

```bash
# Fork the repo on GitHub, then:
git checkout -b feature/your-feature-name
git commit -m "Add: your feature description"
git push origin feature/your-feature-name
# Open a Pull Request on GitHub
```

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

<div align="center">
  <p>Built with ❤️ by <a href="https://github.com/Jeevansanal2872">Jeevan Sanal</a></p>
</div>
