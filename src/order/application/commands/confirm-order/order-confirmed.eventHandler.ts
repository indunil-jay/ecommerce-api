import { Inject } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { INotification, NOTIFICATION_SERVICE } from "src/customer/application/ports/notification.port";
import { OrderConfirmedEvent } from "src/order/domain/events/order-confirmed.event";


@EventsHandler(OrderConfirmedEvent)
export class OrderConfirmedEventHandler implements IEventHandler<OrderConfirmedEvent> {
    constructor(
        @Inject(NOTIFICATION_SERVICE)
        private readonly notificationService: INotification
    ) {}

    async handle(event: OrderConfirmedEvent): Promise<void> {
        const { street, city, state, zipCode, country } = event.shippingAddress;
        await this.notificationService.send({
            recepientId: event.customerId,
            subject: "Order Confirmed",
            message: `Your order with ID ${event.orderId} has been confirmed and will be shipped to ${street}, ${city}, ${state}, ${zipCode}, ${country}.`,
        });
    }
}
