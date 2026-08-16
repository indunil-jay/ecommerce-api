import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CqrsModule } from "@nestjs/cqrs";
import { ProductController } from "./presentation/product.controller";
import { DrizzleProductRepository } from "./infrastructure/adapters/drizzle-product.repository";
import { MongoProductRepository } from "./infrastructure/adapters/mongo-product.repository";
import { PRODUCT_REPOSITORY, ProductRepository } from "./application/ports/product.repository.port";
import { QueryHandlers } from "./application/queries";
import { CommandHandlers } from "./application/commands";

@Module({
   imports: [CqrsModule],
   controllers: [ProductController],
   providers: [
      ...CommandHandlers,
      ...QueryHandlers,
      DrizzleProductRepository,
      MongoProductRepository,
      {
         provide: PRODUCT_REPOSITORY,
         inject: [ConfigService, DrizzleProductRepository, MongoProductRepository],
         useFactory: (
            config: ConfigService,
            drizzleRepo: DrizzleProductRepository,
            mongoRepo: MongoProductRepository
         ): ProductRepository => {
            const dbType = config.get<string>("DATABASE_TYPE", "postgres");
            return dbType === "mongodb" ? mongoRepo : drizzleRepo;
         }
      }
   ]
})
export class ProductModule { }