import { ApiProperty } from "@nestjs/swagger";

export class CreateTranslationGroupDto {

  @ApiProperty()
  name: string;

  @ApiProperty()
  rounds: RoundNameDto[];

}

export class RoundNameDto {

  @ApiProperty()
  text: string;

  @ApiProperty()
  lang: string;

}
