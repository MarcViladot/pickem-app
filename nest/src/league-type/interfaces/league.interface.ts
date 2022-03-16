import { User } from "../../user/entities/user.entity";
import { Round } from "../../round/entities/round.entity";
import { UserEvent } from "../../user-event/entities/user-event.entity";
import { RoundResult } from "../../match/entities/round-result.entity";

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
  event: RoundWithResults | UserEvent;
}

export class RoundWithResults extends Round {
  results: RoundResult[]; // PARSED WITH ALL USERS
}

export class RoundEvent implements LeagueEvent {
  event: RoundWithResults;
  date: Date;
  type: EventType;

  constructor(date: Date, event: Round, users: User[]) {
    this.date = date;
    this.type = EventType.RoundEvent;
    this.parseAllUsers(event, users);
  }

  private parseAllUsers(round: Round, users: User[]) {
    this.event = new RoundWithResults();
    this.event = {
      ...round,
      results: this.getAllUsersResults(round, users)
    }
  }

  private getAllUsersResults(round: Round, users: User[]): RoundResult[] {
    const missingUsers = users.filter(u => users.some(user => user.id === u.id));
    const resultsOfMissingUsers = missingUsers.map(user => {
      return {
        id: -1,
        points: 0,
        userId: user.id,
        roundId: round.id,
        user: user,
        leagueTypeId: -1,
        round: null,
        league: null
      }
    });
    return round.roundResults.concat(resultsOfMissingUsers).sort((a, b) => b.points - a.points);
  }
}

export class UserLeagueEvent implements LeagueEvent {
  event: UserEvent;
  date: Date;
  type: EventType;

  constructor(event: UserEvent) {
    this.date = event.date;
    this.event = event;
    this.type = EventType.UserEvent;
  }
}

export enum EventType {
  UserEvent = 1,
  RoundEvent = 2
}
