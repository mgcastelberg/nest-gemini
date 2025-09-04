import { Injectable } from '@nestjs/common';
import { BasicPromptDto } from './dtos/basic-prompt.dto';
import { GoogleGenAI } from "@google/genai";
import { basicPromptUseCase } from './use-cases/basic-prompt.use-case';
import { basicPromptStreamUseCase } from './use-cases/basic-prompt-stream.use-case';

@Injectable()
export class GeminiService {

    private ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

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
}

// systemInstruction: "You are a helpful assistant."