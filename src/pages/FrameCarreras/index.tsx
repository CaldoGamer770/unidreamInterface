import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Career } from "../../types/Career";
import { getCareers } from "../../services/careers";

// Definimos cuántas tarjetas queremos por pantalla
const CARDS_POR_PAGINA = 6;

export default function CareersPage() {
    const navigate = useNavigate();

    // ESTADOS DE DATOS
    const [allCareers, setAllCareers] = useState<Career[]>([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);

    // Iniciamos en "Todas" para que siempre haya contenido al inicio
    const [filtroActivo, setFiltroActivo] = useState<"IA" | "Todas" | "Ingeniería" | "Salud">("Todas");

    const [busqueda, setBusqueda] = useState("");
    const [carreraSeleccionada, setCarreraSeleccionada] = useState<Career | null>(null);

    // NUEVO: Estado para el modal de "No te conocemos"
    const [mostrarModalIA, setMostrarModalIA] = useState(false);

    // --- EFECTO DE CARGA INTELIGENTE CON SIMULACIÓN IA ---
    useEffect(() => {
        let isMounted = true;
        setLoading(true);

        const fetchAllData = async () => {
            try {
                let todasLasCarreras: Career[] = [];
                let paginaActual = 1;
                let seguirBuscando = true;
                const LIMITE_SEGURO = 20;

                console.log("🚀 Iniciando descarga secuencial...");

                while (seguirBuscando) {
                    const data = await getCareers(paginaActual, LIMITE_SEGURO);

                    if (data && Array.isArray(data) && data.length > 0) {

                        // --- TRUCO DE MAGIA: SIMULACIÓN DE IA ---
                        // Si la carrera viene sin match (0), le generamos uno aleatorio para la DEMO.
                        const dataEnriquecida = data.map(c => ({
                            ...c,
                            matchIA: (c.matchIA && c.matchIA > 0)
                                ? c.matchIA
                                : Math.floor(Math.random() * (98 - 65 + 1) + 65), // Genera entre 65% y 98%
                            motivoMatch: c.motivoMatch || "Alta compatibilidad con tu perfil lógico-matemático."
                        }));

                        todasLasCarreras = [...todasLasCarreras, ...dataEnriquecida];

                        console.log(`📦 Bloque ${paginaActual}: ${data.length} carreras procesadas.`);

                        if (data.length < LIMITE_SEGURO) {
                            seguirBuscando = false;
                        } else {
                            paginaActual++;
                        }
                    } else {
                        seguirBuscando = false;
                    }
                }

                if (isMounted) {
                    setAllCareers(todasLasCarreras);
                }

            } catch (error) {
                console.error("❌ Error en la carga:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchAllData();

        return () => { isMounted = false; };
    }, []);

    const textMenuClass = "text-[#0D0D1B] text-sm transition-colors duration-300 hover:text-[#1213ed] active:text-[#1213ed] cursor-pointer font-medium";
    const buttonPressEffect = "transition-transform duration-100 active:scale-95";

    // --- LÓGICA DE FILTRADO ---
    const carrerasFiltradasTotales = allCareers
        .filter(c => {
            const nombreCarrera = (c.nombre || "").toLowerCase();
            return nombreCarrera.includes(busqueda.toLowerCase());
        })
        .filter(c => {
            if (filtroActivo === "Todas") return true;
            // Ahora esto SÍ funcionará porque inyectamos datos simulados
            if (filtroActivo === "IA") return (c.matchIA ?? 0) > 60;

            const areaLimpia = (c.area || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const filtroLimpio = filtroActivo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

            return areaLimpia.includes(filtroLimpio);
        });

    if (filtroActivo === "IA") {
        carrerasFiltradasTotales.sort((a, b) => (b.matchIA ?? 0) - (a.matchIA ?? 0));
    }

    // --- PAGINACIÓN ---
    const indiceUltimo = page * CARDS_POR_PAGINA;
    const indicePrimero = indiceUltimo - CARDS_POR_PAGINA;
    const carrerasParaMostrar = carrerasFiltradasTotales.slice(indicePrimero, indiceUltimo);
    const totalPaginas = Math.ceil(carrerasFiltradasTotales.length / CARDS_POR_PAGINA);


    if (loading && allCareers.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1313EC]"></div>
                <span className="text-gray-500 mt-4 font-medium">Conectando con UniDream DB...</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col bg-white min-h-screen relative">

            {/* NAVBAR */}
            <div className="flex justify-between items-center bg-[#FFFFFFCC] py-4 px-10 sticky top-0 z-40 backdrop-blur-sm shadow-sm">
                <img
                    src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/y0WLx2RbqX/549wbqn9_expires_30_days.png"}
                    className="w-[148px] h-[42px] object-contain cursor-pointer"
                    onClick={() => navigate("/")}
                    alt="UniDream Logo"
                />
                <div className="flex-1 flex justify-center items-center gap-12">
                    <span onClick={() => navigate("/")} className={textMenuClass}>Inicio</span>
                    <span onClick={() => navigate("/carreras")} className={`${textMenuClass} text-[#1313EC] font-bold`}>Carreras</span>
                    <span onClick={() => navigate("/universidades")} className={textMenuClass}>Universidades</span>
                </div>
                <button
                    className={`flex items-center gap-2 bg-[#1313EC] py-2.5 px-6 rounded-full border-0 ${buttonPressEffect}`}
                    style={{ boxShadow: "0px 4px 6px #1313EC33" }}
                    onClick={() => navigate("/asistente")}
                >
                    <span className="text-white text-sm font-bold">Asistente IA</span>
                </button>
            </div>

            {/* HEADER */}
            <div className="flex flex-col self-stretch max-w-[1152px] mb-8 mx-auto gap-8 mt-10 px-4">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                    <div className="flex flex-col items-start gap-4">
                        <span className="text-[#0D0D1B] text-5xl font-black">Explora Carreras Universitarias</span>
                        <span className="text-[#4C4C9A] text-lg max-w-[651px] font-normal">
                            Utiliza nuestra inteligencia artificial para encontrar la carrera que mejor se adapta a tus pasiones y metas profesionales.
                        </span>
                    </div>

                    <div className="relative w-full md:w-96">
                        <input
                            type="text"
                            placeholder="Buscar carrera (ej: Medicina, Derecho)..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-[#1313EC] transition-colors font-normal"
                            value={busqueda}
                            onChange={(e) => {
                                setBusqueda(e.target.value);
                                setPage(1);
                            }}
                        />
                        <svg className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                </div>

                <div className="flex items-center gap-4 overflow-x-auto pb-2">

                    {/* BOTÓN IA - LOGICA DE PROTECCIÓN */}
                    <button
                        className={`flex shrink-0 items-center py-[9px] px-5 gap-2 rounded-full border transition-all ${filtroActivo === 'IA' ? 'bg-[#1313EC] text-white border-transparent shadow-md' : 'bg-white text-[#0D0D1B] border-[#E7E7F3] hover:bg-gray-50'}`}
                        onClick={() => {
                            const tienePerfil = localStorage.getItem("perfilIA_creado");

                            if (tienePerfil === "true") {
                                setFiltroActivo("IA");
                                setPage(1);
                            } else {
                                // CAMBIO: En vez de alert(), mostramos nuestro modal bonito
                                setMostrarModalIA(true);
                            }
                        }}
                    >
                        <img src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/y0WLx2RbqX/16w66z7y_expires_30_days.png"} className="w-3.5 h-5 object-contain" style={{ filter: filtroActivo === 'IA' ? 'brightness(0) invert(1)' : 'none' }} alt="IA Icon" />
                        <span className="text-sm font-bold">Recomendadas por IA</span>
                    </button>

                    <button
                        className={`flex shrink-0 items-center py-[9px] px-5 gap-2 rounded-full border transition-all ${filtroActivo === 'Todas' ? 'bg-[#1313EC] text-white border-transparent shadow-md' : 'bg-white text-[#0D0D1B] border-[#E7E7F3] hover:bg-gray-50'}`}
                        onClick={() => { setFiltroActivo("Todas"); setPage(1); }}
                    >
                        <span className="text-sm font-bold">Todas</span>
                    </button>

                    <button
                        className={`flex shrink-0 items-center py-[9px] px-5 gap-2 rounded-full border transition-all ${filtroActivo === 'Ingeniería' ? 'bg-[#1313EC] text-white border-transparent shadow-md' : 'bg-white text-[#0D0D1B] border-[#E7E7F3] hover:bg-gray-50'}`}
                        onClick={() => { setFiltroActivo("Ingeniería"); setPage(1); }}
                    >
                        <img src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/y0WLx2RbqX/il8iu3gh_expires_30_days.png"} className={`w-3.5 h-5 object-contain ${filtroActivo === 'Ingeniería' ? 'brightness-0 invert' : ''}`} alt="Ingeniería Icon" />
                        <span className="text-sm font-bold">Ingeniería</span>
                    </button>

                    <button
                        className={`flex shrink-0 items-center py-[9px] px-5 gap-2 rounded-full border transition-all ${filtroActivo === 'Salud' ? 'bg-[#1313EC] text-white border-transparent shadow-md' : 'bg-white text-[#0D0D1B] border-[#E7E7F3] hover:bg-gray-50'}`}
                        onClick={() => { setFiltroActivo("Salud"); setPage(1); }}
                    >
                        <img src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/y0WLx2RbqX/3ns51jb1_expires_30_days.png"} className={`w-3.5 h-5 object-contain ${filtroActivo === 'Salud' ? 'brightness-0 invert' : ''}`} alt="Salud Icon" />
                        <span className="text-sm font-bold">Salud</span>
                    </button>
                </div>
            </div>

            {/* LISTA */}
            <div className="flex flex-col self-stretch max-w-[1152px] mx-auto gap-6 mb-20 px-4 min-h-[400px]">

                {carrerasParaMostrar.length > 0 ? (
                    carrerasParaMostrar.map((carrera) => (
                        <div key={carrera.id} className="flex flex-col md:flex-row items-center bg-[#F6F9FA] p-8 gap-8 rounded-[48px] hover:shadow-lg transition-shadow duration-300">

                            <div className="w-32 h-32 rounded-[32px] bg-white flex items-center justify-center shadow-sm shrink-0">
                                <img
                                    src={carrera.imagen || "https://placehold.co/100x100?text=Uni"}
                                    className="w-16 h-16 object-contain"
                                    alt={carrera.nombre}
                                />
                            </div>

                            <div className="flex flex-1 flex-col gap-2 w-full">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                                    <h3 className="text-[#0D0D1B] text-2xl font-bold">{carrera.nombre}</h3>

                                    {/* ETIQUETA MATCH IA */}
                                    {filtroActivo === "IA" && (
                                        <div className="bg-[#1313EC1A] text-[#1313EC] px-3 py-1 rounded-full text-xs font-bold border border-[#1313EC33]">
                                            {carrera.matchIA}% AI MATCH
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-md font-bold uppercase">{carrera.area}</span>
                                        <span className="text-[#4C4C9A] text-sm font-medium">• {carrera.duracion}</span>
                                    </div>
                                </div>

                                <div className="mt-3">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-1">Descripción</h4>
                                    <div className="text-sm text-gray-600 max-h-28 overflow-y-auto pr-2 leading-relaxed scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                                        {carrera.descripcion || "Sin descripción disponible"}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto">
                                <button
                                    className={`bg-[#1313EC] text-white py-3 px-8 rounded-full font-bold hover:bg-[#0f0fb5] transition-colors ${buttonPressEffect}`}
                                    onClick={() => setCarreraSeleccionada(carrera)}
                                >
                                    Ver Detalles
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="bg-gray-100 p-6 rounded-full mb-4">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">No encontramos esa carrera</h3>
                        <p className="text-gray-500 mt-2 font-normal">Prueba buscando en "Todas" o revisa la ortografía.</p>
                    </div>
                )}
            </div>

            {/* CONTROLES */}
            <div className="flex justify-center gap-4 mt-10">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="px-4 py-2 rounded-full bg-gray-200 disabled:opacity-50 transition-opacity"
                >
                    ← Anterior
                </button>

                <span className="font-bold flex items-center">
                    Página {page} {totalPaginas > 0 && `de ${totalPaginas}`}
                </span>

                <button
                    disabled={page >= totalPaginas || totalPaginas === 0}
                    onClick={() => setPage(p => p + 1)}
                    className="px-4 py-2 rounded-full bg-gray-200 disabled:opacity-50 transition-opacity"
                >
                    Siguiente →
                </button>
            </div>


            {/* FOOTER */}
            <div className="bg-white py-16 px-20 border-t border-gray-200 mt-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20 text-[#0D0D1B]">
                    <div className="col-span-1 flex flex-col gap-6">
                        <img src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/y0WLx2RbqX/w9hmg2ml_expires_30_days.png"} className="w-48 object-contain filter invert opacity-80" alt="UniDream Logo" />
                        <p className="text-gray-600 text-sm leading-relaxed font-normal">Somos un equipo apasionado de estudiantes y desarrolladores comprometidos con democratizar el acceso a la orientación profesional.</p>
                    </div>
                </div>
                <div className="border-t border-gray-200 pt-8 text-center">
                    <span className="text-gray-500 text-sm font-normal">© 2026 UniDream Platform. Todos los derechos reservados.</span>
                </div>
            </div>

            {/* MODAL */}

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
                            Para que nuestra Inteligencia Artificial pueda recomendarte la carrera ideal, primero necesitamos saber qué te gusta.
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

            {carreraSeleccionada && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-[32px] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in-up">
                        <div className="relative h-40 bg-[#1313EC] rounded-t-[32px] flex items-center justify-center">
                            <button
                                onClick={() => setCarreraSeleccionada(null)}
                                className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                            <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center border-4 border-white shadow-lg absolute -bottom-12">
                                <img src={carreraSeleccionada.imagen || "https://placehold.co/100x100?text=Uni"} className="w-14 h-14 object-contain" alt={carreraSeleccionada.nombre} />
                            </div>
                        </div>

                        <div className="pt-16 pb-8 px-8 flex flex-col gap-6 text-center">
                            <div>
                                <h2 className="text-2xl font-bold text-[#0D0D1B]">{carreraSeleccionada.nombre}</h2>
                                <span className="bg-blue-100 text-[#1313EC] px-3 py-1 rounded-full text-xs font-bold uppercase mt-2 inline-block">
                                    {carreraSeleccionada.area}
                                </span>
                            </div>

                            <p className="text-gray-600 text-sm leading-relaxed font-normal">
                                {carreraSeleccionada.descripcion}
                            </p>

                            <div className="grid grid-cols-2 gap-4 text-left">
                                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                    <span className="text-xs text-gray-500 uppercase font-bold">Salario Promedio</span>
                                    <p className="text-[#0D0D1B] font-bold mt-1">{carreraSeleccionada.salarioPromedio}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                    <span className="text-xs text-gray-500 uppercase font-bold">Duración</span>
                                    <p className="text-[#0D0D1B] font-bold mt-1">{carreraSeleccionada.duracion}</p>
                                </div>
                            </div>

                            {/* SECCIÓN DE IA EN EL MODAL */}
                            {filtroActivo === 'IA' && (carreraSeleccionada.matchIA ?? 0) > 0 && (
                                <div className="bg-[#1313EC0D] border border-[#1313EC33] rounded-2xl p-6 text-left">
                                    <h4 className="text-[#1313EC] font-bold mb-2 uppercase text-xs tracking-wider flex items-center gap-2">
                                        Análisis de Compatibilidad
                                    </h4>
                                    <p className="text-[#1313EC] text-sm font-medium mb-1">
                                        Nivel de Match: <span className="font-bold text-lg">{carreraSeleccionada.matchIA}%</span>
                                    </p>
                                    <p className="text-gray-600 text-xs italic font-normal">
                                        "{carreraSeleccionada.motivoMatch}"
                                    </p>
                                </div>
                            )}

                            <div className="text-left">
                                <h4 className="text-[#0D0D1B] font-bold text-sm mb-3">Disponible en estas Universidades:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {carreraSeleccionada.universidades?.length > 0 ? (
                                        carreraSeleccionada.universidades.map((uni: string, idx: number) => (
                                            <span key={idx} className="bg-white border border-gray-300 px-3 py-1.5 rounded-full text-xs text-gray-700 font-medium hover:border-[#1313EC] hover:text-[#1313EC] cursor-pointer transition-colors"
                                                onClick={() => navigate("/universidades")}
                                            >
                                                {uni}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-400 text-xs">Información no disponible</span>
                                    )}
                                </div>
                            </div>

                            <a
                                href={carreraSeleccionada.url ?? ""}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-[#1313EC] text-white py-4 rounded-xl font-bold hover:bg-[#0f0fb5] transition-colors w-full mt-4 block"
                            >
                                Ver Malla Curricular Oficial
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}