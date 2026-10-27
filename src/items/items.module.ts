import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { ItemsController } from './items.controller.js';
import { ItemsService } from './items.service.js';
import { ItemDao } from './item.dao.js';

@Module({
  imports: [PrismaModule],
  controllers: [ItemsController],
  providers: [ItemsService, ItemDao],
})
export class ItemsModule {}
