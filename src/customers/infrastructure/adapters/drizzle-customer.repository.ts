import { Inject, Injectable } from "@nestjs/common";
import { CustomerRepository } from "src/customers/application/ports/customer-repository.port";
import { Customer } from "src/customers/domain/entities/customer.entity";
import { CustomerId } from "src/customers/domain/value-objects/customer-id.vo";
import { Email } from "src/customers/domain/value-objects/email.vo";
import { DRIZZLE, DrizzleDB } from "src/shared/infrastructure/database/postgres/drizzle.provider";
import { customers } from "src/shared/infrastructure/database/postgres/schemas";

@Injectable()
export class DrizzleCustomerRepository implements CustomerRepository {
    constructor(
        @Inject(DRIZZLE) private readonly drizzle: DrizzleDB
    ) {
    }
    async save(customer: Customer): Promise<void> {
        const row = DrizzleCustomerRepository.toPersistence(customer);
        await this.drizzle.insert(customers)
            .values(row)
            .onConflictDoUpdate({
                target: customers.id,
                set: {
                    email: row.email,
                    firstName: row.firstName,
                    lastName: row .lastName,
                    isActive: row.isActive,
                    phone: row.phone,
                    updatedAt: row.updatedAt
                }
            });
    }
    findById(id: CustomerId): Promise<Customer | null> {
        throw new Error("Method not implemented.");
    }
    findByEmail(email: Email): Promise<Customer | null> {
        throw new Error("Method not implemented.");
    }
    findAll(): Promise<Customer[]> {
        throw new Error("Method not implemented.");
    }
    delete(id: CustomerId): Promise<void> {
        throw new Error("Method not implemented.");
    }

    private static toPersistence(customer: Customer): typeof customers.$inferSelect {
        return {
            id: customer.getId().getValue(),
            email: customer.getEmail().getValue(),
            firstName: customer.getFirstName(),
            lastName: customer.getLastName(),
            isActive: customer.isActive(),
            phone: customer.getPhone(),
            createdAt: customer.getCreatedAt(),
            updatedAt: customer.getUpdatedAt()
        };
    }
}
    

