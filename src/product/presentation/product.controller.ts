import { Body, Controller, Post } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateProductDto } from "./dto/create-product.dto";
import { CreateProductCommand } from "../application/use-cases/create-product/create-product.command";


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

}