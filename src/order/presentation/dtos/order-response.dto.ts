import { Order } from "src/order/domain/entities/order.entity";
import { OrderItem } from "src/order/domain/entities/order-item.entity";
import { ShippingAddress } from "src/order/domain/value-objects/shipping-address.vo";

export class OrderItemResponseDto {
    id: string;
    productId: string;
    productName: string;
    unitPrice: number;
    currency: string;
    quantity: number;
    discount: number | null;
    subtotal: number;

    static fromDomain(item: OrderItem): OrderItemResponseDto {
        const dto = new OrderItemResponseDto();
        dto.id = item.getId().getValue();
        dto.productId = item.productId;
        dto.productName = item.productName;
        dto.unitPrice = item.unitPrice.getAmount();
        dto.currency = item.unitPrice.getCurrency();
        dto.quantity = item.quantity;
        dto.discount = item.discount ? item.discount.getAmount() : null;
        dto.subtotal = item.getSubtotal().getAmount();
        return dto;
    }
}

export class ShippingAddressResponseDto {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;

    static fromDomain(address: ShippingAddress): ShippingAddressResponseDto {
        const dto = new ShippingAddressResponseDto();
        dto.street = address.street;
        dto.city = address.city;
        dto.state = address.state;
        dto.zipCode = address.zipCode;
        dto.country = address.country;
        return dto;
    }
}

export class OrderResponseDto {
    id: string;
    customerId: string;
    status: string;
    itemCount : number;
    items: OrderItemResponseDto[];
    shippingAddress: ShippingAddressResponseDto;
    total: number;
    currency: string;
    trackingNumber: string | null;
    notes: string | null;
    createdAt: string;
    updatedAt: string;

    static fromDomain(order: Order): OrderResponseDto {
        const dto = new OrderResponseDto();
        const total  = order.getTotal();
        dto.id = order.id.getValue();
        dto.customerId = order.customerId;
        dto.status = order.status.getValue();
        dto.items = order.items.map(OrderItemResponseDto.fromDomain);
        dto.itemCount = order.getItemsCount();
        dto.shippingAddress = ShippingAddressResponseDto.fromDomain(order.shippingAddress);
        dto.total = total.getAmount();
        dto.currency = total.getCurrency();
        dto.trackingNumber = order.trackingNumber;
        dto.notes = order.notes;
        dto.createdAt = order.createdAt.toISOString();
        dto.updatedAt = order.updatedAt.toISOString();
        return dto;
    }
}
