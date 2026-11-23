import { Module } from "@nestjs/common";
import { CommandHandler, CqrsModule } from "@nestjs/cqrs";
import { PAYMENT_REPOSITORY } from "./application/ports/payment.repository.port";
import { DrizzlePaymentRepository } from "./infrastructure/adapters/drizzle-payment.repository";
import { PAYMENT_GATEWAY } from "./application/ports/payment-gateway.port";
import { StripePaymentAdapter } from "./infrastructure/adapters/stripe-payment.adapter";
import { ORDER_PRICING } from "./application/ports/order-pricing.port";
import { OrderPricingAdapter } from "./infrastructure/adapters/order-pricing.adapter";
import { OrderModule } from "src/order/order.module";
import { PaymentController } from "./presentation/payment.controller";
import { CommandHandlers } from "./application/commands";



@Module({
    imports :[OrderModule],
    controllers :[PaymentController],
    providers: [
        ...CommandHandlers,
        {
            provide: PAYMENT_REPOSITORY,
            useClass: DrizzlePaymentRepository
        },

        {
            provide: PAYMENT_GATEWAY,
            useClass : StripePaymentAdapter
        }
        ,
        {
            provide : ORDER_PRICING,
            useClass: OrderPricingAdapter
        }
    ],
})
export class PaymentModule {}