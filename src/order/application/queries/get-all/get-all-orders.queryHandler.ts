import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { GetAllOrdersQuery } from "./get-all-orders.query";
import { ORDER_REPOSITORY, OrderRepository } from "../../ports/order.repository.port";
import { Order } from "../../../domain/entities/order.entity";

@QueryHandler(GetAllOrdersQuery)
export class GetAllOrdersQueryHandler implements IQueryHandler<GetAllOrdersQuery, Order[]> {
    constructor(
        @Inject(ORDER_REPOSITORY)
        private readonly orderRepository: OrderRepository,
    ) {}

    async execute(query: GetAllOrdersQuery): Promise<Order[]> {
        if (query.customerId) {
            return this.orderRepository.findByCustomerId(query.customerId);
        }
        return this.orderRepository.findAll();
    }
}
