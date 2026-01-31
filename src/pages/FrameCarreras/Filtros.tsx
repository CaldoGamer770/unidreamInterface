type Props = {
  filtroActivo: "IA" | "Todas" | "Ingeniería" | "Salud";
  setFiltroActivo: (v: "IA" | "Todas" | "Ingeniería" | "Salud") => void;
  busqueda: string;
  setBusqueda: (v: string) => void;
};

export default function Filtros({
  filtroActivo,
  setFiltroActivo,
  busqueda,
  setBusqueda
}: Props) {
  const filtros = ["IA", "Todas", "Ingeniería", "Salud"] as const;

  return (
    <div className="flex flex-col gap-4">
      {/* Buscador */}
      <input
        type="text"
        placeholder="Buscar carrera..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="w-full max-w-md px-4 py-2 border rounded-lg"
      />

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {filtros.map((f) => (
          <button
            key={f}
            onClick={() => setFiltroActivo(f)}
            className={`px-4 py-2 rounded-full text-sm font-semibold
              ${
                filtroActivo === f
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
          >
            {f}
          </button>
        ))}
      </div>
    </div>
  );
}
