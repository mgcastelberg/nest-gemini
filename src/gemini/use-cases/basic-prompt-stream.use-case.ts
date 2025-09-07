import { GoogleGenAI } from "@google/genai";
import { BasicPromptDto } from '../dtos/basic-prompt.dto';

interface Options {
    model?: string;
    systemInstruction?: string;
}

export const basicPromptStreamUseCase = async (ai: GoogleGenAI, basicPromptDto: BasicPromptDto, options?: Options) => {

    const file = basicPromptDto.file;
    console.log(file);

    const {
        model="gemini-2.5-flash",
        systemInstruction=`Responde únicamente en español en formato markdown. Usa negritas de esta forma __  usa el sistema metrico decimal`
    } = options ?? {};

    const response = await ai.models.generateContentStream({
            model: model,
            contents: basicPromptDto.prompt,
            config: {
                systemInstruction: systemInstruction,
            }
        });
        console.log(response);
        
        return response;
}