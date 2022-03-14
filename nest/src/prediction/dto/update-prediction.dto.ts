import { ApiProperty } from "@nestjs/swagger";

export class UpdatePredictionDto {

  @ApiProperty()
  localTeamResult: number;

  @ApiProperty()
  awayTeamResult: number;

  @ApiProperty()
  id: number;

  @ApiProperty()
  roundId: number;

}
