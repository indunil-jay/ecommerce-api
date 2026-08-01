import { randomUUID } from "crypto";

export class UniqueId {
    private readonly value: string;

    constructor(id?: string) {
        this.value = id ?? randomUUID();
    }

    getValue(): string {
        return this.value;
    }

    equals(other: UniqueId): boolean {
        if (other === null || other === undefined) return false;
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}