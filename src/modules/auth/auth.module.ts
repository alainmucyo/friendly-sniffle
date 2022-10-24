import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocaleStrategy } from "./local.strategy";
import { JwtStrategy } from "./jwt.strategy";
import { UserService } from "./user/user.service";
import { UserController } from "./user/user.controller";

@Module({
  providers: [UserService, AuthService, LocaleStrategy, JwtStrategy],
  controllers: [UserController],
})
export class AuthModule {}
