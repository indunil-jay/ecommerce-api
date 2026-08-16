import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { CUSTOMER_REPOSITORY } from "./application/ports/customer-repository.port";
import { DrizzleCustomerRepository } from "./infrastructure/adapters/drizzle-customer.repository";
import { CustomerController } from "./presentation/customer.controller";
import { CommandHandlers, EventHandlers } from "./application/commands";
import { QueryHandlers } from "./application/queries";
import { NOTIFICATION_SERVICE } from "./application/ports/notification.port";
import { ConsoleNotificationAdapter } from "./infrastructure/adapters/console-notification.adapter";
import { NodeMailerNotificationAdapter } from "./infrastructure/adapters/nodemailer-notification.adapter";

@Module({
    imports: [CqrsModule],
    controllers: [CustomerController],
    providers: [
        ...CommandHandlers,
        ...EventHandlers,
        ...QueryHandlers,
        {
            provide: CUSTOMER_REPOSITORY,
            useClass: DrizzleCustomerRepository
        },
        {
            provide:NOTIFICATION_SERVICE,
            useClass: ConsoleNotificationAdapter,
            // useClass: NodeMailerNotificationAdapter
        }
    ],
})
export class CustomerModule {}