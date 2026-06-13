financial-management-system/
│
├── src/
│   │
│   ├── main.ts
│   ├── app.module.ts
│   │
│   ├── config/
│   │   ├── database.config.ts
│   │   ├── redis.config.ts
│   │   └── app.config.ts
│   │
│   ├── common/
│   │   ├── middleware/
│   │   │   └── tenant.middleware.ts
│   │   │
│   │   ├── interceptors/
│   │   │   └── audit.interceptor.ts
│   │   │
│   │   ├── decorators/
│   │   │   └── tenant.decorator.ts
│   │   │
│   │   ├── guards/
│   │   │   └── roles.guard.ts
│   │   │
│   │   ├── enums/
│   │   │   ├── user-role.enum.ts
│   │   │   └── account-type.enum.ts
│   │   │
│   │   └── utils/
│   │       └── response.util.ts
│   │
│   ├── database/
│   │   ├── migrations/
│   │   │   ├── 001_create_tables.sql
│   │   │   ├── 002_rls_policies.sql
│   │   │   ├── 003_indexes.sql
│   │   │   └── 004_seed_data.sql
│   │   │
│   │   ├── schema/
│   │   │   └── schema.sql
│   │   │
│   │   └── seeds/
│   │       └── seed.ts
│   │
│   ├── modules/
│   │   │
│   │   ├── tenants/
│   │   │   ├── dto/
│   │   │   │   └── create-tenant.dto.ts
│   │   │   │
│   │   │   ├── entities/
│   │   │   │   └── tenant.entity.ts
│   │   │   │
│   │   │   ├── tenants.controller.ts
│   │   │   ├── tenants.service.ts
│   │   │   ├── tenants.module.ts
│   │   │   └── tenants.repository.ts
│   │   │
│   │   ├── users/
│   │   │   ├── dto/
│   │   │   │   ├── create-user.dto.ts
│   │   │   │   └── update-user.dto.ts
│   │   │   │
│   │   │   ├── entities/
│   │   │   │   └── user.entity.ts
│   │   │   │
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.module.ts
│   │   │   └── users.repository.ts
│   │   │
│   │   ├── accounts/
│   │   │   ├── dto/
│   │   │   │   ├── create-account.dto.ts
│   │   │   │   └── update-account.dto.ts
│   │   │   │
│   │   │   ├── entities/
│   │   │   │   └── account.entity.ts
│   │   │   │
│   │   │   ├── accounts.controller.ts
│   │   │   ├── accounts.service.ts
│   │   │  ├── accounts.module.ts
│   │   │   └── accounts.repository.ts
│   │   │
│   │   ├── transactions/
│   │   │   ├── dto/
│   │   │   │   ├── create-transaction.dto.ts
│   │   │   │   └── update-transaction.dto.ts
│   │   │   │
│   │   │   ├── entities/
│   │   │   │   └── transaction.entity.ts
│   │   │   │
│   │   │   ├── transactions.controller.ts
│   │   │   ├── transactions.service.ts
│   │   │   ├── transactions.module.ts
│   │   │   └── transactions.repository.ts
│   │   │
│   │   ├── reports/
│   │   │   ├── reports.controller.ts
│   │   │   ├── reports.service.ts
│   │   │   └── reports.module.ts
│   │   │
│   │   ├── audit-logs/
│   │   │   ├── entities/
│   │   │   │   └── audit-log.entity.ts
│   │   │   │
│   │   │   ├── audit-logs.controller.ts
│   │   │   ├── audit-logs.service.ts
│   │   │   ├── audit-logs.module.ts
│   │   │   └── audit-logs.repository.ts
│   │   │
│   │   └── redis/
│   │       ├── redis.module.ts
│   │       ├── redis.service.ts
│   │       └── redis.provider.ts
│   │
│   ├── README-assets/
│   │   ├── explain-before.png
│   │   ├── explain-after.png
│   │   └── architecture-diagram.png
│   │
│   └── tests/
│       ├── accounts.e2e-spec.ts
│       ├── transactions.e2e-spec.ts
│       └── rls.e2e-spec.ts
│
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
├── nest-cli.json
├── README.md
└── docker-compose.yml