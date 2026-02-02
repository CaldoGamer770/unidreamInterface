import axios from 'axios';

const API_URL = "http://3.144.209.174";

export async function getCareers(page = 1, limit = 6, area = "") {
  // Construimos los parámetros para la URL
  const params: any = { page, limit };

  // Solo enviamos el área si es una categoría real (Ingeniería o Salud)
  if (area && area !== "Todas" && area !== "IA") {
    params.area = area;
  }

  const res = await axios.get(`${API_URL}/careers`, { params });
  return res.data;
}