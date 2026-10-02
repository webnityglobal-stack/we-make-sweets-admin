import axios from "axios";

const HOSTINGER_API_URL = "https://salmon-coyote-671066.hostingersite.com/api";

const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  // If envUrl is missing, or points to the old render backend or localhost, force Hostinger
  if (
    !envUrl ||
    envUrl.includes("wemakesweets-backend.onrender.com") ||
    envUrl.includes("localhost:5000")
  ) {
    return HOSTINGER_API_URL;
  }
  return envUrl;
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    // Fail-safe: Always redirect any calls aimed at the old render backend to Hostinger
    if (config.baseURL && config.baseURL.includes("wemakesweets-backend.onrender.com")) {
      config.baseURL = HOSTINGER_API_URL;
    }
    if (typeof config.url === "string" && config.url.includes("wemakesweets-backend.onrender.com")) {
      config.url = config.url.replace(
        "https://wemakesweets-backend.onrender.com/api",
        HOSTINGER_API_URL
      );
    }

    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {

    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;