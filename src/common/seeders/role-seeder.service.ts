import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from 'src/users/entities/role.entity';
import { RoleEnum } from '../enum/role.enum';

@Injectable()
export class RolesSeederService implements OnApplicationBootstrap {
  constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) {}

  async onApplicationBootstrap() {
    await this.seedRoles();
  }

  private async seedRoles() {
    const roles = Object.values(RoleEnum);

    for (const role of roles) {
      const existingRole = await this.roleModel.findOne({ title: role });
      if (!existingRole) {
        await this.roleModel.create({ title: role });
        console.log(`Inserted role: ${role}`);
      }
    }
  }
}
