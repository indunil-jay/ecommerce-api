import { ConfigService } from "@nestjs/config"
import { MongoClient } from "mongodb";

export const MONGO_DB = Symbol("MONGO_DB")
export const MongoProvider = {
    provide: MONGO_DB,
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => {
        const uri = config.getOrThrow<string>("MONGODB_URI");
        const databaseName = config.getOrThrow<string>("MONGODB_DATABASE_NAME", "clean_shop");
        const client = new MongoClient(uri);
        await client.connect();
        return client.db(databaseName);
    }
}