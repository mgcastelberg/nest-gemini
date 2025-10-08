import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class BasicPromptDtoFiles {
    @IsString()
    @IsNotEmpty()
    prompt: string;

    @IsArray()
    @IsOptional()
    files?: Express.Multer.File[];
}


