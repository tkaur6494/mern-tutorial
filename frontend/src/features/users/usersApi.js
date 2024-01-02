import {withAuth} from "../../api/api";

export const getUserList = async () => {
  return withAuth
    .get("users")
    .then((response) => {
      return response?.data;
    })
    .catch((err) => console.log(err));
};

export const updateUser = async (updatedUser) => {
  return withAuth
    .patch("users", updatedUser)
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

export const deleteUser = async (userId) => {
  return withAuth
    .delete("users", { data: userId })
    .then((response) => {
      return { status: response.status, message: response.data };
    })
    .catch((err) => {
      return {
        status: err.response.status,
        message: err.response.data.message,
      };
    });
};

export const createUser = async (newUser) => {
  return withAuth
    .post("users", newUser)
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
