import { Body, Controller, Get, Post } from '@nestjs/common';
import { DeeplService } from './deepl.service';
import { DeeplPromptDto } from './dtos/deepl-prompt.dto';

@Controller('deepl')
export class DeeplController {
  constructor(private readonly deeplService: DeeplService) {}

    @Get()
    getHello(): string {
      console.log(process.env.DEEPL_API_KEY);
      return 'Hello World form Deepl!';
    }

    @Post('translate')
    async translate(@Body() deeplPromptDto: DeeplPromptDto) {
      return this.deeplService.basicPrompt(deeplPromptDto);
    }
    
}
