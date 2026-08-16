import { DomainException } from "src/shared/domain/exceptions/domain.exception";

export type OrderStatusValue = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

export class OrderStatus {
    private static readonly VALID_TRANSITIONS: Record<OrderStatusValue, OrderStatusValue[]> = {
        pending: ["confirmed", "cancelled"],
        confirmed: ["shipped", "cancelled"],
        shipped: ["delivered"],
        delivered: [],
        cancelled: [],
    };

    private constructor(private readonly value: OrderStatusValue) {}

    static fromString(value: string): OrderStatus {
        const valid: OrderStatusValue[] = ["pending", "confirmed", "cancelled", "delivered", "shipped"];

        if (!valid.includes(value as OrderStatusValue)) {
            throw new DomainException(`Invalid order status: ${value}`);
        }

        return new OrderStatus(value as OrderStatusValue);
    }

    canConfirm = (): boolean => this.canTransitionTo("confirmed");
    canShip = (): boolean => this.canTransitionTo("shipped");
    canDeliver = (): boolean => this.canTransitionTo("delivered");
    canCancel = (): boolean => this.canTransitionTo("cancelled");

    confirm = (): OrderStatus => this.transitionTo("confirmed");
    ship = (): OrderStatus => this.transitionTo("shipped");
    deliver = (): OrderStatus => this.transitionTo("delivered");
    cancel = (): OrderStatus => this.transitionTo("cancelled");

    getValue = (): OrderStatusValue => this.value;
    equals = (other: OrderStatus): boolean => this.value === other.value;
    toString = (): string => this.value;

    static pending = (): OrderStatus => new OrderStatus("pending");
    static confirmed = (): OrderStatus => new OrderStatus("confirmed");
    static shipped = (): OrderStatus => new OrderStatus("shipped");
    static delivered = (): OrderStatus => new OrderStatus("delivered");
    static cancelled = (): OrderStatus => new OrderStatus("cancelled");

    private canTransitionTo(target: OrderStatusValue): boolean {
        const allowed = OrderStatus.VALID_TRANSITIONS[this.value];
        return allowed.includes(target);
    }

    private transitionTo(target: OrderStatusValue): OrderStatus {
        if (!this.canTransitionTo(target)) {
            throw new DomainException(`Invalid order status transition: cannot transition from ${this.value} to ${target}`);
        }
        return new OrderStatus(target);
    }
}
