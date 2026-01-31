import axios from "axios";
import { Career } from "../types/Career";

const API_URL = "http://3.144.209.174";

export async function getCareers(page = 1, limit = 6): Promise<Career[]> {
  const res = await axios.get(`${API_URL}/careers`, {
    params: { page, limit }
  });
  return res.data;
}
