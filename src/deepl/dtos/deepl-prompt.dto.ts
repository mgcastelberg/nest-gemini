import { IsNotEmpty, IsString } from "class-validator";

export class DeeplPromptDto {
  @IsString()
  @IsNotEmpty()
  prompt: string;

  @IsString()
  @IsNotEmpty()
  targetLang: string; // luego validamos que sea un código válido
}


