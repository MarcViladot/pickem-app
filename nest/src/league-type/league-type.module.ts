import { Module } from '@nestjs/common';
import { LeagueTypeService } from './league-type.service';
import { LeagueTypeController } from './league-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeagueType } from './entities/LeagueType.entity';
import { Group } from "../group/entities/group.entity";

@Module({
  imports: [TypeOrmModule.forFeature([LeagueType, Group])],
  providers: [LeagueTypeService],
  controllers: [LeagueTypeController],
  exports: [LeagueTypeService]
})
export class LeagueTypeModule {}
