"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    Plane, Hotel, Utensils, MapPin,
    Calendar, CreditCard, ChevronLeft,
    Car, ArrowRight, ShieldCheck, Tag
} from "lucide-react";
import { useRouter } from "next/navigation";
import { TRANSLATIONS } from "@/lib/translations";
import { calculateTotal, formatCurrency } from "@/lib/calculations";

export default function ItineraryPage() {
    const router = useRouter();
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const stored = localStorage.getItem('orbit-itinerary');
        if (stored) {
            setData(JSON.parse(stored));
        } else {
            router.push('/');
        }
    }, [router]);

    if (!data) return <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>;

    const { selectedItems, fullResults, lang, destination, startDate, endDate, category } = data;
    const t = TRANSLATIONS[lang as keyof typeof TRANSLATIONS];

    const swapSelection = (newItem: any, type: 'flight' | 'stay') => {
        const newData = { ...data };
        if (type === 'flight') newData.selectedItems.flight = newItem;
        if (type === 'stay') newData.selectedItems.stay = newItem;
        setData(newData);
        localStorage.setItem('orbit-itinerary', JSON.stringify(newData));
    };

    // Find "lesser budget" recommendations
    const cheapFlights = fullResults.flights.filter((f: any) => f.price < (selectedItems.flight?.price || Infinity));
    const cheapStays = fullResults.stays.filter((s: any) => s.priceLevel < (selectedItems.stay?.priceLevel || Infinity));

    return (
        <main className="min-h-screen bg-background text-foreground pb-20">
            {/* Header */}
            <div className="h-64 bg-gradient-to-br from-indigo-900 via-primary/20 to-background relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 pt-12">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-4"
                    >
                        <ChevronLeft className="w-4 h-4" /> {t.back}
                    </button>
                    <h1 className="text-4xl md:text-6xl font-bold mb-2">
                        {destination} <span className="text-primary opacity-50">Itinerary</span>
                    </h1>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {startDate} - {endDate}</span>
                        <span className="flex items-center gap-1 uppercase tracking-widest"><Tag className="w-4 h-4" /> {category}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-12 grid lg:grid-cols-3 gap-8">
                {/* Main Plan */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Flights & Logistics */}
                    <div className="glass-card p-8">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Plane className="text-secondary" /> {t.transDetail}
                        </h2>

                        {/* Flight Detail */}
                        {selectedItems.flight && (
                            <div className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/5">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Confirmed Flight</p>
                                        <h3 className="text-2xl font-bold">{selectedItems.flight.airline}</h3>
                                        <p className="text-primary font-mono">{selectedItems.flight.flightNo}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold">{formatCurrency(selectedItems.flight.price, lang)}</div>
                                        <div className="text-xs text-green-400 flex items-center gap-1 justify-end"><ShieldCheck className="w-3 h-3" /> Best Price</div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between border-t border-white/5 pt-6">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold">{selectedItems.flight.outbound}</p>
                                        <p className="text-xs text-gray-400">Departure</p>
                                    </div>
                                    <div className="flex-1 px-8 relative">
                                        <div className="h-[1px] w-full bg-white/10" />
                                        <Plane className="w-4 h-4 text-gray-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold">{selectedItems.flight.inbound}</p>
                                        <p className="text-xs text-gray-400">Arrival</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Logistics (Taxi) */}
                        <div className="space-y-4">
                            <h3 className="font-bold flex items-center gap-2 text-primary opacity-80"><Car className="w-4 h-4" /> {t.logistics}</h3>
                            {fullResults.logistics.map((log: any, i: number) => (
                                <div key={i} className="flex gap-4 p-4 glass rounded-2xl">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">{i + 1}</div>
                                    <div>
                                        <p className="font-bold">{log.step}</p>
                                        <p className="text-sm text-gray-400">{log.detail} via <span className="text-white">{log.mode}</span></p>
                                        <p className="text-xs text-primary mt-1">{log.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Stay & Food */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="glass-card p-6">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Hotel className="text-accent" /> Stay</h2>
                            {selectedItems.stay ? (
                                <div className="space-y-4">
                                    <img src={selectedItems.stay.image} className="w-full h-40 object-cover rounded-2xl" />
                                    <div>
                                        <h3 className="font-bold">{selectedItems.stay.name}</h3>
                                        <p className="text-xs text-gray-400">{selectedItems.stay.description}</p>
                                    </div>
                                </div>
                            ) : <p className="text-gray-500 italic">No stay selected</p>}
                        </div>
                        <div className="glass-card p-6">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Utensils className="text-indigo-400" /> Culinary</h2>
                            <div className="space-y-3">
                                {selectedItems.eats.map((eat: any) => (
                                    <div key={eat.id} className="flex items-center gap-3 glass p-2 rounded-xl">
                                        <img src={eat.image} className="w-10 h-10 rounded-lg" />
                                        <div>
                                            <p className="text-sm font-bold">{eat.name}</p>
                                            <div className="flex gap-1">
                                                {eat.dietary?.map((d: string) => (
                                                    <span key={d} className="text-[8px] bg-primary/20 px-1 rounded">{d}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {selectedItems.eats.length === 0 && <p className="text-gray-500 italic">No spots selected</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Summary & Upsell */}
                <div className="space-y-8">
                    {/* Final Cost Summary */}
                    <div className="glass-card p-8 sticky top-8 border-primary/20 bg-primary/5">
                        <CreditCard className="w-8 h-8 text-primary mb-4" />
                        <h2 className="text-2xl font-bold mb-6">Budget Overview</h2>
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Transportation</span>
                                <span>{formatCurrency(selectedItems.flight?.price || 0, lang)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Accommodations</span>
                                <span>{formatCurrency((selectedItems.stay?.priceLevel || 0) * 150, lang)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Dining</span>
                                <span>{formatCurrency(selectedItems.eats.reduce((a: any, c: any) => a + (c.priceLevel * 40), 0), lang)}</span>
                            </div>
                            <div className="h-[1px] bg-white/10 my-4" />
                            <div className="flex justify-between items-end">
                                <span className="text-lg font-bold">Total</span>
                                <span className="text-3xl font-bold text-gradient">{formatCurrency(calculateTotal(selectedItems), lang)}</span>
                            </div>
                        </div>
                        <button className="w-full py-4 bg-primary rounded-full font-bold shadow-lg shadow-primary/20">
                            {t.confirmPay}
                        </button>
                    </div>

                    {/* Smart Recommendations (Save Money) */}
                    {(cheapFlights.length > 0 || cheapStays.length > 0) && (
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-green-400 flex items-center gap-2">
                                <Tag className="w-4 h-4" /> {t.saveOrbit}
                            </h3>
                            {cheapFlights.slice(0, 1).map((f: any) => (
                                <div key={f.id} className="glass p-4 rounded-2xl border-l-4 border-green-500 cursor-pointer hover:bg-white/5 transition-all" onClick={() => swapSelection(f, 'flight')}>
                                    <div className="flex justify-between items-center text-xs mb-2">
                                        <span className="text-gray-400">Better Price on Flight</span>
                                        <span className="bg-green-500/20 text-green-400 px-2 rounded">Save {formatCurrency((selectedItems.flight?.price || 0) - f.price, lang)}</span>
                                    </div>
                                    <p className="font-bold flex items-center justify-between">
                                        {f.airline} <ArrowRight className="w-4 h-4 text-primary" />
                                    </p>
                                </div>
                            ))}
                            {cheapStays.slice(0, 1).map((s: any) => (
                                <div key={s.id} className="glass p-4 rounded-2xl border-l-4 border-green-500 cursor-pointer hover:bg-white/5 transition-all" onClick={() => swapSelection(s, 'stay')}>
                                    <div className="flex justify-between items-center text-xs mb-2">
                                        <span className="text-gray-400">Cheaper Elite Stay</span>
                                        <span className="bg-green-500/20 text-green-400 px-2 rounded">Lower Tier Option</span>
                                    </div>
                                    <p className="font-bold flex items-center justify-between">
                                        {s.name} <ArrowRight className="w-4 h-4 text-primary" />
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
