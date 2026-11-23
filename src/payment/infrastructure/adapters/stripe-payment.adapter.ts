import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CheckoutLineItem, CheckoutUrls, CreateCheckoutSessionResult, IPaymentGateway } from "src/payment/application/ports/payment-gateway.port";
import { Money } from "src/shared/domain/value-objects/money";
import Stripe from "stripe";

@Injectable()
export class StripePaymentAdapter implements IPaymentGateway {

    private readonly stripe: Stripe

    constructor(private readonly configService: ConfigService) {
        this.stripe = new Stripe(this.configService.getOrThrow("STRIPE_SECRET_KEY")
        );
    }


    async createCheckoutSession(lines: CheckoutLineItem[], metadata: { orderId: string; paymentId: string; }, urls?: CheckoutUrls): Promise<CreateCheckoutSessionResult> {
        const session = await this.stripe.checkout.sessions.create({
            mode: 'payment', line_items: lines.map(line => ({
                quantity: line.quantity,
                price_data: {
                    currency: line.unitAmount.getCurrency().toLocaleLowerCase(),
                    unit_amount: line.unitAmount.toCents(),
                    product_data: {
                        name: line.name
                    }
                }
            })),
            success_url: urls?.successUrl || this.configService.getOrThrow("STRIPE_SUCCESS_URL"),
            cancel_url : urls?.cancelUrl,
            metadata: {
                orderId: metadata.orderId,
                paymentId: metadata.paymentId
            }
        })

        return {
            sessionId: session.id,
            url: session.url!
        }

    }

    constructWebhookEvent(payload: Buffer, signature: string): Promise<any> {
        return this.stripe.webhooks.constructEventAsync(payload, signature, this.configService.getOrThrow("STRIPE_WEBHOOK_SECRET"));
    }

}