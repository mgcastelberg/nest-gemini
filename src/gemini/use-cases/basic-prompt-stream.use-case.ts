import { createPartFromUri, createUserContent, GoogleGenAI } from "@google/genai";
import { BasicPromptDto } from '../dtos/basic-prompt.dto';

interface Options {
    model?: string;
    systemInstruction?: string;
}

export const basicPromptStreamUseCase = async (ai: GoogleGenAI, basicPromptDto: BasicPromptDto, options?: Options) => {

    // const file = basicPromptDto.file;
    const { prompt, file } = basicPromptDto;
    
    console.log(file);

    const {
        model="gemini-2.5-flash",
        systemInstruction=`Responde únicamente en español en formato markdown. Usa negritas de esta forma __  usa el sistema metrico decimal`
    } = options ?? {};

    // Creamos el arreglo de "parts" (texto + posibles archivos)
    const parts: any[] = [prompt];

    // Si se envía un archivo, lo subimos y agregamos al contenido
    if (file) {
        const image = await ai.files.upload({
            file: new Blob([new Uint8Array(file.buffer)], { type: file.mimetype }),
        });

        // Solo si hay URI válida, la añadimos
        if (image?.uri) {
            parts.push(createPartFromUri(image.uri, image.mimeType ?? ""));
        }
    }

    // Llamamos a Gemini con el contenido dinámico
    const response = await ai.models.generateContentStream({
        model,
        contents: [createUserContent(parts)],
        config: {
            systemInstruction,
        },
    });

    console.log(response);
    
    return response;
}

// // forza a que siempre llege una imagen
// export const basicPromptStreamUseCase = async (ai: GoogleGenAI, basicPromptDto: BasicPromptDto, options?: Options) => {

//     // const file = basicPromptDto.file;
//     const { prompt, file } = basicPromptDto;
//     console.log(file);

//     if (!file) {
//     throw new Error("No se envió un archivo");
//     }

//     const image = await ai.files.upload({
//         file: new Blob([new Uint8Array(file.buffer)], { type: file.mimetype }),
//     });

//     const {
//         model="gemini-2.5-flash",
//         systemInstruction=`Responde únicamente en español en formato markdown. Usa negritas de esta forma __  usa el sistema metrico decimal`
//     } = options ?? {};

//     const response = await ai.models.generateContentStream({
//             model: model,
//             // contents: basicPromptDto.prompt,
//             contents: [
//                 createUserContent([
//                     prompt,
//                     // Imagenes o archivos
//                     createPartFromUri(image.uri ?? "", image.mimeType ?? ""),
//                 ])
//             ],
//             config: {
//                 systemInstruction: systemInstruction,
//             }
//         });
//         console.log(response);
        
//         return response;
// }