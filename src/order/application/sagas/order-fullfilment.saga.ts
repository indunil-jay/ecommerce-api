import { Injectable } from "@nestjs/common";
import { ICommand, ofType, Saga } from "@nestjs/cqrs";
import { map, Observable } from "rxjs";
import { PaymentCompletedEvent } from "src/payment/domain/events/payment-completed.event";
import { ConfirmOrderCommand } from "../commands/confirm-order/confirm-order.command";

@Injectable()
export class OrderFulfilmentSaga{

    @Saga()
    paymentCompleted = (events$: Observable<any>):Observable<ICommand> => {
        return events$.pipe(
            ofType(PaymentCompletedEvent),
            map((event)=>new ConfirmOrderCommand(event.orderId)),
        )
    }
}