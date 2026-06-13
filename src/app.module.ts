import {
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';

import {
  ConfigModule,
  ConfigService,
} from '@nestjs/config';

import {
  TypeOrmModule,
} from '@nestjs/typeorm';

import {
  CacheModule,
} from '@nestjs/cache-manager';

import {
  APP_GUARD,
} from '@nestjs/core';

import {
  redisStore,
} from 'cache-manager-redis-store';

import { TenantMiddleware }
from './common/middleware/tenant.middleware';

import { RolesGuard }
from './common/guards/roles.guard';

import { User }
from './modules/users/entities/user.entity';

import { TenantsModule }
from './modules/tenants/tenants.module';

import { UsersModule }
from './modules/users/users.module';

import { AccountsModule }
from './modules/accounts/accounts.module';

import { TransactionsModule }
from './modules/transactions/transactions.module';

import { AuditLogsModule }
from './modules/audit-logs/audit-logs.module';

import { ReportsModule }
from './modules/reports/reports.module';
import { Tenant } from './modules/tenants/entities/tenant.entity';

@Module({
  imports: [

    ConfigModule.forRoot({
      isGlobal: true,
    }),

    /*
      REDIS CACHE
    */

    CacheModule.registerAsync({
      isGlobal: true,

      useFactory: async () => ({
        store: await redisStore({

          socket: {
            host: 'localhost',
            port: 6379,
          },

          ttl: 60,
        }),
      }),
    }),

    /*
      DATABASE
    */

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],

      inject: [ConfigService],

      useFactory: (
        configService: ConfigService,
      ) => ({

        type: 'postgres',

        host:
          configService.get<string>(
            'DB_HOST',
          ),

        port:
          configService.get<number>(
            'DB_PORT',
          ),

        username:
          configService.get<string>(
            'DB_USERNAME',
          ),

        password:
          configService.get<string>(
            'DB_PASSWORD',
          ),

        database:
          configService.get<string>(
            'DB_NAME',
          ),

        autoLoadEntities: true,

        synchronize: false,
      }),
    }),

    /*
      REQUIRED FOR RolesGuard
    */

    TypeOrmModule.forFeature([
      User,
      Tenant,
    ]),

    /*
      MODULES
    */

    TenantsModule,

    UsersModule,

    AccountsModule,

    TransactionsModule,

    AuditLogsModule,

    ReportsModule,
  ],

  providers: [

    /*
      GLOBAL RBAC GUARD
    */

    {
      provide: APP_GUARD,

      useClass: RolesGuard,
    },
  ],
})

export class AppModule
  implements NestModule {

  configure(
    consumer: MiddlewareConsumer,
  ) {

    consumer
      .apply(TenantMiddleware)

      .exclude('tenants')

      .forRoutes('*');
  }
}

