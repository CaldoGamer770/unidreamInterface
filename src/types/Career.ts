export interface Career {
  id: string;                 // UUID viene como string
  nombre: string;
  area?: string | null;
  imagen?: string | null;
  descripcion?: string | null;
  duracion?: string | null;
  modalidad?: string | null;
  salarioPromedio?: string | null;
  universidades: string[];
  url?: string | null;

  // 🔥 Dinámico (IA)
  matchIA?: number;
  motivoMatch?: string;
}
