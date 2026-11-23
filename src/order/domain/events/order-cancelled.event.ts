export class OrderCancelledEvent {
    constructor(
        public readonly orderId: string,
        public readonly customerId: string,
        public readonly reason: string
    ) {}
}
