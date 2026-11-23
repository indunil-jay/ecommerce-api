import { GetOrderQueryHandler } from "./get/get-order.queryHandler";
import { GetAllOrdersQueryHandler } from "./get-all/get-all-orders.queryHandler";

export const QueryHandlers = [
    GetOrderQueryHandler,
    GetAllOrdersQueryHandler,
];

export * from "./get/get-order.query";
export * from "./get-all/get-all-orders.query";
