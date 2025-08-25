import { GoogleGenAI } from "@google/genai";
import { BasicPromptDto } from '../dtos/basic-prompt.dto';

interface Options {
    model?: string;
    systemInstruction?: string;
}

export const basicPromptUseCase = async (ai: GoogleGenAI, basicPromptDto: BasicPromptDto, options?: Options) => {

    const {
        model="gemini-2.5-flash",
        systemInstruction=`Responde únicamente en español en formato markdown. Usa negritas de esta forma __  usa el sistema metrico decimal`
    } = options ?? {};

    const response = await ai.models.generateContent({
            model: model,
            contents: basicPromptDto.prompt,
            config: {
                systemInstruction: systemInstruction,
            }
        });
        console.log(response.text);
        
        return response.text;
}