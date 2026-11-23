import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { ConfirmPaymentCommand } from "./confirm-payment.command";
import { PAYMENT_REPOSITORY, PaymentRepository } from "../../ports/payment.repository.port";
import { Inject } from "@nestjs/common";
import { PaymentId } from "src/payment/domain/value-objects/payment-id.vo";
import { ApplicationException } from "src/shared/domain/exceptions/application.exception";
import { ApplicationExceptionCode } from "src/shared/domain/enums/application-exception-code";

@CommandHandler(ConfirmPaymentCommand)
export class ConfirmPaymentCommandHandler implements ICommandHandler<ConfirmPaymentCommand, void> {
    constructor(
        @Inject(PAYMENT_REPOSITORY)
        private readonly paymentRepository: PaymentRepository,
        private readonly eventPublisher: EventPublisher
    ) { }

    async execute(command: ConfirmPaymentCommand): Promise<void> {

        const payment = await this.paymentRepository.findById(new PaymentId(command.paymentId))

        if (!payment) {
            throw new ApplicationException(`Payment with Id ${command.paymentId} not found.`, ApplicationExceptionCode.NOT_FOUND)
        }

        if (payment.status.isSucceeded()) {
            return;
        }

        const trackedPayment = this.eventPublisher.mergeObjectContext(
            payment
        )
        trackedPayment.complete(command.gatewayTransactionId)

        await this.paymentRepository.save(payment);
        
        trackedPayment.commit()
    }

}