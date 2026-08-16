import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Product } from "src/product/domain/entities/product.entity";
import { Inject } from "@nestjs/common";
import { GetAllProductsQuery } from "./get-all-products.query";
import { PRODUCT_REPOSITORY, ProductRepository } from "../../ports/product.repository.port";


@QueryHandler(GetAllProductsQuery)
export class GetAllProductsQueryHandler implements IQueryHandler<GetAllProductsQuery, Product[]> {
    constructor(
        @Inject(PRODUCT_REPOSITORY)
        private readonly productRepository: ProductRepository
    )  {}

    async execute(query: GetAllProductsQuery): Promise<Product[]> {
        return this.productRepository.findAll({
            isActive: query.isActive,
            minPrice: query.minPrice,
            maxPrice: query.maxPrice,
        });
    }
}