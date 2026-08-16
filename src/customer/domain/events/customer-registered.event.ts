import { Customer } from "../entities/customer.entity";

export class CustomerRegisteredEvent {
    constructor(
        public readonly customer: Customer
    ) {}
}