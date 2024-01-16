const User = require("../../models/User");
const request = require("supertest");
const mongoose = require("mongoose");
const createServer = require("../../server");
const { disconnectDB } = require("../../config/dbConn");

const app = createServer();
let userDetails = {
  username: "tripat123",
  password: "$2b$10$FsEosiKFWFzD7KiQ2StY0eLwES4yE.yIjOxHX4xjfyzYA3h.7.mjC",
  roles: ["Employee", "Manager", "Admin"],
  active: true,
  __v: 0,
};
let accessToken = "";
beforeAll(async () => {
  const user = await mongoose.connection.collections.users.insertOne(
    userDetails
  );
  userDetails = { ...userDetails, id: user.insertedId };
});

afterAll(async () => {
  const collections = await mongoose.connection.db.listCollections().toArray();
  await Promise.all(
    collections.map(async (collection) => {
      await mongoose.connection.db.dropCollection(collection.name);
    })
  );
  await disconnectDB();
});

describe("Testing Login Route", () => {
  it("Should return status 200 and 2 cookies are set", async () => {
    const response = await request(app).post("/auth").send({
      username: "tripat123",
      password: "12345",
    });
    accessToken = response.headers["set-cookie"][0];
    expect(response.status).toBe(200);
    expect(response.headers["set-cookie"]).toBeDefined();
    expect(response.headers["set-cookie"]).toHaveLength(2);
  });
});

describe("Users route", () => {
  it("Should return status 200 and the list of users", async () => {
    const user_keys = ["_id", "username", "roles", "active", "__v"];
    const response = await request(app)
      .get("/users")
      .set("Cookie", accessToken);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    response.body.forEach((element) => {
      expect(Object.keys(element).sort()).toEqual(user_keys.sort());
      expect(Array.isArray(element.roles)).toBeTruthy();
      expect(element.roles.length).toBeGreaterThanOrEqual(1);
    });
  });

  it("Should return status 201 and create new user", async () => {
    const response = await request(app)
      .post("/users")
      .send({ username: "test_user", password: "12345", roles: ["Employee"] })
      .set("Cookie", accessToken);
    expect(response.status).toBe(201);
  });

  it("Should return message test_user updated", async () => {
    const response = await request(app)
      .patch("/users")
      .send({
        id: userDetails._id,
        ...userDetails,
        password: "12345",
      })
      .set("Cookie", accessToken);
    expect(response.status).toBe(200);
  });

  it("Should delete the user and return status 200", async () => {
    const response = await request(app)
      .delete("/users")
      .send(userDetails)
      .set("Cookie", accessToken);
    expect(response.status).toBe(200);
  });
});
