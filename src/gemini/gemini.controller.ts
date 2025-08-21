import { Controller, Get, Post } from '@nestjs/common';
import { GeminiService } from './gemini.service';

@Controller('gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}
  
  @Get()
  getHello(): string {
    console.log(process.env.GEMINI_API_KEY);
    return 'Hello World!'; //this.geminiService.getHello();
  }

  @Post('basic-prompt')
  basicPrompt() {
    return this.geminiService.basicPrompt();
  }

}
