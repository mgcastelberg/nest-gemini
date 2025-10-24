import { Injectable } from '@nestjs/common';
import { BasicPromptDto } from './dtos/basic-prompt.dto';
import { Content, GoogleGenAI } from "@google/genai";
import { basicPromptUseCase } from './use-cases/basic-prompt.use-case';
import { basicPromptStreamUseCase } from './use-cases/basic-prompt-stream.use-case';
import { translateUseCase } from './use-cases/translate.use-case';
import { BasicPromptDtoFiles } from './dtos/basic-prompt-files.dto';
import { basicPromptStreamFilesUseCase } from './use-cases/basic-prompt-stream-files.use-case';
import { ChatPromptDto } from './dtos/chat-prompt.dto';
import { chatPromptStreamUseCase } from './use-cases/chat-prompt-stream.use-case';

@Injectable()
export class GeminiService {

    private ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

    // Mantener en memoria el chat
    private chatHistory = new Map<string, Content[]>();

    async basicPrompt(basicPromptDto: BasicPromptDto) {

        return basicPromptUseCase(this.ai, basicPromptDto);

        // const response = await this.ai.models.generateContent({
        //     model: "gemini-2.5-flash",
        //     contents: basicPromptDto.prompt,
        //     config: {
        //         systemInstruction: "Responde únicamente en español, en formato markdown. Usa negritas de esta forma __",
        //     }
        // });
        // console.log(response.text);
        // return response.text;
    
    }
    
    async basicPromptStream(basicPromptDto: BasicPromptDto) {
        return basicPromptStreamUseCase(this.ai, basicPromptDto);
    }

    async basicPromptStreamFiles(basicPromptDtoFiles: BasicPromptDtoFiles) {
        return basicPromptStreamFilesUseCase(this.ai, basicPromptDtoFiles);
    }

    async chatStreamService(chatPromptDto: ChatPromptDto) {
        const chatHistory = this.getChatHistory(chatPromptDto.chatId) ?? [];
        return chatPromptStreamUseCase(this.ai, chatPromptDto, {history: chatHistory});
    }

    async translate(basicPromptDto: BasicPromptDto) {
        return translateUseCase(this.ai, basicPromptDto);    
    }

    saveMessage(chatId: string, message: Content) {
        const messages = this.getChatHistory(chatId) ?? [];
        messages.push(message);
        this.chatHistory.set(chatId, messages);
        console.log(this.chatHistory);
    };

    getChatHistory(chatId: string) {
        // rompe el referencia, para que no lo mute gemini
        return structuredClone(this.chatHistory.get(chatId)) ?? [];
    };
}

// systemInstruction: "You are a helpful assistant."