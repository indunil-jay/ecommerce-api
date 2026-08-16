import { CreateProductCommandHandler } from "./commands/create-product/create-product.commandHandler";
import { GetAllProductsQueryHandler } from "./queries/get-all/get-all-product.queryHandler";
import { GetProductQueryHandler } from "./queries/get/get-product.queryHandler";

export const CommandHandlers = [
    CreateProductCommandHandler
]

export const QueryHandlers = [
    GetAllProductsQueryHandler,
    GetProductQueryHandler
]