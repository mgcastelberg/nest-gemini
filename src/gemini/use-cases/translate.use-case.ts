import { GoogleGenAI } from "@google/genai";
import { BasicPromptDto } from '../dtos/basic-prompt.dto';

interface Options {
    model?: string;
    systemInstruction?: string;
    targetLangs?: string; // opcional, para hacerlo más flexible
}

export const translateUseCase = async (ai: GoogleGenAI, basicPromptDto: BasicPromptDto, options?: Options) => {

    const {
        model="gemini-2.5-flash",
        targetLangs = { eng: "inglés", fra: "francés" }, 
        systemInstruction=`Responde únicamente en español en formato markdown. Usa negritas de esta forma __  usa el sistema metrico decimal`
    } = options ?? {};

    // Construimos la instrucción
    const langsPrompt = Object.entries(targetLangs)
        .map(([code, lang]) => `"${code}": traducción al ${lang}`)
        .join(", ");

    const response = await ai.models.generateContent({
        model,
        contents: [
            {
                role: "user",
                parts: [
                    {
                    text: `Traduce el siguiente texto al formato JSON con las claves indicadas:\n{ ${langsPrompt} }\n\nTexto: ${basicPromptDto.prompt}`
                    }
                ]
            }
        ],
        config: {
            systemInstruction: "Responde estrictamente en formato JSON válido, sin texto adicional."
        }
    });

    const text = response.text;
    if (!text) {
        return { error: "No se recibió texto de Gemini" };
    }

    // Limpiar posibles bloques de markdown
    const cleaned = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    try {
        return JSON.parse(cleaned);
    } catch {
        return { error: "La respuesta no es un JSON válido", raw: cleaned };
    }


    // const response = await ai.models.generateContent({
    //         model: model,
    //         contents:[
    //             {
    //                 role: "user",
    //                 parts: [
    //                     {
    //                         text: `Traduce el siguiente texto de español a inglés, sin explicaciones, solo la traducción:\n\n${basicPromptDto.prompt}`
    //                     }
    //                 ]
    //             }
    //         ],
    //         config: {
    //             systemInstruction: "Eres un traductor profesional de español a inglés."
    //         }
    //     });
        console.log(response.text);
        
        return response.text;
}