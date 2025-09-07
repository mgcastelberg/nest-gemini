import { Body, Controller, Get, HttpStatus, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { GeminiService } from './gemini.service';
import { BasicPromptDto } from './dtos/basic-prompt.dto';
import type { Response } from 'express';

@Controller('gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}
  
  @Get()
  getHello(): string {
    console.log(process.env.GEMINI_API_KEY);
    return 'Hello World!'; //this.geminiService.getHello();
  }

  @Post('basic-prompt')
  basicPrompt(@Body() basicPromptDto: BasicPromptDto) {
    // return basicPrompDto;
    return this.geminiService.basicPrompt(basicPromptDto);
  
  }
  @Post('translate')
  translate(@Body() basicPromptDto: BasicPromptDto) {
    // return basicPrompDto;
    return this.geminiService.translate(basicPromptDto);
  }

  @Post('basic-prompt-stream')
  @UseInterceptors(FileInterceptor('file'))
  async basicPromptStream(
    @Body() basicPromptDto: BasicPromptDto,
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File
  ) {
    basicPromptDto.file = file;
    // console.log(file);
    const stream = await this.geminiService.basicPromptStream(basicPromptDto);
    res.setHeader('Content-Type', 'text/plain');
    res.status(HttpStatus.OK);

    for await (const chunk of stream) {
      const piece = chunk.text;
      console.log(piece);
      res.write(piece);
    }

    res.end();

  }

}
