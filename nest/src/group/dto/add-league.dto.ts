import { ApiProperty } from "@nestjs/swagger";


export class AddLeagueDto {

  @ApiProperty()
  userGroupId: number;

  @ApiProperty()
  leagueTypeId: number;

}
