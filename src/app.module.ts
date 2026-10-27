import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ItemsModule } from './items/items.module.js';

@Module({
  imports: [
    // Lê o .env e deixa ConfigService disponível em todo o projeto.
    ConfigModule.forRoot({ isGlobal: true }),
    ItemsModule,
  ],
})
export class AppModule {}
