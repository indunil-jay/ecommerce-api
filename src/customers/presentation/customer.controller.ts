import { Body, Controller, Post } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { RegisterCustomerDto } from "./dtos/register-customer.dto";
import { RegisterCustomerCommand } from "../application/commands/register-customer/register-customer.command";

@Controller('customers')
export class CustomerController {
    constructor(
        private readonly commandBus: CommandBus,
    ) {}

    @Post()
    async register(@Body() dto: RegisterCustomerDto): Promise<void> {
        await this.commandBus.execute<RegisterCustomerCommand, void>(
            new RegisterCustomerCommand(
                dto.email,
                dto.firstName,
                dto.lastName,
                dto.phone ?? null
            )
        );
    }
}