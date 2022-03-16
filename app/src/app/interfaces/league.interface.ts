import {Team} from "./team.interface"
import {Group, LeagueType, User} from "./user.interface";
import {LeagueEvent} from './event.interface';

export interface ILeagueInfo {
    homeInfo: LeagueHomeInfo;
    leagueInfo: League;
    groupInfo: Group;
    totalPoints: number;
    table: ClassificationTableInfo;
}

export class LeagueInfo implements ILeagueInfo {
    homeInfo: LeagueHomeInfo;
    leagueInfo: League;
    groupInfo: Group;
    totalPoints: number;
    table: ClassificationTableInfo;

    constructor(api: ILeagueInfo) {
        this.setState(api);
    }

    setState(league: ILeagueInfo): void {
        this.homeInfo = league.homeInfo;
        this.leagueInfo = league.leagueInfo;
        this.groupInfo = league.groupInfo;
        this.totalPoints = league.totalPoints;
        this.table = league.table;
    }

    updateNextRound(round: Round): void {
        this.homeInfo.nextRound = {...round};
        this.updateRoundList(round);
    }

    updateRoundList(round: Round): void {
        this.leagueInfo.rounds = this.leagueInfo.rounds.map(r => {
            if (r.id === round.id) {
                return {...round};
            }
            return r;
        });
    }
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
    league?: League;
}

export interface RoundResult {
    id: number;
    points: number;
    user: User;
    userId: number;
    round: Round;
    roundId: number;
    league: LeagueType;
    leagueTypeId: number;
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

export interface LeagueHomeInfo {
    nextRound: Round | null;
    events: LeagueEvent[];
}

