import { ApiProperty } from '@nestjs/swagger';

export class CreateRoundDto {

  @ApiProperty()
  name: string;

  @ApiProperty({type: 'timestamp'})
  startingDate: Date;

  @ApiProperty()
  leagueTypeId: number;

}
