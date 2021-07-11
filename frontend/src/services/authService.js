import API from "./api";

const AuthService = {
  login: async (data) => {
    return await API.post("auth/login", data)
      .then(({ data }) => {
        setHeadersAndStorage(data);
        return data;
      })
      .catch((err) => {
        console.log(err.response.data.message);
        throw err;
      });
  },

  register: async (data) => {
    return await API.post("auth/register", data)
      .then(({ data }) => {
        setHeadersAndStorage(data);
        return data;
      })
      .catch((err) => {
        console.log(err.response.data.message);
        throw err;
      });
  },

  logout: () => {
    API.defaults.headers["Authorization"] = "";
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  },

  updateProfile: async (data) => {
    const headers = {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    };
    return await API.post("/users/update", data, headers)
      .then(({ data }) => {
        console.log("response data update", data);

        localStorage.setItem("user", JSON.stringify(data));
        return data;
      })
      .catch((err) => {
        console.log(err.response.data.message);
        throw err;
      });
  },
};

const setHeadersAndStorage = ({ user, token }) => {
  API.defaults.headers["Authorization"] = `Bearer ${token}`;
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("token", token);
};

export default AuthService;
