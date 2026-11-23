import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { DeliverOrderCommand } from "./deliver-order.command";
import { ORDER_REPOSITORY, OrderRepository } from "../../ports/order.repository.port";
import { Inject } from "@nestjs/common";
import { OrderId } from "src/order/domain/value-objects/order-id.vo";
import { ApplicationException } from "src/shared/domain/exceptions/application.exception";
import { ApplicationExceptionCode } from "src/shared/domain/enums/application-exception-code";


@CommandHandler(DeliverOrderCommand)
export class DeliverOrderCommandHandler implements ICommandHandler<DeliverOrderCommand, void> {
    constructor(
        @Inject(ORDER_REPOSITORY)
        private readonly orderRepository: OrderRepository,
        private readonly eventPublisher: EventPublisher
    ) {}

    async execute(command: DeliverOrderCommand): Promise<void> {
        const order = await this.orderRepository.findById(new OrderId(command.orderId));

        if (!order) {
            throw new ApplicationException(`Order with ID ${command.orderId} not found`, ApplicationExceptionCode.NOT_FOUND);
        }

        const trackedOrder = this.eventPublisher.mergeObjectContext(order);
        trackedOrder.deliver();
        await this.orderRepository.save(trackedOrder);
        trackedOrder.commit();
    }
}



