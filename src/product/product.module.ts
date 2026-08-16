import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { ProductController } from "./presentation/product.controller";
import { DrizzleProductRepository } from "./infrastructure/adapters/drizzle-product.repository";
import { PRODUCT_REPOSITORY } from "./application/ports/product.repository.port";
import { CommandHandlers, QueryHandlers } from "./application";

@Module({
   imports :[CqrsModule],
   controllers:[ProductController],
   providers:[
      ...CommandHandlers,
      ...QueryHandlers,
      {
         provide : PRODUCT_REPOSITORY,
         useClass : DrizzleProductRepository
      }
   ]
})
export class ProductModule {

}