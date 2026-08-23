import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, MaxLength, Min, MinLength, ValidateNested } from "class-validator";

export class PlaceOrderItemDto {
    @IsUUID()
    @IsNotEmpty()
    productId: string;

    @IsString()
    @MinLength(1)
    @MaxLength(255)
    productName: string;

    @IsNumber()
    @Min(0)
    unitPrice: number;

    @IsString()
    @IsOptional()
    @MinLength(3)
    @MaxLength(3)
    currency?: string = "usd";

    @IsNumber()
    @Min(1)
    quantity: number;

    @IsNumber()
    @Min(0)
    @IsOptional()
    discountAmount?: number;

    @IsString()
    @IsOptional()
    @MinLength(3)
    @MaxLength(3)
    discountCurrency?: string;
}

export class ShippingAddressDto {
    @IsString()
    @IsNotEmpty()
    street: string;

    @IsString()
    @IsNotEmpty()
    city: string;

    @IsString()
    @IsNotEmpty()
    state: string;

    @IsString()
    @IsNotEmpty()
    zipCode: string;

    @IsString()
    @IsNotEmpty()
    country: string;
}

export class PlaceOrderDto {
    @IsUUID()
    @IsNotEmpty()
    customerId: string;

    @IsArray()
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @Type(() => PlaceOrderItemDto)
    items: PlaceOrderItemDto[];

    @ValidateNested()
    @Type(() => ShippingAddressDto)
    shippingAddress: ShippingAddressDto;
}
