import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { LeagueType } from '../../league-type/entities/LeagueType.entity';
import { Match } from '../../match/entities/match.entity';

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

  @OneToMany(() => Match, match => match.round)
  matches: Match[];

}
