import { Redis } from "ioredis";
import  redisMock from "redis-mock" ;
import dotenv from "dotenv";
dotenv.config();


let redisClient: Redis;


function redisDB() {
    const redisClientInfo = () => {
        if (process.env.REDIS_URL) {
            return {
                host: process.env.REDIS_HOST,
                port:Number( process.env.REDISPORT),
                password: process.env.REDIS_PASSWORD,
                tls: process.env.REDIS_HOST !== "localhost" ? {
                    rejectUnauthorized: false
                } : undefined
            };
        }
        throw new Error("Redis connection failed");
    };

    if (process.env.NODE_ENV === "test") {
        // Use a mock Redis client in test environments
        
        redisClient = redisMock.createClient() as unknown as Redis;
    } else {
        
        // Use the actual Redis client
        redisClient = new Redis(redisClientInfo());
    }

  
}

redisDB();
export {redisClient};
