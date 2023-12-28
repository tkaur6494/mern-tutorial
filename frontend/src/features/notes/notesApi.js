import api from "../../api";

export const getNotesList = async () => {
  return api
    .get("notes")
    .then((response) => {
        return response?.data
    })
    .catch((err) => console.log(err));
};

export const createNote = async (newNote) => {
  return api
    .post("notes", newNote)
    .then((response) => {
      return { status: response.status, message: response.data.message };
    })
    .catch((err) => {
      return {
        status: err.response.status,
        message: err.response.data.message,
      };
    });
};

export const updateNote = async (updatedNote) => {
  return api
    .patch("notes", updatedNote)
    .then((response) => {
      return { status: response.status, message: response.data.message};
    })
    .catch((err) => {
      return {
        status: err.response.status,
        message: err.response.data.message,
      };
    });
};