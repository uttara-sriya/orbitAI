import { NextResponse } from 'next/server';
import { MOCK_ITINERARIES, MOCK_FLIGHTS, MOCK_STAYS, MOCK_EATS } from '@/lib/mock-data';

export async function POST(request: Request) {
    try {
        const { destination, category } = await request.json();

        // Simulate AI processing delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        return NextResponse.json({
            itinerary: MOCK_ITINERARIES[category] || MOCK_ITINERARIES.experience,
            flights: MOCK_FLIGHTS,
            stays: MOCK_STAYS,
            eats: MOCK_EATS,
            summary: `OrbitAI has generated a premium ${category} trip to ${destination}.`
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to generate plan' }, { status: 500 });
    }
}
