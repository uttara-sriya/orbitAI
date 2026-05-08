"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import SafeImage from "@/components/SafeImage";
import { useRouter } from "next/navigation";
import {
    Plane, Hotel, Utensils, MapPin, Search, Compass,
    Wind, Coffee, ArrowRight, TrendingUp, Star
} from "lucide-react";
import { TRANSLATIONS, Language } from "@/lib/translations";
import { calculateTotal, formatCurrency } from "@/lib/calculations";

// --- Types ---
interface TravelItem {
    id: string;
    name: string;
    price: number;
    priceLevel: number;
    image: string;
    description: string;
    rating: number;
    tags: string[];
}

export default function Home() {
    const router = useRouter();
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

    // Fix Hydration Mismatch
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const t = TRANSLATIONS[lang];

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

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        const sanitizedDest = destination.trim().replace(/[<>]/g, ""); // Basic security sanitization
        if (sanitizedDest) {
            setLoading(true);
            try {
                const response = await fetch('/api/plan', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ destination: sanitizedDest, category, startDate, endDate, budget }),
                });
                const data = await response.json();
                setResults(data);
                setShowResults(true);
                // Scroll to results
                setTimeout(() => window.scrollTo({ top: window.innerHeight * 0.8, behavior: 'smooth' }), 100);
            } catch (error) {
                console.error("Failed to fetch plan:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    const generateItinerary = () => {
        const data = {
            destination, category, startDate, endDate, budget, lang,
            selectedItems, fullResults: results
        };
        localStorage.setItem('orbit-itinerary', JSON.stringify(data));
        router.push('/itinerary');
    };

    const totalCost = useMemo(() => calculateTotal(selectedItems), [selectedItems]);

    return (
        <main id="main-content" className="min-h-screen pb-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-background to-background" role="main">
            {/* Accessibility Live Announcements */}
            <div className="sr-only" aria-live="polite" aria-atomic="true">
                {loading ? "Searching for travel plans..." : showResults ? `Found travel plans for ${destination}` : ""}
            </div>
            {/* Navigation */}
            <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto" aria-label="Global navigation">
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
                        className="bg-transparent border-none outline-none text-sm glass px-3 py-1 rounded-full cursor-pointer focus:ring-2 focus:ring-primary"
                        aria-label="Select Language"
                    >
                        <option value="en" className="bg-background">EN</option>
                        <option value="es" className="bg-background">ES</option>
                    </select>
                    <button className="px-4 py-2 rounded-full glass hover:bg-white/10 transition-all text-sm focus:ring-2 focus:ring-primary">
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
                    aria-label="Travel Plan Search"
                >
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-white/5 rounded-2xl focus-within:ring-2 focus-within:ring-primary transition-all">
                            <MapPin className="text-primary w-5 h-5 flex-shrink-0" />
                            <input
                                type="text"
                                placeholder={t.destinationPlaceholder}
                                className="bg-transparent border-none outline-none w-full text-foreground placeholder:text-gray-500"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                required
                                aria-label="Destination"
                            />
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="glass px-4 py-2 rounded-2xl text-xs outline-none focus:ring-2 focus:ring-primary"
                                aria-label="Trip Start Date"
                            />
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="glass px-4 py-2 rounded-2xl text-xs outline-none focus:ring-2 focus:ring-primary"
                                aria-label="Trip End Date"
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex gap-2" role="group" aria-label="Trip Category Selection">
                            {(['adventure', 'experience', 'chill'] as const).map((cat) => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setCategory(cat)}
                                    className={`px-4 py-2 rounded-2xl text-sm capitalize transition-all ${category === cat ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:bg-white/5'}`}
                                    aria-pressed={category === cat}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-3 glass px-4 py-2 rounded-2xl" role="group" aria-label="Budget Selection">
                            <span className="text-xs text-gray-400 uppercase tracking-widest">{t.budget}</span>
                            <div className="flex gap-1">
                                {(['low', 'mid', 'high'] as const).map((b) => (
                                    <button
                                        key={b}
                                        type="button"
                                        onClick={() => setBudget(b)}
                                        className={`px-3 py-1 rounded-xl text-xs transition-all ${budget === b ? 'bg-accent text-white' : 'text-gray-500'}`}
                                        aria-pressed={budget === b}
                                    >
                                        {t[b]}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 h-12 bg-primary rounded-2xl font-bold hover:bg-primary/80 transition-all disabled:opacity-50 flex items-center gap-2 focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-xl shadow-primary/20"
                            aria-label="Generate Travel Plan"
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
                        exit={{ opacity: 0, y: 40 }}
                        className="max-w-7xl mx-auto px-6 space-y-12"
                        id="results-section"
                    >
                        {/* Summary Banner */}
                        {results?.summary && (
                            <div className="glass-card p-6 bg-primary/5 border-primary/20" role="alert">
                                <p className="text-primary italic animate-pulse-slow">
                                    {results.summary}
                                </p>
                            </div>
                        )}

                        {/* Recommendation Grid */}
                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Itinerary */}
                            <section className="lg:col-span-1 space-y-6">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <Wind className="text-primary" /> {t.itinerary}
                                </h2>
                                <div className="space-y-4">
                                    {results?.itinerary.map((day: any) => (
                                        <div key={day.day} className="glass-card p-6 relative">
                                            <h3 className="font-bold mb-4">Day {day.day}</h3>
                                            <div className="space-y-4">
                                                {day.activities.slice(0, 2).map((act: any, idx: number) => (
                                                    <div key={idx} className="flex gap-3 text-sm">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                                                        <div>
                                                            <p className="font-semibold">{act.activity}</p>
                                                            <p className="text-gray-400 text-xs">{act.location}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Flights & Stays */}
                            <div className="lg:col-span-2 space-y-12">
                                <section>
                                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                        <Plane className="text-secondary" /> {t.flights}
                                    </h2>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {results?.flights.map((flight: any) => (
                                            <div
                                                key={flight.id}
                                                className={`glass p-6 rounded-3xl cursor-pointer transition-all ${selectedItems.flight?.id === flight.id ? 'ring-2 ring-primary bg-primary/10' : 'hover:bg-white/5'}`}
                                                onClick={() => toggleItem(flight, 'flight')}
                                                role="button"
                                                aria-pressed={selectedItems.flight?.id === flight.id}
                                            >
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <p className="font-bold">{flight.airline}</p>
                                                        <p className="text-xs text-gray-400">{flight.duration}</p>
                                                    </div>
                                                    <p className="text-xl font-bold">${flight.price}</p>
                                                </div>
                                                <button className={`w-full py-2 rounded-xl text-xs ${selectedItems.flight?.id === flight.id ? 'bg-primary text-white' : 'glass'}`}>
                                                    {selectedItems.flight?.id === flight.id ? t.booked : t.book}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                        <Hotel className="text-accent" /> {t.stays}
                                    </h2>
                                    <div className="grid md:grid-cols-3 gap-4">
                                        {results?.stays.map((stay: any) => (
                                            <div
                                                key={stay.id}
                                                className={`glass-card overflow-hidden cursor-pointer transition-all ${selectedItems.stay?.id === stay.id ? 'ring-2 ring-accent bg-accent/10' : 'hover:bg-white/5'}`}
                                                onClick={() => toggleItem(stay, 'stay')}
                                                role="button"
                                                aria-pressed={selectedItems.stay?.id === stay.id}
                                            >
                                                <div className="h-24 w-full relative">
                                                    <SafeImage src={stay.image} alt={stay.name} fill className="object-cover" sizes="200px" />
                                                </div>
                                                <div className="p-4">
                                                    <p className="font-bold text-xs truncate">{stay.name}</p>
                                                    <div className="flex justify-between items-center mt-2">
                                                        <span className="text-xs text-accent">{"$".repeat(stay.priceLevel)}</span>
                                                        <span className="text-[10px] text-gray-400">⭐ {stay.rating.toFixed(1)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>
                        </div>

                        {/* Travel Card */}
                        {(selectedItems.flight || selectedItems.stay || selectedItems.eats.length > 0) && (
                            <section className="py-20 border-t border-white/10">
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="max-w-2xl mx-auto glass-card p-12 text-center shadow-2xl shadow-primary/20"
                                >
                                    <Compass className="w-12 h-12 text-primary mx-auto mb-6" />
                                    <h2 className="text-3xl font-bold mb-2">{t.travelCardTitle}</h2>
                                    <p className="text-gray-400 mb-8">{destination} • {startDate} - {endDate}</p>

                                    <div className="text-5xl font-bold text-gradient mb-8">
                                        {formatCurrency(totalCost, lang)}
                                    </div>

                                    <button
                                        onClick={generateItinerary}
                                        className="px-12 py-4 bg-primary rounded-full font-bold hover:scale-105 transition-transform shadow-xl shadow-primary/20 focus:ring-2 focus:ring-primary focus:ring-offset-4 focus:ring-offset-background"
                                    >
                                        {t.checkout}
                                    </button>
                                </motion.div>
                            </section>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {!showResults && (
                <section className="max-w-7xl mx-auto px-6 mt-12 grid md:grid-cols-3 gap-6">
                    {[
                        { icon: Plane, label: "Smart Routing", desc: "AI-optimized flight paths.", color: "text-secondary" },
                        { icon: Hotel, label: "Curated Stays", desc: "Handpicked premium hotels.", color: "text-accent" },
                        { icon: Utensils, label: "Local Flavor", desc: "Authentic culinary spots.", color: "text-primary" }
                    ].map((item, i) => (
                        <div key={i} className="glass-card p-8 flex flex-col items-center gap-4 hover:bg-white/10 transition-all group">
                            <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                                <item.icon className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-lg">{item.label}</h3>
                            <p className="text-sm text-gray-400 text-center">{item.desc}</p>
                        </div>
                    ))}
                </section>
            )}
        </main>
    );
}
