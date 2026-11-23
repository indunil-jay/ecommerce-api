import { PlaceOrderCommandHandler } from "./place-order/place-order.commandHandler";
import { DeleteOrderCommandHandler } from "./delete-order/delete-order.commandHandler";
import { OrderPlacedEventHandler } from "./place-order/order-placed.event-handler";

export const CommandHandlers = [
    PlaceOrderCommandHandler,
    DeleteOrderCommandHandler,
];


export const EventHandlers = [
    OrderPlacedEventHandler,
];