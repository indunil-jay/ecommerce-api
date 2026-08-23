import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Query } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { OrderResponseDto } from "./dtos/order-response.dto";
import { PlaceOrderDto } from "./dtos/place-order.dto";
import { GetOrderQuery, GetAllOrdersQuery } from "../application/queries";
import { Order } from "../domain/entities/order.entity";
import { PlaceOrderCommand } from "../application/commands/place-order/place-order.command";
import { DeleteOrderCommand } from "../application/commands/delete-order/delete-order.command";

@Controller("orders")
export class OrderController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) { }

    @Post()
    async place(@Body() createOrderDto: PlaceOrderDto): Promise<void> {
        await this.commandBus.execute<PlaceOrderCommand, void>(
            new PlaceOrderCommand(
                createOrderDto.customerId,
                createOrderDto.items.map((item) => ({
                    productId: item.productId,
                    productName: item.productName,
                    unitPrice: item.unitPrice,
                    currency: item.currency,
                    quantity: item.quantity,
                    discountAmount: item.discountAmount,
                    discountCurrency: item.discountCurrency,
                })),
                {
                    street: createOrderDto.shippingAddress.street,
                    city: createOrderDto.shippingAddress.city,
                    state: createOrderDto.shippingAddress.state,
                    zipCode: createOrderDto.shippingAddress.zipCode,
                    country: createOrderDto.shippingAddress.country,
                }
            )
        );
    }

    @Get()
    async findAll(
        @Query("customerId", new ParseUUIDPipe({ optional: true })) customerId?: string,
    ): Promise<OrderResponseDto[]> {
        const orders = await this.queryBus.execute<GetAllOrdersQuery, Order[]>(
            new GetAllOrdersQuery(customerId)
        );
        return orders.map(OrderResponseDto.fromDomain);
    }

    @Get(":id")
    async findOne(@Param("id", new ParseUUIDPipe()) id: string): Promise<OrderResponseDto> {
        const order = await this.queryBus.execute<GetOrderQuery, Order>(
            new GetOrderQuery(id)
        );
        return OrderResponseDto.fromDomain(order);
    }

    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param("id", new ParseUUIDPipe()) id: string): Promise<void> {
        await this.commandBus.execute<DeleteOrderCommand, void>(
            new DeleteOrderCommand(id)
        );
    }
}