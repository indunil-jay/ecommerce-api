import { RegisterCustomerCommandHandler } from "./register-customer/register-customer.commandHandler";
import { DeleteCustomerCommandHandler } from "./delete-customer/delete-customer.commandHandler";
import { CustomerRegisteredEventHandler } from "./register-customer/customer-registered.eventHandler";

export const CommandHandlers = [
    RegisterCustomerCommandHandler,
    DeleteCustomerCommandHandler,
];

export const EventHandlers = [
    CustomerRegisteredEventHandler,
];
