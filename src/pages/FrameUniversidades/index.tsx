import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUniversities, University } from "../../services/universities";

const CARDS_POR_PAGINA = 5;

// --- DATOS DE RESPALDO (Por si falla la conexión) ---
const UNIVERSIDADES_MOCK: University[] = [
  {
    id: 1,
    nombre: "Universidad Central del Ecuador",
    tipo: "Pública",
    imagen:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Escudo_de_la_Universidad_Central_del_Ecuador.svg/1200px-Escudo_de_la_Universidad_Central_del_Ecuador.svg.png",
    ubicacion: "Quito, Pichincha",
    descripcion:
      "La universidad más antigua y grande del Ecuador, líder en investigación y ciencias sociales.",
    matchIA: 98,
    url: "https://www.uce.edu.ec",
    contact: "(02) 252-1500",
  },
  // ... (resto de tus datos mock se mantienen igual)
];

export default function UniversitiesPage() {
  const navigate = useNavigate();

  const [allUniversities, setAllUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const [filtroActivo, setFiltroActivo] = useState<
    "Todas" | "Publica" | "Privada"
  >("Todas");
  const [busqueda, setBusqueda] = useState("");
  const [universidadSeleccionada, setUniversidadSeleccionada] =
    useState<University | null>(null);

  // --- EFECTO DE CARGA HÍBRIDA ---
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchAllData = async () => {
      try {
        console.log("📡 Intentando conectar a AWS...");
        const data = await getUniversities(1, 20);

        if (isMounted) {
          if (data && Array.isArray(data) && data.length > 0) {
            console.log("✅ Conexión exitosa con AWS");
            setAllUniversities(data);
          } else {
            throw new Error("Respuesta vacía");
          }
        }
      } catch (error) {
        console.warn("⚠️ AWS no disponible. Usando RESPALDO LOCAL.");
        if (isMounted) {
          setAllUniversities(UNIVERSIDADES_MOCK);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAllData();
    return () => {
      isMounted = false;
    };
  }, []);

  // --- FILTRADO LOCAL ---
  const universidadesFiltradas = allUniversities
    .filter((uni) =>
      (uni.nombre || "").toLowerCase().includes(busqueda.toLowerCase()),
    )
    .filter((uni) => {
      if (filtroActivo === "Todas") return true;
      const tipoNormalizado = (uni.tipo || uni.descripcion || "").toLowerCase();
      if (filtroActivo === "Publica")
        return (
          tipoNormalizado.includes("pública") ||
          tipoNormalizado.includes("publica")
        );
      if (filtroActivo === "Privada")
        return tipoNormalizado.includes("privada");
      return true;
    });

  // --- PAGINACIÓN ---
  const indiceUltimo = page * CARDS_POR_PAGINA;
  const indicePrimero = indiceUltimo - CARDS_POR_PAGINA;
  const unisParaMostrar = universidadesFiltradas.slice(
    indicePrimero,
    indiceUltimo,
  );
  const totalPaginas = Math.ceil(
    universidadesFiltradas.length / CARDS_POR_PAGINA,
  );

  const textMenuClass =
    "text-[#0D0D1B] text-sm transition-colors duration-300 hover:text-[#1213ed] active:text-[#1213ed] cursor-pointer font-medium";
  const buttonPressEffect = "transition-transform duration-100 active:scale-95";

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1313EC]"></div>
        <span className="text-gray-500 mt-4">Cargando Universidades...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white min-h-screen relative">
      {/* NAVBAR */}
      <div className="flex justify-between items-center bg-[#FFFFFFCC] py-4 px-10 sticky top-0 z-40 backdrop-blur-sm shadow-sm">
        <img
          src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/y0WLx2RbqX/549wbqn9_expires_30_days.png"
          className="w-[148px] h-[42px] object-contain cursor-pointer"
          onClick={() => navigate("/")}
          alt="Logo"
        />
        <div className="flex-1 flex justify-center items-center gap-12">
          <span onClick={() => navigate("/")} className={textMenuClass}>
            Inicio
          </span>
          <span onClick={() => navigate("/carreras")} className={textMenuClass}>
            Carreras
          </span>
          <span
            onClick={() => navigate("/universidades")}
            className={`${textMenuClass} text-[#1313EC] font-bold`}
          >
            Universidades
          </span>
        </div>
        <button
          className={`flex items-center gap-2 bg-[#1313EC] py-2.5 px-6 rounded-full border-0 ${buttonPressEffect}`}
          onClick={() => navigate("/asistente")}
        >
          <span className="text-white text-sm font-bold">Asistente IA</span>
        </button>
      </div>

      {/* HEADER */}
      <div className="flex flex-col w-full max-w-[1152px] mb-8 mx-auto gap-8 mt-10 px-4">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="flex flex-col items-start gap-4">
            <span className="text-[#0D0D1B] text-5xl font-black">
              Explora Universidades
            </span>
            <span className="text-[#4C4C9A] text-lg max-w-[628px] font-normal">
              Encuentra la institución ideal.{" "}
              {allUniversities === UNIVERSIDADES_MOCK &&
                "(Modo Offline activo)"}
            </span>
          </div>
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Buscar universidad..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-[#1313EC]"
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setPage(1);
              }}
            />
            <svg
              className="w-5 h-5 text-gray-400 absolute left-4 top-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
        </div>

        <div className="flex items-center gap-4 overflow-x-auto pb-2">
          <button
            className={`flex shrink-0 items-center py-[9px] px-5 gap-2 rounded-full border transition-all ${filtroActivo === "Todas" ? "bg-[#1313EC] text-white border-transparent" : "bg-white text-[#0D0D1B] border-[#E7E7F3]"}`}
            onClick={() => {
              setFiltroActivo("Todas");
              setPage(1);
            }}
          >
            <span className="text-sm font-bold">Todas</span>
          </button>
          <button
            className={`flex shrink-0 items-center py-[9px] px-5 gap-2 rounded-full border transition-all ${filtroActivo === "Publica" ? "bg-[#1313EC] text-white border-transparent" : "bg-white text-[#0D0D1B] border-[#E7E7F3]"}`}
            onClick={() => {
              setFiltroActivo("Publica");
              setPage(1);
            }}
          >
            <span className="text-sm font-bold">Públicas</span>
          </button>
          <button
            className={`flex shrink-0 items-center py-[9px] px-5 gap-2 rounded-full border transition-all ${filtroActivo === "Privada" ? "bg-[#1313EC] text-white border-transparent" : "bg-white text-[#0D0D1B] border-[#E7E7F3]"}`}
            onClick={() => {
              setFiltroActivo("Privada");
              setPage(1);
            }}
          >
            <span className="text-sm font-bold">Privadas</span>
          </button>
        </div>
      </div>

      {/* LISTA */}
      <div className="flex flex-col w-full max-w-[1152px] mx-auto gap-6 mb-20 px-4 min-h-[400px]">
        {unisParaMostrar.length > 0 ? (
          unisParaMostrar.map((uni) => (
            <div
              key={uni.id}
              className="flex flex-col md:flex-row items-center w-full bg-[#F6F9FA] p-8 gap-8 rounded-[48px] hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-32 h-32 rounded-[32px] bg-white flex items-center justify-center shadow-sm shrink-0 p-2 overflow-hidden">
                <img
                  src={uni.imagen || "https://placehold.co/100x100?text=U"}
                  className="w-full h-full object-contain"
                  alt={uni.nombre}
                />
              </div>

              <div className="flex flex-1 flex-col gap-2 w-full text-center md:text-left">
                <h3 className="text-[#0D0D1B] text-2xl font-bold">
                  {uni.nombre}
                </h3>
                <div className="flex flex-col gap-1 items-center md:items-start">
                  <span className="text-[#4C4C9A] text-sm font-medium">
                    {uni.ubicacion || "Ecuador"}
                  </span>
                  <span className="text-gray-500 text-sm">{uni.tipo}</span>
                </div>
                <p className="text-[#4C4C9A] text-sm leading-relaxed max-w-2xl font-normal line-clamp-2">
                  {uni.descripcion}
                </p>
              </div>

              <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto">
                <button
                  className={`bg-[#1313EC] text-white py-3 px-8 rounded-full font-bold hover:bg-[#0f0fb5] transition-colors ${buttonPressEffect}`}
                  onClick={() => setUniversidadSeleccionada(uni)}
                >
                  Ver Detalles
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h3 className="text-xl font-bold text-gray-900">
              No encontramos universidades
            </h3>
            <p className="text-gray-500 mt-2">Prueba cambiando el filtro.</p>
          </div>
        )}

        {/* PAGINACIÓN */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 rounded-full bg-gray-200 disabled:opacity-50"
          >
            ← Anterior
          </button>
          <span className="font-bold py-2">
            Página {page} {totalPaginas > 0 && `de ${totalPaginas}`}
          </span>
          <button
            disabled={page >= totalPaginas || totalPaginas === 0}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 rounded-full bg-gray-200 disabled:opacity-50"
          >
            Siguiente →
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <div className="bg-white py-16 px-20 border-t border-gray-200 mt-auto">
        <div className="text-center text-gray-500 text-sm">
          © 2026 UniDream Platform. Todos los derechos reservados.
        </div>
      </div>

      {/* MODAL REDISEÑADO */}
      {universidadSeleccionada && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-[32px] w-full max-w-[600px] flex flex-col overflow-hidden relative shadow-2xl animate-scale-up">
            {/* CABECERA AZUL */}
            <div className="bg-[#1313EC] h-[140px] w-full relative shrink-0">
              <button
                onClick={() => setUniversidadSeleccionada(null)}
                className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors z-10"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* CONTENIDO MODAL */}
            <div className="px-8 pb-10 flex flex-col items-center -mt-16 relative z-0">
              <div className="bg-white p-4 rounded-[24px] shadow-[0_8px_24px_rgba(0,0,0,0.12)] w-28 h-28 flex items-center justify-center mb-6 shrink-0">
                <img
                  src={
                    universidadSeleccionada.imagen ||
                    "https://placehold.co/100x100?text=U"
                  }
                  className="w-full h-full object-contain"
                  alt="Logo"
                />
              </div>
              <h2 className="text-[#0D0D1B] text-2xl font-black text-center mb-4 leading-tight">
                {universidadSeleccionada.nombre}
              </h2>
              <p className="text-gray-600 text-center text-sm leading-relaxed mb-8 max-w-md">
                {universidadSeleccionada.descripcion}
              </p>
              <div className="flex flex-row gap-4 w-full mb-8">
                <div className="flex-1 bg-gray-50 rounded-2xl p-4 border border-gray-100 flex flex-col items-center justify-center">
                  <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                    TIPO DE UNIVERSIDAD
                  </span>
                  <span className="text-[#0D0D1B] font-bold text-sm md:text-base text-center">
                    {universidadSeleccionada.tipo}
                  </span>
                </div>
                <div className="flex-1 bg-gray-50 rounded-2xl p-4 border border-gray-100 flex flex-col items-center justify-center">
                  <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                    CONTACTO
                  </span>
                  <span className="text-[#0D0D1B] font-bold text-sm md:text-base text-center">
                    {universidadSeleccionada.contact || "No disponible"}
                  </span>
                </div>
              </div>
              <a
                href={universidadSeleccionada.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full bg-[#1313EC] text-white py-4 rounded-xl font-bold text-center text-base hover:bg-[#0f0fb5] transition-all shadow-lg hover:shadow-xl ${buttonPressEffect}`}
              >
                Visitar Sitio Web Oficial
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
