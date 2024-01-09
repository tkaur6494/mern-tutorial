import axios from "axios";

let withAuth = axios.create({
  baseURL: "https://localhost:3500/",
  withCredentials: true,
});

export const setAuthorization = (authorizationToken) => {
  // withAuth.defaults.headers["Authorization"] = `Bearer ${authorizationToken}`;
  return withAuth;
};

withAuth.interceptors.response.use(
  (resp) => {
    return resp;
  },
  async (err) => {
    if (err.response.status === 403) {
      const originalRequest = err.config;
      if (err.response.status === 403 && !originalRequest._retry) {
        originalRequest._retry = true;

        const resp = await withAuth.get("/auth/refresh");

        if (resp.data.hasOwnProperty("UserInfo")) {
          //save username and role in session
          return withAuth(originalRequest);
        } else {
          window.location.href = "/logout";
          sessionStorage.removeItem("userInfo");
          return { status: 9999, data: { message: "Logged out" } };
          // console.log("Error")
        }
      }
    }
    return err.response;
  }
);

export { withAuth };
