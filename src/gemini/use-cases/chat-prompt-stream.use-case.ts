import { createPartFromUri, GoogleGenAI } from "@google/genai";
import { ChatPromptDto } from '../dtos/chat-prompt.dto';
import { geminiUploadFiles } from "../helpers/gemini-upload";

interface Options {
    model?: string;
    systemInstruction?: string;
}

export const chatPromptStreamUseCase = async (ai: GoogleGenAI, chatPromptDto: ChatPromptDto, options?: Options) => {

    const { prompt, files = [] } = chatPromptDto;
    const uploadedFiles = await geminiUploadFiles(ai, files);

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