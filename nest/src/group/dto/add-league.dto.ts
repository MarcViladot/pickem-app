import { ApiProperty } from "@nestjs/swagger";


export class AddLeagueDto {

  @ApiProperty()
  groupId: number;

  @ApiProperty()
  leagueTypeIds: number[];

}
