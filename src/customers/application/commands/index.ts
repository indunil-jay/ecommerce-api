import { RegisterCustomerCommandHandler } from "./register-customer/register-customer.commandHandler";
import { DeleteCustomerCommandHandler } from "./delete-customer/delete-customer.commandHandler";

export const CommandHandlers = [
    RegisterCustomerCommandHandler,
    DeleteCustomerCommandHandler,
];
