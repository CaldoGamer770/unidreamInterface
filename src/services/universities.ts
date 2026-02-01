import axios from 'axios';

// La misma IP de tu backend
const API_URL = "http://3.144.209.174";

export interface University {
    id: number;
    nombre: string;
    ubicacion?: string;     
    tipo?: string;          
    imagen?: string;
    descripcion?: string;
    matchIA?: number;       
    carreraSugeridaIA?: string; // <--- ¡AGREGA ESTA LÍNEA!
    facultades?: string[];      // Agreguemos esta también por si acaso
    url?: string;
}

export async function getUniversities(page = 1, limit = 20) {
    const res = await axios.get(`${API_URL}/universities`, { 
        params: { page, limit } 
    });
    return res.data;
}