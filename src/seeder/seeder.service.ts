import { Injectable, Logger } from '@nestjs/common';
import { UserService } from './user/services/user.service';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(private readonly userSeeder: UserService) {}

  async initialize() {
    await this.user();
  }

  user = async (): Promise<void> => {
    this.logger.log('Initializing user ...');
    await this.userSeeder.init();
  };
}
