import { IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";

export class BasicPromptDto {
    @IsString()
    @IsNotEmpty()
    prompt: string;

    @IsObject()
    @IsOptional()
    file: Express.Multer.File;
}


