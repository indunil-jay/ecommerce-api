import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { CreatePaymentCommand } from "./create-payment.command";
import { UniqueId } from "src/shared/domain/value-objects/unique-id.vo";
import { Inject } from "@nestjs/common";
import { PAYMENT_REPOSITORY, PaymentRepository } from "../../ports/payment.repository.port";
import { ApplicationException } from "src/shared/domain/exceptions/application.exception";
import { ApplicationExceptionCode } from "src/shared/domain/enums/application-exception-code";
import { IOrderPricing, ORDER_PRICING, OrderPricing } from "../../ports/order-pricing.port";
import { Payment } from "src/payment/domain/entities/payment.entity";
import { IPaymentGateway, PAYMENT_GATEWAY } from "../../ports/payment-gateway.port";


interface CreatePaymentResponse {
    checkoutUrl: string;
    paymentId: string;
}

@CommandHandler(CreatePaymentCommand)
export class CreatePaymentCommandHandler implements ICommandHandler<CreatePaymentCommand, CreatePaymentResponse> {
    constructor(
        @Inject(PAYMENT_REPOSITORY) private readonly paymentRepository: PaymentRepository,
        @Inject(ORDER_PRICING) private readonly orderPricing: IOrderPricing,
        @Inject(PAYMENT_GATEWAY) private readonly paymentGateway: IPaymentGateway,
        private readonly eventPublisher: EventPublisher
    ) { }
    async execute(command: CreatePaymentCommand): Promise<CreatePaymentResponse> {
        const orderId = new UniqueId(command.orderId);
        const existing = await this.paymentRepository.findByOrderId(orderId);
        if (existing?.isSucceeded()) {
            throw new ApplicationException(`Payment for order ${orderId.getValue()} has already been completed.`, ApplicationExceptionCode.CONFLICT);
        }

        const pricing = await this.orderPricing.getOrderPricing(command.orderId);

        if (!pricing) {
            throw new ApplicationException(`order with Id ${command.orderId} not found`)
        }
        let payment: Payment;
        if (existing) {
            payment = this.eventPublisher.mergeObjectContext(existing)
        } else {
            payment = this.eventPublisher.mergeObjectContext(
                Payment.initiate(orderId.toString(), pricing.total)
            )
        }
        const { url } = await this.paymentGateway.createCheckoutSession(
            pricing.lines,
             {
            orderId: command.orderId, 
            paymentId: payment.id.getValue()
             },
             {
                successUrl : command.successUrl,
                cancelUrl:command.cancelUrl
             }
        )
        payment.startCheckout()
        await this.paymentRepository.save(payment)
        payment.commit()
        return {
            checkoutUrl: url,
            paymentId: payment.id.getValue()
        };
    }
}