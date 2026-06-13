import { ValidationPipe } from '@nestjs/common';

import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

import { AuditInterceptor } from './common/interceptors/audit.interceptor';

import { AuditLogsService } from './modules/audit-logs/audit-logs.service';

async function bootstrap() {
  const app =
    await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const auditLogsService =
    app.get(AuditLogsService);

  app.useGlobalInterceptors(
    new AuditInterceptor(
      auditLogsService,
    ),
  );

  await app.listen(
    process.env.PORT || 3000,
  );

  console.log(
    `Server running on port 3000`,
  );
}

bootstrap();