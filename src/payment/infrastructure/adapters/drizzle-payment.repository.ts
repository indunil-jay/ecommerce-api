import { Inject, Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm/pg-core/expressions";
import { PaymentRepository } from "src/payment/application/ports/payment.repository.port";
import { Payment } from "src/payment/domain/entities/payment.entity";
import { PaymentId } from "src/payment/domain/value-objects/payment-id.vo";
import { PaymentStatus } from "src/payment/domain/value-objects/payment-status.vo";
import { Money } from "src/shared/domain/value-objects/money";
import { UniqueId } from "src/shared/domain/value-objects/unique-id.vo";
import { DRIZZLE, DrizzleDB } from "src/shared/infrastructure/database/postgres/drizzle.provider";
import { payments } from "src/shared/infrastructure/database/postgres/schemas/payments.schema";


@Injectable()
export class DrizzlePaymentRepository implements PaymentRepository {
    constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) { }
    async save(payment: Payment): Promise<void> {
        const row = DrizzlePaymentRepository.toPersistence(payment);
        await this.db.insert(payments).values(row).onConflictDoUpdate({
            target: payments.id,
            set: {
                amount: row.amount,
                currency: row.currency,
                status: row.status,
                gatewayTransactionId: row.gatewayTransactionId,
                updatedAt: row.updatedAt,
            },
        });
    }
   async findByOrderId(orderId: UniqueId): Promise<Payment | null> {
       const row = await this.db.query.payments.findFirst({where : eq(payments.orderId, orderId.getValue())});
       if (!row) {
           return null;
       }
       return DrizzlePaymentRepository.toDomain(row);
    }

    private static toDomain(row: typeof payments.$inferSelect): Payment {
        return Payment.reconstitute({
            id: new PaymentId(row.id),
            orderId: row.orderId,
            amount: Money.create(row.amount/100, row.currency),
            status: PaymentStatus.fromString(row.status),
            gatewayTransactionId: row.gatewayTransactionId,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
        });
    }

    private static toPersistence(payment: Payment): typeof payments.$inferSelect {
        return {
            id: payment.id.getValue(),
            orderId: payment.orderId,
        amount: payment.amount.getAmount(),
        currency: payment.amount.getCurrency(),
        status: payment.status.getValue(),
        gatewayTransactionId: payment.gatewayTransactionId,
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt,
    };
 }
 }