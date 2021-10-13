import { Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export  class CreateTeamDto {

  @ApiProperty()
  name: string;

  @ApiProperty()
  crest: string;

}
