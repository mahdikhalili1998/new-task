import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://reqres.in/api",
  headers: {
    "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
  },
});

export default axiosClient;
