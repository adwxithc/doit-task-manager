import request from "supertest";
import { app } from "../../src/app";

it("returns a 200 on successful signup", async () => {
    
    const res= await  request(app)
        .post("/api/auth/signup")
        .send({
            email: "test@test.com",
            password: "password123@",
            name:"tester"
        })
        .expect(200);

    return res;
        
});
it("returns a 400 with a invalid email", async () => {
    return request(app)
        .post("/api/auth/signup")
        .send({
            email: "454djer653rf4ref45",
            password: "password",
        })
        .expect(400);
});

it("returns a 400 with a invalid password", async () => {
    return request(app)
        .post("/api/auth/signup")
        .send({
            email: "454djer653rf4ref45",
            password: "pa",
        })
        .expect(400);
});

it("returns a 400 with misssing email and password", async () => {
    await request(app)
        .post("/api/auth/signup")
        .send({
            email: "test@test.com",
        })
        .expect(400);

    await request(app)
        .post("/api/auth/signup")
        .send({
            email: "test@test.com",
        })
        .expect(400);
});


