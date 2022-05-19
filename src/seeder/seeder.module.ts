import { Module } from '@nestjs/common';
import { UserSeederModule } from './user/user-seeder.module';
import { SeederService } from './seeder.service';
import { configEnvironment } from '../packages/env-config/env-config';
import { configTypeorm } from '../packages/typeorm-config/typeorm.config';

@Module({
  imports: [configEnvironment(), configTypeorm(), UserSeederModule],
  providers: [SeederService],
})
export class SeederModule {}
