import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoundDto {

  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({type: 'timestamp'})
  startingDate: Date;

  @ApiProperty()
  finished: boolean;

}
