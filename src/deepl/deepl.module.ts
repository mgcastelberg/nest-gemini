import { Module } from '@nestjs/common';
import { DeeplService } from './deepl.service';
import { DeeplController } from './deepl.controller';

@Module({
  controllers: [DeeplController],
  providers: [DeeplService],
})
export class DeeplModule {}
