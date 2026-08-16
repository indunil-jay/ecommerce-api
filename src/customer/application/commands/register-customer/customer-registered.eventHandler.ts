import { Inject } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { CustomerRegisteredEvent } from "src/customer/domain/events/customer-registered.event";
import { INotification, NOTIFICATION_SERVICE } from "../../ports/notification.port";

@EventsHandler(CustomerRegisteredEvent)
export class CustomerRegisteredEventHandler implements IEventHandler<CustomerRegisteredEvent> {
    constructor(
        @Inject(NOTIFICATION_SERVICE)
        private readonly notificationService : INotification
    ) { }
    async handle(event: CustomerRegisteredEvent): Promise<void> {

        await this.notificationService.send({
            recepientId: event.customer.getId().getValue(),
            subject: 'welcome',
            message: `Welcome to clean shop ${event.customer.getFullName()}! Your account has been created.`
        });
    }

}