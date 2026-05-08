import { describe, it, expect } from 'vitest';
import { MOCK_ITINERARIES } from './mock-data';

describe('Travel Planning Data', () => {
    it('should have itineraries for adventure, experience, and chill', () => {
        expect(MOCK_ITINERARIES).toHaveProperty('adventure');
        expect(MOCK_ITINERARIES).toHaveProperty('experience');
        expect(MOCK_ITINERARIES).toHaveProperty('chill');
    });

    it('should have at least one day in each itinerary', () => {
        Object.values(MOCK_ITINERARIES).forEach(itinerary => {
            expect(itinerary.length).toBeGreaterThan(0);
            expect(itinerary[0].activities.length).toBeGreaterThan(0);
        });
    });
});
