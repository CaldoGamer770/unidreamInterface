import axios from "axios";
import { API_URL } from "./api";
import { Career } from "../types/Career";

export const getCareers = async (): Promise<Career[]> => {
  const response = await axios.get<Career[]>(`${API_URL}/careers`);
  return response.data;
};