import { Inject } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { INotification, NOTIFICATION_SERVICE } from "src/customer/application/ports/notification.port";
import { OrderShippedEvent } from "src/order/domain/events/order-shipped.event";



@EventsHandler(OrderShippedEvent)
export class OrderShippedEventHandler implements IEventHandler<OrderShippedEvent> {
    constructor(
        @Inject(NOTIFICATION_SERVICE)
        private readonly notificationService: INotification
    ) {}

    async handle(event: OrderShippedEvent): Promise<void> {
        await this.notificationService.send({
            recepientId: event.customerId,
            subject: "Order Shipped",
            message: `Your order with ID ${event.orderId} has been shipped with tracking number ${event.trackingNumber}.`,
        });
    }
}