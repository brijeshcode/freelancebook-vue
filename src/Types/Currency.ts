export interface Currency {
    id: number;
    code: string;       // ISO 4217: USD, EUR, LBP, INR
    name: string;       // US Dollar, Lebanese Pound
    symbol: string;     // $, €, ل.ل, ₹
    decimal_places: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export type CalculationType = 'multiply' | 'divide';
