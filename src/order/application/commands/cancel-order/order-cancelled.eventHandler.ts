import { Inject } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { INotification, NOTIFICATION_SERVICE } from "src/customer/application/ports/notification.port";
import { OrderCancelledEvent } from "src/order/domain/events/order-cancelled.event";



@EventsHandler(OrderCancelledEvent)
export class OrderCancelledEventHandler implements IEventHandler<OrderCancelledEvent> {
    constructor(
        @Inject(NOTIFICATION_SERVICE)
        private readonly notificationService: INotification
    ) {}

    async handle(event: OrderCancelledEvent): Promise<void> {
        await this.notificationService.send({
            recepientId: event.customerId,
            subject: "Order Cancelled",
            message: `Your order with ID ${event.orderId} has been cancelled.`,
        });
    }
}
