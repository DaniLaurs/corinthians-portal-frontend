import axios from "axios";

export const api = axios.create({
  baseURL: "https://corinthians-portal-backend.onrender.com"
});