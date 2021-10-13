import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../../../user/entities/user.entity';
import { ITokenPayload } from '../../services/auth.service';

export type RequestWithUser = Request & { user: ITokenPayload }

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

