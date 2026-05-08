import { NextResponse } from 'next/server';
import { MOCK_ITINERARIES, MOCK_FLIGHTS, MOCK_STAYS, MOCK_EATS, Recommendation } from '@/lib/mock-data';
import { fetchNearbyPlaces } from '@/lib/overpass-api';

export async function POST(request: Request) {
    try {
        const { destination, category, startDate, endDate, budget } = await request.json();

        // 1. Fetch real restaurants, hotels, and tourist spots from OpenStreetMap
        const [realEats, realHotels, realAttractions] = await Promise.all([
            fetchNearbyPlaces(destination, 'restaurant'),
            fetchNearbyPlaces(destination, 'hotel'),
            fetchNearbyPlaces(destination, 'tourism')
        ]);

        const formatPlace = (place: any, type: string) => ({
            id: `real-${type[0]}-${place.id}`,
            name: place.name,
            type: type as any,
            rating: 4.0 + Math.random(),
            priceLevel: Math.floor(Math.random() * 3) + 1,
            image: type === 'restaurant'
                ? 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=800'
                : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
            description: place.tags.cuisine || place.tags.description || `A top-rated ${type} in ${destination}.`,
            tags: [place.tags.cuisine || 'Local', 'Real-time'],
            dietary: type === 'restaurant' ? ['Veg', 'Non-Veg', Math.random() > 0.5 ? 'Jain' : ''].filter(Boolean) : []
        });

        const logistics = [
            { step: "Airport Pickup", mode: "Private Taxi", detail: `Transfer from ${destination} International to Hotel`, time: "Upon Arrival" },
            { step: "Daily Commute", mode: "Orbit-Cab", detail: "Scheduled pickup for all itinerary attractions", time: "Daily" },
            { step: "Airport Drop", mode: "Private Taxi", detail: "Transfer from Hotel to Airport", time: "3 hours before departure" }
        ];

        const statusSummary = (realEats.length > 0 && realHotels.length > 0)
            ? `OrbitAI has designed a budget-aware plan for ${destination} with live data from ${realHotels.length} hotels and ${realEats.length} restaurants.`
            : `OrbitAI has generated a premium ${category} trip plan.`;

        return NextResponse.json({
            itinerary: MOCK_ITINERARIES[category] || MOCK_ITINERARIES.experience,
            flights: [
                {
                    id: 'f1', airline: 'SkyConnect', flightNo: 'SC-402/SC-403',
                    outbound: '10:00 AM', inbound: '08:00 PM',
                    price: budget === 'low' ? 320 : 550, duration: '8h 30m', stops: budget === 'low' ? 1 : 0
                },
                {
                    id: 'f2', airline: 'AeroElite', flightNo: 'AE-991/AE-992',
                    outbound: '07:00 AM', inbound: '11:00 PM',
                    price: budget === 'low' ? 410 : 720, duration: '9h 15m', stops: 0
                }
            ],
            stays: realHotels.length > 0 ? realHotels.map(h => formatPlace(h, 'hotel')) : MOCK_STAYS,
            eats: realEats.length > 0 ? realEats.map(e => formatPlace(e, 'restaurant')) : MOCK_EATS,
            logistics,
            summary: statusSummary
        });
    } catch (error) {
        console.error('Plan generation error:', error);
        return NextResponse.json({ error: 'Failed to generate plan' }, { status: 500 });
    }
}
