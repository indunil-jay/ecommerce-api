import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { ORDER_REPOSITORY } from "./application/ports/order.repository.port";
import { DrizzleOrderRepository } from "./infrastructure/adapters/drizzle-order.repository";
import { OrderController } from "./presentation/order.controller";
import { CommandHandlers, EventHandlers } from "./application/commands";
import { QueryHandlers } from "./application/queries";
import { CUSTOMER } from "./application/ports/customer.port";
import { CustomerAdapter } from "./infrastructure/adapters/customer.adapter";
import { PRODUCT } from "./application/ports/product.port";
import { ProductAdapter } from "./infrastructure/adapters/product.adapter";
import { CustomerModule } from "src/customer/customer.module";
import { ProductModule } from "src/product/product.module";

@Module({
    imports: [ CustomerModule, ProductModule],
    controllers: [OrderController],
    providers: [
        ...CommandHandlers,
        ...QueryHandlers,
        ...EventHandlers,
        {
            provide: ORDER_REPOSITORY,
            useClass: DrizzleOrderRepository
        },
        {
            provide: CUSTOMER,
            useClass: CustomerAdapter
        },
        {
            provide: PRODUCT,
            useClass: ProductAdapter
        }
    ],
    exports: [ORDER_REPOSITORY]
})
export class OrderModule { }