/**
 * Fetches the exchange rates from the Binance API
 * @returns {Promise<{ [key: string]: number }>} The exchange rates
 */
export const fetchExchangeRates = async () => {
    try {
        const response = await fetch('https://api.binance.com/api/v3/ticker/price');
        const data = await response.json();
        const rates: { [key: string]: number } = data.reduce(
            (
                acc: { [key: string]: number },
                { symbol, price }: { symbol: string; price: number }
            ) => {
                acc[symbol] = price;
                return acc;
            },
            {}
        );
        return rates;
    } catch (error) {
        console.error('Failed to fetch exchange rates:', error);
    }
};
