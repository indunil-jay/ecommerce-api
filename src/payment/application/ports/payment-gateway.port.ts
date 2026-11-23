import { Money } from "src/shared/domain/value-objects/money";


export const PAYMENT_GATEWAY = Symbol('PAYMENT_GATEWAY');

export interface CheckoutUrls {
    successUrl?: string;
    cancelUrl?: string;
}

export interface CreateCheckoutSessionResult {
    sessionId: string;
    url: string;
}

export interface CheckoutLineItem {
name :string;
unitAmount : Money;
quantity : number;
}

export interface IPaymentGateway {
    createCheckoutSession(
        lines: CheckoutLineItem[], 
        metadata :{orderId:string, paymentId:string},
        urls?:CheckoutUrls): Promise<CreateCheckoutSessionResult>;

    constructWebhookEvent(payload: Buffer, signature: string): Promise<any>;
} 