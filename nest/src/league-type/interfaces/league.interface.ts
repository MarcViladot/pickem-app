import { User } from "../../user/entities/user.entity";
import { Round } from "../../round/entities/round.entity";
import { UserEvent } from "../../user-event/entities/user-event.entity";

export interface ClassificationTableInfo {
  byRounds: any;
  global: GroupedTableByUser[];
}

export interface GroupedTableByUser {
  userId: number;
  totalPoints: number;
}

export interface LeagueEvent {
  date: Date;
  type: EventType;
  event: Round | UserEvent;
}

export class RoundEvent implements LeagueEvent {
  event: Round;
  date: Date;
  type: EventType;

  constructor(date: Date, event: Round) {
    this.date = date;
    this.event = event;
    this.type = EventType.RoundEvent;
  }
}

export class UserLeagueEvent implements LeagueEvent {
  event: UserEvent;
  date: Date;
  type: EventType;

  constructor(event: UserEvent) {
    this.date = event.date;
    this.event = event;
    this.type = EventType.RoundEvent;
  }
}

export enum EventType {
  UserEvent = 1,
  RoundEvent = 2
}
