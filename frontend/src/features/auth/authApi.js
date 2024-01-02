import {withAuth} from "../../api/api";

export const authLogin = async (userDetail) => {
  return withAuth
    .post("auth", userDetail)
    .then((response) => {
      return { status: response.status, token: response.data.accessToken };
    })
    .catch((err) => {
      return {
        status: err.response.status,
        message: err.response.data.message,
      };
    });
};

