import { withAuth } from "../../api/api";

export const authLogin = async (userDetail) => {
  return withAuth
    .post("auth", userDetail)
    .then((response) => {
      return { status: response.status, userInfo: response.data.UserInfo };
    })
    .catch((err) => {
      return {
        status: err.response.status,
        message: err.response.data.message,
      };
    });
};

export const authLogout = async () => {
  return withAuth
    .post("/auth/logout")
    .then((response) => {
      return { status: response.status, token: response.data.message };
    })
    .catch((err) => {
      return {
        status: err.response.status,
        message: err.response.data.message,
      };
    });
};
