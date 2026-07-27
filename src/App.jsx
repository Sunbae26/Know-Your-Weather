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

const languages = [
  { code: "en", name: "English", voiceLang: "en" },
  { code: "ta", name: "தமிழ்", voiceLang: "ta" },
  { code: "hi", name: "हिन्दी", voiceLang: "hi" },
  { code: "fr", name: "Français", voiceLang: "fr" },
  { code: "es", name: "Español", voiceLang: "es" },
  { code: "zh_cn", name: "中文", voiceLang: "zh" },
  { code: "ar", name: "العربية", voiceLang: "ar" },
  { code: "ja", name: "日本語", voiceLang: "ja" },
  { code: "te", name: "తెలుగు", voiceLang: "te" },
  { code: "de", name: "Deutsch", voiceLang: "de" },
  { code: "ko", name: "한국어", voiceLang: "ko" },
  { code: "pt", name: "Português", voiceLang: "pt" },
  { code: "ru", name: "Русский", voiceLang: "ru" },
  { code: "it", name: "Italiano", voiceLang: "it" },
];

const translations = {
  en: {
    changeCity: "← Change City",
    feelsLike: "Feels like",
    humidity: "Humidity",
    wind: "Wind",
    visibility: "Visibility",
    pressure: "Pressure",
    language: "Language",
    errorMessage: "City not found. The Earth is big, try again!",
    tryAgain: "Try Again",
    speakText: (city, temp, desc) =>
      `The weather in ${city} is ${temp} degrees celsius with ${desc}`,
  },
  ta: {
    changeCity: "← நகரத்தை மாற்று",
    feelsLike: "உணர்வு",
    humidity: "ஈரப்பதம்",
    wind: "காற்று",
    visibility: "தெரிவுநிலை",
    pressure: "அழுத்தம்",
    language: "மொழி",
    errorMessage: "நகரம் கிடைக்கவில்லை. மீண்டும் முயற்சிக்கவும்!",
    tryAgain: "மீண்டும் முயற்சி",
    speakText: (city, temp, desc) =>
      `${city} வானிலை ${temp} டிகிரி செல்சியஸ், ${desc}`,
  },
  hi: {
    changeCity: "← शहर बदलें",
    feelsLike: "महसूस",
    humidity: "नमी",
    wind: "हवा",
    visibility: "दृश्यता",
    pressure: "दबाव",
    language: "भाषा",
    errorMessage: "शहर नहीं मिला। पृथ्वी बड़ी है, फिर से कोशिश करें!",
    tryAgain: "पुनः प्रयास करें",
    speakText: (city, temp, desc) =>
      `${city} का मौसम ${temp} डिग्री सेल्सियस है, ${desc}`,
  },
  fr: {
    changeCity: "← Changer de ville",
    feelsLike: "Ressenti",
    humidity: "Humidité",
    wind: "Vent",
    visibility: "Visibilité",
    pressure: "Pression",
    language: "Langue",
    errorMessage: "Ville non trouvée. La Terre est grande, réessayez!",
    tryAgain: "Réessayer",
    speakText: (city, temp, desc) =>
      `La météo à ${city} est de ${temp} degrés celsius avec ${desc}`,
  },
  es: {
    changeCity: "← Cambiar ciudad",
    feelsLike: "Sensación",
    humidity: "Humedad",
    wind: "Viento",
    visibility: "Visibilidad",
    pressure: "Presión",
    language: "Idioma",
    errorMessage: "Ciudad no encontrada. ¡La Tierra es grande, inténtalo de nuevo!",
    tryAgain: "Intentar de nuevo",
    speakText: (city, temp, desc) =>
      `El clima en ${city} es de ${temp} grados celsius con ${desc}`,
  },
  zh_cn: {
    changeCity: "← 更换城市",
    feelsLike: "体感温度",
    humidity: "湿度",
    wind: "风速",
    visibility: "能见度",
    pressure: "气压",
    language: "语言",
    errorMessage: "未找到城市。地球很大，再试一次！",
    tryAgain: "重试",
    speakText: (city, temp, desc) => `${city}的天气是${temp}摄氏度，${desc}`,
  },
  ar: {
    changeCity: "← تغيير المدينة",
    feelsLike: "يشعر وكأنه",
    humidity: "الرطوبة",
    wind: "الرياح",
    visibility: "الرؤية",
    pressure: "الضغط",
    language: "اللغة",
    errorMessage: "المدينة غير موجودة. الأرض كبيرة، حاول مرة أخرى!",
    tryAgain: "حاول مرة أخرى",
    speakText: (city, temp, desc) =>
      `الطقس في ${city} هو ${temp} درجة مئوية مع ${desc}`,
  },
  ja: {
    changeCity: "← 都市を変更",
    feelsLike: "体感温度",
    humidity: "湿度",
    wind: "風速",
    visibility: "視界",
    pressure: "気圧",
    language: "言語",
    errorMessage: "都市が見つかりません。地球は広い、もう一度試してください！",
    tryAgain: "再試行",
    speakText: (city, temp, desc) => `${city}の天気は${temp}度、${desc}です`,
  },
  te: {
    changeCity: "← నగరాన్ని మార్చండి",
    feelsLike: "అనుభూతి",
    humidity: "తేమ",
    wind: "గాలి",
    visibility: "దృశ్యమానత",
    pressure: "ఒత్తిడి",
    language: "భాష",
    errorMessage: "నగరం కనుగొనబడలేదు. భూమి పెద్దది, మళ్ళీ ప్రయత్నించండి!",
    tryAgain: "మళ్ళీ ప్రయత్నించండి",
    speakText: (city, temp, desc) =>
      `${city} వాతావరణం ${temp} డిగ్రీలు సెల్సియస్, ${desc}`,
  },
  de: {
    changeCity: "← Stadt ändern",
    feelsLike: "Gefühlt",
    humidity: "Feuchtigkeit",
    wind: "Wind",
    visibility: "Sichtweite",
    pressure: "Druck",
    language: "Sprache",
    errorMessage: "Stadt nicht gefunden. Die Erde ist groß, versuche es erneut!",
    tryAgain: "Erneut versuchen",
    speakText: (city, temp, desc) =>
      `Das Wetter in ${city} ist ${temp} Grad Celsius mit ${desc}`,
  },
  ko: {
    changeCity: "← 도시 변경",
    feelsLike: "체감 온도",
    humidity: "습도",
    wind: "바람",
    visibility: "가시거리",
    pressure: "기압",
    language: "언어",
    errorMessage: "도시를 찾을 수 없습니다. 지구는 넓으니 다시 시도하세요!",
    tryAgain: "다시 시도",
    speakText: (city, temp, desc) =>
      `${city}의 날씨는 섭씨 ${temp}도이며, ${desc}입니다`,
  },
  pt: {
    changeCity: "← Mudar cidade",
    feelsLike: "Sensação",
    humidity: "Umidade",
    wind: "Vento",
    visibility: "Visibilidade",
    pressure: "Pressão",
    language: "Idioma",
    errorMessage: "Cidade não encontrada. A Terra é grande, tente novamente!",
    tryAgain: "Tentar novamente",
    speakText: (city, temp, desc) =>
      `O clima em ${city} é de ${temp} graus celsius com ${desc}`,
  },
  ru: {
    changeCity: "← Сменить город",
    feelsLike: "Ощущается",
    humidity: "Влажность",
    wind: "Ветер",
    visibility: "Видимость",
    pressure: "Давление",
    language: "Язык",
    errorMessage: "Город не найден. Земля большая, попробуйте снова!",
    tryAgain: "Попробовать снова",
    speakText: (city, temp, desc) =>
      `Погода в ${city} ${temp} градусов цельсия, ${desc}`,
  },
  it: {
    changeCity: "← Cambia città",
    feelsLike: "Percepita",
    humidity: "Umidità",
    wind: "Vento",
    visibility: "Visibilità",
    pressure: "Pressione",
    language: "Lingua",
    errorMessage: "Città non trovata. La Terra è grande, riprova!",
    tryAgain: "Riprova",
    speakText: (city, temp, desc) =>
      `Il meteo a ${city} è di ${temp} gradi celsius con ${desc}`,
  },
};

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

function WeatherDetails({
  data,
  error,
  language,
  onLanguageChange,
  autoSpeaking,
  currentAutoLang,
  onStopAll,
}) {
  const navigate = useNavigate();
  const t = translations[language] || translations.en;
  const [isSpeaking, setIsSpeaking] = useState(false);

  function handleSpeak() {
    if (isSpeaking || autoSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      onStopAll();
      return;
    }

    const city = data.name;
    const temp = Math.round(data.main.temp);
    const desc = data.weather[0].description;
    const text = t.speakText(city, temp, desc);

    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const langObj = languages.find((l) => l.code === language);
    const voiceLang = langObj ? langObj.voiceLang : "en";
    const voices = speechSynthesis.getVoices();
    const matchedVoice = voices.find((v) => v.lang.startsWith(voiceLang));
    if (matchedVoice) utterance.voice = matchedVoice;

    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  }

  useEffect(() => {
    return () => speechSynthesis.cancel();
  }, []);

  if (error)
    return (
      <div className="error-card card-entry">
        <p className="error-message">{t.errorMessage}</p>
        <button onClick={() => navigate("/")} className="back-btn">
          {t.tryAgain}
        </button>
      </div>
    );

  if (!data) return null;

  return (
    <div className="weather-card card-entry">
      <div className="weather-top-bar">
        <button onClick={() => navigate("/")} className="back-link">
          {t.changeCity}
        </button>
        <div className="language-picker">
          <label className="lang-label">{t.language}:</label>
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="language-select"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="weather-header">
        <h2 className="city-name">
          {data.name}, {data.sys.country}
        </h2>
        <p className="weather-description">{data.weather[0].description}</p>
      </div>

      <div className="main-stats">
        <span className="big-temp">{Math.round(data.main.temp)}°</span>
        <div className="feels-tag">
          {t.feelsLike} {Math.round(data.main.feels_like)}°
        </div>
      </div>

      <div className="details-grid">
        <div className="detail-item fade-in-up" style={{ animationDelay: "0.1s" }}>
          <span className="stat-icon">💧</span>
          <div className="stat-info">
            <label>{t.humidity}</label>
            <p>{data.main.humidity}%</p>
          </div>
        </div>
        <div className="detail-item fade-in-up" style={{ animationDelay: "0.2s" }}>
          <span className="stat-icon">💨</span>
          <div className="stat-info">
            <label>{t.wind}</label>
            <p>{data.wind.speed} m/s</p>
          </div>
        </div>
        <div className="detail-item fade-in-up" style={{ animationDelay: "0.3s" }}>
          <span className="stat-icon">👁️</span>
          <div className="stat-info">
            <label>{t.visibility}</label>
            <p>{(data.visibility / 1000).toFixed(1)} km</p>
          </div>
        </div>
        <div className="detail-item fade-in-up" style={{ animationDelay: "0.4s" }}>
          <span className="stat-icon">⏲️</span>
          <div className="stat-info">
            <label>{t.pressure}</label>
            <p>{data.main.pressure} hPa</p>
          </div>
        </div>
      </div>

      {autoSpeaking && (
        <div className="auto-speak-indicator">
          <span className="speak-wave">🔊</span> Speaking in {currentAutoLang}...
        </div>
      )}

      <button onClick={handleSpeak} className="speak-btn">
        {isSpeaking || autoSpeaking ? "⏹ Stop" : "🔊 Speak"}
      </button>
    </div>
  );
}

function AppContent({
  city,
  setCity,
  language,
  setLanguage,
  weatherData,
  setWeatherData,
  error,
  setError,
  marker,
  setMarker,
  globeRef,
  autoSpeaking,
  setAutoSpeaking,
  currentAutoLang,
  setCurrentAutoLang,
}) {
  const navigate = useNavigate();
  const lastSearchedCity = useRef("");

  const fetchWeather = async (cityName, lang) => {
    if (!cityName.trim()) return null;
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&lang=${lang}&appid=${API_KEY}`
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
          2000
        );
      }
      return data;
    } catch {
      setError(true);
      return null;
    }
  };

  // Chain speak: speak one language, when it ends speak the next
  function speakChain(langList, index, city, temp, desc) {
    if (index >= langList.length) {
      setAutoSpeaking(false);
      setCurrentAutoLang("");
      return;
    }

    const lang = langList[index];
    const langTranslation = translations[lang.code];
    const text = langTranslation.speakText(city, temp, desc);

    setCurrentAutoLang(lang.label);

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = speechSynthesis.getVoices();
    const matched = voices.find((v) => v.lang.startsWith(lang.voiceLang));
    if (matched) utterance.voice = matched;

    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onend = () => {
      // Speak next language after a short pause
      setTimeout(() => {
        speakChain(langList, index + 1, city, temp, desc);
      }, 500);
    };

    utterance.onerror = () => {
      // Skip to next on error
      setTimeout(() => {
        speakChain(langList, index + 1, city, temp, desc);
      }, 500);
    };

    speechSynthesis.speak(utterance);
  }

  function startAutoSpeak(data) {
    const city = data.name;
    const temp = Math.round(data.main.temp);
    const desc = data.weather[0].description;

    const autoLangs = [
      { code: "en", voiceLang: "en", label: "English" },
      { code: "hi", voiceLang: "hi", label: "Hindi" },
      { code: "ta", voiceLang: "ta", label: "Tamil" },
    ];

    // Make sure voices are loaded by speaking a silent utterance first
    const silence = new SpeechSynthesisUtterance("");
    silence.volume = 0;
    silence.onend = () => {
      // Now voices are guaranteed loaded, start the real chain
      setAutoSpeaking(true);
      speakChain(autoLangs, 0, city, temp, desc);
    };
    speechSynthesis.speak(silence);
  }

  const handleSearch = async () => {
    if (!city.trim()) return;
    lastSearchedCity.current = city;
    speechSynthesis.cancel();

    const data = await fetchWeather(city, language);

    if (data) {
      // Start auto-speak within user click context
      startAutoSpeak(data);
    }

    navigate("/weather");
    setCity("");
  };

  const handleLanguageChange = async (newLang) => {
    setLanguage(newLang);
    speechSynthesis.cancel();
    setAutoSpeaking(false);
    setCurrentAutoLang("");
    if (lastSearchedCity.current || (weatherData && weatherData.name)) {
      const cityToFetch = lastSearchedCity.current || weatherData.name;
      await fetchWeather(cityToFetch, newLang);
    }
  };

  const handleStopAll = () => {
    speechSynthesis.cancel();
    setAutoSpeaking(false);
    setCurrentAutoLang("");
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
            element={
              <WeatherDetails
                data={weatherData}
                error={error}
                language={language}
                onLanguageChange={handleLanguageChange}
                autoSpeaking={autoSpeaking}
                currentAutoLang={currentAutoLang}
                onStopAll={handleStopAll}
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  const [city, setCity] = useState("");
  const [language, setLanguage] = useState("en");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(false);
  const [marker, setMarker] = useState([]);
  const [autoSpeaking, setAutoSpeaking] = useState(false);
  const [currentAutoLang, setCurrentAutoLang] = useState("");
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
        language={language}
        setLanguage={setLanguage}
        weatherData={weatherData}
        setWeatherData={setWeatherData}
        error={error}
        setError={setError}
        marker={marker}
        setMarker={setMarker}
        globeRef={globeRef}
        autoSpeaking={autoSpeaking}
        setAutoSpeaking={setAutoSpeaking}
        currentAutoLang={currentAutoLang}
        setCurrentAutoLang={setCurrentAutoLang}
      />
    </Router>
  );
}