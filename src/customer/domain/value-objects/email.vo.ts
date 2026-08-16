import { DomainException } from "src/shared/domain/exceptions/domain.exception";


export class Email {
    private static readonly EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    static create(value: string): Email {
        const trimmed = value.trim().toLocaleLowerCase();
        if(!trimmed) {
            throw new DomainException('Email address cannot be empty');
        }
        if (!this.isValidEmail(trimmed)) {
            throw new DomainException('Invalid email address');
        }
        return new Email(trimmed);
    }

    private static isValidEmail(email: string): boolean {
        return this.EMAIL_PATTERN.test(email);
    }
    getValue(): string {
        return this.value;
    }

    equals(other: Email): boolean {
        if (other === null || other === undefined) return false;
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}