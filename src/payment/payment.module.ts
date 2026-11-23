import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { PAYMENT_REPOSITORY } from "./application/ports/payment.repository.port";
import { DrizzlePaymentRepository } from "./infrastructure/adapters/drizzle-payment.repository";



@Module({
    imports: [CqrsModule],
    controllers: [],
    providers: [
     
        {
            provide: PAYMENT_REPOSITORY,
            useClass: DrizzlePaymentRepository
        },
       
    ],
    exports: [PAYMENT_REPOSITORY]
})
export class PaymentModule {}