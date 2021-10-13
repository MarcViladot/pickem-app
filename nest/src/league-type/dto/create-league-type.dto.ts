import { ApiProperty } from "@nestjs/swagger";

export class createLeagueTypeDto {
  
    @ApiProperty()
    logo: string;
  
    @ApiProperty()
    name: string;

}