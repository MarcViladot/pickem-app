import {Team} from "./Team"

export interface League {
    id: number;
    logo: string;
    name: string;
    rounds?: Round[];
}

export interface CreateLeague {
    logo: string;
    name: string;
}

export interface Round {
    id: number;
    name: string;
    startingDate: string;
    finished: boolean;
    matches?: Match[];
    visible: boolean;
}

export interface UpdateRound {
    id: number;
    name: string;
    startingDate: Date;
    finished: boolean;
}

export interface Match {
    id: number;
    startDate: string;
    finished: boolean;
    doublePoints: boolean;
    teams: TeamMatch[];
}

export interface TeamMatch {
    id: number;
    finalResult: number;
    teamPosition: TeamPosition;
    team: Team;
}

export interface UpdateMatchResult {
    matchId: number;
    localResult: number;
    awayResult: number;
}

export enum TeamPosition {
    LOCAL = 0,
    AWAY = 1
}

export interface CreateRound {
    name: string;
    startingDate: Date;
    leagueTypeId: number;
}
export interface CreateMatch {
    localTeamId: number;
    awayTeamId: number;
    startDate: Date;
    roundId?: number;
    doublePoints: boolean;
}

export interface UpdateMatch {
    id: number;
    startDate: Date;
    doublePoints: boolean;
    finished: boolean;
}
