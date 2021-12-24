import { Module } from '@nestjs/common';
import { RoundService } from './round.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Round } from './entities/round.entity';
import { RoundController } from './round.controller';
import { TranslationGroup } from "./entities/translation.group";
import { RoundName } from "./entities/round.name";

@Module({
  imports: [TypeOrmModule.forFeature([Round, TranslationGroup, RoundName])],
  providers: [RoundService],
  controllers: [RoundController],
  exports: [RoundService]
})
export class RoundModule {
}
