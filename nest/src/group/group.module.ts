import { UserGroup } from './entities/user-group.entity';
import { AuthModule } from './../auth/auth.module';
import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { Group } from './entities/group.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeagueTypeModule } from '../league-type/league-type.module';
import { UserEventModule } from "../user-event/user-event.module";

@Module({
  imports: [
    AuthModule,
    LeagueTypeModule,
    UserEventModule,
    TypeOrmModule.forFeature([Group, UserGroup])
  ],
  providers: [GroupService],
  controllers: [GroupController]
})
export class GroupModule {}
