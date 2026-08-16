import { Body, Controller, Get, ParseBoolPipe, ParseFloatPipe, Post, Query, Param, ParseUUIDPipe } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateProductDto } from "./dto/create-product.dto";
import { CreateProductCommand } from "../application/commands/create-product/create-product.command";
import { ProductResponseDto } from "./dto/product-response.dto";
import { GetAllProductsQuery } from "../application/queries/get-all/get-all-products.query";
import { GetProductQuery } from "../application/queries/get/get-product.query";
import { Product } from "../domain/entities/product.entity";


@Controller('products')
export class ProductController {
    constructor(
        private readonly queryBus: QueryBus,
        private readonly commandBus: CommandBus,
    ) { }


    @Post()
    async create(@Body() createProductDto: CreateProductDto) : Promise<void> {
        await this.commandBus.execute<CreateProductCommand, void>(new CreateProductCommand(
            createProductDto.name,
            createProductDto.description,
            createProductDto.sku,
            createProductDto.price,
            createProductDto.currency || 'usd',
            createProductDto.stock
        ));
    }

    @Get()
    async findAll(
        @Query('isActive', new ParseBoolPipe({ optional: true })) isActive?: boolean,
        @Query('minPrice', new ParseFloatPipe({ optional: true })) minPrice?: number,
        @Query('maxPrice', new ParseFloatPipe({ optional: true })) maxPrice?: number
    ) : Promise<ProductResponseDto[]> {
        const products = await this.queryBus.execute<GetAllProductsQuery, Product[]>(new GetAllProductsQuery(
            isActive,
            minPrice,
            maxPrice
        ));
        return products.map(ProductResponseDto.fromDomain);
    }

    @Get(':id')
    async findOne(@Param('id', new ParseUUIDPipe()) id: string) : Promise<ProductResponseDto> {
        const product = await this.queryBus.execute<GetProductQuery, Product>(new GetProductQuery(id));
        return ProductResponseDto.fromDomain(product);
    }   

    

}