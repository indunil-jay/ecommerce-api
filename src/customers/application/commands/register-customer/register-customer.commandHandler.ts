import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { RegisterCustomerCommand } from "./register-customer.command";
import { Inject } from "@nestjs/common";
import { CUSTOMER_REPOSITORY, CustomerRepository } from "../../ports/customer-repository.port";
import { Customer } from "src/customers/domain/entities/customer.entity";
import { Email } from "src/customers/domain/value-objects/email.vo";
import { ApplicationException } from "src/shared/domain/exceptions/application.exception";
import { ApplicationExceptionCode } from "src/shared/domain/enums/application-exception-code";

@CommandHandler(RegisterCustomerCommand)
export class RegisterCustomerCommandHandler implements ICommandHandler<RegisterCustomerCommand, void> {
    constructor(
        @Inject(CUSTOMER_REPOSITORY)
        private readonly customerRepository: CustomerRepository,
        private readonly eventPublisher: EventPublisher
    ) {}

    async execute(command: RegisterCustomerCommand): Promise<void> {
        const email = Email.create(command.email);
        const existingCustomer = await this.customerRepository.findByEmail(email);
        if (existingCustomer) {
            throw new ApplicationException(`Customer with email ${command.email} already exists`, ApplicationExceptionCode.CONFLICT);
        }

        if (command.phone) {
            const existingPhone = await this.customerRepository.findByPhone(command.phone);
            if (existingPhone) {
                throw new ApplicationException(`Customer with phone ${command.phone} already exists`, ApplicationExceptionCode.CONFLICT);
            }
        }

        const customer = this.eventPublisher.mergeObjectContext(
            Customer.register(
                email,
                command.firstName,
                command.lastName,
                command.phone
            )
        )

        await this.customerRepository.save(customer);
        customer.commit();
    }
}
