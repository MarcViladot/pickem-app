import { ApiProperty } from '@nestjs/swagger';

export class ChangeVisibilityDto {

  @ApiProperty()
  id: number;

  @ApiProperty()
  visible: boolean;
}
