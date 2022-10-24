import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import * as dotenv from "dotenv";
import { UserService } from "./user/user.service";
import { User } from "./user/user.entity";
dotenv.config();

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    console.log("Reached validateUser");
    const user = await this.userService.findUserByUsername(username);
    if (!user) return null;
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;
    return user;
  }
  async login(user: User) {
    const payload = {
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      sub: user.id,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  async register(user: User) {
    const createdUser = await this.userService.storeUser(user);
    console.log(user);
    const payload = {
      firstName: createdUser.firstName,
      lastName: createdUser.lastName,
      username: user.username,
      sub: user.id,
    };
    console.log(payload);
    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SCRET,
      }),
      user,
    };
  }
}
