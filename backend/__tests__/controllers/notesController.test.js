const notesController = require("../../controllers/notesController");
const Notes = require("../../models/Notes");
const User = require("../../models/User");

jest.mock("../../models/Notes");
jest.mock("../../models/User");

const response = {
  status: jest.fn(() => response),
  json: jest.fn((x) => x),
};

describe("Test getNotes API", () => {
  it("Should return status 400 when no notes are found", async () => {
    Notes.find = jest.fn().mockReturnValue({
      lean: jest.fn().mockReturnValueOnce([]),
    });
    await notesController.getAllNotes({}, response);
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({ message: "No notes found" });
  });

  it("Should return notes list with every note mapped to a username", async () => {
    Notes.find = jest.fn().mockReturnValue({
      lean: jest.fn().mockResolvedValueOnce([
        {
          _id: 1,
          completed: false,
          createdAt: "2023-12-12T13:19:41.960Z",
          text: "My first note",
          title: "First text",
          updatedAt: "2023-12-12T13:19:41.960Z",
          user: "12345",
        },
      ]),
    });

    User.findById = jest.fn().mockReturnValue({
      lean: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce({
          _id: "12345",
          username: "Username",
        }),
      }),
    });
    await notesController.getAllNotes({}, response);
    expect(response.json).toHaveBeenCalledWith([
      {
        _id: 1,
        completed: false,
        createdAt: "2023-12-12T13:19:41.960Z",
        text: "My first note",
        title: "First text",
        updatedAt: "2023-12-12T13:19:41.960Z",
        user: "12345",
        username: "Username",
      },
    ]);
  });
});

describe("Test createNote API", () => {
  it("Should return status of 400 with message All fields are required", async () => {
    const request = { body: { user: "Username" } };
    await notesController.createNewNote(request, response);
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({
      message: "All fields are required",
    });
  });

  it("Should return status of 409 with message Duplicate note title", async () => {
    const request = {
      body: {
        user: "Username",
        title: " Note title",
        text: "Note text",
      },
    };
    Notes.findOne = jest.fn().mockReturnValue({
      lean: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          title: "Note title",
        }),
      }),
    });
    await notesController.createNewNote(request, response);
    expect(response.status).toHaveBeenCalledWith(409);
    expect(response.json).toHaveBeenCalledWith({
      message: "Duplicate note title",
    });
  });

  it("Should return status 201 with message New note created", async () => {
    const request = {
      body: {
        user: "Username",
        title: " Note title",
        text: "Note text",
      },
    };
    Notes.findOne = jest.fn().mockReturnValue({
      lean: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      }),
    });

    Notes.create = jest.fn().mockResolvedValueOnce({
      user: "Username",
      title: " Note title",
      text: "Note text",
    });
    await notesController.createNewNote(request, response);
    expect(response.status).toHaveBeenCalledWith(201);
    expect(response.json).toHaveBeenCalledWith({ message: "New note created" });
  });

  it("Should return status 400 with message Invalid note data received", async () => {
    const request = {
      body: {
        user: "Username",
        title: " Note title",
        text: "Note text",
      },
    };
    Notes.findOne = jest.fn().mockReturnValue({
      lean: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      }),
    });

    Notes.create = jest.fn().mockResolvedValueOnce(null);
    await notesController.createNewNote(request, response);
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({
      message: "Invalid note data received",
    });
  });
});

describe("Test updateNote API", () => {
  it("Should return status 400 with message All fields are required", async () => {
    const request = {
      body: {
        id: 1,
        title: "Note title",
        text: "Note text",
        completed: true,
      },
    };

    await notesController.updateNote(request, response);
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({
      message: "All fields are required",
    });
  });

  it("Should return status 400 with message Note not found", async () => {
    const request = {
      body: {
        id: 1,
        title: "Note title",
        text: "Note text",
        completed: true,
        user: "12345",
      },
    };
    Notes.findById = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });
    await notesController.updateNote(request, response);
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({ message: "Note not found" });
  });

  it("Should return status of 409 with message Duplicate note title", async () => {
    const request = {
      body: {
        user: "Username",
        title: " Note title",
        text: "Note text",
        id: "1",
        completed: true,
      },
    };
    Notes.findById = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue({ id: 1 }),
    });
    Notes.findOne = jest.fn().mockReturnValue({
      lean: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          title: "Note title",
          _id: 2,
        }),
      }),
    });
    await notesController.updateNote(request, response);
    expect(response.status).toHaveBeenCalledWith(409);
    expect(response.json).toHaveBeenCalledWith({
      message: "Duplicate note title",
    });
  });

  it("Should return a message Note title updated", async () => {
    const request = {
      body: {
        user: "Username",
        title: " Note title",
        text: "Note text",
        id: "1",
        completed: true,
      },
    };
    Notes.findById = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue({
        id: 1,
        save: jest.fn().mockResolvedValue({ title: "New Note title" }),
      }),
    });
    Notes.findOne = jest.fn().mockReturnValue({
      lean: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      }),
    });
    await notesController.updateNote(request, response);
    expect(response.json).toHaveBeenCalledWith({
      message: `'New Note title' updated`,
    });
  });
});

describe("Test deleteNote API", () => {
  it("Should respond with status 400 and message Note ID required", async () => {
    const request = { body: {} };
    await notesController.deleteNote(request, response);
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({ message: "Note ID required" });
  });

  it("Should respond with status 400 and message Note not found", async () => {
    const request = { body: { id: 1 } };
    Notes.findById = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });
    await notesController.deleteNote(request, response);
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({ message: "Note not found" });
  });

  it("Should respond with message note with title and id deleted", async () => {
    const request = { body: { id: 1 } };
    Notes.findById = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue({
        id: 1,
        deleteOne: jest
          .fn()
          .mockResolvedValue({ title: "New Note title", _id: 1 }),
      }),
    });
    await notesController.deleteNote(request, response);
    expect(response.json).toHaveBeenCalledWith(
      "Note 'New Note title' with ID 1 deleted"
    );
  });
});
