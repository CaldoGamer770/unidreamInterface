// src/services/api.ts
import axios from "axios";

export const API_URL = "http://3.144.209.174"; // URL de FastAPI

export const chat = async (userId: string, message: string) => {
  const response = await axios.post(`${API_URL}/chat/stream`, { user_id: userId, message });
  return response.data;
};

export const chatStream = async (
  userId: string,
  message: string,
  onChunk: (chunk: string) => void
) => {
  // 1. Hacemos la solicitud POST al endpoint de streaming
  const response = await fetch(`${API_URL}/chat/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, message }),
  });

  // 2. Obtenemos el reader de la respuesta
  const reader = response.body?.getReader();
  if (!reader) return; // Si no hay reader, terminamos la función

  // 3. Creamos el decoder solo una vez
  const decoder = new TextDecoder();
  let partial = ""; // Almacena los fragmentos incompletos de texto

  // 4. Loop de lectura de streaming
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    if (value) {
      // Decodificamos el fragmento recibido
      partial += decoder.decode(value, { stream: true });

      // Dividimos por líneas y dejamos la última para la siguiente iteración
      const lines = partial.split("\n");
      partial = lines.pop()!;

      // Enviamos cada línea completa al callback
      for (const line of lines) {
        if (line.trim()) onChunk(line);
      }
    }
  }

  // 5. Enviamos cualquier fragmento restante
  if (partial.trim()) onChunk(partial);
};
