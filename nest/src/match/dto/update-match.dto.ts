import { ApiProperty } from '@nestjs/swagger';

export class UpdateMatchDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  doublePoints: boolean;

  @ApiProperty()
  finished: boolean;

  @ApiProperty()
  postponed: boolean;
}
