import api from "../../api";

export const getUserList = async () => {
  return api
    .get("users")
    .then((response) => {
        return response?.data
    })
    .catch((err) => console.log(err));
};
