import { Module } from '@nestjs/common';
import { AmoCRMController } from './amocrm.controller';
import { AmoCRMService } from './amocrm.service';

@Module({
  controllers: [AmoCRMController],
  providers: [AmoCRMService],
})
export class AmoCRMModule {}
