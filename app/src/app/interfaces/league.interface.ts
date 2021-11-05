import { Team } from "./team.interface"
import { Group } from "./user.interface";

export interface LeagueInfo {
    leagueInfo: League;
    groupInfo: Group;
    totalPoints: number;
}

export interface League {
    id: number;
    logo: string;
    name: string;
    rounds?: Round[];
}

export interface Round {
    id: number;
    name: string;
    startingDate: string;
    finished: boolean;
    matches?: Match[];
    visible: boolean;
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

export enum TeamPosition {
    LOCAL = 0,
    AWAY = 1
}
