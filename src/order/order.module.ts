import { Module } from "@nestjs/common";
import { ORDER_REPOSITORY } from "./application/ports/order.repository.port";
import { DrizzleOrderRepository } from "./infrastructure/adapters/drizzle-order.repository";



@Module({
    imports: [],
    providers: [{
        provide: ORDER_REPOSITORY,
        useClass: DrizzleOrderRepository
    }],
    exports: []
})
export class OrderModule { }