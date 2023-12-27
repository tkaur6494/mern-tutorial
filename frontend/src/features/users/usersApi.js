import api from "../../api";

export const getUserList = async () => {
  return api
    .get("users")
    .then((response) => {
      return response?.data;
    })
    .catch((err) => console.log(err));
};

export const updateUser = async (updatedUser) => {
  return api
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
  console.log(userId);
  return api
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
