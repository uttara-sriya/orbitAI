import { describe, it, expect, vi } from 'vitest';
import { TRANSLATIONS } from './translations';
import { gcpLog } from './gcp-logger';
import { calculateTotal } from './calculations';
import { MOCK_ITINERARIES, MOCK_STAYS, MOCK_EATS } from './mock-data';

describe('OrbitAI Comprehensive Test Suite', () => {

    describe('Internationalization (i18n)', () => {
        it('should have consistent keys across all languages', () => {
            const enKeys = Object.keys(TRANSLATIONS.en).sort();
            const esKeys = Object.keys(TRANSLATIONS.es).sort();
            expect(enKeys).toEqual(esKeys);
        });

        it('should not have empty translation strings', () => {
            Object.values(TRANSLATIONS).forEach(langSet => {
                Object.values(langSet).forEach(value => {
                    expect(value.length).toBeGreaterThan(0);
                });
            });
        });
    });

    describe('Google Cloud Observability', () => {
        it('should format logs in structured JSON for Stackdriver', () => {
            const consoleSpy = vi.spyOn(console, 'log');
            gcpLog('INFO', 'Test Message', { user: 'test-user' });

            expect(consoleSpy).toHaveBeenCalled();
            const lastCall = JSON.parse(consoleSpy.mock.calls[0][0]);
            expect(lastCall.severity).toBe('INFO');
            expect(lastCall.message).toBe('Test Message');
            expect(lastCall.user).toBe('test-user');

            consoleSpy.mockRestore();
        });
    });

    describe('Calculation Edge Cases', () => {
        it('should handle undefined flight price gracefully', () => {
            const total = calculateTotal({
                flight: { airline: 'Test' } as any,
                eats: []
            });
            expect(total).toBe(0);
        });

        it('should handle massive counts of spots', () => {
            const eats = Array(100).fill({ priceLevel: 1 });
            const total = calculateTotal({ eats });
            expect(total).toBe(4000);
        });
    });

    describe('System Integrity', () => {
        it('should have a valid itinerary for all core categories', () => {
            const categories = ['adventure', 'experience', 'chill'];
            categories.forEach(cat => {
                expect(MOCK_ITINERARIES[cat]).toBeDefined();
                expect(MOCK_ITINERARIES[cat].length).toBeGreaterThan(0);
            });
        });

        it('should ensure all mock images are using HTTPS for security', () => {
            [...MOCK_STAYS, ...MOCK_EATS].forEach(item => {
                expect(item.image.startsWith('https://')).toBe(true);
            });
        });
    });

    describe('Currency & Formatting Utilities', () => {
        it('should format USD correctly for English', () => {
            const { formatCurrency } = require('./calculations');
            const formatted = formatCurrency(1234, 'en');
            expect(formatted).toContain('$1,234.00');
        });

        it('should format USD correctly for Spanish locale', () => {
            const { formatCurrency } = require('./calculations');
            const formatted = formatCurrency(1234, 'es');
            expect(formatted).toContain('1.234,00');
        });
    });

    describe('API Service (Mocked)', () => {
        it('should structure Overpass queries correctly', async () => {
            const { fetchNearbyPlaces } = require('./overpass-api');
            global.fetch = vi.fn().mockResolvedValue({
                json: () => Promise.resolve({ elements: [{ id: 1, tags: { name: 'Test Spot' } }] })
            });

            const results = await fetchNearbyPlaces('London', 'restaurant');
            expect(results[0].name).toBe('Test Spot');
            expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('node["amenity"="restaurant"]'));
        });

        it('should return an empty array on API failure', async () => {
            const { fetchNearbyPlaces } = require('./overpass-api');
            global.fetch = vi.fn().mockRejectedValue(new Error('Network Error'));

            const results = await fetchNearbyPlaces('London', 'hotel');
            expect(results).toEqual([]);
        });
    });
});
