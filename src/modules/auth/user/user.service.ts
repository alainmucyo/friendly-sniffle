import { Injectable } from "@nestjs/common";
import { User } from "./user.entity";
import { Roles } from "./model/role.model";

@Injectable()
export class UserService {
  async findAll() {
    return await User.find({
      relations: ["detail"],
      where: { role: Roles.User },
      order: { created_at: "DESC" },
    });
  }

  async storeUser(user: User) {
    return await user.save();
  }

  async findUserByUsername(username: string) {
    return User.findOne({ where: { username } });
  }

  findById(id: string) {
    return User.findOne({ where: { id } });
  }
}
