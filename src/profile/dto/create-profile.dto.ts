import { Type } from "class-transformer";
import { IsArray, IsDate, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { Gender } from "src/profile/enums/gender.enum";

export class CreateProfileDto {
    @IsString()
    name: string;

    @IsEnum(Gender)
    gender: Gender;

    @Type(() => Date)
    @IsDate({ message: 'birthday must be a valid date' })
    birthday: Date;

    @IsOptional()
    @IsString()
    horoscope: string;

    @IsOptional()
    @IsString()
    zodiac: string;

    @IsNumber()
    height: number;

    @IsNumber()
    weight: number;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    interests: string[]
}