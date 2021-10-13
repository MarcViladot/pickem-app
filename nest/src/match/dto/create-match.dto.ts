import { ApiProperty } from '@nestjs/swagger';

export class CreateMatchDto {

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  roundId: number;

  @ApiProperty()
  finished: boolean;

  @ApiProperty()
  doublePoints: boolean;

  @ApiProperty()
  localTeamId: number;

  @ApiProperty()
  awayTeamId: number;

}
