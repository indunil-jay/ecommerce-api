---
name: ddd-module-generator
description: Scaffolds a complete Domain-Driven Design (DDD) & CQRS module in the ecommerce-api project with all required TypeScript boilerplate, Clean Architecture layers, Drizzle ORM repository, schemas, DTOs, controllers, and dependency injection wiring.
---

# DDD & CQRS Module Generator for ecommerce-api

Use this skill whenever creating a new feature module (e.g., `referrals`, `inventory`, `payments`, `cart`) in this codebase. It enforces strict Clean Architecture / DDD conventions, file structure, naming standards, and DI registration matching the existing `product`, `customer`, and `order` modules.

---

## 1. Clean Architecture Dependency Rules

> [!IMPORTANT]
> **Strict Dependency Inversion & Layer Direction Rules**:
> 1. **Domain Layer (Core)**: 0 external dependencies. Never imports from Application, Infrastructure, or Presentation.
> 2. **Application Layer (Use Cases / CQRS)**: Depends **ONLY** on Domain. **NEVER** import anything from Presentation (e.g., Request/Response DTOs) or Infrastructure. Commands and queries must define their own self-contained command inputs or use primitives.
> 3. **Infrastructure Layer (Adapters)**: Implements Application ports (`ports/<module>.repository.port.ts`). Injects database instances via DI tokens.
> 4. **Presentation Layer (Controllers & DTOs)**: Outer layer. Depends on Application (dispatches commands & queries via `CommandBus`/`QueryBus`). Maps Presentation Request DTOs -> Application Commands, and Domain entities -> Response DTOs.

```text
┌────────────────────────────────────────────────────────┐
│                   Presentation Layer                   │
│   (Controllers, Request/Response DTOs, HTTP Routes)   │
└──────────────────────────┬─────────────────────────────┘
                           │ Dispatches commands/queries
                           ▼
┌────────────────────────────────────────────────────────┐
│                   Application Layer                    │
│   (Commands, Queries, Handlers, Ports/Interfaces)      │
└──────────┬─────────────────────────────────┬───────────┘
           │ Implements Ports                │ Uses Entities & VOs
           ▼                                 ▼
┌───────────────────────┐         ┌──────────────────────┐
│  Infrastructure Layer │         │     Domain Layer     │
│ (Drizzle/Mongo Repos) │         │ (Entities, VOs, Root)│
└───────────────────────┘         └──────────────────────┘
```

---

## 2. Architectural File Structure

For a new module `<module>` (e.g., `referral`), create the following directory tree under `src/<module>/`:

```text
src/<module>/
├── application/
│   ├── commands/
│   │   ├── create-<module>/
│   │   │   ├── create-<module>.command.ts
│   │   │   └── create-<module>.commandHandler.ts
│   │   ├── delete-<module>/
│   │   │   ├── delete-<module>.command.ts
│   │   │   └── delete-<module>.commandHandler.ts
│   │   └── index.ts
│   ├── queries/
│   │   ├── get/
│   │   │   ├── get-<module>.query.ts
│   │   │   └── get-<module>.queryHandler.ts
│   │   ├── get-all/
│   │   │   ├── get-all-<module>s.query.ts
│   │   │   └── get-all-<module>s.queryHandler.ts
│   │   └── index.ts
│   └── ports/
│       └── <module>.repository.port.ts
├── domain/
│   ├── entities/
│   │   └── <module>.entity.ts
│   ├── value-objects/
│   │   └── <module>-id.vo.ts
│   └── events/
│       └── <module>-created.event.ts (optional)
├── infrastructure/
│   └── adapters/
│       └── drizzle-<module>.repository.ts
├── presentation/
│   ├── dtos/
│   │   ├── create-<module>.dto.ts
│   │   └── <module>-response.dto.ts
│   └── <module>.controller.ts
└── <module>.module.ts
```

Shared schema files to register/update:
- `src/shared/infrastructure/database/postgres/schemas/<module>.schema.ts`
- `src/shared/infrastructure/database/postgres/schemas/index.ts` (export schema)
- `src/app.module.ts` (register module in `imports`)
- `http/<module>/` (`<module>.post.http`, `<module>-get.http`, `<module>.delete.http`)

---

## 3. Layer-by-Layer Implementation Standards

### A. Domain Layer (`src/<module>/domain/`)

#### 1. Value Object: `<module>-id.vo.ts`
```typescript
import { UniqueId } from "src/shared/domain/value-objects/unique-id.vo";

export class <Module>Id extends UniqueId {
    constructor(value?: string) {
        super(value);
    }
}
```

#### 2. Aggregate Root Entity: `<module>.entity.ts`
```typescript
import { AggregateRoot } from "src/shared/domain/aggregates/aggregate-root";
import { <Module>Id } from "../value-objects/<module>-id.vo";
import { DomainException } from "src/shared/domain/exceptions/domain.exception";

export interface <Module>Props {
    id: <Module>Id;
    createdAt: Date;
    updatedAt: Date;
}

export class <Module> extends AggregateRoot {
    private _id: <Module>Id;
    private _createdAt: Date;
    private _updatedAt: Date;

    private constructor(props: <Module>Props) {
        super();
        this._id = props.id;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
    }

    public static create(): <Module> {
        return new <Module>({
            id: new <Module>Id(),
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    public static reconstitute(props: <Module>Props): <Module> {
        return new <Module>(props);
    }

    get id(): <Module>Id {
        return this._id;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }
}
```

---

### B. Application Layer (`src/<module>/application/`)

> [!CAUTION]
> **No Presentation Imports**: Never import anything from `presentation/dtos` in this layer. Define command interfaces/types locally in the command file.

#### 1. Repository Port: `ports/<module>.repository.port.ts`
```typescript
import { <Module> } from "../../domain/entities/<module>.entity";
import { <Module>Id } from "../../domain/value-objects/<module>-id.vo";

export const <MODULE_UPPER>_REPOSITORY = Symbol('<MODULE_UPPER>_REPOSITORY');

export interface <Module>Repository {
    save(entity: <Module>): Promise<void>;
    findById(id: <Module>Id): Promise<<Module> | null>;
    findAll(): Promise<<Module>[]>;
    delete(id: <Module>Id): Promise<void>;
}
```

#### 2. Commands & Handlers (`commands/`)
- `create-<module>/create-<module>.command.ts`:
  ```typescript
  export interface Create<Module>CommandInput {
      // Define application-level input fields using primitive types
  }

  export class Create<Module>Command {
      constructor(public readonly input: Create<Module>CommandInput) {}
  }
  ```
- `create-<module>/create-<module>.commandHandler.ts`:
  ```typescript
  import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
  import { Inject } from "@nestjs/common";
  import { Create<Module>Command } from "./create-<module>.command";
  import { <MODULE_UPPER>_REPOSITORY, <Module>Repository } from "../../ports/<module>.repository.port";
  import { <Module> } from "../../../domain/entities/<module>.entity";

  @CommandHandler(Create<Module>Command)
  export class Create<Module>CommandHandler implements ICommandHandler<Create<Module>Command, <Module>> {
      constructor(
          @Inject(<MODULE_UPPER>_REPOSITORY)
          private readonly repository: <Module>Repository,
      ) {}

      async execute(command: Create<Module>Command): Promise<<Module>> {
          const entity = <Module>.create();
          await this.repository.save(entity);
          return entity;
      }
  }
  ```
- `delete-<module>/delete-<module>.command.ts` and `delete-<module>.commandHandler.ts` following the same pattern with `@CommandHandler(Delete<Module>Command)`.
- `commands/index.ts`:
  ```typescript
  import { Create<Module>CommandHandler } from "./create-<module>/create-<module>.commandHandler";
  import { Delete<Module>CommandHandler } from "./delete-<module>/delete-<module>.commandHandler";

  export const CommandHandlers = [
      Create<Module>CommandHandler,
      Delete<Module>CommandHandler,
  ];

  export * from "./create-<module>/create-<module>.command";
  export * from "./create-<module>/create-<module>.commandHandler";
  export * from "./delete-<module>/delete-<module>.command";
  export * from "./delete-<module>/delete-<module>.commandHandler";
  ```

#### 3. Queries & Handlers (`queries/`)
- `get/get-<module>.query.ts` & `get-<module>.queryHandler.ts`:
  ```typescript
  import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
  import { Inject } from "@nestjs/common";
  import { Get<Module>Query } from "./get-<module>.query";
  import { <MODULE_UPPER>_REPOSITORY, <Module>Repository } from "../../ports/<module>.repository.port";
  import { <Module> } from "../../../domain/entities/<module>.entity";
  import { <Module>Id } from "../../../domain/value-objects/<module>-id.vo";
  import { ApplicationException } from "src/shared/domain/exceptions/application.exception";
  import { ApplicationExceptionCode } from "src/shared/domain/enums/application-exception-code";

  export class Get<Module>Query {
      constructor(public readonly id: string) {}
  }

  @QueryHandler(Get<Module>Query)
  export class Get<Module>QueryHandler implements IQueryHandler<Get<Module>Query, <Module>> {
      constructor(
          @Inject(<MODULE_UPPER>_REPOSITORY)
          private readonly repository: <Module>Repository,
      ) {}

      async execute(query: Get<Module>Query): Promise<<Module>> {
          const entity = await this.repository.findById(new <Module>Id(query.id));
          if (!entity) {
              throw new ApplicationException('<Module> not found', ApplicationExceptionCode.NOT_FOUND);
          }
          return entity;
      }
  }
  ```
- `get-all/get-all-<module>s.query.ts` & `get-all-<module>s.queryHandler.ts`
- `queries/index.ts`:
  ```typescript
  import { Get<Module>QueryHandler } from "./get/get-<module>.queryHandler";
  import { GetAll<Module>sQueryHandler } from "./get-all/get-all-<module>s.queryHandler";

  export const QueryHandlers = [
      Get<Module>QueryHandler,
      GetAll<Module>sQueryHandler,
  ];

  export * from "./get/get-<module>.query";
  export * from "./get/get-<module>.queryHandler";
  export * from "./get-all/get-all-<module>s.query";
  export * from "./get-all/get-all-<module>s.queryHandler";
  ```

---

### C. Database & Infrastructure Layer

#### 1. Drizzle Schema: `src/shared/infrastructure/database/postgres/schemas/<module>.schema.ts`
```typescript
import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

export const <modules> = pgTable("<modules>", {
    id: uuid("id").primaryKey(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
```

#### 2. Export Schema in `src/shared/infrastructure/database/postgres/schemas/index.ts`
```typescript
export { <modules> } from "./<module>.schema";
```

#### 3. Drizzle Repository Adapter: `src/<module>/infrastructure/adapters/drizzle-<module>.repository.ts`
```typescript
import { Inject, Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { <Module>Repository } from "../../application/ports/<module>.repository.port";
import { <Module> } from "../../domain/entities/<module>.entity";
import { <Module>Id } from "../../domain/value-objects/<module>-id.vo";
import { DRIZZLE, DrizzleDB } from "src/shared/infrastructure/database/postgres/drizzle.provider";
import { <modules> } from "src/shared/infrastructure/database/postgres/schemas";

@Injectable()
export class Drizzle<Module>Repository implements <Module>Repository {
    constructor(
        @Inject(DRIZZLE)
        private readonly db: DrizzleDB,
    ) {}

    async save(entity: <Module>): Promise<void> {
        const persistence = Drizzle<Module>Repository.toPersistence(entity);
        await this.db.insert(<modules>).values(persistence).onConflictDoUpdate({
            target: <modules>.id,
            set: persistence,
        });
    }

    async findById(id: <Module>Id): Promise<<Module> | null> {
        const result = await this.db.query.<modules>.findFirst({
            where: eq(<modules>.id, id.getValue()),
        });
        return result ? Drizzle<Module>Repository.toDomain(result) : null;
    }

    async findAll(): Promise<<Module>[]> {
        const result = await this.db.query.<modules>.findMany();
        return result.map(Drizzle<Module>Repository.toDomain);
    }

    async delete(id: <Module>Id): Promise<void> {
        await this.db.delete(<modules>).where(eq(<modules>.id, id.getValue()));
    }

    private static toPersistence(entity: <Module>): typeof <modules>.$inferInsert {
        return {
            id: entity.id.getValue(),
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }

    private static toDomain(row: typeof <modules>.$inferSelect): <Module> {
        return <Module>.reconstitute({
            id: new <Module>Id(row.id),
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
        });
    }
}
```

---

### D. Presentation Layer (`src/<module>/presentation/`)

#### 1. DTOs
- `dtos/create-<module>.dto.ts`: Decorated with `class-validator` and `class-transformer`.
- `dtos/<module>-response.dto.ts`:
  ```typescript
  import { <Module> } from "../../domain/entities/<module>.entity";

  export class <Module>ResponseDto {
      id: string;
      createdAt: string;
      updatedAt: string;

      static fromDomain(entity: <Module>): <Module>ResponseDto {
          const dto = new <Module>ResponseDto();
          dto.id = entity.id.getValue();
          dto.createdAt = entity.createdAt.toISOString();
          dto.updatedAt = entity.updatedAt.toISOString();
          return dto;
      }
  }
  ```

#### 2. Controller: `<module>.controller.ts`
```typescript
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { Create<Module>Dto } from "./dtos/create-<module>.dto";
import { <Module>ResponseDto } from "./dtos/<module>-response.dto";
import { Create<Module>Command, Delete<Module>Command } from "../application/commands";
import { Get<Module>Query, GetAll<Module>sQuery } from "../application/queries";
import { <Module> } from "../domain/entities/<module>.entity";

@Controller("<modules>")
export class <Module>Controller {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) {}

    @Post()
    async create(@Body() dto: Create<Module>Dto): Promise<<Module>ResponseDto> {
        // Map presentation DTO to application command
        const entity = await this.commandBus.execute<Create<Module>Command, <Module>>(
            new Create<Module>Command({ ...dto })
        );
        return <Module>ResponseDto.fromDomain(entity);
    }

    @Get()
    async findAll(): Promise<<Module>ResponseDto[]> {
        const results = await this.queryBus.execute<GetAll<Module>sQuery, <Module>[]>(new GetAll<Module>sQuery());
        return results.map(<Module>ResponseDto.fromDomain);
    }

    @Get(":id")
    async findOne(@Param("id", new ParseUUIDPipe()) id: string): Promise<<Module>ResponseDto> {
        const result = await this.queryBus.execute<Get<Module>Query, <Module>>(new Get<Module>Query(id));
        return <Module>ResponseDto.fromDomain(result);
    }

    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param("id", new ParseUUIDPipe()) id: string): Promise<void> {
        await this.commandBus.execute(new Delete<Module>Command(id));
    }
}
```

---

### E. Module & DI Registration

#### 1. Module Class: `src/<module>/<module>.module.ts`
```typescript
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { <Module>Controller } from "./presentation/<module>.controller";
import { CommandHandlers } from "./application/commands";
import { QueryHandlers } from "./application/queries";
import { <MODULE_UPPER>_REPOSITORY } from "./application/ports/<module>.repository.port";
import { Drizzle<Module>Repository } from "./infrastructure/adapters/drizzle-<module>.repository";

@Module({
    imports: [CqrsModule],
    controllers: [<Module>Controller],
    providers: [
        ...CommandHandlers,
        ...QueryHandlers,
        {
            provide: <MODULE_UPPER>_REPOSITORY,
            useClass: Drizzle<Module>Repository,
        },
    ],
    exports: [<MODULE_UPPER>_REPOSITORY],
})
export class <Module>Module {}
```

#### 2. Root App Registration: `src/app.module.ts`
- Import `<Module>Module` in `src/app.module.ts` under `@Module.imports`.

---

### F. HTTP Request Testing (`http/<module>/`)

For every new module, create REST test requests matching `product`, `customer`, and `order`:
- `http/<module>/<module>.post.http` (POST create payload)
- `http/<module>/<module>-get.http` (GET all and GET by ID)
- `http/<module>/<module>.delete.http` (DELETE by ID)

---

## 4. Workflow Checklist when user asks to scaffold a module

1. Identify the module entity name in singular (e.g. `Referral`), kebab (e.g. `referral`), plural (e.g. `referrals`), and symbol (e.g. `REFERRAL_REPOSITORY`).
2. Create directory hierarchy under `src/<module>/`.
3. Create all domain files (Value Objects & Entities).
4. Create application ports, commands (with self-contained inputs, **no presentation imports**), command handlers, queries, query handlers, and barrel exports `index.ts`.
5. Create schema under `src/shared/infrastructure/database/postgres/schemas/<module>.schema.ts` and re-export in `schemas/index.ts`.
6. Create Drizzle adapter repository under `src/<module>/infrastructure/adapters/drizzle-<module>.repository.ts`.
7. Create presentation DTOs and Controller (mapping Request DTOs to Application Commands, and Domain entities to Response DTOs).
8. Create `<module>.module.ts` and register in `src/app.module.ts`.
9. Create HTTP test request files under `http/<module>/`.
10. Run `npm run build` to verify type safety and compilation.
