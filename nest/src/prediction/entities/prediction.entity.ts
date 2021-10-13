import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Match } from '../../match/entities/match.entity';

@Entity()
export class Prediction {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  localTeamResult: number;

  @Column()
  awayTeamResult: number;

  @Column({nullable: true})
  correct: boolean;

  @Column({default: 0})
  points: number;

  @ManyToOne(() => User, user => user.id)
  @JoinColumn({name: 'userId'})
  user: User;

  @ManyToOne(() => Match, match => match.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({name: 'matchId'})
  match: Match;

}
