import {withAuth} from "../../api/api";

export const getNotesList = async () => {
  return withAuth
    .get("notes")
    .then((response) => {
      console.log(response)  
      return response?.data
    })
    .catch((err) => console.log(err));
};

export const createNote = async (newNote) => {
  return withAuth
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
  return withAuth
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