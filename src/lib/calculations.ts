export function calculateTotal(selectedItems: {
    flight?: { price: number };
    stay?: { priceLevel: number };
    eats: { priceLevel: number }[];
}): number {
    const flightCost = selectedItems.flight?.price || 0;
    const stayCost = (selectedItems.stay?.priceLevel || 0) * 150;
    const eatsCost = selectedItems.eats.reduce((acc, curr) => acc + (curr.priceLevel * 40), 0);

    return flightCost + stayCost + eatsCost;
}

export function formatCurrency(amount: number, lang: string = 'en'): string {
    return new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'es-ES', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
}
