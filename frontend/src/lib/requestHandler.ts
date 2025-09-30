import axios, { AxiosError } from "axios";
import { toast } from "sonner";

interface IRequestHandler {
  method: "POST" | "GET" | "PUT" | "DELETE";
  endpoint: string;
  data?: any;
  headers?: any;
  params?: Record<string, any>;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || "http://localhost:3000",
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const requestHandler = async ({
  method,
  endpoint,
  data = null,
  headers = {},
  params = {},
}: IRequestHandler) => {
  const maxRetries = 3;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const response = await api({
        method,
        url: endpoint,
        data,
        headers,
        params,
      });
      console.log("api call", response.data?.data)
      return response.data?.data;
    } catch (error) {
      attempt++;
      const errorMsg =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message
          : error instanceof Error
          ? error.message
          : "Unknown error";

      toast.error(`Request failed (attempt ${attempt}): ${errorMsg}`);

      if (attempt >= maxRetries) {
        throw error; // rethrow after max retries
      }
    }
  }
};
