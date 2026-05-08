import { describe, it, expect } from 'vitest';
import { calculateTotal } from './calculations';

describe('Budget Calculations', () => {
    it('should calculate zero for no selections', () => {
        const total = calculateTotal({ eats: [] });
        expect(total).toBe(0);
    });

    it('should calculate total with flight and stay', () => {
        const total = calculateTotal({
            flight: { price: 500 },
            stay: { priceLevel: 2 }, // 2 * 150 = 300
            eats: []
        });
        expect(total).toBe(800);
    });

    it('should calculate total with multiple eats', () => {
        const total = calculateTotal({
            eats: [
                { priceLevel: 1 }, // 40
                { priceLevel: 3 }, // 120
            ]
        });
        expect(total).toBe(160);
    });

    it('should calculate grand total correctly', () => {
        const total = calculateTotal({
            flight: { price: 1000 },
            stay: { priceLevel: 3 }, // 450
            eats: [{ priceLevel: 2 }] // 80
        });
        expect(total).toBe(1530);
    });
});
