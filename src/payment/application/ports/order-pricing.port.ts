import { Money } from "src/shared/domain/value-objects/money"

export const ORDER_PRICING = Symbol('ORDER_PRICING')


export interface PricingLine {
    name:string;
    unitAmount:Money;
    quantity:number
}
export interface OrderPricing {
    total : Money
    lines : PricingLine[]
}

export interface IOrderPricing {
    getOrderPricing(orderId:string):Promise<OrderPricing |null>
}