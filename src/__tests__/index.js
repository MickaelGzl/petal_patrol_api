import supertest from "supertest";
import { app } from "../../app.js";

const req = supertest(app);

test("GET /test can access to api", async () => {
  const res = await req.get("/test");
  expect(res.status).toEqual(200);
  expect(res.type).toEqual(expect.stringContaining("json"));
  expect(res.body).toEqual({ message: "coucou" });
});

test("POST /api/auth/signup", async () => {
  const reqBody = {
    name: "gigi",
    email: "mickael.gonzales30@outlook.fr",
    password: "totototo",
  };

  const res = await req
    .post("/api/auth/signup")
    .send(reqBody)
    .set("Content-Type", "application/json");

  expect(res.status).toEqual(200);
});

test("POST /api/auth/signup return 409 cause email already exist", async () => {
  const reqBody = {
    name: "gigi",
    email: "mickael.gonzales30@outlook.fr",
    password: "totototo",
  };

  const res = await req
    .post("/api/auth/signup")
    .send(reqBody)
    .set("Content-Type", "application/json");

  expect(res.status).toEqual(409);
});

test("POST /api/auth/signin", async () => {
  const reqBody = {
    email: "mickael.gonzales30@outlook.fr",
    password: "totototo",
  };

  const res = await req
    .post("/api/auth/signin")
    .send(reqBody)
    .set("Content-Type", "application/json");

  expect(res.status).toEqual(200);
});
