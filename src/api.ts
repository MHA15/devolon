import Axios from "axios";

const api = Axios.create({
  baseURL: "https://api.thecatapi.com/v1/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default api;
