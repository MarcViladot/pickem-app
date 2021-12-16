import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entities/user.entity";
import * as admin from "firebase-admin";
import { FirebaseException, WebApiException } from "../utils/WebApiException";
import { WebApiResponseCode } from "../utils/ResponseApi";

@Injectable()
export class UserService {


  constructor(@InjectRepository(User) private userRepository: Repository<User>) {
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.save({ ...createUserDto });
  }

  async uploadPhotoToStorage(file: any, userId: number): Promise<string> {
    return new Promise((resolve) => {
      const bucket = admin.storage().bucket();
      const fileName = `${userId}.jpg`;
      const blob = bucket.file(fileName);
      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: file.mimetype
        }
      });
      blobStream.on("error", (error) => {
        throw new FirebaseException(error.message);
      });
      blobStream.on("finish", () => {
        const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${fileName}?alt=media`;
        resolve(url);
      });
      blobStream.end(file.buffer);
    });
  }

  async removeUserPhoto(userId: number): Promise<void> {
    const bucket = admin.storage().bucket();
    const fileName = `${userId}.jpg`;
    const file = bucket.file(fileName);
    try {
      await file.delete();
    } catch (e) {
      throw new FirebaseException(e.message);
    }
    return;
  }

  async updateUserPhoto(userId: number, photoUrl: string): Promise<User> {
    const user = await this.userRepository.findOne(userId);
    user.photo = photoUrl;
    return this.userRepository.save(user);
  }

  async findUserById(userId: number): Promise<User | undefined> {
    return this.userRepository.findOne(userId);
  }

  async getCurrentUser(uid: string): Promise<User> {
    return this.userRepository.createQueryBuilder("user")
      .where("user.uid = :uid", { uid })
      .leftJoinAndSelect("user.userGroups", "userGroup", "userGroup.userId = user.id")
      .leftJoinAndSelect("userGroup.group", "group", "userGroup.groupId = group.id")
      .leftJoinAndSelect("group.leagues", "leagueType")
      .getOne();
  }


  async getCurrentUserAdmin(userId: number): Promise<User> {
    return this.userRepository.findOne(userId, {
      relations: ["userGroups", "userGroups.group"]
    });
  }

  async findAll(maxCount: number, nextPageToken: string): Promise<{ parsedUsers: User[], nextPageToken: string }> {
    let func = admin.auth().listUsers(maxCount);
    if (nextPageToken !== "null") {
      func = admin.auth().listUsers(maxCount, nextPageToken);
    }
    const result = await func;
    const uids = result.users.map(user => user.uid);
    const dbUsers = await this.userRepository.find({
      relations: ["userGroups", "userGroups.group"],
      where: {
        uid: In(uids)
      }
    });
    const parsedUsers = dbUsers.map(user => {
      const firebaseUser = result.users.find(fbUser => fbUser.uid === user.uid);
      return {
        ...user,
        firebaseUser
      };
    });
    return {
      nextPageToken: result.pageToken,
      parsedUsers
    };
  }

  async findByEmail(email: string): Promise<User[]> {
    try {
      const user = await admin.auth().getUserByEmail(email);
      const dbUser = await this.userRepository.findOne({
        relations: ["userGroups", "userGroups.group"],
        where: {
          uid: user.uid
        }
      });
      return [{
        ...dbUser,
        firebaseUser: user
      }];
    } catch (e) {
      throw new FirebaseException(e.message);
    }
  }
}
