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

export default function Home() {
    const [destination, setDestination] = useState("");
    const [category, setCategory] = useState<"adventure" | "experience" | "chill">("experience");
    const [showResults, setShowResults] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (destination) {
            setLoading(true);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            setShowResults(true);
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen pb-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-background to-background">
            {/* Navbar placeholder */}
            <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
                <div className="text-2xl font-bold tracking-tighter flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <Compass className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-gradient">orbitAI</span>
                </div>
                <button className="px-4 py-2 rounded-full glass hover:bg-white/10 transition-all text-sm">
                    Login
                </button>
            </nav>

            {/* Hero Section */}
            <section className="px-6 py-20 text-center max-w-4xl mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
                >
                    Travel at the speed of <span className="text-gradient">Thought</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-lg text-gray-400 mb-12"
                >
                    Your personal AI travel architect for itineraries, flights, and curated experiences.
                </motion.p>

                {/* Search Bar */}
                <motion.form
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    onSubmit={handleSearch}
                    className="max-w-2xl mx-auto p-2 glass-card flex flex-col md:flex-row gap-2"
                >
                    <div className="flex-1 flex items-center gap-3 px-4 py-3">
                        <MapPin className="text-primary w-5 h-5 flex-shrink-0" />
                        <label htmlFor="destination-input" className="sr-only">Destination</label>
                        <input
                            id="destination-input"
                            type="text"
                            placeholder="Where to next?"
                            className="bg-transparent border-none outline-none w-full text-foreground placeholder:text-gray-500"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            aria-label="Enter your destination"
                        />
                    </div>
                    <div className="h-10 w-[1px] bg-white/10 hidden md:block self-center" />
                    <div className="flex gap-2 p-1 overflow-x-auto no-scrollbar" role="group" aria-label="Travel categories">
                        {(['adventure', 'experience', 'chill'] as const).map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setCategory(cat)}
                                className={`px-4 py-2 rounded-2xl text-sm capitalize transition-all whitespace-nowrap ${category === cat ? 'bg-primary text-white shadow-lg' : 'hover:bg-white/5'
                                    }`}
                                aria-pressed={category === cat}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="md:w-14 h-12 bg-primary rounded-2xl flex items-center justify-center hover:bg-primary/80 transition-colors flex-shrink-0 disabled:opacity-50"
                        aria-label="Search for plans"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Search className="w-5 h-5" />
                        )}
                    </button>
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
                        {/* Itinerary */}
                        <section>
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <Wind className="text-primary" /> Your {category} Itinerary
                            </h2>
                            <div className="grid md:grid-cols-1 gap-6">
                                {MOCK_ITINERARIES[category].map((day) => (
                                    <div key={day.day} className="glass-card p-6 overflow-hidden relative">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -z-10" />
                                        <h3 className="text-xl font-bold mb-6">Day {day.day}: Exploration</h3>
                                        <div className="space-y-6">
                                            {day.activities.map((act, idx) => (
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

                        {/* Flight Map / Recommendations */}
                        <section className="grid lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <Plane className="text-secondary" /> Flight Recommendations
                                </h2>
                                <div className="space-y-4">
                                    {MOCK_FLIGHTS.map((flight) => (
                                        <div key={flight.id} className="glass flex items-center justify-between p-6 rounded-3xl hover:bg-white/10 transition-all group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                                                    <Plane className="w-6 h-6 text-secondary transform -rotate-45 group-hover:rotate-0 transition-transform" />
                                                </div>
                                                <div>
                                                    <p className="font-bold">{flight.airline}</p>
                                                    <p className="text-sm text-gray-400">{flight.duration} • {flight.stops === 0 ? 'Direct' : `${flight.stops} Stop`}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-bold text-gradient">{flight.price}</p>
                                                <button className="text-sm flex items-center gap-1 text-primary hover:gap-2 transition-all">
                                                    Select <ArrowRight className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Best Budget Recommendations */}
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <TrendingUp className="text-accent" /> Expert Stays
                                </h2>
                                <div className="space-y-4">
                                    {MOCK_STAYS.map((stay) => (
                                        <div key={stay.id} className="glass-card overflow-hidden group cursor-pointer hover:-translate-y-1 transition-all">
                                            <div className="h-32 w-full relative overflow-hidden">
                                                <img
                                                    src={stay.image}
                                                    alt={stay.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                                <div className="absolute top-2 right-2 px-2 py-1 glass rounded-lg text-[10px] font-bold flex items-center gap-1">
                                                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> {stay.rating}
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <h4 className="font-bold">{stay.name}</h4>
                                                <p className="text-xs text-gray-400 line-clamp-1">{stay.description}</p>
                                                <div className="flex gap-2 mt-3">
                                                    {stay.tags.map(tag => (
                                                        <span key={tag} className="text-[10px] bg-white/5 px-2 py-1 rounded-md">{tag}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Restaurants Section */}
                        <section>
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <Utensils className="text-indigo-400" /> Culinary Experiences
                            </h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {MOCK_EATS.map((eat) => (
                                    <div key={eat.id} className="glass flex gap-4 p-4 rounded-3xl hover:bg-white/10 transition-all">
                                        <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                                            <img src={eat.image} alt={eat.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <h4 className="font-bold">{eat.name}</h4>
                                            <p className="text-xs text-gray-400 mb-2 line-clamp-2">{eat.description}</p>
                                            <div className="flex items-center gap-2">
                                                <div className="flex">
                                                    {[...Array(3)].map((_, i) => (
                                                        <div key={i} className={`text-xs ${i < eat.priceLevel ? 'text-primary' : 'text-gray-600'}`}>$</div>
                                                    ))}
                                                </div>
                                                <span className="w-1 h-1 rounded-full bg-gray-600" />
                                                <span className="text-xs text-gray-400">Trending</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
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
