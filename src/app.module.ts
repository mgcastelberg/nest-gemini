import { Module } from '@nestjs/common';
import { GeminiModule } from './gemini/gemini.module';
import { ConfigModule } from '@nestjs/config';
import { DeeplModule } from './deepl/deepl.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GeminiModule,
    DeeplModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
