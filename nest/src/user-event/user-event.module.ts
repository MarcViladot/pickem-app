import { Module } from '@nestjs/common';
import { UserEventService } from './user-event.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEvent } from "./entities/user-event.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UserEvent])],
  providers: [UserEventService],
  controllers: [],
  exports: [UserEventService]
})
export class UserEventModule {}
