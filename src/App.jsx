import { useEffect, useState } from "react";
import { 
  Search,
  Droplets,
  Wind,
  Thermometer,
  Eye,
  LoaderCircle,
  MapPin 
} from "lucide-react";

function App(){
    
  const [city , setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error , setError] = useState("");
  const [loading, setloading] = useState(false);
  const [background, setBackground] = useState("/weather-background.png");
  
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  const getWeatherBackground = () => {
    
    if (!weather || !weather.current?.condition?.text) {
      return "/weather-background.png";
    }

    const condition = weather.current.condition.text.toLowerCase();
    if (condition.includes("partly cloudy")) {
      return "/partly-cloudy-background.png";
    }
    if (condition.includes("rain") || condition.includes("patchy light drizzle")) {
      return "/rain-background.png";
    }
    if (condition.includes("snow")) {
      return "/snow-background.png";
    }
    if (condition.includes("cloudy") || condition.includes("overcast")) {
      return "/cloudy-background.png";
    }
    if (condition.includes("smoky haze") || condition.includes("smog") || condition.includes("fog") || condition.includes("mist")) {
      return "/fog-background.png";
    }
    if (condition.includes("clear")) { 
      return "/clear-background.png";
    }
    if (condition.includes("sunny")) {
      return "/sunny-background.png"
    }
    if (condition.includes("thunder") || condition.includes("storm")) {
      return "/storm-background.png";
    }

    return "/weather-background.png";
  };

  useEffect(() => {
    const newBackground = getWeatherBackground();
    setBackground(newBackground);
  }, [weather]);

  const fetchCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }
    setError("");
    setloading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}`;
          const response = await fetch(url);
          const data = await response.json();
          if (data.error) {
            setError("Location weather not found");
            return;
          }
          setWeather(data);
        } catch (err) {
          setError("Could not fetch location weather");
          console.log(err);
        } finally {
          setloading(false);
        }
      },
      (err) => {
        setError("Location permission denied. Please search manually.");
        setloading(false);
      }
    );
  };

  const handleSearch = async () => {
    if (!city.trim()) {
      return;
    }

    setError("");
    setloading(true);

    try {
      const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}`; // 👈 encodeURIComponent spaces handle karne ke liye
      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
        setError("City not found. Please check the spelling."); // 👈 Meaningful error
        setWeather(null);
        return;
      }

      setWeather(data);
      setCity("");
    } catch (error) {
      setError("Something went wrong. Check your internet connection."); // 👈 Network error message
      setWeather(null);
      console.log(error);
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center p-4"> {/* 👈 Mobile view ke liye padding 'p-4' zaroori thi */}
      <div
        key={background}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500" // 👈 Smooth transition add ki line
        style={{ backgroundImage: `url('${background}')` }}
      ></div>

      <div className="relative z-10 w-full max-w-md rounded-3xl p-6 sm:p-8 bg-white/25 backdrop-blur-2xl border border-white/60 shadow-2xl ring-1 ring-white/20 my-4">
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-800"> Weather App </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-600">Check the weather anywhere in the world</p>
        </div>

        {loading && (
          <p className="mb-3 text-center text-sm font-medium text-slate-600 animate-pulse">
            Loading weather...
          </p>
        )}

        <div className="flex gap-2 sm:gap-3">
          <input 
            type="text"
            placeholder="Search a city or country..."
            value={city}
            onChange={(e) => { 
              setCity(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            className="flex-1 rounded-2xl border border-white/60 bg-white/50 px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-slate-800 outline-none placeholder:text-slate-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
          />
          
          <button 
            onClick={handleSearch}
            disabled={loading}
            className="flex items-center gap-1.5 sm:gap-2 rounded-2xl bg-blue-600 px-4 py-2.5 sm:px-5 sm:py-3 text-sm sm:text-base font-medium text-white shadow-lg transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
  <LoaderCircle
    size={18}
    className="animate-spin"
  />
) : (
  <>
    <Search size={16} />
    <span className="hidden sm:inline">Search</span>
  </>
)}
          </button>
        </div>


        <button 
          onClick={fetchCurrentLocation}
          disabled={loading}
          className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl bg-slate-800/80 px-4 py-2.5 text-sm font-medium text-white shadow-md transition hover:bg-slate-900 disabled:opacity-50"
        >
          <MapPin size={16} /> Use My Current Location
        </button>


        {error && (
          <div className="mt-5 rounded-2xl border border-red-200/60 bg-red-50/60 p-4 text-center shadow-sm">
            <p className="text-sm sm:text-base font-semibold text-red-700">
              ⚠️ {error} 
            </p>
          </div>
        )}

        {weather && (
          <div className="mt-6 sm:mt-8 text-center animate-fade-in">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 leading-tight">
              {weather.location.name}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              {weather.location.country}
            </p>

            <div className="mt-4 sm:mt-6">
              <h3 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-800">
                {weather.current.temp_c}°C
              </h3>

              <img
                src={`https:${weather.current.condition.icon}`}
                alt={weather.current.condition.text}
                className="mx-auto mt-2 h-14 w-14 sm:h-16 sm:w-16"
              />

              <p className="mt-2 text-base sm:text-lg font-medium text-slate-700">
                {weather.current.condition.text}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4">
                <div className="rounded-2xl bg-white/30 p-3 sm:p-4 border border-white/20">
                  <Thermometer size={18} className="mx-auto text-orange-500" />
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">Feels Like</p>
                  <p className="mt-0.5 text-lg sm:text-xl font-semibold text-slate-800">{weather.current.feelslike_c}°C</p>
                </div>

                <div className="rounded-2xl bg-white/30 p-3 sm:p-4 border border-white/20">
                  <Eye size={18} className="mx-auto text-slate-600" />
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">Visibility</p>
                  <p className="mt-0.5 text-lg sm:text-xl font-semibold text-slate-800">{weather.current.vis_km} km</p>
                </div>

                <div className="rounded-2xl bg-white/30 p-3 sm:p-4 border border-white/20">
                  <Droplets size={18} className="mx-auto text-blue-500" /> 
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">Humidity</p>
                  <p className="mt-0.5 text-lg sm:text-xl font-semibold text-slate-800">{weather.current.humidity}%</p>
                </div>

                <div className="rounded-2xl bg-white/30 p-3 sm:p-4 border border-white/20">
                  <Wind size={18} className="mx-auto text-slate-600" />
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">Wind</p>
                  <p className="mt-0.5 text-lg sm:text-xl font-semibold text-slate-800">{weather.current.wind_kph} km/h</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
