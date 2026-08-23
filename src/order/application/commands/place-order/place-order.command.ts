export interface PlaceOrderItemCommandInput {
    productId: string;
    productName: string;
    unitPrice: number;
    currency?: string;
    quantity: number;
    discountAmount?: number;
    discountCurrency?: string;
}

export interface PlaceOrderShippingAddressCommandInput {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export class PlaceOrderCommand {
    constructor(
        public readonly customerId: string,
        public readonly items: PlaceOrderItemCommandInput[],
        public readonly shippingAddress: PlaceOrderShippingAddressCommandInput,
    ) {}
}
