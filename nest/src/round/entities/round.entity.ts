import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { LeagueType } from '../../league-type/entities/LeagueType.entity';
import { Match } from '../../match/entities/match.entity';
import { RoundResult } from "../../match/entities/round-result.entity";

@Entity()
export class Round {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({type: 'timestamp'})
  startingDate: Date;

  @Column({default: false})
  finished: boolean;

  @Column({default: false})
  visible: boolean;

  @ManyToOne(() => LeagueType, leagueType => leagueType.id)
  @JoinColumn({name: 'leagueTypeId'})
  league: LeagueType;

  @Column()
  leagueTypeId: number;

  @OneToMany(() => Match, match => match.round)
  matches: Match[];

  @OneToMany(() => RoundResult, roundResult => roundResult.round)
  roundResults: RoundResult[];

  @UpdateDateColumn()
  updatedAt: Date;

}
