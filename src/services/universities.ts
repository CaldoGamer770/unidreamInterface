// src/services/universities.ts
import axios from 'axios';

// La misma IP de tu backend
const API_URL = "http://3.144.209.174";

// Definimos la interfaz aquí para mantener el orden
export interface University {
    id: number;
    nombre: string;
    ubicacion?: string;     // Ej: "Quito, Pichincha"
    tipo?: string;          // Ej: "Pública" o "Privada"
    imagen?: string;
    descripcion?: string;
    matchIA?: number;       // Para el filtro de IA
    url?: string;
}

export async function getUniversities(page = 1, limit = 20) {
    // Pedimos datos al endpoint /universities
    const res = await axios.get(`${API_URL}/universities`, { 
        params: { page, limit } 
    });
    return res.data;
}