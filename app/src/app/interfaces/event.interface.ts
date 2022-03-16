import {Round, RoundResult} from './league.interface';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {User} from './user.interface';

export enum EventType {
    UserEvent = 1,
    RoundEvent = 2
}

export interface LeagueEvent {
    date: Date;
    type: EventType;
    event: RoundWithResults | UserEvent;
}

export interface RoundWithResults extends Round {
    results: RoundResult[];
}

export interface RoundLeagueEvent extends LeagueEvent {
    event: RoundWithResults;
}

export interface UserLeagueEvent extends LeagueEvent {
    event: UserEvent;
}

export interface UserEvent {
    date: Date;
    type: UserEventType;
    groupId: number;
    userId: number;
    user: User;
}

export enum UserEventType {
    UserRemoved = "UserRemoved",
    UserJoined = "UserJoined",
    UserLeft = "UserLeft",
    UserRoleChangedAdmin = "UserRoleChangedAdmin",
    UserRoleChangedMember = "UserRoleChangedMember",
}


