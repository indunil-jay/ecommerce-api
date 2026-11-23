import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { PlaceOrderCommand } from "./place-order.command";
import { ORDER_REPOSITORY, OrderRepository } from "../../ports/order.repository.port";
import { Order } from "../../../domain/entities/order.entity";
import { OrderItem } from "../../../domain/entities/order-item.entity";
import { ShippingAddress } from "../../../domain/value-objects/shipping-address.vo";
import { Money } from "src/shared/domain/value-objects/money";
import { CUSTOMER, CustomerPort } from "../../ports/customer.port";
import { PRODUCT, ProductPort } from "../../ports/product.port";
import { ApplicationException } from "src/shared/domain/exceptions/application.exception";
import { ApplicationExceptionCode } from "src/shared/domain/enums/application-exception-code";

@CommandHandler(PlaceOrderCommand)
export class PlaceOrderCommandHandler implements ICommandHandler<PlaceOrderCommand, void> {

    constructor(
        @Inject(ORDER_REPOSITORY)
        private readonly orderRepository: OrderRepository,
        @Inject(CUSTOMER)
        private readonly customer: CustomerPort,
        @Inject(PRODUCT)
        private readonly product: ProductPort,
        private readonly eventPublisher: EventPublisher
    ) { }

    async execute(command: PlaceOrderCommand): Promise<void> {
        const customerExists = await this.customer.exists(command.customerId);
        if (!customerExists) {
            throw new ApplicationException(`Customer with id ${command.customerId} not found`,
                ApplicationExceptionCode.NOT_FOUND);
        }

        for (const item of command.items) {
            const productExists = await this.product.exists(item.productId);
            if (!productExists) {
                throw new ApplicationException(`Product with id ${item.productId} not found`,
                    ApplicationExceptionCode.NOT_FOUND);
            }
        }

        const items = command.items.map((item) => {
            const orderItem = OrderItem.create(
                item.productId,
                item.productName,
                Money.create(item.unitPrice, item.currency || "usd"),
                item.quantity,
            );
            if (item.discountAmount !== undefined && item.discountAmount !== null) {
                orderItem.applyDiscount(
                    Money.create(item.discountAmount, item.discountCurrency || item.currency || "usd")
                );
            }
            return orderItem;
        });

        const shippingAddress = ShippingAddress.create({
            street: command.shippingAddress.street,
            city: command.shippingAddress.city,
            state: command.shippingAddress.state,
            zipCode: command.shippingAddress.zipCode,
            country: command.shippingAddress.country,
        });

        const order = this.eventPublisher.mergeObjectContext(Order.place(command.customerId, items, shippingAddress));
        await this.orderRepository.save(order);
        order.commit();
    }
}
