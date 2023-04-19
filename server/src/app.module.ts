import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { WsModule } from './ws/ws.module';

@Module({
  imports: [DatabaseModule, CloudinaryModule, WsModule],
  providers: [],
})
export class AppModule {}
