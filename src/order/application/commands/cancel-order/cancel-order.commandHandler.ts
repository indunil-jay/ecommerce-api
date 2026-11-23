import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { OrderId } from "src/order/domain/value-objects/order-id.vo";
import { ApplicationExceptionCode } from "src/shared/domain/enums/application-exception-code";
import { ApplicationException } from "src/shared/domain/exceptions/application.exception";
import { CancelOrderCommand } from "./cancel-order.command";
import { ORDER_REPOSITORY, OrderRepository } from "../../ports/order.repository.port";
import { Inject } from "@nestjs/common";

@CommandHandler(CancelOrderCommand)
export class CancelOrderCommandHandler implements ICommandHandler<CancelOrderCommand, void> {
    constructor(
        @Inject(ORDER_REPOSITORY)
        private readonly orderRepository: OrderRepository,
        private readonly eventPublisher: EventPublisher
    ) {}

    async execute(command: CancelOrderCommand): Promise<void> {
        const order = await this.orderRepository.findById(new OrderId(command.orderId));

        if (!order) {
            throw new ApplicationException(`Order with ID ${command.orderId} not found`, ApplicationExceptionCode.NOT_FOUND);
        }

        const trackedOrder = this.eventPublisher.mergeObjectContext(order);
        trackedOrder.cancel(command.reason);
        await this.orderRepository.save(trackedOrder);
        trackedOrder.commit();
    }
}
