import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Career } from "../../types/Career";
import { getCareers } from "../../services/careers";
import Filtros from "./Filtros";
import CareersGrid from "./CareersGrid";
import CareersSkeleton from "./CareersSkeleton";
import Pagination from "./Pagination";

export default function CareersPage() {
    const navigate = useNavigate();
    const [careers, setCareers] = useState<Career[]>([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const limit = 5;

    const [filtroActivo, setFiltroActivo] = useState<
        "IA" | "Todas" | "Ingeniería" | "Salud"
    >("IA");

    const [busqueda, setBusqueda] = useState("");
    const [carreraSeleccionada, setCarreraSeleccionada] = useState<Career | null>(null);

    useEffect(() => {
        setLoading(true);
        getCareers(page).then(newData => {
            setCareers(newData);
            setLoading(false);
        });
    }, [page]);

    const textMenuClass =
        "text-[#0D0D1B] text-sm transition-colors duration-300 hover:text-[#1213ed] active:text-[#1213ed] cursor-pointer font-medium";
    const buttonPressEffect =
        "transition-transform duration-100 active:scale-95";

    const carrerasFiltradas = careers
        .filter(c =>
            c.nombre.toLowerCase().includes(busqueda.toLowerCase())
        )
        .filter(c => {
            if (filtroActivo === "Todas") return true;
            if (filtroActivo === "IA") return (c.matchIA ?? 0) > 0;
            return c.area === filtroActivo;
        });

    if (filtroActivo === "IA") {
        carrerasFiltradas.sort(
            (a, b) => (b.matchIA ?? 0) - (a.matchIA ?? 0)
        );
    }

    return (
        <div className="flex flex-col bg-white min-h-screen relative">

            {/* --- NAVBAR --- */}
            <div className="flex justify-between items-center bg-[#FFFFFFCC] py-4 px-10 sticky top-0 z-40 backdrop-blur-sm shadow-sm">
                <img
                    src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/y0WLx2RbqX/549wbqn9_expires_30_days.png"
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

            {/* Filtros, tabs, buscador → nunca desaparecen */}
            <div className="px-6 py-4">
                <Filtros
                    filtroActivo={filtroActivo}
                    setFiltroActivo={setFiltroActivo}
                    busqueda={busqueda}
                    setBusqueda={setBusqueda}
                />

                {/* SOLO esta parte cambia */}
                <section className="mt-6">
                    {loading ? (
                        <CareersSkeleton />
                    ) : (
                        <CareersGrid
                            careers={carrerasFiltradas}
                            onSelect={setCarreraSeleccionada}
                        />
                    )}
                </section>

                {/* Paginación */}
                <Pagination
                    page={page}
                    setPage={setPage}
                />
            </div>


            {/* --- HEADER --- */}
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
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                        <svg className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                </div>

                <div className="flex items-center gap-4 overflow-x-auto pb-2">
                    <button
                        className={`flex shrink-0 items-center py-[9px] px-5 gap-2 rounded-full border transition-all ${filtroActivo === 'IA' ? 'bg-[#1313EC] text-white border-transparent shadow-md' : 'bg-white text-[#0D0D1B] border-[#E7E7F3] hover:bg-gray-50'}`}
                        onClick={() => setFiltroActivo("IA")}
                    >
                        <img src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/y0WLx2RbqX/16w66z7y_expires_30_days.png"} className="w-3.5 h-5 object-contain" style={{ filter: filtroActivo === 'IA' ? 'brightness(0) invert(1)' : 'none' }} alt="IA Icon" />
                        <span className="text-sm font-bold">Recomendadas por IA</span>
                    </button>

                    <button
                        className={`flex shrink-0 items-center py-[9px] px-5 gap-2 rounded-full border transition-all ${filtroActivo === 'Todas' ? 'bg-[#1313EC] text-white border-transparent shadow-md' : 'bg-white text-[#0D0D1B] border-[#E7E7F3] hover:bg-gray-50'}`}
                        onClick={() => setFiltroActivo("Todas")}
                    >
                        <span className="text-sm font-bold">Todas</span>
                    </button>

                    <button
                        className={`flex shrink-0 items-center py-[9px] px-5 gap-2 rounded-full border transition-all ${filtroActivo === 'Ingeniería' ? 'bg-[#1313EC] text-white border-transparent shadow-md' : 'bg-white text-[#0D0D1B] border-[#E7E7F3] hover:bg-gray-50'}`}
                        onClick={() => setFiltroActivo("Ingeniería")}
                    >
                        <img src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/y0WLx2RbqX/il8iu3gh_expires_30_days.png"} className={`w-3.5 h-5 object-contain ${filtroActivo === 'Ingeniería' ? 'brightness-0 invert' : ''}`} alt="Ingeniería Icon" />
                        <span className="text-sm font-bold">Ingeniería</span>
                    </button>

                    <button
                        className={`flex shrink-0 items-center py-[9px] px-5 gap-2 rounded-full border transition-all ${filtroActivo === 'Salud' ? 'bg-[#1313EC] text-white border-transparent shadow-md' : 'bg-white text-[#0D0D1B] border-[#E7E7F3] hover:bg-gray-50'}`}
                        onClick={() => setFiltroActivo("Salud")}
                    >
                        <img src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/y0WLx2RbqX/3ns51jb1_expires_30_days.png"} className={`w-3.5 h-5 object-contain ${filtroActivo === 'Salud' ? 'brightness-0 invert' : ''}`} alt="Salud Icon" />
                        <span className="text-sm font-bold">Salud</span>
                    </button>
                </div>
            </div>

            

            <div className="flex justify-center gap-4 mt-10">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="px-4 py-2 rounded-full bg-gray-200 disabled:opacity-50"
                >
                    ← Anterior
                </button>

                <span className="font-bold">Página {page}</span>

                <button
                    onClick={() => setPage(p => p + 1)}
                    className="px-4 py-2 rounded-full bg-gray-200"
                >
                    Siguiente →
                </button>
            </div>


            {/* --- FOOTER --- */}
            <div className="bg-white py-16 px-20 border-t border-gray-200 mt-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20 text-[#0D0D1B]">
                    <div className="col-span-1 flex flex-col gap-6">
                        <img src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/y0WLx2RbqX/w9hmg2ml_expires_30_days.png"} className="w-48 object-contain filter invert opacity-80" alt="UniDream Logo" />
                        <p className="text-gray-600 text-sm leading-relaxed font-normal">Somos un equipo apasionado de estudiantes y desarrolladores comprometidos con democratizar el acceso a la orientación profesional.</p>
                    </div>
                    <div className="col-span-1 flex flex-col gap-4">
                        <h4 className="text-lg font-bold mb-2 text-[#0D0D1B]">Plataforma</h4>
                        <span className="text-gray-600 text-sm hover:text-[#1313EC] cursor-pointer font-normal" onClick={() => navigate("/carreras")}>Directorio de Carreras</span>
                        <span className="text-gray-600 text-sm hover:text-[#1313EC] cursor-pointer font-normal" onClick={() => navigate("/universidades")}>Ranking de Universidades</span>
                        <span className="text-gray-600 text-sm hover:text-[#1313EC] cursor-pointer font-normal">Test Vocacional IA</span>
                    </div>
                    <div className="col-span-1"></div>
                    <div className="col-span-1 flex flex-col gap-4">
                        <h4 className="text-lg font-bold mb-2 text-[#0D0D1B]">Suscríbete</h4>
                        <div className="flex flex-col gap-3">
                            <input type="email" placeholder="Tu correo electrónico" className="bg-gray-100 text-[#0D0D1B] p-3 rounded-full border border-gray-300 outline-none focus:border-[#1313EC] font-normal" />
                            <button className="bg-[#1313EC] text-white py-3 rounded-full font-bold hover:bg-[#0f0fb5]" onClick={() => alert("Suscrito!")}>Suscribirme</button>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-200 pt-8 text-center">
                    <span className="text-gray-500 text-sm font-normal">© 2026 UniDream Platform. Todos los derechos reservados.</span>
                </div>
            </div>

            {/* --- MODAL --- */}
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
                                <img src={carreraSeleccionada.imagen ?? ""} className="w-14 h-14 object-contain" alt={carreraSeleccionada.nombre} />
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

                            {/* Corregido: Acceso seguro a matchIA */}
                            {filtroActivo === 'IA' && (carreraSeleccionada.matchIA ?? 0) > 0 && (
                                <div className="bg-[#1313EC0D] border border-[#1313EC33] rounded-2xl p-6 text-left">
                                    <h4 className="text-[#1313EC] font-bold mb-2 uppercase text-xs tracking-wider flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path></svg>
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
                                    {/* Corregido: Validación de existencia de universidades */}
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