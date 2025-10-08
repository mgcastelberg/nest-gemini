import { Injectable } from '@nestjs/common';
import * as deepl from "deepl-node";
import { DeeplPromptDto } from './dtos/deepl-prompt.dto';

@Injectable()
export class DeeplService {

    // Authorization: DeepL-Auth-Key [yourAuthKey]
    // https://api-free.deepl.com/v2/translate

    private authKey = process.env.DEEPL_API_KEY || ''; // clave de tu cuenta (Free o Pro)
    private translator = new deepl.Translator(this.authKey);

    async basicPrompt(deeplPromptDto: DeeplPromptDto) {

        const { prompt, targetLang } = deeplPromptDto;

        console.log({prompt, targetLang});

        const result = await this.translator.translateText(
            prompt,   // texto que recibes
            null,     // idioma origen (null = autodetect)
            targetLang as deepl.TargetLanguageCode // idioma destino (ej. inglés)
        );

        console.log(result);
        
        return {
            prompt,
            text: result.text,
            detectedSourceLang: result.detectedSourceLang,
            targetLang
        };
    }

}
