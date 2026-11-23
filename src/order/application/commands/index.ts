import { PlaceOrderCommandHandler } from "./place-order/place-order.commandHandler";
import { DeleteOrderCommandHandler } from "./delete-order/delete-order.commandHandler";
import { OrderPlacedEventHandler } from "./place-order/order-placed.event-handler";
import { ConfirmOrderCommandHandler } from "./confirm-order/confirm-order.commandHandler";
import { OrderConfirmedEventHandler } from "./confirm-order/order-confirmed.eventHandler";
import { ShipOrderCommandHandler } from "./ship-order/ship-order.commandHandler";
import { OrderShippedEventHandler } from "./ship-order/order-shipped.eventHandler";

export const CommandHandlers = [
    PlaceOrderCommandHandler,
    DeleteOrderCommandHandler,
    ConfirmOrderCommandHandler,
    ShipOrderCommandHandler
];


export const EventHandlers = [
    OrderPlacedEventHandler,
    OrderConfirmedEventHandler, 
    OrderShippedEventHandler 
];