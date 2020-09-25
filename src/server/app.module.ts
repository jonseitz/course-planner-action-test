import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import session from 'express-session';
import ConnectRedis from 'connect-redis';
import redis from 'redis';
import { HarvardKeyStrategy } from 'server/auth/harvardkey.strategy';
import { DevStrategy } from 'server/auth/dev.strategy';
import { SessionModule, NestSessionOptions } from 'nestjs-session';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { AuthModule } from './auth/auth.module';
import { CourseModule } from './course/course.module';
import { FacultyModule } from './faculty/faculty.module';
import { CourseInstanceModule } from './courseInstance/courseInstance.module';
import { MetadataModule } from './metadata/metadata.module';
import { UserController } from './user/user.controller';
import { HealthCheckController } from './healthCheck/healthCheck.controller';
import { LogModule } from './log/log.module';

/**
 * Base application module that configures the database connections and other
 * resources used by the application.
 */

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (
        config: ConfigService
      ): TypeOrmModuleOptions => (config.dbOptions),
      inject: [ConfigService],
    }),
    SessionModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (
        config: ConfigService
      ): NestSessionOptions => {
        const client = redis.createClient(config.redisURL);
        const RedisStore = ConnectRedis(session);
        const store = new RedisStore({
          client,
          prefix: config.get('REDIS_PREFIX'),
          logErrors: config.isDevelopment,
        });
        return config.getSessionSettings(store);
      },
    }),
    AuthModule.register({
      strategies: [HarvardKeyStrategy, DevStrategy],
    }),
    CourseModule,
    FacultyModule,
    CourseInstanceModule,
    MetadataModule,
    LogModule,
  ],
  controllers: [
    UserController,
    HealthCheckController,
  ],
  providers: [],
})
class AppModule { }

export { AppModule };
