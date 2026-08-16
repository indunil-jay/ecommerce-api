import { Body, Controller, Get, ParseBoolPipe, ParseFloatPipe, Post, Query } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateProductDto } from "./dto/create-product.dto";
import { CreateProductCommand } from "../application/commands/create-product/create-product.command";
import { ProductResponseDto } from "./dto/product-response.dto";
import { GetAllProductsQuery } from "../application/queries/get-all-products.query";


@Controller('products')
export class ProductController {
    constructor(
        private readonly queryBus: QueryBus,
        private readonly commandBus: CommandBus,
    ) { }


    @Post()
    async createProduct(@Body() createProductDto: CreateProductDto) : Promise<void> {
        await this.commandBus.execute(new CreateProductCommand(
            createProductDto.name,
            createProductDto.description,
            createProductDto.sku,
            createProductDto.price,
            createProductDto.currency || 'usd',
            createProductDto.stock
        ));
    }

    @Get()
    async getAllProducts(
        @Query('isActive', new ParseBoolPipe({ optional: true })) isActive?: boolean,
        @Query('minPrice', new ParseFloatPipe({ optional: true })) minPrice?: number,
        @Query('maxPrice', new ParseFloatPipe({ optional: true })) maxPrice?: number
    ) : Promise<ProductResponseDto[]> {
        const products = await this.queryBus.execute(new GetAllProductsQuery(
            isActive,
            minPrice,
            maxPrice
        ));
        return products.map(ProductResponseDto.fromDomain);
    }

}