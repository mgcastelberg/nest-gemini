import { Injectable } from '@nestjs/common';

@Injectable()
export class GeminiService {

    basicPrompt() {
        return { message: 'Hello World!'};
    }
}
