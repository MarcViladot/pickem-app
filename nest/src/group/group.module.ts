import { UserGroup } from './entities/user-group.entity';
import { AuthModule } from './../auth/auth.module';
import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { Group } from './entities/group.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeagueTypeModule } from '../league-type/league-type.module';

@Module({
  imports: [
    AuthModule,
    LeagueTypeModule,
    TypeOrmModule.forFeature([Group, UserGroup])
  ],
  providers: [GroupService],
  controllers: [GroupController]
})
export class GroupModule {}
