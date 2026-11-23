import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { ConfirmOrderCommand } from "./confirm-order.command";
import { Inject } from "@nestjs/common";
import { ORDER_REPOSITORY, OrderRepository } from "../../ports/order.repository.port";
import { OrderId } from "src/order/domain/value-objects/order-id.vo";
import { ApplicationExceptionCode } from "src/shared/domain/enums/application-exception-code";
import { ApplicationException } from "src/shared/domain/exceptions/application.exception";

@CommandHandler(ConfirmOrderCommand)
export class ConfirmOrderCommandHandler implements ICommandHandler<ConfirmOrderCommand, void> {
    constructor(
        @Inject(ORDER_REPOSITORY)
        private readonly orderRepository: OrderRepository,
        private readonly eventPublisher: EventPublisher
    ) {}

    async execute(command: ConfirmOrderCommand): Promise<void> {
        const order = await this.orderRepository.findById(new OrderId(command.orderId));

        if (!order) {
            throw new ApplicationException(`Order with ID ${command.orderId} not found`, ApplicationExceptionCode.NOT_FOUND);
        }

        const trackedOrder = this.eventPublisher.mergeObjectContext(order);
        trackedOrder.confirm();
        await this.orderRepository.save(trackedOrder);
        trackedOrder.commit();
    }
}
