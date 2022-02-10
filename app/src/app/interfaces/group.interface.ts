export interface CreateGroupDto {
    name: string;
    private: boolean;
}


export class AddLeagueDto {
    groupId: number;
    leagueTypeIds: number[];
}
