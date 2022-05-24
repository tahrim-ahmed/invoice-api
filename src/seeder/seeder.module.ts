import { Module } from '@nestjs/common';
import { UserSeederModule } from './user/user-seeder.module';
import { SeederService } from './seeder.service';
import { configEnvironment } from '../package/env-config/env-config';
import { configTypeorm } from '../package/typeorm-config/typeorm.config';

@Module({
  imports: [configEnvironment(), configTypeorm(), UserSeederModule],
  providers: [SeederService],
})
export class SeederModule {}
