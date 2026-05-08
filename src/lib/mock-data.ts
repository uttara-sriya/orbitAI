export interface Recommendation {
    id: string;
    name: string;
    type: 'hotel' | 'restaurant' | 'attraction';
    rating: number;
    priceLevel: number;
    image: string;
    description: string;
    tags: string[];
}

export interface FlightRecommendation {
    id: string;
    airline: string;
    price: string;
    duration: string;
    stops: number;
    departure: string;
    arrival: string;
}

export interface ItineraryDay {
    day: number;
    activities: {
        time: string;
        activity: string;
        category: 'adventure' | 'experience' | 'chill';
        location: string;
    }[];
}

export const MOCK_FLIGHTS: FlightRecommendation[] = [
    { id: '1', airline: 'SkyOrbit', price: '$450', duration: '12h 30m', stops: 1, departure: '10:00 AM', arrival: '10:30 PM' },
    { id: '2', airline: 'AeroLuxe', price: '$820', duration: '10h 15m', stops: 0, departure: '08:00 AM', arrival: '06:15 PM' },
    { id: '3', airline: 'CloudBound', price: '$390', duration: '14h 45m', stops: 2, departure: '11:30 PM', arrival: '02:15 PM' },
];

export const MOCK_STAYS: Recommendation[] = [
    {
        id: 'h1',
        name: 'Horizon Glass Resort',
        type: 'hotel',
        rating: 4.8,
        priceLevel: 3,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
        description: 'Eco-luxury resort with panoramic views.',
        tags: ['Eco', 'Luxury', 'View']
    },
    {
        id: 'h2',
        name: 'Urban Nest Boutique',
        type: 'hotel',
        rating: 4.5,
        priceLevel: 2,
        image: 'https://images.unsplash.com/photo-1551882547-ff43c63efe8c?auto=format&fit=crop&q=80&w=800',
        description: 'Minimalist boutique hotel in the heart of the city.',
        tags: ['Boutique', 'Minimalist', 'Central']
    }
];

export const MOCK_EATS: Recommendation[] = [
    {
        id: 'r1',
        name: 'Neon Umami',
        type: 'restaurant',
        rating: 4.9,
        priceLevel: 3,
        image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=800',
        description: 'Fusion Asian cuisine with vibrant cyberpunk aesthetics.',
        tags: ['Fusion', 'Cyberpunk', 'Modern']
    },
    {
        id: 'r2',
        name: 'The Rustic Grove',
        type: 'restaurant',
        rating: 4.6,
        priceLevel: 1,
        image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=800',
        description: 'Farm-to-table breakfast and brunch spot.',
        tags: ['Farm-to-table', 'Brunch', 'Cozy']
    }
];

export const MOCK_ITINERARIES: Record<string, ItineraryDay[]> = {
    adventure: [
        {
            day: 1,
            activities: [
                { time: '08:00 AM', activity: 'Sunrise Ridge Trek', category: 'adventure', location: 'Summit Point' },
                { time: '01:00 PM', activity: 'Canyon Kayaking', category: 'adventure', location: 'Crystal River' },
                { time: '07:00 PM', activity: 'Night Jungle Walk', category: 'adventure', location: 'Wild Reserve' },
            ]
        }
    ],
    experience: [
        {
            day: 1,
            activities: [
                { time: '09:00 AM', activity: 'Street Art Photography Tour', category: 'experience', location: 'Creative District' },
                { time: '02:00 PM', activity: 'Artisan Glass Blowing Workshop', category: 'experience', location: 'Vetro Studio' },
                { time: '06:00 PM', activity: 'Culinary Masterclass', category: 'experience', location: 'Chef Table' },
            ]
        }
    ],
    chill: [
        {
            day: 1,
            activities: [
                { time: '10:00 AM', activity: 'Mineral Springs Spa', category: 'chill', location: 'Serenity Spa' },
                { time: '02:00 PM', activity: 'Sunset Beach Picnic', category: 'chill', location: 'Golden Sands' },
                { time: '08:00 PM', activity: 'Starlight Cinema', category: 'chill', location: 'Open Sky Theater' },
            ]
        }
    ]
};
