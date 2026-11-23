import { Inject } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { INotification, NOTIFICATION_SERVICE } from "src/customer/application/ports/notification.port";
import { OrderDeliveredEvent } from "src/order/domain/events/order-delivered.event";



@EventsHandler(OrderDeliveredEvent)
export class OrderDeliveredEventHandler implements IEventHandler<OrderDeliveredEvent> {
    constructor(
        @Inject(NOTIFICATION_SERVICE)
        private readonly notificationService: INotification
    ) {}

    async handle(event: OrderDeliveredEvent): Promise<void> {
        await this.notificationService.send({
            recepientId: event.customerId,
            subject: "Order Delivered",
            message: `Your order with ID ${event.orderId} has been delivered.`,
        });
    }
}
