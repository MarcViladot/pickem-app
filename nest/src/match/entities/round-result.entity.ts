import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Round } from '../../round/entities/round.entity';


@Entity()
export class RoundResult {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({default: 0})
  points: number;

  @ManyToOne(() => User, user => user.id)
  @JoinColumn({name: 'userId'})
  user: User;

  @ManyToOne(() => Round, round => round.id)
  @JoinColumn({name: 'roundId'})
  round: Round;



}
