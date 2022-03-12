import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEvent, UserEventType } from "./entities/user-event.entity";

@Injectable()
export class UserEventService {

  constructor(@InjectRepository(UserEvent) private userEventRepository: Repository<UserEvent>) {}

  createEvent(userId: number, groupId: number, eventType: UserEventType): Promise<UserEvent> {
    const userEvent = new UserEvent(userId, groupId, eventType);
    return this.userEventRepository.save(userEvent);
  }
}
