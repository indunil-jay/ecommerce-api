import { DomainException } from '../exceptions/domain.exception';

export class Money {
  private constructor(
    private readonly amount: number,
    private readonly currency: string,
  ) {}

  static create(amount: number, currency: string = 'USD'): Money {
    if (amount < 0) throw new DomainException('Amount cannot be negative');
    const normalized = Math.round(amount * 100) / 100;
    return new Money(normalized, currency.toUpperCase());
  }

  getAmount(): number {
    return this.amount;
  }

  getCurrency(): string {
    return this.currency;
  }

  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }

  toCents(): number {
    return Math.round(this.amount * 100);
  }

  isGreaterThan(other: Money): boolean {
    this.assertSameCurrency(other);
    return this.amount > other.amount;
  }

  subtract(other: Money): Money {
    this.assertSameCurrency(other);
    if (this.amount < other.amount) {
      throw new DomainException('Resulting amount cannot be negative');
    }
    return Money.create(this.amount - other.amount, this.currency);
  }

  add(other: Money): Money {
    this.assertSameCurrency(other);
    return Money.create(this.amount + other.amount, this.currency);
  }

  multiplyBy(factor: number): Money {
    if (factor < 0) throw new DomainException('Factor cannot be negative');
    return Money.create(this.amount * factor, this.currency);
  }

  static zero (currency:string ='usd'):Money {
  return new Money(0,currency.toUpperCase())
  }

  static fromCents(cents:number,currency:string='usd') {
    return new Money(cents/100,currency.toUpperCase())
  }

  private assertSameCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new DomainException('Currencies must match');
    }
  }
}
