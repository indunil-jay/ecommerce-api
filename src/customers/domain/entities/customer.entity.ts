import { AggregateRoot } from "src/shared/domain/aggregates/aggregate-root";
import { CustomerId } from "../value-objects/customer-id.vo";
import { Email } from "../value-objects/email.vo";

interface CustomerProps {
    id: CustomerId;
    email:Email;
    firstName: string;
    lastName: string;
    isActive: boolean;
    phone:string| null;
    createdAt: Date;    
    updatedAt: Date;
}

export class Customer extends AggregateRoot {
    private readonly _id: CustomerId;
    private readonly _email: Email;
    private readonly _firstName: string;
    private readonly _lastName: string;
    private readonly _isActive: boolean;
    private readonly _phone: string | null;
    private readonly _createdAt: Date;
    private readonly _updatedAt: Date;

    private constructor(props: CustomerProps) {
        super();
        this._id = props.id;
        this._email = props.email;
        this._firstName = props.firstName;
        this._lastName = props.lastName;
        this._isActive = props.isActive;
        this._phone = props.phone;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
    }

    static register(email:Email, firstName:string, lastName:string,phone:string | null): Customer {
        const id  = new CustomerId();
        const props: CustomerProps = {
            id,
            email,
            firstName,
            lastName,
            isActive: true,
            phone,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        return new Customer(props);    
    }

    static reconstitute(props: CustomerProps): Customer {
        return new Customer(props);
    }

    getFullName(): string {
        return `${this._firstName} ${this._lastName}`;
    }
    getId(): CustomerId {
        return this._id;
    }
    getEmail(): Email { 
        return this._email;
    }
    getFirstName(): string {
        return this._firstName;
    }
    getLastName(): string {
        return this._lastName;
    }
    isActive(): boolean {
        return this._isActive;
    }
    getPhone(): string | null {
        return this._phone;
    }
    getCreatedAt(): Date {
        return this._createdAt;
    }
    getUpdatedAt(): Date {
        return this._updatedAt;
    }
    

}