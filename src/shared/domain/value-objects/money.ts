
export class Money {
    private constructor(
        private readonly amount: number,
        private readonly currency: string) { }

    static create(amount: number, currency: string = "USD"): Money {
        if (amount < 0) throw new Error("Amount cannot be negative");
        const normalized = Math.round(amount * 100) / 100;
        return new Money(normalized, currency.toUpperCase());
    }

    getAmount() {
        return this.amount;
    }

    getCurrency() {
        return this.currency;
    }

    equals(other: Money): boolean {
        return this.amount === other.amount && this.currency === other.currency;
    }
}