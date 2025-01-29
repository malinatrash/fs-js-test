import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AmoCRMModule } from './amocrm/amocrm.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AmoCRMModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
