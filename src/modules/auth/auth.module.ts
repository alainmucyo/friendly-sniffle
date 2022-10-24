import { Module } from "@nestjs/common";
import { AuthService } from "./passport/auth.service";
import { LocaleStrategy } from "./passport/local.strategy";
import { JwtStrategy } from "./passport/jwt.strategy";
import { UserService } from "./user/user.service";
import { UserController } from "./user/user.controller";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: `${process.env.JWT_EXPIRES_IN}s` },
    }),
  ],
  providers: [UserService, AuthService, LocaleStrategy, JwtStrategy],
  controllers: [UserController],
})
export class AuthModule {}
