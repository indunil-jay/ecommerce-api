import { Body, Controller, Header, Headers, Inject, Logger, Post, RawBody } from "@nestjs/common";
import { CreatePaymentDto } from "./dtos/create-payment.dto";
import { CommandBus } from "@nestjs/cqrs";
import { CreatePaymentCommand } from "../application/commands/create-payment/create-payment.command";
import { IPaymentGateway, PAYMENT_GATEWAY } from "../application/ports/payment-gateway.port";
import { ConfirmPaymentCommand } from "../application/commands/confirm-payment/confirm-payment.command";

@Controller('payments')
export class PaymentController {
    private readonly logger = new Logger(PaymentController.name)
    constructor(
        private readonly commandBus: CommandBus,
        @Inject(PAYMENT_GATEWAY) private readonly paymentGateway: IPaymentGateway
    ) { }

    @Post()
    async createPayment(
        @Body() req: CreatePaymentDto
    ) {
        return this.commandBus.execute(
            new CreatePaymentCommand(req.orderId, req.successUrl, req.cancelUrl)
        )
    }

    @Post('webhook')
    async handleWebhook(
        @RawBody() payload: Buffer,
        @Headers('stripe-signature') signature: string
    ) {
        const event = await this.paymentGateway.constructWebhookEvent(payload, signature)
        this.logger.log('Got stripe webhook event', event)

        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                const paymentId = session.metadata?.paymentId;
                const gatewayTransactionId = typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id;
                 
                if (paymentId && gatewayTransactionId) {
                    await this.commandBus.execute(new ConfirmPaymentCommand(paymentId,gatewayTransactionId))
                }
                break;
            }
            default :
                 break;
            }
        }
    }
