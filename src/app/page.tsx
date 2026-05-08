"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plane,
    Hotel,
    Utensils,
    MapPin,
    Search,
    Compass,
    Wind,
    Coffee,
    ArrowRight,
    TrendingUp,
    Star
} from "lucide-react";
import {
    MOCK_FLIGHTS,
    MOCK_ITINERARIES,
    MOCK_STAYS,
    MOCK_EATS,
    type FlightRecommendation,
    type Recommendation,
    type ItineraryDay
} from "@/lib/mock-data";

import { TRANSLATIONS, Language } from "@/lib/translations";
import { calculateTotal, formatCurrency } from "@/lib/calculations";
import { useRouter } from "next/navigation";

export default function Home() {
    const [destination, setDestination] = useState("");
    const [category, setCategory] = useState<"adventure" | "experience" | "chill">("experience");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [budget, setBudget] = useState<"low" | "mid" | "high">("mid");
    const [lang, setLang] = useState<Language>("en");

    const [showResults, setShowResults] = useState(false);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<{
        itinerary: any[];
        flights: any[];
        stays: any[];
        eats: any[];
        summary: string;
    } | null>(null);

    const [selectedItems, setSelectedItems] = useState<{
        flight?: any;
        stay?: any;
        eats: any[];
    }>({ eats: [] });

    const t = TRANSLATIONS[lang];

    const router = useRouter();

    const toggleItem = (item: any, type: 'flight' | 'stay' | 'eat') => {
        setSelectedItems(prev => {
            if (type === 'flight') return { ...prev, flight: prev.flight?.id === item.id ? null : item };
            if (type === 'stay') return { ...prev, stay: prev.stay?.id === item.id ? null : item };
            const exists = prev.eats.find(e => e.id === item.id);
            return {
                ...prev,
                eats: exists ? prev.eats.filter(e => e.id !== item.id) : [...prev.eats, item]
            };
        });
    };

    const generateItinerary = () => {
        const data = {
            destination,
            category,
            startDate,
            endDate,
            budget,
            lang,
            selectedItems,
            fullResults: results
        };
        localStorage.setItem('orbit-itinerary', JSON.stringify(data));
        router.push('/itinerary');
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (destination) {
            setLoading(true);
            try {
                const response = await fetch('/api/plan', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ destination, category, startDate, endDate, budget }),
                });
                const data = await response.json();
                setResults(data);
                setShowResults(true);
            } catch (error) {
                console.error("Failed to fetch plan:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <main className="min-h-screen pb-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-background to-background">
            {/* Navbar */}
            <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
                <div className="text-2xl font-bold tracking-tighter flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <Compass className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-gradient">orbitAI</span>
                </div>
                <div className="flex gap-4">
                    <select
                        value={lang}
                        onChange={(e) => setLang(e.target.value as Language)}
                        className="bg-transparent border-none outline-none text-sm glass px-3 py-1 rounded-full"
                    >
                        <option value="en">EN</option>
                        <option value="es">ES</option>
                    </select>
                    <button className="px-4 py-2 rounded-full glass hover:bg-white/10 transition-all text-sm">
                        Login
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="px-6 py-20 text-center max-w-5xl mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-8xl font-bold tracking-tight mb-6"
                >
                    {t.title.split('Thought')[0]}<span className="text-gradient">Thought</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-lg text-gray-400 mb-12"
                >
                    {t.subtitle}
                </motion.p>

                {/* Enhanced Search Bar */}
                <motion.form
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    onSubmit={handleSearch}
                    className="max-w-4xl mx-auto p-4 glass-card space-y-4"
                >
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-white/5 rounded-2xl">
                            <MapPin className="text-primary w-5 h-5 flex-shrink-0" />
                            <input
                                type="text"
                                placeholder={t.destinationPlaceholder}
                                className="bg-transparent border-none outline-none w-full text-foreground placeholder:text-gray-500"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="glass px-4 py-2 rounded-2xl text-xs outline-none"
                            />
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="glass px-4 py-2 rounded-2xl text-xs outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex gap-2">
                            {(['adventure', 'experience', 'chill'] as const).map((cat) => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setCategory(cat)}
                                    className={`px-4 py-2 rounded-2xl text-sm capitalize transition-all ${category === cat ? 'bg-primary text-white' : 'hover:bg-white/5'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-3 glass px-4 py-2 rounded-2xl">
                            <span className="text-xs text-gray-400 uppercase tracking-widest">{t.budget}</span>
                            <div className="flex gap-1">
                                {(['low', 'mid', 'high'] as const).map((b) => (
                                    <button
                                        key={b}
                                        type="button"
                                        onClick={() => setBudget(b)}
                                        className={`px-3 py-1 rounded-xl text-xs transition-all ${budget === b ? 'bg-accent text-white' : 'text-gray-500'}`}
                                    >
                                        {t[b]}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 h-12 bg-primary rounded-2xl font-bold hover:bg-primary/80 transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Search className="w-5 h-5" />}
                            {t.searchButton}
                        </button>
                    </div>
                </motion.form>
            </section>

            {/* Results Section */}
            <AnimatePresence>
                {showResults && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-7xl mx-auto px-6 space-y-12"
                    >
                        {/* Summary Banner */}
                        {results?.summary && (
                            <div className="glass-card p-6 bg-primary/5 border-primary/20">
                                <p className="text-primary italic animate-pulse-slow">
                                    {results.summary}
                                </p>
                            </div>
                        )}
                        {/* Itinerary */}
                        <section>
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <Wind className="text-primary" /> {t.itinerary} ({category})
                            </h2>
                            <div className="grid md:grid-cols-1 gap-6">
                                {results?.itinerary.map((day: any) => (
                                    <div key={day.day} className="glass-card p-6 overflow-hidden relative">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -z-10" />
                                        <h3 className="text-xl font-bold mb-6">Day {day.day}: Exploration</h3>
                                        <div className="space-y-6">
                                            {day.activities.map((act: any, idx: number) => (
                                                <div key={idx} className="flex gap-4 relative">
                                                    <div className="flex flex-col items-center">
                                                        <div className="w-3 h-3 rounded-full bg-primary mt-1" />
                                                        {idx !== day.activities.length - 1 && <div className="w-0.5 h-full bg-white/10 mt-2" />}
                                                    </div>
                                                    <div>
                                                        <span className="text-xs font-mono text-primary uppercase tracking-widest">{act.time}</span>
                                                        <h4 className="font-semibold text-lg">{act.activity}</h4>
                                                        <p className="text-sm text-gray-400 flex items-center gap-1">
                                                            <MapPin className="w-3 h-3" /> {act.location}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Flights and Stays */}
                        <section className="grid lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <Plane className="text-secondary" /> {t.flights}
                                </h2>
                                <div className="space-y-4">
                                    {results?.flights.map((flight: any) => (
                                        <div key={flight.id} className={`glass flex items-center justify-between p-6 rounded-3xl transition-all ${selectedItems.flight?.id === flight.id ? 'border-primary bg-primary/10' : ''}`}>
                                            <div className="flex items-center gap-4">
                                                <Plane className="w-6 h-6 text-secondary" />
                                                <div>
                                                    <p className="font-bold">{flight.airline}</p>
                                                    <p className="text-sm text-gray-400">{flight.duration} • {flight.stops === 0 ? 'Direct' : `${flight.stops} Stop`}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-bold text-gradient">${flight.price}</p>
                                                <button
                                                    onClick={() => toggleItem(flight, 'flight')}
                                                    className={`px-4 py-1 rounded-full text-sm transition-all ${selectedItems.flight?.id === flight.id ? 'bg-primary text-white' : 'glass hover:bg-white/10'}`}
                                                >
                                                    {selectedItems.flight?.id === flight.id ? t.booked : t.book}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <Hotel className="text-accent" /> {t.stays}
                                </h2>
                                <div className="space-y-4">
                                    {results?.stays.map((stay: any) => (
                                        <div key={stay.id} className={`glass-card overflow-hidden transition-all ${selectedItems.stay?.id === stay.id ? 'border-accent bg-accent/10' : ''}`}>
                                            <div className="h-24 w-full relative">
                                                <img src={stay.image} alt={stay.name} className="w-full h-full object-cover" />
                                                <div className="absolute top-2 right-2 px-2 py-1 glass rounded-lg text-[10px] font-bold">⭐ {stay.rating.toFixed(1)}</div>
                                            </div>
                                            <div className="p-4">
                                                <h4 className="font-bold text-sm">{stay.name}</h4>
                                                <div className="flex justify-between items-center mt-2">
                                                    <div className="flex text-accent text-xs">{"$".repeat(stay.priceLevel)}</div>
                                                    <button
                                                        onClick={() => toggleItem(stay, 'stay')}
                                                        className={`px-3 py-1 rounded-full text-[10px] ${selectedItems.stay?.id === stay.id ? 'bg-accent text-white' : 'glass'}`}
                                                    >
                                                        {selectedItems.stay?.id === stay.id ? t.booked : t.book}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Culinary */}
                        <section>
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <Utensils className="text-indigo-400" /> {t.eats}
                            </h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {results?.eats.map((eat: any) => {
                                    const isSelected = selectedItems.eats.find(e => e.id === eat.id);
                                    return (
                                        <div key={eat.id} className={`glass flex gap-4 p-4 rounded-3xl transition-all ${isSelected ? 'border-primary bg-primary/10' : ''}`}>
                                            <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                                                <img src={eat.image} alt={eat.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-sm">{eat.name}</h4>
                                                <div className="flex gap-1 mb-2">
                                                    {[...Array(3)].map((_, i) => (
                                                        <span key={i} className={`text-xs ${i < eat.priceLevel ? 'text-primary' : 'text-gray-600'}`}>$</span>
                                                    ))}
                                                </div>
                                                <button
                                                    onClick={() => toggleItem(eat, 'eat')}
                                                    className={`w-full py-1 rounded-xl text-[10px] ${isSelected ? 'bg-primary text-white' : 'glass'}`}
                                                >
                                                    {isSelected ? t.booked : t.book}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        {/* Travel Card Generator */}
                        {(selectedItems.flight || selectedItems.stay || selectedItems.eats.length > 0) && (
                            <section className="py-20 border-t border-white/10">
                                <div className="max-w-2xl mx-auto glass-card p-12 text-center relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-accent to-secondary" />
                                    <Compass className="w-12 h-12 text-primary mx-auto mb-6" />
                                    <h2 className="text-3xl font-bold mb-4">{t.travelCardTitle}</h2>
                                    <p className="text-gray-400 mb-8">{destination} • {startDate} - {endDate}</p>

                                    <div className="space-y-4 text-left mb-10">
                                        {selectedItems.flight && (
                                            <div className="flex justify-between items-center glass p-4 rounded-2xl">
                                                <span>✈️ {selectedItems.flight.airline}</span>
                                                <span className="font-bold">${selectedItems.flight.price}</span>
                                            </div>
                                        )}
                                        {selectedItems.stay && (
                                            <div className="flex justify-between items-center glass p-4 rounded-2xl">
                                                <span>🏨 {selectedItems.stay.name}</span>
                                                <span className="font-bold">${selectedItems.stay.priceLevel * 150} approx</span>
                                            </div>
                                        )}
                                        {selectedItems.eats.length > 0 && (
                                            <div className="flex justify-between items-center glass p-4 rounded-2xl">
                                                <span>🍽️ {selectedItems.eats.length} {t.eats} spots</span>
                                                <span className="font-bold">${selectedItems.eats.reduce((acc, curr) => acc + (curr.priceLevel * 40), 0)} est.</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col items-center gap-4">
                                        <div className="text-sm text-gray-500 uppercase tracking-widest">{t.total}</div>
                                        <div className="text-5xl font-bold text-gradient">
                                            {formatCurrency(calculateTotal(selectedItems), lang)}
                                        </div>
                                        <button
                                            onClick={generateItinerary}
                                            className="mt-6 px-12 py-4 bg-primary rounded-full font-bold hover:scale-105 transition-transform shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                                        >
                                            {t.checkout}
                                        </button>
                                    </div>
                                </div>
                            </section>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {!showResults && (
                <section className="max-w-7xl mx-auto px-6 mt-12 grid md:grid-cols-3 gap-6">
                    {[
                        { icon: Plane, label: "Smart Routing", color: "text-secondary" },
                        { icon: Hotel, label: "Curated Stays", color: "text-accent" },
                        { icon: Coffee, label: "Local Flavor", color: "text-primary" }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + i * 0.1 }}
                            className="glass-card p-8 flex flex-col items-center text-center gap-4"
                        >
                            <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${item.color}`}>
                                <item.icon className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-lg">{item.label}</h3>
                            <p className="text-sm text-gray-400">Our AI engine compares millions of combinations to find your perfect fit.</p>
                        </motion.div>
                    ))}
                </section>
            )}
        </main>
    );
}
