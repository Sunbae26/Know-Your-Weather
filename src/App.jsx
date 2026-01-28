import { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Globe from "react-globe.gl";
import "./App.css";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

function Home({ city, setCity, onSearch }) {
  return (
    <div className="search-card card-entry">
      <h1 className="app-title">Know Your Weather</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Enter city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="search-input"
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
        />
        <button onClick={onSearch} className="search-button">
          Explore
        </button>
      </div>
    </div>
  );
}

function WeatherDetails({ data, error }) {
  const navigate = useNavigate();

  if (error)
    return (
      <div className="error-card card-entry">
        <p className="error-message">
          City not found. The Earth is big, try again!
        </p>
        <button onClick={() => navigate("/")} className="back-btn">
          Try Again
        </button>
      </div>
    );

  if (!data) return null;

  return (
    <div className="weather-card card-entry">
      <button onClick={() => navigate("/")} className="back-link">
        ← Change City
      </button>
      <div className="weather-header">
        <h2 className="city-name">
          {data.name}, {data.sys.country}
        </h2>
        <p className="weather-description">{data.weather[0].description}</p>
      </div>

      <div className="main-stats">
        <span className="big-temp">{Math.round(data.main.temp)}°</span>
        <div className="feels-tag">
          Feels like {Math.round(data.main.feels_like)}°
        </div>
      </div>

      <div className="details-grid">
        <div
          className="detail-item fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          <span className="stat-icon">💧</span>
          <div className="stat-info">
            <label>Humidity</label>
            <p>{data.main.humidity}%</p>
          </div>
        </div>

        <div
          className="detail-item fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          <span className="stat-icon">💨</span>
          <div className="stat-info">
            <label>Wind</label>
            <p>{data.wind.speed} m/s</p>
          </div>
        </div>

        <div
          className="detail-item fade-in-up"
          style={{ animationDelay: "0.3s" }}
        >
          <span className="stat-icon">👁️</span>
          <div className="stat-info">
            <label>Visibility</label>
            <p>{(data.visibility / 1000).toFixed(1)} km</p>
          </div>
        </div>

        <div
          className="detail-item fade-in-up"
          style={{ animationDelay: "0.4s" }}
        >
          <span className="stat-icon">⏲️</span>
          <div className="stat-info">
            <label>Pressure</label>
            <p>{data.main.pressure} hPa</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AppContent({
  city,
  setCity,
  weatherData,
  setWeatherData,
  error,
  setError,
  marker,
  setMarker,
  globeRef,
}) {
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!city.trim()) return;
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`,
      );
      if (!res.ok) throw new Error();
      const data = await res.json();

      setWeatherData(data);
      setError(false);
      setMarker([{ lat: data.coord.lat, lng: data.coord.lon, size: 20 }]);

      if (globeRef.current) {
        globeRef.current.controls().autoRotate = false;
        globeRef.current.pointOfView(
          { lat: data.coord.lat, lng: data.coord.lon, altitude: 1.2 },
          2000,
        );
      }

      navigate("/weather");
      setCity("");
    } catch {
      setError(true);
      navigate("/weather");
    }
  };

  return (
    <div className="app-container">
      <div className="globe-canvas">
        <Globe
          ref={globeRef}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          atmosphereColor="#10b981"
          atmosphereAltitude={0.15}
          htmlElementsData={marker}
          htmlElement={() => {
            const el = document.createElement("div");
            el.className = "marker-container";
            el.innerHTML = `<div class="marker-ping"></div><div class="marker-dot"></div>`;
            return el;
          }}
        />
      </div>

      <div className="weather-wrapper">
        <Routes>
          <Route
            path="/"
            element={
              <Home city={city} setCity={setCity} onSearch={handleSearch} />
            }
          />
          <Route
            path="/weather"
            element={<WeatherDetails data={weatherData} error={error} />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(false);
  const [marker, setMarker] = useState([]);
  const globeRef = useRef();

  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 0.5;
      globeRef.current.pointOfView({ altitude: 2.5 });
    }
  }, []);

  return (
    <Router>
      <AppContent
        city={city}
        setCity={setCity}
        weatherData={weatherData}
        setWeatherData={setWeatherData}
        error={error}
        setError={setError}
        marker={marker}
        setMarker={setMarker}
        globeRef={globeRef}
      />
    </Router>
  );
}
