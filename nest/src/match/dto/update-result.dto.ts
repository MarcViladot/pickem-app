import { ApiProperty } from '@nestjs/swagger';

export class UpdateResultDto {

  @ApiProperty()
  matchId: number;

  @ApiProperty()
  localResult: number;

  @ApiProperty()
  awayResult: number;

}
