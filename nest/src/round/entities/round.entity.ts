import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { LeagueType } from '../../league-type/entities/LeagueType.entity';
import { Match } from '../../match/entities/match.entity';
import { RoundResult } from "../../match/entities/round-result.entity";
import { TranslationGroup } from "./translation.group";

@Entity()
export class Round {

  @PrimaryGeneratedColumn()
  id: number;

  @Column() // Only used in Admin
  name: string;

  @ManyToOne(() => TranslationGroup, translationGroup => translationGroup.id, {eager: true})
  @JoinColumn({name: 'translationGroupId'})
  translationGroup: number;

  @Column()
  translationGroupId: number;

  @Column()
  translationNameExtra: string;

  @Column({type: 'timestamp', nullable: true})
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

  @Column({type: 'timestamp', nullable: true})
  finishedAt: Date;

}
