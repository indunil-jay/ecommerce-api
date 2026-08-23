import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { DeleteOrderCommand } from "./delete-order.command";
import { ORDER_REPOSITORY, OrderRepository } from "../../ports/order.repository.port";
import { OrderId } from "../../../domain/value-objects/order-id.vo";
import { ApplicationException } from "src/shared/domain/exceptions/application.exception";
import { ApplicationExceptionCode } from "src/shared/domain/enums/application-exception-code";

@CommandHandler(DeleteOrderCommand)
export class DeleteOrderCommandHandler implements ICommandHandler<DeleteOrderCommand> {
    constructor(
        @Inject(ORDER_REPOSITORY)
        private readonly orderRepository: OrderRepository,
    ) {}

    async execute(command: DeleteOrderCommand): Promise<void> {
        const orderId = new OrderId(command.id);
        const order = await this.orderRepository.findById(orderId);
        if (!order) {
            throw new ApplicationException(`Order with id ${command.id} not found`, ApplicationExceptionCode.NOT_FOUND);
        }
        await this.orderRepository.delete(orderId);
    }
}
