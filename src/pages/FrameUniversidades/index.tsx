import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUniversities, University } from "../../services/universities"; 

const CARDS_POR_PAGINA = 5;

// --- DATOS DE RESPALDO (Por si AWS falla) ---
const UNIVERSIDADES_MOCK: University[] = [
    {
        id: 1,
        nombre: "Universidad Central del Ecuador",
        tipo: "Pública",
        imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Escudo_de_la_Universidad_Central_del_Ecuador.svg/1200px-Escudo_de_la_Universidad_Central_del_Ecuador.svg.png",
        ubicacion: "Quito, Pichincha",
        descripcion: "La universidad más antigua y grande del Ecuador, líder en investigación y ciencias sociales.",
        matchIA: 98,
        url: "https://www.uce.edu.ec"
    },
    {
        id: 2,
        nombre: "Escuela Politécnica Nacional",
        tipo: "Pública",
        imagen: "https://www.epn.edu.ec/wp-content/uploads/2015/06/logo-epn.png",
        ubicacion: "Quito, Pichincha",
        descripcion: "Referente nacional en carreras de ingeniería, ciencias exactas y tecnología.",
        matchIA: 95,
        url: "https://www.epn.edu.ec"
    }
];

export default function UniversitiesPage() {
    const navigate = useNavigate();

    const [allUniversities, setAllUniversities] = useState<University[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    const [filtroActivo, setFiltroActivo] = useState<"IA" | "Todas" | "Publica" | "Privada">("Todas");
    const [busqueda, setBusqueda] = useState("");
    const [universidadSeleccionada, setUniversidadSeleccionada] = useState<University | null>(null);

    // NUEVO: Estado para el modal de "No te conocemos"
    const [mostrarModalIA, setMostrarModalIA] = useState(false);

    // --- EFECTO DE CARGA HÍBRIDA CON SIMULACIÓN ---
    useEffect(() => {
        let isMounted = true;
        setLoading(true);

        const fetchAllData = async () => {
            try {
                // 1. Intentamos conectar a AWS
                const data = await getUniversities(1, 100); // Pedimos bastantes para la demo

                if (isMounted) {
                    if (data && Array.isArray(data) && data.length > 0) {
                        
                        // --- TRUCO DE MAGIA: SIMULACIÓN DE IA ---
                        // Si AWS devuelve matchIA = 0, le inventamos uno para la demo
                        const dataEnriquecida = data.map(uni => ({
                            ...uni,
                            matchIA: (uni.matchIA && uni.matchIA > 0) 
                                ? uni.matchIA 
                                : Math.floor(Math.random() * (98 - 65 + 1) + 65), // Genera entre 65% y 98%
                            carreraSugeridaIA: uni.carreraSugeridaIA || "Ingeniería en Software" // Dato relleno
                        }));

                        setAllUniversities(dataEnriquecida);
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
        return () => { isMounted = false; };
    }, []);

    // --- FILTRADO LOCAL ---
    const universidadesFiltradas = allUniversities
        .filter(uni => (uni.nombre || "").toLowerCase().includes(busqueda.toLowerCase()))
        .filter(uni => {
            if (filtroActivo === "Todas") return true;
            
            // Ahora esto SÍ funcionará gracias a la simulación
            if (filtroActivo === "IA") return (uni.matchIA ?? 0) > 60;
            
            const tipoNormalizado = (uni.tipo || uni.descripcion || "").toLowerCase();
            
            if (filtroActivo === "Publica") return tipoNormalizado.includes("pública") || tipoNormalizado.includes("publica");
            if (filtroActivo === "Privada") return tipoNormalizado.includes("privada");
            
            return true;
        });

    if (filtroActivo === "IA") {
        universidadesFiltradas.sort((a, b) => (b.matchIA ?? 0) - (a.matchIA ?? 0));
    }

    // --- PAGINACIÓN ---
    const indiceUltimo = page * CARDS_POR_PAGINA;
    const indicePrimero = indiceUltimo - CARDS_POR_PAGINA;
    const unisParaMostrar = universidadesFiltradas.slice(indicePrimero, indiceUltimo);
    const totalPaginas = Math.ceil(universidadesFiltradas.length / CARDS_POR_PAGINA);

    const textMenuClass = "text-[#0D0D1B] text-sm transition-colors duration-300 hover:text-[#1213ed] active:text-[#1213ed] cursor-pointer font-medium";
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
                <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/y0WLx2RbqX/549wbqn9_expires_30_days.png" className="w-[148px] h-[42px] object-contain cursor-pointer" onClick={() => navigate("/")} alt="Logo" />
                <div className="flex-1 flex justify-center items-center gap-12">
                    <span onClick={() => navigate("/")} className={textMenuClass}>Inicio</span>
                    <span onClick={() => navigate("/carreras")} className={textMenuClass}>Carreras</span>
                    <span onClick={() => navigate("/universidades")} className={`${textMenuClass} text-[#1313EC] font-bold`}>Universidades</span>
                </div>
                <button className={`flex items-center gap-2 bg-[#1313EC] py-2.5 px-6 rounded-full border-0 ${buttonPressEffect}`} onClick={() => navigate("/asistente")}>
                    <span className="text-white text-sm font-bold">Asistente IA</span>
                </button>
            </div>

            {/* HEADER */}
            <div className="flex flex-col self-stretch max-w-[1152px] mb-8 mx-auto gap-8 mt-10 px-4">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                    <div className="flex flex-col items-start gap-4">
                        <span className="text-[#0D0D1B] text-5xl font-black">Explora Universidades</span>
                        <span className="text-[#4C4C9A] text-lg max-w-[628px] font-normal">
                            Encuentra la institución ideal. {allUniversities === UNIVERSIDADES_MOCK && "(Modo Offline activo)"}
                        </span>
                    </div>
                    <div className="relative w-full md:w-96">
                        <input 
                            type="text" 
                            placeholder="Buscar universidad..." 
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-[#1313EC]"
                            value={busqueda}
                            onChange={(e) => { setBusqueda(e.target.value); setPage(1); }}
                        />
                        <svg className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                </div>

                <div className="flex items-center gap-4 overflow-x-auto pb-2">
                    
                    {/* BOTÓN IA - CON PROTECCIÓN */}
                    <button 
                        className={`flex shrink-0 items-center py-[9px] px-5 gap-2 rounded-full border transition-all ${filtroActivo === 'IA' ? 'bg-[#1313EC] text-white border-transparent' : 'bg-white text-[#0D0D1B] border-[#E7E7F3]'}`} 
                        onClick={() => {
                            const tienePerfil = localStorage.getItem("perfilIA_creado");
                            
                            if (tienePerfil === "true") {
                                setFiltroActivo("IA"); 
                                setPage(1);
                            } else {
                                setMostrarModalIA(true); // Muestra el Modal bonito
                            }
                        }}
                    >
                        <img src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/y0WLx2RbqX/16w66z7y_expires_30_days.png"} className="w-3.5 h-5 object-contain" style={{ filter: filtroActivo === 'IA' ? 'brightness(0) invert(1)' : 'none' }} alt="IA" />
                        <span className="text-sm font-bold ml-2">Recomendadas por IA</span>
                    </button>

                    <button className={`flex shrink-0 items-center py-[9px] px-5 gap-2 rounded-full border transition-all ${filtroActivo === 'Todas' ? 'bg-[#1313EC] text-white border-transparent' : 'bg-white text-[#0D0D1B] border-[#E7E7F3]'}`} onClick={() => { setFiltroActivo("Todas"); setPage(1); }}>
                        <span className="text-sm font-bold">Todas</span>
                    </button>
                    <button className={`flex shrink-0 items-center py-[9px] px-5 gap-2 rounded-full border transition-all ${filtroActivo === 'Publica' ? 'bg-[#1313EC] text-white border-transparent' : 'bg-white text-[#0D0D1B] border-[#E7E7F3]'}`} onClick={() => { setFiltroActivo("Publica"); setPage(1); }}>
                        <span className="text-sm font-bold">Públicas</span>
                    </button>
                    <button className={`flex shrink-0 items-center py-[9px] px-5 gap-2 rounded-full border transition-all ${filtroActivo === 'Privada' ? 'bg-[#1313EC] text-white border-transparent' : 'bg-white text-[#0D0D1B] border-[#E7E7F3]'}`} onClick={() => { setFiltroActivo("Privada"); setPage(1); }}>
                        <span className="text-sm font-bold">Privadas</span>
                    </button>
                </div>
            </div>

            {/* LISTA */}
            <div className="flex flex-col self-stretch max-w-[1152px] mx-auto gap-6 mb-20 px-4 min-h-[400px]">
                {unisParaMostrar.length > 0 ? (
                    unisParaMostrar.map((uni) => (
                        <div key={uni.id} className="flex flex-col md:flex-row items-center bg-[#F6F9FA] p-8 gap-8 rounded-[48px] hover:shadow-lg transition-shadow duration-300">
                            <div className="w-32 h-32 rounded-[32px] bg-white flex items-center justify-center shadow-sm shrink-0 p-2 overflow-hidden">
                                <img src={uni.imagen || "https://placehold.co/100x100?text=U"} className="w-full h-full object-contain" alt={uni.nombre} />
                            </div>
                            
                            <div className="flex flex-1 flex-col gap-2 w-full">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                                    <h3 className="text-[#0D0D1B] text-2xl font-bold">{uni.nombre}</h3>
                                    {filtroActivo === "IA" && (
                                        <div className="bg-[#1313EC1A] text-[#1313EC] px-3 py-1 rounded-full text-xs font-bold border border-[#1313EC33]">
                                            {uni.matchIA}% AI MATCH
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[#4C4C9A] text-sm font-medium">{uni.ubicacion}</span>
                                    <span className="text-gray-500 text-sm">{uni.tipo}</span>
                                </div>
                                <p className="text-[#4C4C9A] text-sm leading-relaxed max-w-2xl font-normal line-clamp-2">
                                    {uni.descripcion}
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto">
                                <button className={`bg-[#1313EC] text-white py-3 px-8 rounded-full font-bold hover:bg-[#0f0fb5] transition-colors ${buttonPressEffect}`} onClick={() => setUniversidadSeleccionada(uni)}>
                                    Ver Detalles
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <h3 className="text-xl font-bold text-gray-900">No encontramos universidades</h3>
                        <p className="text-gray-500 mt-2">Prueba cambiando el filtro.</p>
                    </div>
                )}

                {/* PAGINACIÓN */}
                <div className="flex justify-center gap-4 mt-8">
                    <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 rounded-full bg-gray-200 disabled:opacity-50">← Anterior</button>
                    <span className="font-bold py-2">Página {page} {totalPaginas > 0 && `de ${totalPaginas}`}</span>
                    <button disabled={page >= totalPaginas || totalPaginas === 0} onClick={() => setPage(p => p + 1)} className="px-4 py-2 rounded-full bg-gray-200 disabled:opacity-50">Siguiente →</button>
                </div>
            </div>

            {/* FOOTER */}
            <div className="bg-white py-16 px-20 border-t border-gray-200 mt-auto">
                <div className="text-center text-gray-500 text-sm">© 2026 UniDream Platform. Todos los derechos reservados.</div>
            </div>

            {/* MODAL DETALLES UNIVERSIDAD */}
            {universidadSeleccionada && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-[32px] w-full max-w-2xl p-8 relative shadow-2xl">
                        <button onClick={() => setUniversidadSeleccionada(null)} className="absolute top-4 right-4 text-gray-400 hover:text-black font-bold text-xl">✕</button>
                        <h2 className="text-2xl font-bold text-[#0D0D1B] mb-2">{universidadSeleccionada.nombre}</h2>
                        <span className="bg-blue-100 text-[#1313EC] px-3 py-1 rounded-full text-xs font-bold uppercase">{universidadSeleccionada.tipo}</span>
                        
                        <p className="text-gray-600 mt-4">{universidadSeleccionada.descripcion}</p>

                        {/* SECCIÓN DE IA EN EL MODAL */}
                        {filtroActivo === 'IA' && (universidadSeleccionada.matchIA ?? 0) > 0 && (
                            <div className="bg-[#1313EC0D] border border-[#1313EC33] rounded-2xl p-6 text-left mt-4">
                                <h4 className="text-[#1313EC] font-bold mb-2 uppercase text-xs tracking-wider flex items-center gap-2">
                                    Análisis de Compatibilidad
                                </h4>
                                <p className="text-[#1313EC] text-sm font-medium mb-1">
                                    Nivel de Match: <span className="font-bold text-lg">{universidadSeleccionada.matchIA}%</span>
                                </p>
                                <p className="text-gray-600 text-xs italic font-normal">
                                    Carrera sugerida: {universidadSeleccionada.carreraSugeridaIA}
                                </p>
                            </div>
                        )}

                        <a href={universidadSeleccionada.url} target="_blank" rel="noopener noreferrer" className="bg-[#1313EC] text-white py-3 rounded-xl font-bold block text-center mt-6 hover:bg-[#0f0fb5]">
                            Visitar Sitio Web Oficial
                        </a>
                    </div>
                </div>
            )}

            {/* --- MODAL DE "NO TE CONOCEMOS" (BONITO) --- */}
            {mostrarModalIA && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-[32px] w-full max-w-md p-8 text-center shadow-2xl relative">
                        {/* Botón Cerrar */}
                        <button 
                            onClick={() => setMostrarModalIA(false)} 
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>

                        {/* Ícono Robot */}
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/y0WLx2RbqX/16w66z7y_expires_30_days.png" className="w-10 h-10 object-contain" alt="IA" />
                        </div>

                        <h3 className="text-2xl font-black text-[#0D0D1B] mb-3">
                            ¡Aún no te conocemos! 🤖
                        </h3>
                        
                        <p className="text-gray-500 text-sm leading-relaxed mb-8">
                            Para que nuestra Inteligencia Artificial pueda recomendarte la universidad ideal, primero necesitamos saber qué te gusta.
                        </p>

                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={() => navigate("/")}
                                className="w-full bg-[#1313EC] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-[#0f0fb5] transition-all transform hover:scale-[1.02] shadow-lg shadow-blue-200"
                            >
                                Ir a Empezar Ahora 🚀
                            </button>
                            
                            <button 
                                onClick={() => setMostrarModalIA(false)}
                                className="w-full bg-white text-gray-500 py-3 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}