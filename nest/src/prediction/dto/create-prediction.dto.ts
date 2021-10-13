import { ApiProperty } from '@nestjs/swagger';


export class CreatePredictionDto {

  @ApiProperty()
  localTeamResult: number;

  @ApiProperty()
  awayTeamResult: number;

  @ApiProperty()
  matchId: number;

}
