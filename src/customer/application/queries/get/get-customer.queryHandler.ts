import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetCustomerQuery } from "./get-customer.query";
import { Inject } from "@nestjs/common";
import { CUSTOMER_REPOSITORY, CustomerRepository } from "../../ports/customer-repository.port";
import { Customer } from "src/customer/domain/entities/customer.entity";
import { CustomerId } from "src/customer/domain/value-objects/customer-id.vo";
import { ApplicationException } from "src/shared/domain/exceptions/application.exception";
import { ApplicationExceptionCode } from "src/shared/domain/enums/application-exception-code";

@QueryHandler(GetCustomerQuery)
export class GetCustomerQueryHandler implements IQueryHandler<GetCustomerQuery, Customer> {
    constructor(
        @Inject(CUSTOMER_REPOSITORY)
        private readonly customerRepository: CustomerRepository
    ) {}

    async execute(query: GetCustomerQuery): Promise<Customer> {
        const customer = await this.customerRepository.findById(new CustomerId(query.id));
        if (!customer) {
            throw new ApplicationException(`Customer with id ${query.id} not found`, ApplicationExceptionCode.NOT_FOUND);
        }
        return customer;
    }
}
