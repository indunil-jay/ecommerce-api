import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetAllCustomersQuery } from "./get-all-customers.query";
import { Inject } from "@nestjs/common";
import { CUSTOMER_REPOSITORY, CustomerRepository } from "../../ports/customer-repository.port";
import { Customer } from "src/customers/domain/entities/customer.entity";

@QueryHandler(GetAllCustomersQuery)
export class GetAllCustomersQueryHandler implements IQueryHandler<GetAllCustomersQuery, Customer[]> {
    constructor(
        @Inject(CUSTOMER_REPOSITORY)
        private readonly customerRepository: CustomerRepository
    ) {}

    async execute(_query: GetAllCustomersQuery): Promise<Customer[]> {
        return this.customerRepository.findAll();
    }
}
