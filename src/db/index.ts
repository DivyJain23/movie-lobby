import { MongoClient, MongoClientOptions } from "mongodb";
import { config } from "../config";
import { AppError, ErrorCode } from "../constants/appCode";
import mongoose from "mongoose";

async function connect(dbUrl: string | null, dbName: string | null, connectionOption: MongoClientOptions) {
    if (!dbUrl) {
        throw {
            msg: AppError.DB_URL_NOT_FOUND,
            status: ErrorCode.NOT_FOUND
        };
    }
    if (!dbName) {
        throw {
            msg: AppError.DB_NAME_NOT_FOUND,
            status: ErrorCode.NOT_FOUND
        };
    }
    const client = await MongoClient.connect(dbUrl, connectionOption);
    return client.db(dbName);
}

export default async function () {
    try {
        global.DB_URL_OBJ = await connect(config.DB.URL!, config.DB.NAME!, { maxPoolSize: config.DB.POOL_SIZE.MAX, minPoolSize: config.DB.POOL_SIZE.MIN });
        await mongoose.connect(config.DB.URL!);
        console.log("Connected to database!");
        return { success: true };
    } catch (err: any) {
        console.error("Could not connect to mongodb");
        console.error(err.message);
        process.exit(1);
    }
}