import { DomainException } from "src/shared/domain/exceptions/domain.exception";

export interface ShippingAddressProps {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export class ShippingAddress {
    private readonly _street: string;
    private readonly _city: string;
    private readonly _state: string;
    private readonly _zipCode: string;
    private readonly _country: string;

    private constructor(props: ShippingAddressProps) {
        this._street = props.street;
        this._city = props.city;
        this._state = props.state;
        this._zipCode = props.zipCode;
        this._country = props.country;
    }

    get street(): string {
        return this._street;
    }

    get city(): string {
        return this._city;
    }

    get state(): string {
        return this._state;
    }

    get zipCode(): string {
        return this._zipCode;
    }

    get country(): string {
        return this._country;
    }

    equals(other: ShippingAddress): boolean {
        return (
            this._street === other._street &&
            this._city === other._city &&
            this._state === other._state &&
            this._zipCode === other._zipCode &&
            this._country === other._country
        );
    }

    static create(props: ShippingAddressProps): ShippingAddress {
        if (!props.street || props.street.trim().length === 0) {
            throw new DomainException("Shipping address street is required.");
        }
        if (!props.city || props.city.trim().length === 0) {
            throw new DomainException("Shipping address city is required.");
        }
        if (!props.state || props.state.trim().length === 0) {
            throw new DomainException("Shipping address state is required.");
        }
        if (!props.zipCode || props.zipCode.trim().length === 0) {
            throw new DomainException("Shipping address zipCode is required.");
        }
        if (!props.country || props.country.trim().length === 0) {
            throw new DomainException("Shipping address country is required.");
        }

        return new ShippingAddress({
            street: props.street.trim(),
            city: props.city.trim(),
            state: props.state.trim(),
            zipCode: props.zipCode.trim().toUpperCase(),
            country: props.country.trim(),
        });
    }
}
