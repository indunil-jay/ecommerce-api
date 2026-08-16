import { CreateProductCommandHandler } from "./create-product/create-product.commandHandler";
import { DeleteProductCommandHandler } from "./delete-product/delete-product.commandHandler";

export const CommandHandlers = [
    CreateProductCommandHandler,
    DeleteProductCommandHandler,
]