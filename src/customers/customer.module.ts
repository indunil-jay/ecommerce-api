import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { CUSTOMER_REPOSITORY } from "./application/ports/customer-repository.port";
import { DrizzleCustomerRepository } from "./infrastructure/adapters/drizzle-customer.repository";
import { CustomerController } from "./presentation/customer.controller";
import { CommandHandlers } from "./application/commands";

@Module({
    imports: [CqrsModule],
    controllers: [CustomerController],
    providers: [
        ...CommandHandlers,
        {
            provide: CUSTOMER_REPOSITORY,
            useClass: DrizzleCustomerRepository
        }
    ],
})
export class CustomerModule {}