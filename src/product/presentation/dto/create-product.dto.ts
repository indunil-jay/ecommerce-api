import { IsNumber, IsOptional, IsString, Matches, MaxLength, Min, MinLength } from "class-validator";


export class CreateProductDto {
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    name: string;

    @IsString()
    description: string;

    @IsString()
    @MinLength(3)
    @MaxLength(50)
    @Matches(/^[A-Za-z0-9]+$/, {
        message: 'Sku must contain only alphanumeric characters',
    })
    sku: string;


    @IsNumber()
    @Min(0)
    price : number;

    @IsString()
    @MinLength(3)
    @MaxLength(3)
    @IsOptional()
    currency? : string  = "usd";

    @IsNumber()
    @Min(0)
    stock : number;
}