import { createPartFromUri, GoogleGenAI } from "@google/genai";
import { ChatPromptDto } from '../dtos/chat-prompt.dto';

interface Options {
    model?: string;
    systemInstruction?: string;
}

export const chatPromptStreamUseCase = async (ai: GoogleGenAI, chatPromptDto: ChatPromptDto, options?: Options) => {

    const { prompt, files = [] } = chatPromptDto;

    // Todo Refatorizar para varios tipos de archivos
    const uploadedFiles = await Promise.all(
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

    const chat = ai.chats.create({
        model: model,
        config: {
            systemInstruction: systemInstruction,
        },
        history: [
            {
                role: "user",
                parts: [{ text: "Hola" }],
            },
            {
                role: "model",
                parts: [{ text: "Hola mundo, ¿que tal?" }],
            },
        ],
    });
    
    return chat.sendMessageStream({
        message: [
            prompt,
            ...uploadedFiles.map((file) => createPartFromUri(file.uri ?? '', file.mimeType ?? '')),
        ]
    })
}