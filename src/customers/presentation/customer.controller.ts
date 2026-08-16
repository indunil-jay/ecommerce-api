import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { RegisterCustomerDto } from "./dtos/register-customer.dto";
import { RegisterCustomerCommand } from "../application/commands/register-customer/register-customer.command";
import { CustomerResponseDto } from "./dtos/customer-response.dto";
import { GetAllCustomersQuery } from "../application/queries/get-all/get-all-customers.query";
import { GetCustomerQuery } from "../application/queries/get/get-customer.query";
import { Customer } from "../domain/entities/customer.entity";

@Controller('customers')
export class CustomerController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
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

    @Get()
    async findAll(): Promise<CustomerResponseDto[]> {
        const customers = await this.queryBus.execute<GetAllCustomersQuery, Customer[]>(
            new GetAllCustomersQuery()
        );
        return customers.map(CustomerResponseDto.fromDomain);
    }

    @Get(':id')
    async findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<CustomerResponseDto> {
        const customer = await this.queryBus.execute<GetCustomerQuery, Customer>(
            new GetCustomerQuery(id)
        );
        return CustomerResponseDto.fromDomain(customer);
    }
}