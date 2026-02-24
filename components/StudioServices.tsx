"use client";

import { useState, useEffect } from "react";
import { CloudSun, MessageCircle, ChevronDown, Wind, Car, Mic, Sun, Cloud, CloudRain, CloudLightning, CloudSnow, Moon, CloudMoon } from "lucide-react";

// Types
type ViewType = 'METEO' | 'AIR' | 'TRAFIC';
type City = 'Troyes (Centre)' | 'Campus (Lombards)' | 'Sainte-Savine' | 'TCM';

const CITIES: City[] = ['Troyes (Centre)', 'Campus (Lombards)', 'Sainte-Savine', 'TCM'];

// 1. Configuration des Coordonnées
const CITY_COORDS: Record<City, { lat: number; lon: number }> = {
    'Troyes (Centre)': { lat: 48.2973, lon: 4.0744 },
    'Campus (Lombards)': { lat: 48.2838, lon: 4.0811 },
    'Sainte-Savine': { lat: 48.2933, lon: 4.0536 },
    'TCM': { lat: 48.2973, lon: 4.0744 },
};

// Traffic Data (Simulated as no free API exists for precise local traffic)
const TRAFFIC_DATA: Record<City, { axe: string; status: string; color: string }[]> = {
    'Troyes (Centre)': [{ axe: 'Bouchon de Champagne', status: 'Chargé', color: 'text-orange-500' }, { axe: 'Rocade', status: 'Fluide', color: 'text-green-500' }],
    'Campus (Lombards)': [{ axe: 'Rue de Québec', status: 'Fluide', color: 'text-green-500' }],
    'Sainte-Savine': [{ axe: 'Avenue Gallieni', status: 'Ralenti', color: 'text-orange-500' }],
    'TCM': [{ axe: 'Rocade Ouest', status: 'Fluide', color: 'text-green-500' }, { axe: 'A26 vers Paris', status: 'Fluide', color: 'text-green-500' }],
};

interface WeatherData {
    temp: number;
    weatherCode: number;
    isDay: number;
    airIndex: number;
}

export default function StudioServices() {
    const [activeTab, setActiveTab] = useState<ViewType>('METEO');
    const [selectedCity, setSelectedCity] = useState<City>('Troyes (Centre)');
    const [isPaused, setIsPaused] = useState(false);

    // Data State
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);

    // 2. Data Fetching
    useEffect(() => {
        const fetchCityData = async () => {
            setLoading(true);
            const { lat, lon } = CITY_COORDS[selectedCity];

            try {
                // Parallel Fetching
                const [weatherRes, airRes] = await Promise.all([
                    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,is_day&timezone=Europe%2FParis`),
                    fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=european_aqi&timezone=Europe%2FParis`)
                ]);

                const weatherJson = await weatherRes.json();
                const airJson = await airRes.json();

                setWeatherData({
                    temp: Math.round(weatherJson.current.temperature_2m),
                    weatherCode: weatherJson.current.weather_code,
                    isDay: weatherJson.current.is_day,
                    airIndex: airJson.current.european_aqi
                });
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCityData();
    }, [selectedCity]);

    // Auto-play
    useEffect(() => {
        if (isPaused) return;

        const timer = setInterval(() => {
            setActiveTab((prev) => {
                if (prev === 'METEO') return 'AIR';
                if (prev === 'AIR') return 'TRAFIC';
                return 'METEO';
            });
        }, 5000);

        return () => clearInterval(timer);
    }, [isPaused]);

    // 3. WMO Code to Icon Mapper
    const getWeatherIcon = (code: number, isDay: number) => {
        const props = { className: "w-12 h-12 text-yellow-400 drop-shadow-lg" };

        if (code === 0) return isDay ? <Sun {...props} /> : <Moon {...props} className="text-blue-200" />;
        if (code >= 1 && code <= 3) return isDay ? <CloudSun {...props} /> : <CloudMoon {...props} className="text-blue-200" />;
        if (code >= 45 && code <= 48) return <Wind {...props} className="text-gray-300" />;
        if (code >= 51 && code <= 67) return <CloudRain {...props} className="text-blue-400" />;
        if (code >= 71 && code <= 77) return <CloudSnow {...props} className="text-white" />;
        if (code >= 95) return <CloudLightning {...props} className="text-purple-400" />;

        return <Cloud {...props} />;
    };

    const getWeatherLabel = (code: number) => {
        if (code === 0) return "Ensoleillé";
        if (code >= 1 && code <= 3) return "Nuageux";
        if (code >= 45 && code <= 48) return "Brume";
        if (code >= 51 && code <= 67) return "Pluie";
        if (code >= 71 && code <= 77) return "Neige";
        if (code >= 95) return "Orage";
        return "Variable";
    };

    const getAirLabel = (index: number) => {
        if (index <= 20) return 'Bon';
        if (index <= 40) return 'Correct';
        if (index <= 60) return 'Moyen';
        if (index <= 80) return 'Médiocre';
        return 'Mauvais';
    };

    const getAirColor = (index: number) => {
        if (index <= 20) return 'bg-green-500';
        if (index <= 40) return 'bg-lime-500';
        if (index <= 60) return 'bg-yellow-500';
        if (index <= 80) return 'bg-orange-500';
        return 'bg-red-500';
    };

    const renderCarouselContent = () => {
        if (loading || !weatherData) {
            return (
                <div className="flex flex-col h-full justify-center items-center gap-2 animate-pulse">
                    <div className="h-8 w-24 bg-white/10 rounded-lg" />
                    <div className="h-4 w-32 bg-white/5 rounded-lg" />
                </div>
            );
        }

        switch (activeTab) {
            case 'METEO':
                return (
                    <div className="flex flex-col h-full animate-fadeIn justify-center px-4">
                        <div className="flex items-center justify-between w-full">
                            <div className="flex flex-col">
                                <span className="text-5xl font-black text-white tracking-tighter">{weatherData.temp}°</span>
                                <span className="text-white/60 text-sm font-medium">{getWeatherLabel(weatherData.weatherCode)}</span>
                            </div>
                            <div className="transform scale-110">
                                {getWeatherIcon(weatherData.weatherCode, weatherData.isDay)}
                            </div>
                        </div>
                    </div>
                );

            case 'AIR':
                return (
                    <div className="flex flex-col h-full animate-fadeIn justify-center items-center gap-3">
                        <div className="flex items-center gap-2 text-blue-300">
                            <Wind className="w-5 h-5" />
                            <span className="font-bold text-sm uppercase tracking-wider">Qualité de l'Air</span>
                        </div>
                        <div className={`px-6 py-2 rounded-full text-white font-bold text-sm shadow-lg ${getAirColor(weatherData.airIndex)}`}>
                            Indice {weatherData.airIndex} - {getAirLabel(weatherData.airIndex)}
                        </div>
                    </div>
                );

            case 'TRAFIC':
                return (
                    <div className="flex flex-col h-full animate-fadeIn justify-center gap-3 px-4">
                        <div className="flex items-center gap-2 text-orange-300 mb-1">
                            <Car className="w-4 h-4" />
                            <span className="font-bold text-xs uppercase tracking-wider">Info Route</span>
                        </div>
                        <div className="space-y-2">
                            {TRAFFIC_DATA[selectedCity].map((t, i) => (
                                <div key={i} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2 border border-white/5">
                                    <span className="text-white text-xs font-bold">{t.axe}</span>
                                    <span className={`text-xs font-bold ${t.color}`}>{t.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="flex flex-col gap-4 h-full">

            {/* ZONE 1: INFO CAROUSEL (40%) */}
            <div
                className="h-[40%] bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-white/10 shadow-xl p-4 relative overflow-hidden group flex flex-col"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {/* City Selector Header (Top Left) */}
                <div className="relative z-20 flex justify-start mb-2">
                    <div className="relative group cursor-pointer inline-flex items-center gap-1.5 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full transition-colors border border-white/5">
                        <span className="text-white font-bold text-xs uppercase tracking-wide">{selectedCity}</span>
                        <ChevronDown className="w-3 h-3 text-white/50 group-hover:text-white transition-colors" />
                        <select
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value as City)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        >
                            {CITIES.map((city) => (
                                <option key={city} value={city} className="text-black">
                                    {city}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Carousel Content */}
                <div className="flex-1 relative">
                    {renderCarouselContent()}
                </div>

                {/* Dots (Bottom Center) */}
                <div className="flex justify-center gap-1.5 mt-auto pt-2">
                    {(['METEO', 'AIR', 'TRAFIC'] as ViewType[]).map((view) => (
                        <button
                            key={view}
                            onClick={() => setActiveTab(view)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${activeTab === view ? 'bg-oxy-orange w-6' : 'bg-white/20 w-1.5 hover:bg-white/40'}`}
                            aria-label={`Voir ${view}`}
                        />
                    ))}
                </div>
            </div>

            {/* ZONE 2: SUPER CONTACT (60%) */}
            <div className="h-[60%] bg-gradient-to-br from-slate-900 to-slate-950 backdrop-blur-xl rounded-3xl border border-white/10 shadow-xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                {/* Subtle Green Glow */}
                <div className="absolute inset-0 bg-green-900/10 opacity-50 pointer-events-none" />
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#25D366]/20 rounded-full blur-[60px] pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center w-full h-full justify-between py-2">

                    <div className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center shadow-inner border border-white/5 group-hover:scale-110 transition-transform duration-300">
                            <Mic className="w-7 h-7 text-[#25D366]" />
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-white leading-none tracking-tight">Direct Studio</h3>
                            <p className="text-slate-300 text-xs leading-relaxed max-w-[220px] mx-auto font-medium">
                                Contactez votre radio préférée pour une dédicace, une info route ou juste pour dire bonjour !
                            </p>
                        </div>
                    </div>

                    <a
                        href="https://wa.me/33600000000" // Replace with actual number
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] shadow-lg shadow-[#25D366]/20 group/btn mt-2"
                    >
                        <MessageCircle className="w-6 h-6 fill-current" />
                        <span className="font-extrabold text-base tracking-wide">ENVOYER UN MESSAGE</span>
                    </a>
                </div>
            </div>

        </div>
    );
}
