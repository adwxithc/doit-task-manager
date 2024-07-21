
import { redisClient } from "../config/redis";
import { IUnverifiedUser } from "../types/data";

class UnverifiedUserRepository{

    async storeUser (email: string, payload: IUnverifiedUser)  {
        
        const data = JSON.stringify(payload);
        const OTP_EXPIRATION=process.env.OTP_EXPIRATION|| 300;
        await redisClient.setex(email, OTP_EXPIRATION, data);
    }

    async getUser (email:string){
        const data= await redisClient.get(email);
        return data?JSON.parse(data):null;
    }

    async deleteUser(email: string) {
        await redisClient.del(email);
    }
}

export const unverifiedUserRepository=new UnverifiedUserRepository();