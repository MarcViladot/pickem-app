import { Module } from '@nestjs/common';
import { RoundService } from './round.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Round } from './entities/round.entity';
import { RoundController } from './round.controller';
import { LeagueTypeModule } from '../league-type/league-type.module';

@Module({
  imports: [LeagueTypeModule, TypeOrmModule.forFeature([Round])],
  providers: [RoundService],
  controllers: [RoundController],
  exports: [RoundService]
})
export class RoundModule {
}
