const { request } = require("express");
const usersController = require("../../controllers/usersController");
const User = require("../../models/User");
const Notes = require("../../models/Notes");
const bcrypt = require("bcrypt");

jest.mock("../../models/User");
jest.mock("../../models/Notes");
jest.mock("bcrypt");

const userList = [
  { _id: "1", username: "username1", roles: ["Employee"], active: true },
];

const response = {
  status: jest.fn(() => response),
  json: jest.fn((x) => x),
};

const responseGetUsers = {
  status: jest.fn(() => responseGetUsers),
  json: jest.fn((x) => x),
};

describe("Test createNewUser API", () => {
  let requestInvalidMissingRoles = {
    body: {
      username: "fake_user",
      password: "fake_password",
    },
  };

  let requestInvalidMissingUsername = {
    body: {
      password: "fake_password",
    },
  };

  let validRequest = {
    body: {
      username: "valid_request",
      password: "password",
      roles: ["Employee"],
    },
  };
  User.create = jest.fn().mockReturnValue({
    username: "valid_request",
  });
  // Checking for 400 response - invalid requests
  it("Should return a status of 400 when all fields are not sent during user creation", async () => {
    await usersController.createNewUser(requestInvalidMissingRoles, response);
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({
      message: "All fields are required",
    });
  });

  it("Should return a status of 400 when all fields are not sent during user creation", async () => {
    await usersController.createNewUser(
      requestInvalidMissingUsername,
      response
    );
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({
      message: "All fields are required",
    });
  });

  // Checking for duplicate usernames
  it("Should return a status of 409 when the username is already in use", async () => {
    User.findOne = jest.fn().mockReturnValue({
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue({ username: "duplicate_username" }),
    });

    await usersController.createNewUser(validRequest, response);
    expect(response.status).toHaveBeenCalledWith(409);
  });

  //Checking for 201 status valid user creation
  it("Should return a status of 201 when a new user is created", async () => {
    User.findOne = jest.fn().mockReturnValue({
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(null),
    });

    bcrypt.hash = jest.fn().mockReturnValue("hashed_password");
    await usersController.createNewUser(validRequest, response);
    expect(User.create).toHaveBeenCalledWith({
      username: "valid_request",
      password: "hashed_password",
      roles: ["Employee"],
    });
    expect(response.status).toHaveBeenCalledWith(201);
  });

  //Checking for 400 status valid user creation
  it("Should return a status of 400 when a new user is not created", async () => {
    User.findOne = jest.fn().mockReturnValue({
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(null),
    });
    User.create = jest.fn().mockReturnValue(null);

    await usersController.createNewUser(validRequest, response);
    expect(response.status).toHaveBeenCalledWith(400);
  });
});

describe("Test getUsers API", () => {
  it("Should return the list of users", async () => {
    User.find = jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnValue(userList),
    });
    await usersController.getAllUsers({}, responseGetUsers);
    expect(responseGetUsers.json).toHaveBeenCalledWith(userList);
    expect(Array.isArray(userList)).toBe(true);
    userList.forEach((user) => {
      expect(user).toHaveProperty("_id");
      expect(user).toHaveProperty("username");
      expect(user).toHaveProperty("roles");
      expect(user).toHaveProperty("active");
    });
  });

  it("Should return 400 if no users are found", async () => {
    User.find = jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnValue({}),
    });
    await usersController.getAllUsers({}, responseGetUsers);
    expect(responseGetUsers.status).toHaveBeenCalledWith(400);
    expect(responseGetUsers.json).toHaveBeenCalledWith({
      message: "No users found",
    });
  });
});

describe("Test updateUser API", () => {
  it("Should return status 400 if any field is missing while updating a user", async () => {
    let requestInvalidUpdate = {
      body: { username: "username", id: 1, roles: ["Employee"] },
    };

    let response = {
      status: jest.fn(() => response),
      json: jest.fn((x) => x),
    };
    await usersController.updateUser(requestInvalidUpdate, response);
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({
      message: "All fields are required.",
    });
  });

  it("Should return status 400 active is not boolean", async () => {
    let requestInvalidUpdate = {
      body: { username: "username", id: 1, roles: ["Employee"], active: 1 },
    };

    let response = {
      status: jest.fn(() => response),
      json: jest.fn((x) => x),
    };
    await usersController.updateUser(requestInvalidUpdate, response);
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({
      message: "All fields are required.",
    });
  });

  it("Should return status 400 if user is not found", async () => {
    User.findById = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });

    let requestUserNotFound = {
      body: { username: "username", id: 1, roles: ["Employee"], active: true },
    };

    let response = {
      status: jest.fn(() => response),
      json: jest.fn((x) => x),
    };
    await usersController.updateUser(requestUserNotFound, response);
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({
      message: "User not found",
    });
  });

  it("Should return status 409 if duplicate username is used", async () => {
    User.findOne = jest.fn().mockReturnValue({
      lean: jest.fn().mockReturnValue({
        exec: jest
          .fn()
          .mockReturnValue({ username: "duplicate_user", _id: 12 }),
      }),
    });
    User.findById = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue({
        username: "username",
        roles: ["roles"],
        active: true,
        save: jest.fn(() => {
          username: "username";
        }),
      }),
    });
    let requestDuplicateUser = {
      body: {
        id: "1",
        username: "duplicate_user",
        active: true,
        roles: ["Employee"],
      },
    };
    let response = {
      status: jest.fn(() => response),
      json: jest.fn((x) => x),
    };
    await usersController.updateUser(requestDuplicateUser, response);
    expect(response.status).toHaveBeenCalledWith(409);
    expect(response.json).toHaveBeenCalledWith({
      message: "Duplicate username",
    });
  });

  it("Should return message that user has been updated", async () => {
    let validRequest = {
      body: {
        id: "1",
        username: "username_updated",
        active: true,
        roles: ["Employee"],
        password: "password_updated",
      },
    };
    User.findById = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue({
        id: "1",
        username: "username",
        roles: ["Employee"],
        active: false,
        save: jest.fn().mockReturnValue(validRequest.body),
      }),
    });

    User.findOne = jest.fn().mockReturnValue({
      lean: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      }),
    });

    let response = {
      status: jest.fn(() => response),
      json: jest.fn((x) => x),
    };
    await usersController.updateUser(validRequest, response);
    expect(response.json).toHaveBeenCalledWith({
      message: `username_updated updated`,
    });
  });
});

describe("Test deleteUser API", () => {
  it("Should return status 400 with message User Id required", async () => {
    let request = {
      body: {
        username: "username",
      },
    };
    let response = {
      status: jest.fn(() => response),
      json: jest.fn((x) => x),
    };
    await usersController.deleteUser(request, response);
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({
      message: "User id required.",
    });
  });

  it("Should return status 400 with message User has assigned notes", async () => {
    Notes.findOne = jest.fn().mockReturnValue({
      lean: jest.fn().mockReturnValue({
        exec: jest.fn().mockReturnValue([{ id: 1, title: "note" }]),
      }),
    });

    let request = {
      body: {
        id: 1,
      },
    };
    let response = {
      status: jest.fn(() => response),
      json: jest.fn((x) => x),
    };
    await usersController.deleteUser(request, response);
    expect(response.json).toHaveBeenCalledWith({
      message: "User has assigned notes.",
    });
  });

  it("Should return status 400 with message User not found", async () => {
    Notes.findOne = jest.fn().mockReturnValue({
      lean: jest.fn().mockReturnValue({
        exec: jest.fn().mockReturnValue(null),
      }),
    });

    User.findById = jest.fn().mockReturnValue({
      exec: jest.fn().mockReturnValue(null),
    });
    let request = {
      body: {
        id: 1,
      },
    };
    let response = {
      status: jest.fn(() => response),
      json: jest.fn((x) => x),
    };
    await usersController.deleteUser(request, response);
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({ message: "User not found." });
  });

  it("Should return message that User with username and id has been deleted", async () => {
    User.findById = jest.fn().mockReturnValue({
      exec: jest.fn().mockReturnValue({
        _id: 1,
        username: "username",
        deleteOne: jest.fn().mockReturnValue(true),
      }),
    });
    let request = {
      body: {
        id: 1,
      },
    };
    let response = {
      status: jest.fn(() => response),
      json: jest.fn((x) => x),
    };
    await usersController.deleteUser(request, response);
    expect(response.json).toHaveBeenCalledWith(
      "Username username with id 1 deleted."
    );
  });
});
