import ky from "ky";
import { getAuthToken, removeAuthToken } from "../store/auth";

export const api = ky.create({
  prefixUrl: import.meta.env.VITE_API_URL || "http://localhost:8000/",
  headers: {
    "Content-Type": "application/json",
  },
  hooks: {
    beforeRequest: [
      (request) => {
        const token = getAuthToken();
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      (request, options, response) => {
        if (response.status === 401) {
          removeAuthToken();
          window.location.href = "/auth/login";
        }
      },
    ],
  }
});
