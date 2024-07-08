import { create } from 'zustand';

// Zustand store for the crypto currency converter
interface ConverterStore {
    valueFrom: string;
    valueTo: string;
    currencyFrom: string;
    currencyTo: string;
    setValueFrom: (value: string) => void;
    setValueTo: (value: string) => void;
    setCurrencyFrom: (currency: string) => void;
    setCurrencyTo: (currency: string) => void;
}

const converterStore = create<ConverterStore>((set) => ({
    valueFrom: '',
    valueTo: '',
    currencyFrom: 'USDT',
    currencyTo: 'BTC',
    setValueFrom: (value) => set((state) => ({ ...state, valueFrom: value })),
    setValueTo: (value) => set((state) => ({ ...state, valueTo: value })),
    setCurrencyFrom: (currency) => set((state) => ({ ...state, currencyFrom: currency })),
    setCurrencyTo: (currency) => set((state) => ({ ...state, currencyTo: currency })),
}));

export default converterStore;

