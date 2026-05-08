export interface Place {
    id: number;
    name: string;
    type: string;
    lat: number;
    lon: number;
    tags: Record<string, string>;
}

export async function fetchNearbyPlaces(destination: string, type: 'restaurant' | 'tourism' | 'hotel'): Promise<Place[]> {
    try {
        // Step 1: Get city coordinates (using Nominatim search)
        const geocodeRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destination)}&limit=1`, {
            headers: {
                'User-Agent': 'OrbitAI-Travel-App/1.0'
            }
        });
        const geocode = await geocodeRes.json();

        if (!geocode || geocode.length === 0) return [];

        const { lat, lon } = geocode[0];
        const radius = 5000; // 5km search radius

        // Step 2: Query Overpass API
        let amenity = '';
        if (type === 'restaurant') amenity = 'amenity=restaurant';
        else if (type === 'hotel') amenity = 'tourism=hotel';
        else amenity = 'tourism=attraction';

        const query = `
            [out:json][timeout:25];
            (
              node[${amenity}](around:${radius},${lat},${lon});
              way[${amenity}](around:${radius},${lat},${lon});
            );
            out body;
            >;
            out skel qt;
        `;

        const overpassRes = await fetch('https://overpass-api.de/api/interpreter', {
            method: 'POST',
            body: query
        });

        const data = await overpassRes.json();

        return (data.elements || [])
            .filter((el: any) => el.tags && el.tags.name)
            .slice(0, 10) // Limit to top 10
            .map((el: any) => ({
                id: el.id,
                name: el.tags.name,
                type: type,
                lat: el.lat || (el.center && el.center.lat),
                lon: el.lon || (el.center && el.center.lon),
                tags: el.tags
            }));
    } catch (error) {
        console.error('Failed to fetch real-time places:', error);
        return [];
    }
}
