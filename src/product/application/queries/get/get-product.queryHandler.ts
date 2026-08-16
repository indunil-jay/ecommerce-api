import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetProductQuery } from "./get-product.query";
import { PRODUCT_REPOSITORY, ProductRepository } from "../../ports/product.repository.port";
import { Product } from "src/product/domain/entities/product.entity";
import { Inject } from "@nestjs/common";
import { ProductId } from "src/product/domain/value-objects/product-id.vo";
import { ApplicationException } from "src/shared/domain/exceptions/application.exception";
import { ApplicationExceptionCode } from "src/shared/domain/enums/application-exception-code";

@QueryHandler(GetProductQuery)
export class GetProductQueryHandler implements IQueryHandler<GetProductQuery, Product> {
    constructor(
        @Inject(PRODUCT_REPOSITORY)
        private readonly productRepository: ProductRepository
    ) {}
    async execute(query: GetProductQuery): Promise<Product> {
        const product = await this.productRepository.findById(new ProductId(query.id));
        if (!product) {
            throw new ApplicationException(`Product with id ${query.id} not found`, ApplicationExceptionCode.NOT_FOUND);
        }
        return product;
    }

}