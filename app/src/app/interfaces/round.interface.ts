export interface CreateRoundPredictionDto {
    matchId: number;
    localTeamResult: number;
    awayTeamResult: number;
}

export interface UpdatePredictionDto {
    id: number;
    localTeamResult: number;
    awayTeamResult: number;
}
