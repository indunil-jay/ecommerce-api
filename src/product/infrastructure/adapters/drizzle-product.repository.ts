import { Inject, Injectable } from "@nestjs/common";

import { SQL, eq, gte, lte, and } from "drizzle-orm";

import { Product } from "src/product/domain/entities/product.entity";
import { ProductId } from "src/product/domain/value-objects/product-id.vo";
import { Sku } from "src/product/domain/value-objects/sku.vo";
import { Money } from "src/shared/domain/value-objects/money";

import { ProductFilters, ProductRepository } from "src/product/application/ports/product.repository.port";

import { DRIZZLE, type DrizzleDB } from "src/shared/infrastructure/database/postgres/drizzle.provider";
import { products } from "src/shared/infrastructure/database/postgres/schemas";


@Injectable()
export class DrizzleProductRepository implements ProductRepository {
    constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) { }


    async save(product: Product): Promise<void> {
        const row = DrizzleProductRepository.toPersistence(product);
        await this.db.insert(products)
            .values(row)
            .onConflictDoUpdate({
                target: products.id,
                set: {
                    name: row.name,
                    description: row.description,
                    sku: row.sku,
                    priceAmount: row.priceAmount,
                    priceCurrency: row.priceCurrency,
                    stockQuantity: row.stockQuantity,
                    isActive: row.isActive,
                    lowStockThreshold: row.lowStockThreshold,
                    updatedAt: row.updatedAt,
                }
            });
    }
    async findById(id: ProductId): Promise<Product | null> {
        const [row] = await this.db.select().from(products).where(eq(products.id, id.getValue()));
        return row ? DrizzleProductRepository.toDomain(row) : null;
    }


    async findByName(name: string): Promise<Product | null> {
        const [row] = await this.db.select().from(products).where(eq(products.name, name)).limit(1);
        return row ? DrizzleProductRepository.toDomain(row) : null;
    }

    async findBySku(sku: Sku): Promise<Product | null> {
        const [row] = await this.db.select().from(products).where(eq(products.sku, sku.getValue())).limit(1);
        return row ? DrizzleProductRepository.toDomain(row) : null;
    }

    async delete(id: ProductId): Promise<void> {
        await this.db.delete(products).where(eq(products.id, id.getValue()));
    }


    async findAll(fiters: ProductFilters): Promise<Product[]> {
        const conditions: SQL[] = [];
        if (fiters.isActive !== undefined) {
            conditions.push(eq(products.isActive, fiters.isActive));
        }
        if (fiters.minPrice !== undefined) {
            conditions.push(gte(products.priceAmount, Math.round(fiters.minPrice * 100)));
        }
        if (fiters.maxPrice !== undefined) {
            conditions.push(lte(products.priceAmount, Math.round(fiters.maxPrice * 100)));
        }
        const rows = conditions.length > 0
            ? await this.db.select().from(products).where(and(...conditions))
            : await this.db.select().from(products);

        return rows.map(DrizzleProductRepository.toDomain);
    }

    private static toPersistence(product: Product): typeof products.$inferInsert {
        return {
            id: product.id.getValue(),
            name: product.name,
            description: product.description,
            sku: product.sku.getValue(),
            priceAmount: product.price.toCents(),
            priceCurrency: product.price.getCurrency(),
            stockQuantity: product.stock,
            isActive: product.isActive,
            lowStockThreshold: product.lowStockThreshold,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
        }
    }

    private static toDomain(row: typeof products.$inferSelect): Product {
        return Product.reconsitute({
            id: new ProductId(row.id),
            name: row.name,
            description: row.description,
            sku: Sku.create(row.sku),
            price: Money.create(row.priceAmount / 100, row.priceCurrency),
            stock: row.stockQuantity,
            isActive: row.isActive,
            lowStockThreshold: row.lowStockThreshold,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
        });
    }

}