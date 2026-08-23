import { Inject, Injectable } from "@nestjs/common";
import { and, eq, notInArray } from "drizzle-orm";
import { OrderRepository } from "src/order/application/ports/order.repository.port";
import { OrderItem } from "src/order/domain/entities/order-item.entity";
import { Order } from "src/order/domain/entities/order.entity";
import { OrderId } from "src/order/domain/value-objects/order-id.vo";
import { OrderStatus } from "src/order/domain/value-objects/order-status.vo";
import { ShippingAddress } from "src/order/domain/value-objects/shipping-address.vo";
import { Money } from "src/shared/domain/value-objects/money";
import { UniqueId } from "src/shared/domain/value-objects/unique-id.vo";
import { DRIZZLE, DrizzleDB } from "src/shared/infrastructure/database/postgres/drizzle.provider";
import { orderItems, orders } from "src/shared/infrastructure/database/postgres/schemas";

@Injectable()
export class DrizzleOrderRepository implements OrderRepository {
    constructor(
        @Inject(DRIZZLE)
        private readonly db: DrizzleDB) { }

    async save(order: Order): Promise<void> {
        const orderRow = DrizzleOrderRepository.toOrderPersistence(order);
        const itemRows = order.items.map((item) => DrizzleOrderRepository.toItemPersistence(item, order.id.getValue()));


        await this.db.transaction(async (tx) => {
            await tx.insert(orders).values(orderRow).onConflictDoUpdate({
                target: orders.id,
                set: {
                    status: orderRow.status,
                    totalAmount: orderRow.totalAmount,
                    currency: orderRow.currency,
                    shippingStreet: orderRow.shippingStreet,
                    shippingCity: orderRow.shippingCity,
                    shippingState: orderRow.shippingState,
                    shippingZipCode: orderRow.shippingZipCode,
                    shippingCountry: orderRow.shippingCountry,
                    trackingNumber: orderRow.trackingNumber,
                    notes: orderRow.notes,
                    updatedAt: orderRow.updatedAt
                }
            })

            for (const itemRow of itemRows) {
                await tx.insert(orderItems).values(itemRow).onConflictDoUpdate({
                    target: orderItems.id,
                    set: {
                        productName: itemRow.productName,
                        unitPriceAmount: itemRow.unitPriceAmount,
                        unitPriceCurrency: itemRow.unitPriceCurrency,
                        quantity: itemRow.quantity,
                        discountAmount: itemRow.discountAmount,
                        discountCurrency: itemRow.discountCurrency,
                        updatedAt: itemRow.updatedAt
                    }
                })
            }
            const currentItemIds = itemRows.map(row => row.id);
            if (currentItemIds.length > 0) {
                await tx.delete(orderItems).where(
                    and(
                        eq(orderItems.orderId, order.id.getValue()),
                        notInArray(orderItems.id, currentItemIds)
                    )
                )
            }
            else {
                await tx.delete(orderItems).where(
                    eq(orderItems.orderId, order.id.getValue())
                )
            }

        })


    }
   async findById(id: OrderId): Promise<Order | null> {
        const result = await this.db.query.orders.findFirst({
            where: eq(orders.id, id.getValue()),
            with: {
                items: true
            }
        })
        return result ? DrizzleOrderRepository.toDomain(result, result.items) : null;
    }
    async findByCustomerId(customerId: string): Promise<Order[]> {
        const result = await this.db.query.orders.findMany({
            where: eq(orders.customerId, customerId),
            with: {
                items: true
            }
        })
        return result.map((order) => DrizzleOrderRepository.toDomain(order, order.items));
    }
    async findAll(): Promise<Order[]> {
        const result = await this.db.query.orders.findMany({
            with: {
                items: true
            }
        })
        return result.map((order) => DrizzleOrderRepository.toDomain(order, order.items));
    }
    async delete(id: OrderId): Promise<void> {
        await this.db.transaction(async (tx)=>{
            await tx.delete(orderItems).where(eq(orderItems.orderId, id.getValue()));
         await tx.delete(orders).where(eq(orders.id, id.getValue()));
        })
    }


    private static toOrderPersistence(order: Order): typeof orders.$inferInsert {
        const total = order.getTotal();
        return {
            id: order.id.getValue(),
            customerId: order.customerId,
            status: order.status.getValue(),
            totalAmount: total.toCents(),
            currency: total.getCurrency(),
            shippingStreet: order.shippingAddress.street,
            shippingCity: order.shippingAddress.city,
            shippingState: order.shippingAddress.state,
            shippingZipCode: order.shippingAddress.zipCode,
            shippingCountry: order.shippingAddress.country,
            trackingNumber: order.trackingNumber,
            notes: order.notes,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt
        };
    }

    private static toItemPersistence(item: OrderItem, orderId: string): typeof orderItems.$inferInsert {
        const unitPrice = item.unitPrice;
        const discount = item?.discount;
        return {
            id: item.getId().getValue(),
            orderId: orderId,
            productId: item.productId,
            productName: item.productName,
            unitPriceAmount: unitPrice.toCents(),
            unitPriceCurrency: unitPrice.getCurrency(),
            quantity: item.quantity,
            discountAmount: item.discount?.toCents() ?? null,
            discountCurrency: item.discount?.getCurrency() ?? null,
            createdAt: new Date(),

        }
    }

    private static toDomain(orderRow: typeof orders.$inferSelect, itemRows: typeof orderItems.$inferSelect[]): Order {
        const items = itemRows.map((row) => {
            const discount = row.discountAmount !== null && row.discountCurrency !== null ?
                Money.create(row.discountAmount / 100, row.discountCurrency) : null;
            return OrderItem.reconstitute({
                id: new UniqueId(row.id),
                productId: row.productId,
                productName: row.productName,
                unitPrice: Money.create(row.unitPriceAmount / 100, row.unitPriceCurrency),
                quantity: row.quantity,
                discount: discount,
            })
        })

        const shippingAddress = ShippingAddress.create({
            street: orderRow.shippingStreet ?? '',
            city: orderRow.shippingCity ?? '',
            state: orderRow.shippingState ?? '',
            zipCode: orderRow.shippingZipCode ?? '',
            country: orderRow.shippingCountry ?? '',
        })

        return Order.reconsitute({
            id: new OrderId(orderRow.id),
            customerId: orderRow.customerId,
            status: OrderStatus.fromString(orderRow.status),
            items: items,
            shippingAddress: shippingAddress,
            trackingNumber: orderRow.trackingNumber,
            notes: orderRow.notes,
            createdAt: orderRow.createdAt,
            updatedAt: orderRow.updatedAt
        })

    }

}