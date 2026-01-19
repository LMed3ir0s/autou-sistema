import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/v1";

export const api = axios.create({
  baseURL: API_URL,
});

export const classifyEmail = async (input: string | FormData) => {
  const formData = input instanceof FormData ? input : new FormData();

  if (typeof input === "string") {
    formData.append("text", input);
  }

  return api.post("/email/classify", formData);
};
