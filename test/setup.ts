import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";


import { app } from "../src/app";


declare global {
    // eslint-disable-next-line no-var
    var signin: () => Promise<string[]>;
}

let mongo: MongoMemoryServer|null=null;


beforeAll(async () => {
    process.env.JWT_KEY = "asdfgh";

    
    mongo = await MongoMemoryServer.create();
    
    const mongoUri = mongo.getUri();
    
    

    await mongoose.connect(mongoUri, {});
   
    
});

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();

    for (const collection of collections) {
        await collection.deleteMany({});
    }



});

afterAll(async () => {
    if(mongo){
        await mongo.stop();
    }

    await mongoose.connection.close();
});

global.signin = async () => {
    const response = await request(app)
        .post("/api/auth/signup")
        .send({
            email: "test@test.com",
            password: "password",
        })
        .expect(200);

    return response.get("Set-Cookie") as string[];
};
