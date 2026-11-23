import { Inject } from "@nestjs/common";
import { IEventHandler, EventsHandler } from "@nestjs/cqrs";
import { INotification, NOTIFICATION_SERVICE } from "src/customer/application/ports/notification.port";
import { OrderPlacedEvent } from "src/order/domain/events/order-placed.event";

@EventsHandler(OrderPlacedEvent)
export class OrderPlacedEventHandler implements IEventHandler<OrderPlacedEvent> {
    constructor(
        @Inject(NOTIFICATION_SERVICE)
        private readonly notificationService: INotification
    ) {}

    async handle(event: OrderPlacedEvent): Promise<void> {
        await this.notificationService.send({
            recepientId: event.customerId,
            subject: 'Order Placed',
            message: `Your order with ID ${event.orderId} has been successfully placed.`
        });
    }
}
