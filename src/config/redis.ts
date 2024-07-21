import { Redis } from "ioredis";
import  redisMock from "redis-mock" ;
import dotenv from "dotenv";
dotenv.config();


let redisClient: Redis;


function redisDB() {
    const redisClientURL = () => {
        if (process.env.REDIS_URL) {
            return process.env.REDIS_URL;
        }
        throw new Error("Redis connection failed");
    };

    if (process.env.NODE_ENV === "test") {
        // Use a mock Redis client in test environments
        
        redisClient = redisMock.createClient() as unknown as Redis;
    } else {
        // Use the actual Redis client
        redisClient = new Redis(redisClientURL());
    }

  
}

redisDB();
export {redisClient};
