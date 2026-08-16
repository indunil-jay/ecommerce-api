import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteCustomerCommand } from "./delete-customer.command";
import { Inject } from "@nestjs/common";
import { CUSTOMER_REPOSITORY, CustomerRepository } from "../../ports/customer-repository.port";
import { CustomerId } from "src/customers/domain/value-objects/customer-id.vo";
import { ApplicationException } from "src/shared/domain/exceptions/application.exception";
import { ApplicationExceptionCode } from "src/shared/domain/enums/application-exception-code";

@CommandHandler(DeleteCustomerCommand)
export class DeleteCustomerCommandHandler implements ICommandHandler<DeleteCustomerCommand, void> {
    constructor(
        @Inject(CUSTOMER_REPOSITORY)
        private readonly customerRepository: CustomerRepository
    ) {}

    async execute(command: DeleteCustomerCommand): Promise<void> {
        const customerId = new CustomerId(command.id);
        const customer = await this.customerRepository.findById(customerId);
        if (!customer) {
            throw new ApplicationException(`Customer with id ${command.id} not found`, ApplicationExceptionCode.NOT_FOUND);
        }
        await this.customerRepository.delete(customerId);
    }
}
