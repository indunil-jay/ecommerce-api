import { DomainException } from "src/shared/domain/exceptions/domain.exception";

export enum PaymentStatusValue {
    Pending = "pending",
    Processing = "processing",
    Succeeded = "succeeded",
}

export class PaymentStatus {
    private readonly _value: PaymentStatusValue;
    private constructor(value: PaymentStatusValue) {
        this._value = value;
    }

    static pending(): PaymentStatus {
        return new PaymentStatus(PaymentStatusValue.Pending);
    }

    static processing(): PaymentStatus {
        return new PaymentStatus(PaymentStatusValue.Processing);
    }

    static succeeded(): PaymentStatus {
        return new PaymentStatus(PaymentStatusValue.Succeeded);
    }

    static fromString(value: string): PaymentStatus {
       const status  = Object.values(PaymentStatusValue).find(v => v === value);
        if (!status) {
            throw new DomainException(`Invalid payment status: ${value}`);
        }
        return new PaymentStatus(status);
    }
  
    isSucceeded(): boolean {
        return this._value === PaymentStatusValue.Succeeded;
    }

    isProcessing() :boolean {
        return this._value === PaymentStatusValue.Processing
    }

    transitionToSucceeded() : PaymentStatus {
         if(this.isProcessing()){
            throw new DomainException(`Cannot transition to succeeded from ${this._value}. only processing payments can succeed`)
         }
     return PaymentStatus.succeeded()
    }



    getValue(): PaymentStatusValue {
        return this._value;
    }
}