import axios from "axios";

const API_URL = "http://3.144.209.174";

export async function getUserRecommendations(userId: string) {
  const res = await fetch(`${API_URL}/users/${userId}/recommendations`);
  return res.json(); // ← devuelve { user_id, recommendations }
}
