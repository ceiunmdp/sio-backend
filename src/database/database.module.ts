import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfigModule } from 'src/config/database/database-config.module';
import { DatabaseConfigService } from 'src/config/database/database-config.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [DatabaseConfigModule],
      useExisting: DatabaseConfigService,
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
