import { Inject, Injectable, Logger } from "@nestjs/common";
import { INotification, Notification } from "../../application/ports/notification.port";
import { CUSTOMER_REPOSITORY, CustomerRepository } from "src/customer/application/ports/customer-repository.port";
import { CustomerId } from "src/customer/domain/value-objects/customer-id.vo";

@Injectable()
export class ConsoleNotificationAdapter implements INotification {
    private readonly logger  = new Logger(ConsoleNotificationAdapter.name);
    constructor(
      @Inject(CUSTOMER_REPOSITORY)
      private readonly customerRepository:CustomerRepository
    ){}
    async send(notification: Notification): Promise<void> {
        const customer = await this.customerRepository.findById(new CustomerId(notification.recepientId));
        
       this.logger.log(`Sending notification to ${customer?.getFullName()} with subject: ${notification.subject} and message: ${notification.message}`);
    }
}