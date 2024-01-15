const authController = require("../../controllers/authController");
const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

jest.mock("../../models/User");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

const response = {
  status: jest.fn(() => response),
  json: jest.fn((x) => x),
  cookie: jest.fn(),
  clearCookie: jest.fn(),
  sendStatus: jest.fn(),
};
describe("Test loginAuth API", () => {
  it("Should return status 400 and message All fields are required", async () => {
    const request = { body: { username: "Username" } };
    await authController.loginAuth(request, response);
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({
      message: "All fields are required.",
    });
  });

  it("Should return status 400 and message User not found", async () => {
    const request = { body: { username: "Username", password: "password" } };
    User.findOne = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(null),
    });
    await authController.loginAuth(request, response);
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({
      message: "User not found",
    });
  });

  it("Should return status 400 and message Incorrect password", async () => {
    const request = { body: { username: "Username", password: "password" } };
    User.findOne = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce({
        username: "Username",
        password: "password123",
      }),
    });
    bcrypt.compare = jest.fn().mockReturnValue(null);
    await authController.loginAuth(request, response);
    expect(bcrypt.compare).toHaveBeenCalledWith("password", "password123");
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({
      message: "Incorrect password",
    });
  });

  it("Should return user name and role", async () => {
    const request = { body: { username: "Username", password: "password" } };
    User.findOne = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce({
        username: "Username",
        password: "password",
        roles: ["Employee", "Manager"],
      }),
    });
    bcrypt.compare = jest.fn().mockReturnValue(true);
    jwt.sign = jest
      .fn()
      .mockReturnValueOnce("access_token_signed")
      .mockReturnValueOnce("refresh_token_signed");
    await authController.loginAuth(request, response);
    expect(jwt.sign).toHaveBeenCalledTimes(2);
    expect(response.cookie).toHaveBeenCalledTimes(2);
    expect(response.json).toHaveBeenCalledWith({
      UserInfo: {
        username: "Username",
        roles: ["Employee", "Manager"],
      },
    });
  });
});

describe("Test refreshAuth API", () => {
  it("Should return status 401 with message Unauthorized", async () => {
    const request = {
      cookies: { access: "access_cookie" },
    };
    await authController.refreshAuth(request, response);
    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith({ message: "Unauthorized" });
  });

  it("Should return status 401 with message Forbidden", async () => {
    const request = {
      cookies: { jwt: "refresh_cookie" },
    };
    jwt.verify = jest.fn((token, secret, callback) => {
      return callback({});
    });
    await authController.refreshAuth(request, response);
    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith({ message: "Forbidden" });
  });

  it("Should return status 400 with message User not found", async () => {
    const request = {
      cookies: { jwt: "refresh_cookie" },
    };
    jwt.verify = jest.fn((token, secret, callback) => {
      return callback(null, { username: "Username" });
    });
    User.findOne = jest
      .fn()
      .mockReturnValue({ exec: jest.fn().mockResolvedValueOnce(null) });
    await authController.refreshAuth(request, response);
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({ message: "User not found" });
  });

  it("Should return user name and role", async () => {
    const request = {
      cookies: { jwt: "refresh_cookie" },
    };
    jwt.verify = jest.fn((token, secret, callback) => {
      return callback(null, { username: "Username" });
    });
    User.findOne = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce({
        username: "Username",
        password: "password",
        roles: ["Employee", "Manager"],
      }),
    });
    await authController.refreshAuth(request, response);
    expect(response.cookie).toHaveBeenCalledTimes(1);
    expect(response.json).toHaveBeenCalledWith({
      UserInfo: {
        username: "Username",
        roles: ["Employee", "Manager"],
      },
    });
  });
});

describe("Test logoutAuth API", () => {
  it("Should return status 204", async () => {
    const request = {
      cookies: { access: "access_cookie" },
    };
    await authController.logoutAuth(request, response);
    expect(response.sendStatus).toHaveBeenCalledWith(204);
  });

  it("Should return message Cookie cleared", async () => {
    const request = {
      cookies: { jwt: "jwt_cookie" },
    };
    await authController.logoutAuth(request, response);
    expect(response.clearCookie).toHaveBeenCalledWith("jwt", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    expect(response.json).toHaveBeenCalledWith({ message: "Cookie cleared" });
  });
});
