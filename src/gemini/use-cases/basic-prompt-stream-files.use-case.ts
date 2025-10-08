import { createPartFromUri, createUserContent, GoogleGenAI } from "@google/genai";
import { BasicPromptDtoFiles } from "../dtos/basic-prompt-files.dto";

interface Options {
    model?: string;
    systemInstruction?: string;
}

export const basicPromptStreamFilesUseCase = async (ai: GoogleGenAI, basicPromptDtoFiles: BasicPromptDtoFiles, options?: Options) => {

    const files = basicPromptDtoFiles.files;

    console.log({files});

    const {
        model="gemini-2.5-flash",
        systemInstruction=`Responde únicamente en español en formato markdown. Usa negritas de esta forma __  usa el sistema metrico decimal`
    } = options ?? {};

    const response = await ai.models.generateContentStream({
            model: model,
            // contents: basicPromptDto.prompt,
            contents: [
                createUserContent([
                    basicPromptDtoFiles.prompt,
                    // Imagenes o archivos
                    // createPartFromUri(image.uri ?? "", image.mimeType ?? ""),
                ])
            ],
            config: {
                systemInstruction: systemInstruction,
            }
        });
        console.log(response);
        
        return response;
}