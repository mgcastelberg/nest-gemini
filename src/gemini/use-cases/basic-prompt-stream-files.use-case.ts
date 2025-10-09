import { createPartFromUri, createUserContent, GoogleGenAI } from "@google/genai";
import { BasicPromptDtoFiles } from "../dtos/basic-prompt-files.dto";

interface Options {
    model?: string;
    systemInstruction?: string;
}

export const basicPromptStreamFilesUseCase = async (ai: GoogleGenAI, basicPromptDtoFiles: BasicPromptDtoFiles, options?: Options) => {

    // const files = basicPromptDtoFiles.files;
    // console.log({files});

    const { prompt, files = [] } = basicPromptDtoFiles;

    // const firstImage = files[0]!;
    // const image = await ai.files.upload({
    //     file: new Blob([new Uint8Array(firstImage.buffer)], { type: firstImage.mimetype }),
    // });

    const images = await Promise.all(
        files.map( async(file) => { 
            return await ai.files.upload({
                file: new Blob([new Uint8Array(file.buffer)], { type: file.mimetype.includes("image") ? file.mimetype : "image/jpg" }),
            });
        })
    );

    const {
        model="gemini-2.5-flash",
        systemInstruction=`Responde únicamente en español en formato markdown. Usa negritas de esta forma __  usa el sistema metrico decimal`
    } = options ?? {};

    const response = await ai.models.generateContentStream({
            model: model,
            // contents: basicPromptDto.prompt,
            contents: [
                createUserContent([
                    prompt,
                    // basicPromptDtoFiles.prompt,
                    // Imagenes o archivos
                    // createPartFromUri(image.uri ?? "", image.mimeType ?? ""), // One image
                    ...images.map(image => createPartFromUri(image.uri ?? "", image.mimeType ?? ""))
                ])
            ],
            config: {
                systemInstruction: systemInstruction,
            }
        });
        console.log(response);
        
        return response;
}