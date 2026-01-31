import axios from "axios";
import { API_URL } from "./api";
import { Career } from "../types/Career";

export async function getCareers() {
  const res = await axios.get(
    "http://3.144.209.174/careers/" // 👈 CON SLASH
  );
  return res.data;
}