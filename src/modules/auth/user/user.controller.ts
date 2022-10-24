import { UserService } from "./user.service";
import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
import { AuthGuard } from "@nestjs/passport";
import { User } from "./user.entity";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { LoginDto } from "./dto/login.dto";
import { Roles } from "./model/role.model";
import { AuthService } from "../passport/auth.service";

@ApiTags("User management")
@Controller({ version: "1", path: "/users" })
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  private static toResponse(users: User[]) {
    return users.map((u) => {
      delete u.password;
      return u;
    });
  }

  @Post("/register")
  @ApiOperation({ summary: "Registers a new user" })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ status: 201, description: "Successfully registered" })
  @ApiResponse({ status: 400, description: "Bad request, validations failed" })
  async register(@Body() registerDto: RegisterDto) {
    const foundUser = await this.userService.findUserByUsername(
      registerDto.username,
    );
    if (foundUser != null)
      throw new BadRequestException("Username have been already used");

    const user = new User();
    user.firstName = registerDto.firstName;
    user.lastName = registerDto.lastName;
    user.username = registerDto.username;
    user.password = registerDto.password;

    const { user: createdUser } = await this.authService.register(user);
    return createdUser;
  }

  @Get()
  @ApiOperation({
    summary: "Returns registered user. Only accessible to admins",
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ status: 200, description: "Successfully" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async users(@Request() request) {
    const user: User = request.user;
    if (user.role != Roles.Admin)
      throw new ForbiddenException("Not allowed to access");

    const users = await this.userService.findAll();

    return UserController.toResponse(users);
  }

  @Post("/login")
  @ApiResponse({ status: 200, description: "Successfully logged in" })
  @ApiResponse({ status: 400, description: "Bad request, validations failed" })
  @ApiResponse({
    status: 401,
    description: "Login failed, invalid credentials",
  })
  @ApiOperation({ summary: "Allows user to login with username & password" })
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    );
    if (!user) throw new BadRequestException("Invalid login credentials");
    return this.authService.login(user);
  }

  @ApiOperation({ summary: "Shows logged in user" })
  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Get("/check")
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ status: 200, description: "Successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  checkLogin(@Request() req) {
    const user = req.user;
    return User.findOne({ where: { id: user.id } });
  }
}
