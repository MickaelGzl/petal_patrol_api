// import * as chai from "chai";
// import chaiHttp from "chai-http";
// import { app } from "../../app.js";

// // console.log(chai);
// // console.log(chaiHttp);
// chai.should();
// chai.use(chaiHttp);

// const { expect } = chai;

// describe("text get route /test", function () {
//   it("should return message coucou and status 200", function (done) {
//     chai
//       .request("http://localhost:3000")
//       .get("/test")
//       .end(function (err, res) {
//         // console.log(res);
//         expect(res).to.have.status(200);
//         expect(res.body).to.have.property("message");
//         done();
//       });
//   });
// });

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

  expect(res.status).toEqual(404);
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
