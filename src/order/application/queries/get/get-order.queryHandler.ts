import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { GetOrderQuery } from "./get-order.query";
import { ORDER_REPOSITORY, OrderRepository } from "../../ports/order.repository.port";
import { Order } from "../../../domain/entities/order.entity";
import { OrderId } from "../../../domain/value-objects/order-id.vo";
import { ApplicationException } from "src/shared/domain/exceptions/application.exception";
import { ApplicationExceptionCode } from "src/shared/domain/enums/application-exception-code";

@QueryHandler(GetOrderQuery)
export class GetOrderQueryHandler implements IQueryHandler<GetOrderQuery, Order> {
    constructor(
        @Inject(ORDER_REPOSITORY)
        private readonly orderRepository: OrderRepository,
    ) {}

    async execute(query: GetOrderQuery): Promise<Order> {
        const order = await this.orderRepository.findById(new OrderId(query.id));
        if (!order) {
            throw new ApplicationException(`Order with ID ${query.id} not found`, ApplicationExceptionCode.NOT_FOUND);
        }
        return order;
    }
}
