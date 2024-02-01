import supertest from "supertest";
import { app } from "../../app.js";
import { jest } from "@jest/globals";

jest.mock("../db/server.js");
import { User, Role } from "../db/server.js";

const req = supertest(app);

test("GET /test can access to api", async () => {
  const res = await req.get("/test");
  expect(res.status).toEqual(200);
  expect(res.type).toEqual(expect.stringContaining("json"));
  expect(res.body).toEqual({ message: "hello world" });
});

test("POST /api/auth/signup", async () => {
  jest.spyOn(User, "findOne").mockResolvedValue(null);
  jest.spyOn(User, "create").mockResolvedValue({
    name: "gigi",
    email: "mickael.gonzales30@outlook.fr",
    validate_account: false,
    activation_token: "randomString",
    addRole: jest.fn(),
    save: jest.fn().mockReturnValue({
      name: "gigi",
      email: "mickael.gonzales30@outlook.fr",
      activation_token: "randomString",
    }),
  });
  jest.spyOn(Role, "findOne").mockResolvedValue({ id: 1, role: "User" });

  const reqBody = {
    name: "gigi",
    email: "mickael.gonzales30@outlook.fr",
    password: "totototo",
  };

  const res = await req
    .post("/api/auth/signup")
    .send(reqBody)
    .set("Content-Type", "application/json");

  console.log(res.request.url);
  expect(res.status).toEqual(200);
  expect(res.body).toEqual({
    message:
      "Enregistré avec succès. Veuillez vérifier vos mails afin de valider votre compte avant de vous connecter.",
    user: { name: "gigi", email: "mickael.gonzales30@outlook.fr" },
  });
});

/*
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

test("POST /api/auth/signin without validate email", async () => {
  const reqBody = {
    email: "mickael.gonzales30@outlook.fr",
    password: "totototo",
  };

  const res = await req
    .post("/api/auth/signin")
    .send(reqBody)
    .set("Content-Type", "application/json");

  expect(res.status).toEqual(403);
});

test("POST /api/auth/signin", async () => {
  const reqBody = {
    email: "toto@mail.fr",
    password: "toto",
  };

  const res = await req
    .post("/api/auth/signin")
    .send(reqBody)
    .set("Content-Type", "application/json");

  expect(res.status).toEqual(200);
});
*/
