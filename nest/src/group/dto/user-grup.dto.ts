import { UserRole } from './../entities/user-group.entity';
import { ApiProperty } from "@nestjs/swagger";


export class UserGroupDto {

    @ApiProperty()
    userId: number;

    @ApiProperty()
    groupId: number;

    @ApiProperty()
    userRole: UserRole;

}