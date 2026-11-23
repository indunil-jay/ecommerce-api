import { ConfirmPaymentCommandHandler } from "./confirm-payment/confirm-payment.commandHandler";
import { CreatePaymentCommandHandler } from "./create-payment/create-payment.commandHandler";

export const  CommandHandlers =[
    CreatePaymentCommandHandler,
    ConfirmPaymentCommandHandler,
];
