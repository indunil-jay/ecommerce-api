import { ConfigService } from "@nestjs/config";
import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schemas";

export const DRIZZLE = Symbol('DRIZZLE');

export type DrizzleDB = PostgresJsDatabase<typeof schema>;

export const DrizzleProvider = {
    provide: DRIZZLE,
    inject: [ConfigService],
    useFactory: async (config: ConfigService): Promise<DrizzleDB> => {
        const connectionString = config.getOrThrow<string>("POSTGRES_DATABASE_URL");
        const client = postgres(connectionString);
        return drizzle(client, {schema});
    }
}
