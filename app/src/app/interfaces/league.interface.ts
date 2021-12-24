import { Team } from "./team.interface"
import { Group } from "./user.interface";

export interface LeagueInfo {
    leagueInfo: League;
    groupInfo: Group;
    totalPoints: number;
    table: ClassificationTableInfo;
}

export interface ClassificationTableInfo {
    byRounds: any;
    global: GroupedTableByUser[];
}

export interface GroupedTableByUser {
    userId: number;
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
    translationGroup: TranslationGroup;
    translationNameExtra: string;
}

export interface TranslationGroup {
    id: number;
    groupName: string;
    roundNames: RoundName[];
}

export interface RoundName {
    id: number;
    text: string;
    lang: string;
}

export interface Match {
    id: number;
    startDate: string;
    finished: boolean;
    doublePoints: boolean;
    teams: TeamMatch[];
    predictions: Prediction[];
}

export interface Prediction {
    id: number;
    localTeamResult: number;
    awayTeamResult: number;
    correct: boolean;
    points: number;
    userId: number;
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

