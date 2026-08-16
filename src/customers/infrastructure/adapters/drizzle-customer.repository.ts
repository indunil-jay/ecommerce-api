import { Inject, Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { CustomerRepository } from "src/customers/application/ports/customer-repository.port";
import { Customer } from "src/customers/domain/entities/customer.entity";
import { CustomerId } from "src/customers/domain/value-objects/customer-id.vo";
import { Email } from "src/customers/domain/value-objects/email.vo";
import { DRIZZLE, DrizzleDB } from "src/shared/infrastructure/database/postgres/drizzle.provider";
import { customers } from "src/shared/infrastructure/database/postgres/schemas";

@Injectable()
export class DrizzleCustomerRepository implements CustomerRepository {
    constructor(
        @Inject(DRIZZLE) private readonly db: DrizzleDB
    ) {
    }
    async save(customer: Customer): Promise<void> {
        const row = DrizzleCustomerRepository.toPersistence(customer);
        await this.db.insert(customers)
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
    async findById(id: CustomerId): Promise<Customer | null> {
        const [row] = await this.db.select().from(customers).where(eq(customers.id, id.getValue())).limit(1);
        return row ? DrizzleCustomerRepository.toDomain(row) : null;
    }
    async findByEmail(email: Email): Promise<Customer | null> {
        const [row] = await this.db.select().from(customers).where(eq(customers.email, email.getValue())).limit(1);
        return row ? DrizzleCustomerRepository.toDomain(row) : null;
    }
    async findByPhone(phone: string): Promise<Customer | null> {
        const [row] = await this.db.select().from(customers).where(eq(customers.phone, phone)).limit(1);
        return row ? DrizzleCustomerRepository.toDomain(row) : null;
    }
    async findAll(): Promise<Customer[]> {
        const rows = await this.db.select().from(customers);
        return rows.map(DrizzleCustomerRepository.toDomain);
    }
    async delete(id: CustomerId): Promise<void> {
        await this.db.delete(customers).where(eq(customers.id, id.getValue()));
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

    private static toDomain(row: typeof customers.$inferSelect): Customer {
        return Customer.reconstitute({
            id: new CustomerId(row.id),
            email:  Email.create(row.email),
            firstName: row.firstName,
            lastName: row.lastName,
            isActive: row.isActive,
            phone: row.phone,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt
        });
    }
}
