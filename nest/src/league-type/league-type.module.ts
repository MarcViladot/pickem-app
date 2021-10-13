import { Module } from '@nestjs/common';
import { LeagueTypeService } from './league-type.service';
import { LeagueTypeController } from './league-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeagueType } from './entities/LeagueType.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LeagueType])],
  providers: [LeagueTypeService],
  controllers: [LeagueTypeController],
  exports: [LeagueTypeService]
})
export class LeagueTypeModule {}
