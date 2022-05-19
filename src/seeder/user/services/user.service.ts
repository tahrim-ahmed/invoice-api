import { Injectable, Logger } from '@nestjs/common';
import { RoleSeeder } from './role.seeder';
import { UserSeeder } from './user.seeder';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly userSeeder: UserSeeder,
    private readonly roleSeeder: RoleSeeder,
  ) {}

  init = async (): Promise<boolean> => {
    if ((await this.userSeeder.count()) <= 0) {
      await this.roleSeeder.initRoles();
      await this.userSeeder.initUsers();
      return true;
    }
    this.logger.log('Seeder run once!!');
    return false;
  };
}
