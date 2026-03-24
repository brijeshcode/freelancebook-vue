export interface InvoiceServiceItem {
    id: number;
    title: string;
    total_amount: number;
    client_id: number;
    project_id: number | null;
}

export interface InvoiceItem {
    id?: number;
    service_id: string;
    title: string;
    description: string | null;
    quantity: number;
    unit_price: number;
    unit_price_base_currency: number | null;
    total_price?: number;
    total_price_base_currency: number | null;
    service_period_start: string;
    service_period_end: string;
    notes: string;
    service?: InvoiceServiceItem;
}

export type CreateInvoiceItemRequest = Omit<InvoiceItem, 'id' | 'total_price' | 'total_price_base_currency' | 'service'>;
