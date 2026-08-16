import { AggregateRoot } from "src/shared/domain/aggregates/aggregate-root";
import { ProductId } from "../value-objects/product-id.vo";
import { Sku } from "../value-objects/sku.vo";
import { Money } from "src/shared/domain/value-objects/money";
import { DomainException } from "src/shared/domain/exceptions/domain.exception";


export interface ProductProps {
    id: ProductId;
    name: string;
    description: string;
    sku: Sku;
    price: Money;
    stock: number;
    isActive: boolean;
    lowStockThreshold: number;
    createdAt: Date;
    updatedAt: Date;

}

export class Product extends AggregateRoot {
    private _id: ProductId;
    private _name: string;
    private _description: string;
    private _sku: Sku;
    private _price: Money;
    private _stock: number;
    private _isActive: boolean;
    private _lowStockThreshold: number;
    private _createdAt: Date;
    private _updatedAt: Date;

    private constructor(props: ProductProps) {
        super();
        this._id = props.id;
        this._name = props.name;
        this._description = props.description;
        this._sku = props.sku;
        this._price = props.price
        this._stock = props.stock;
        this._isActive = props.isActive;
        this._lowStockThreshold = props.lowStockThreshold;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
    }

    public static create(name: string, description: string, sku: string, price: number, currency: string, stock: number): Product {
        Product.validateName(name);
        Product.validateStock(stock);
        return new Product({
            id: new ProductId(),
            name,
            description,
            sku: Sku.create(sku),
            price: Money.create(price, currency),
            stock,
            isActive: stock > 0,
            lowStockThreshold: 10,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    static reconsitute(props: ProductProps): Product {
        return new Product(props);
    }

    private static validateName(name: string): void {
        if (name.length < 3 || name.length > 100) {
            throw new DomainException("Name must be between 3 and 100 characters");
        }

    }

    private static validateStock(stock: number): void {
        if (stock < 0) {
            throw new DomainException("Stock cannot be negative");
        }
    }

    get id(): ProductId {
        return this._id;
    }
    get name(): string {
        return this._name;
    }
    get description(): string {
        return this._description;
    }
    get sku(): Sku {
        return this._sku;
    }
    get price(): Money {
        return this._price;
    }
    get stock(): number {
        return this._stock;
    }
    get isActive(): boolean {
        return this._isActive;
    }
    get lowStockThreshold(): number {
        return this._lowStockThreshold;
    }
    get createdAt(): Date {
        return this._createdAt;
    }
    get updatedAt(): Date {
        return this._updatedAt;
    }

}