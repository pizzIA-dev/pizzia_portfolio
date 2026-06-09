import React, { useState, useEffect } from 'react';

const CARDS = [
  { icon: '🎯', title: 'Misión', text: 'Software, hardware e IA para resolver problemas reales y potenciar el crecimiento de nuestros clientes.' },
  { icon: '🔭', title: 'Visión', text: 'Ser referentes en innovación tecnológica en Perú y Latinoamérica.' },
  { icon: '⚙️', title: '¿Qué hacemos?', text: 'Proyectos a medida: automatización, IA, análisis de datos y soluciones electrónicas.' },
  { icon: '🧩', title: '¿Cómo?', text: 'Analizamos, diseñamos y priorizamos funcionalidad, escalabilidad y resultados medibles.' },
];

const SERVICES = [
  'Software a medida', 'Inteligencia Artificial', 'Automatización',
  'Datos & Dashboards', 'Prototipos', 'Hardware + Software', 'Consultoría',
];

const CATEGORIES = [
  'Todos',
  'Aplicaciones Web',
  'Análisis de Negocios',
  'Inteligencia Artificial',
  'Automatización',
  'Robótica',
  'Desarrollo de Videojuegos'
];

// Array de configuración para los logos del carrusel.
// Agrega el nombre del archivo y la empresa cuando subas un logo a /public/logos/
const LOGOS = [
  // Ejemplo:
  { file: 'logoBBVA.png', name: 'BBVA' },
  { file: 'logoBCP.png', name: 'BCP' },
  { file: 'logoScotiabank.png', name: 'Scotiabank' },
  { file: 'logobn.png', name: 'Banco de la Nacion' },
  { file: 'logoJetPeru.png', name: 'JetPeru' },
  { file: 'logoMAF.png', name: 'MAF' },
  { file: 'logoRimac.png', name: 'logoRimac' },
  { file: 'logoTottus.png', name: 'Tottus' }
];

export default function LandingPage({ onEnterGame }) {
  // Add smooth scrolling
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // State for Projects
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // State for Clients
  const [clients, setClients] = useState([]);

  // Pagination States
  const [projectsPage, setProjectsPage] = useState(1);
  const PROJECTS_PER_PAGE = 6;

  const [clientsPage, setClientsPage] = useState(1);
  const CLIENTS_PER_PAGE = 8;

  // Pagination Helper UI
  const renderPagination = (currentPage, totalPages, setPage) => {
    if (totalPages <= 1) return null;
    return (
      <div className="flex justify-center items-center gap-4 mt-12 w-full">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 border border-[var(--color-neon-blue)]/50 text-[var(--color-neon-blue)] rounded-lg disabled:opacity-30 hover:bg-[var(--color-neon-blue)]/10 transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          ← Anterior
        </button>
        <div className="flex items-center gap-2 text-sm font-mono text-gray-400">
          <span className="text-[var(--color-neon-light)] font-bold text-lg">{currentPage}</span>
          <span>de</span>
          <span>{totalPages}</span>
        </div>
        <button
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 border border-[var(--color-neon-blue)]/50 text-[var(--color-neon-blue)] rounded-lg disabled:opacity-30 hover:bg-[var(--color-neon-blue)]/10 transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          Siguiente →
        </button>
      </div>
    );
  };

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

    // Fetch Projects
    fetch(`${API_URL}/api/projects/`)
      .then(res => res.json())
      .then(json => setProjects(json))
      .catch(err => console.error(err));

    // Fetch Clients
    fetch(`${API_URL}/api/clients/`)
      .then(res => res.json())
      .then(json => setClients(json))
      .catch(err => console.error(err));
  }, []);

  const filteredProjects = selectedCategory === 'Todos'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  const totalProjectPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);
  const paginatedProjects = filteredProjects.slice((projectsPage - 1) * PROJECTS_PER_PAGE, projectsPage * PROJECTS_PER_PAGE);

  const totalClientPages = Math.ceil(clients.length / CLIENTS_PER_PAGE);
  const paginatedClients = clients.slice((clientsPage - 1) * CLIENTS_PER_PAGE, clientsPage * CLIENTS_PER_PAGE);

  return (
    <div className="min-h-screen bg-[#02050a] text-white font-sans overflow-x-hidden selection:bg-[var(--color-neon-blue)] selection:text-black relative">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-[#02050a]/80 backdrop-blur-md border-b border-[var(--color-neon-blue)]/20 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img src="/logo.png" alt="PizzIA Logo" className="w-10 h-10 drop-shadow-[0_0_10px_var(--color-neon-blue)]" />
          <span className="text-2xl font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-br from-[var(--color-neon-light)] to-[var(--color-neon-blue)] drop-shadow-[0_0_5px_var(--color-neon-blue)]">
            PizzIA
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-bold tracking-widest uppercase text-gray-300">
          <button onClick={() => scrollTo('nosotros')} className="hover:text-[var(--color-neon-light)] transition-colors">Nosotros</button>
          <button onClick={() => scrollTo('proyectos')} className="hover:text-[var(--color-neon-light)] transition-colors">Proyectos</button>
          <button onClick={() => scrollTo('clientes')} className="hover:text-[var(--color-neon-light)] transition-colors">Clientes</button>
          <button onClick={() => scrollTo('contacto')} className="hover:text-[var(--color-neon-light)] transition-colors">Contacto</button>
        </div>

        <button
          onClick={onEnterGame}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-light)] text-black font-black rounded-lg hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,162,255,0.4)] text-sm md:text-base cursor-pointer"
        >
          🎮 <span className="hidden md:inline">Modo Interactivo</span><span className="md:hidden">Jugar</span>
        </button>
      </nav>

      {/* HERO SECTION */}
      <section className="relative min-h-[100dvh] flex flex-col justify-center items-center px-6 md:px-12 pt-20 overflow-hidden bg-gradient-to-b from-[#02050a] via-[#05111f] to-[#02050a]">
        {/* Background Grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(0,162,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0,162,255,0.15) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
        }}></div>

        <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-neon-blue)]/50 bg-[var(--color-neon-blue)]/10 text-[var(--color-neon-light)] text-xs font-bold tracking-widest uppercase mb-8 shadow-[0_0_15px_rgba(0,162,255,0.2)]">
            <span className="w-2 h-2 rounded-full bg-[var(--color-neon-light)] animate-pulse"></span>
            Innovación sin límites
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight tracking-tighter mb-6 drop-shadow-2xl max-w-4xl">
            Tecnología que <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-light)] filter drop-shadow-[0_0_20px_rgba(0,162,255,0.6)]">
              transforma.
            </span>
          </h1>

          <div className="w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-[var(--color-neon-blue)] to-transparent my-6"></div>

          <p className="text-gray-400 text-lg md:text-2xl max-w-2xl mb-10 leading-relaxed font-medium">
            Software, Inteligencia Artificial y automatización a medida para impulsar el futuro de empresas en el Perú y Latinoamérica.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => scrollTo('proyectos')}
              className="px-8 py-4 bg-[var(--color-neon-blue)] text-black font-black rounded-xl hover:bg-white transition-all shadow-[0_0_30px_rgba(0,162,255,0.5)] uppercase tracking-widest text-sm cursor-pointer"
            >
              Conoce nuestros proyectos
            </button>
            <button
              onClick={() => scrollTo('contacto')}
              className="px-8 py-4 border-2 border-[var(--color-neon-blue)]/50 text-[var(--color-neon-light)] font-bold rounded-xl hover:bg-[var(--color-neon-blue)]/10 hover:border-[var(--color-neon-blue)] transition-all uppercase tracking-widest text-sm cursor-pointer"
            >
              Contáctanos
            </button>
          </div>
        </div>
      </section>

      {/* TRAYECTORIA SECTION (Logo Carousel right below Hero) */}
      <section className="py-12 bg-[#050a14] border-y border-[var(--color-neon-blue)]/20 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 mb-6">
          <h3 className="text-[var(--color-neon-blue)] text-sm font-black uppercase tracking-[0.2em]">Trayectoria Profesional</h3>
        </div>

        <div className="w-full flex overflow-hidden group">
          <div className="flex animate-scroll whitespace-nowrap items-center gap-16 md:gap-24 px-8">
            {/* Render logos (duplicate to ensure smooth infinite scroll) */}
            {[...LOGOS, ...LOGOS, ...LOGOS, ...LOGOS].map((logo, idx) => (
              <img
                key={idx}
                src={`/logos/${logo.file}`}
                alt={logo.name}
                className="h-10 md:h-14 object-contain opacity-80 hover:opacity-100 hover:scale-110 transition-all duration-300"
                title={logo.name}
              />
            ))}
            {LOGOS.length === 0 && (
              <div className="text-gray-600 text-sm font-mono italic">
                (Añade logos en public/logos/ y actualiza el array en LandingPage.jsx)
              </div>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-6">
          <p className="text-[10px] text-gray-600 uppercase tracking-wider">
            Los logos mostrados identifican empresas donde integrantes de nuestro equipo desarrollaron experiencia profesional previa. Su aparición no implica relación comercial, patrocinio, alianza, recomendación ni condición de cliente de nuestra empresa.
          </p>
        </div>
      </section>

      {/* NOSOTROS SECTION */}
      <section id="nosotros" className="py-24 px-6 relative bg-gradient-to-b from-transparent via-[#050a14] to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-6 mb-16">
            <div className="w-16 h-1 bg-[var(--color-neon-blue)] rounded-full shadow-[0_0_10px_var(--color-neon-blue)]"></div>
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-widest">¿Quiénes Somos?</h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-1/2 flex flex-col justify-center">
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                <span className="text-[var(--color-neon-light)] font-bold">Empresa peruana de tecnología</span> — transformamos procesos complejos en soluciones de software, hardware e IA: prácticas, eficientes y escalables.
              </p>

              <div className="bg-[#0a1628] border-l-4 border-[var(--color-neon-blue)] rounded-xl px-6 py-5 mb-8 shadow-lg">
                <p className="text-[var(--color-neon-light)] font-bold text-sm uppercase tracking-widest mb-2">¿Por qué PizzIA?</p>
                <p className="text-gray-200 text-base leading-relaxed">
                  Visión técnica + creatividad + innovación = soluciones reales, útiles y alineadas con tus objetivos.
                </p>
              </div>

              <div className="bg-[#0d1520] border border-[var(--color-neon-blue)]/30 rounded-xl p-6 shadow-lg">
                <p className="text-[var(--color-neon-blue)] text-sm font-bold uppercase tracking-widest border-l-4 border-[var(--color-neon-blue)] pl-2 mb-4">Servicios</p>
                <div className="flex flex-wrap gap-2">
                  {SERVICES.map(s => (
                    <span key={s} className="px-3 py-1.5 bg-[#0a1628] border border-[var(--color-neon-blue)]/30 rounded-full text-xs text-[var(--color-neon-light)] font-medium hover:border-[var(--color-neon-blue)] transition-colors cursor-default">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CARDS.map(c => (
                <div key={c.title} className="bg-[#0d1520] border border-[var(--color-neon-blue)]/20 rounded-2xl p-6 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(0,162,255,0.15)] hover:border-[var(--color-neon-blue)]/60 transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-xl bg-[var(--color-neon-blue)]/10 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform shadow-inner border border-[var(--color-neon-blue)]/20">
                    {c.icon}
                  </div>
                  <h3 className="text-[var(--color-neon-blue)] text-lg font-bold uppercase tracking-wide mb-3">{c.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{c.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROYECTOS SECTION */}
      <section id="proyectos" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-1 bg-[var(--color-neon-blue)] rounded-full shadow-[0_0_10px_var(--color-neon-blue)]"></div>
              <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-widest">Proyectos</h2>
            </div>

            {/* Filter */}
            <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide max-w-full">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setProjectsPage(1);
                  }}
                  className={`shrink-0 px-4 py-2 text-xs font-bold tracking-widest uppercase transition-all rounded-lg border cursor-pointer ${selectedCategory === cat
                    ? 'text-[var(--color-neon-blue)] border-[var(--color-neon-blue)] bg-[var(--color-neon-blue)]/10 shadow-[0_0_10px_rgba(0,162,255,0.2)]'
                    : 'text-gray-400 border-gray-800 hover:text-white hover:border-gray-600 bg-gray-900/50'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedProjects.map(p => {
              let statusColor = 'bg-green-500/20 text-green-400 border-green-500/50';
              if (p.status === 'En progreso') statusColor = 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50';
              if (p.status === 'Abandonado') statusColor = 'bg-red-500/20 text-red-500 border-red-500/50';

              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedProject(p)}
                  className="cursor-pointer group"
                >
                  <div className="bg-[#0d1520] border border-[var(--color-neon-blue)]/20 p-6 rounded-2xl h-full flex flex-col transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_15px_30px_rgba(0,162,255,0.2)] group-hover:border-[var(--color-neon-blue)]/70">
                    <div className="w-full h-48 bg-black flex items-center justify-center border border-white/5 mb-5 rounded-xl overflow-hidden relative shadow-inner">
                      {p.main_image_url ? (
                        <img src={p.main_image_url} alt={p.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                      ) : (
                        <span className="text-[var(--color-neon-blue)]/50 text-xs font-bold tracking-widest">SIN IMAGEN</span>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#02050a] via-transparent to-transparent opacity-80"></div>

                      <div className={`absolute top-3 right-3 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest border rounded backdrop-blur-md ${statusColor}`}>
                        {p.status || 'Culminado'}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-white group-hover:text-[var(--color-neon-light)] transition-colors mb-2 leading-tight">{p.title}</h3>
                    <p className="text-[0.7rem] text-[var(--color-neon-blue)] font-bold uppercase tracking-[0.15em] mb-4 opacity-80">Cliente: {p.client_name}</p>

                    <p className="text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">
                      {p.summary || p.description?.substring(0, 120) + '...'}
                    </p>

                    <div className="mt-auto flex items-center text-xs font-black uppercase tracking-widest text-[var(--color-neon-blue)]">
                      <span>Ver Proyecto</span>
                      <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {projects.length === 0 && [1, 2, 3].map(i => (
              <div key={i} className="bg-[#0d1520] border border-[var(--color-neon-blue)]/10 p-6 rounded-2xl h-96 animate-pulse flex flex-col">
                <div className="w-full h-48 bg-gray-900 rounded-xl mb-5" />
                <div className="h-6 bg-gray-800 rounded w-3/4 mb-3" />
                <div className="h-4 bg-gray-800 rounded w-1/2 mb-6" />
                <div className="space-y-2 flex-1">
                  <div className="h-3 bg-gray-800 rounded w-full" />
                  <div className="h-3 bg-gray-800 rounded w-full" />
                  <div className="h-3 bg-gray-800 rounded w-4/5" />
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Projects */}
          {renderPagination(projectsPage, totalProjectPages, setProjectsPage)}
        </div>
      </section>

      {/* BANNER SECTION */}
      <section className="py-12 bg-[var(--color-neon-blue)] relative overflow-hidden flex flex-col items-center justify-center">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at center, black 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
        <div className="relative z-10 w-full flex overflow-hidden">
          <div className="flex animate-scroll whitespace-nowrap items-center gap-12 px-4">
            {/* Duplicated text for smooth scroll effect */}
            {[1, 2, 3].map((_, i) => (
              <React.Fragment key={i}>
                <span className="text-3xl md:text-5xl font-black text-black uppercase tracking-tighter">Eficiencia</span>
                <span className="text-white text-3xl md:text-5xl">➔</span>
                <span className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter drop-shadow-md">Innovación</span>
                <span className="text-black text-3xl md:text-5xl">➔</span>
                <span className="text-3xl md:text-5xl font-black text-black uppercase tracking-tighter">Excelencia</span>
                <span className="text-white text-3xl md:text-5xl">➔</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* CLIENTES SECTION */}
      <section id="clientes" className="py-24 px-6 relative bg-gradient-to-b from-transparent via-[#050a14] to-transparent">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-widest mb-4 inline-block relative">
            Nuestros Clientes
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-1 bg-[var(--color-neon-blue)] rounded-full shadow-[0_0_10px_var(--color-neon-blue)]"></div>
          </h2>
          <p className="text-gray-400 mt-8 mb-16 max-w-2xl mx-auto text-lg">Empresas que confían en nosotros para transformar sus ideas en soluciones tecnológicas de alto impacto.</p>

          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {paginatedClients.map(c => (
              <div key={c.id} className="flex flex-col items-center group w-32 md:w-40">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-[var(--color-neon-blue)]/40 p-1 bg-[#0a0a0a] flex items-center justify-center overflow-hidden mb-5 shadow-lg group-hover:border-[var(--color-neon-light)] group-hover:shadow-[0_0_25px_rgba(0,162,255,0.4)] transition-all duration-300 group-hover:-translate-y-2">
                  {c.logo_url ? (
                    <img src={c.logo_url} alt={c.name} className="w-full h-full object-cover rounded-full transition-all duration-500" />
                  ) : (
                    <span className="text-3xl text-[var(--color-neon-blue)] font-bold">
                      {c.name?.charAt(0) ?? '?'}
                    </span>
                  )}
                </div>
                <h3 className="text-sm md:text-base font-bold text-white group-hover:text-[var(--color-neon-light)] transition-colors text-center leading-tight">{c.name}</h3>
                <p className="text-xs font-mono text-gray-500 mt-1 text-center">{c.industry}</p>
              </div>
            ))}
            {clients.length === 0 && [1, 2, 3, 4].map(i => (
              <div key={i} className="flex flex-col items-center animate-pulse w-32 md:w-40">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-900 border border-gray-800 mb-5" />
                <div className="h-4 bg-gray-800 rounded w-24 mb-2" />
                <div className="h-3 bg-gray-800 rounded w-16" />
              </div>
            ))}
          </div>

          {/* Pagination Clients */}
          {renderPagination(clientsPage, totalClientPages, setClientsPage)}
        </div>
      </section>

      {/* Removed Logo Carousel from bottom */}

      {/* CONTACTO & FOOTER */}
      <footer id="contacto" className="pt-24 pb-8 px-6 bg-[#050a14] relative border-t border-[var(--color-neon-blue)]/20">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-[#0a1628] via-[#051020] to-[#0a1628] border border-[var(--color-neon-blue)]/30 rounded-3xl p-8 md:p-12 shadow-[0_0_40px_rgba(0,162,255,0.15)] flex flex-col md:flex-row items-center justify-between gap-8 mb-20">
            <div>
              <p className="text-[var(--color-neon-blue)] text-sm uppercase tracking-[0.2em] font-bold mb-3">Hablemos</p>
              <h2 className="text-3xl md:text-5xl font-black text-white">¿Listo para transformar <br className="hidden md:block" /> tu negocio?</h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full md:w-auto">
              <a href="mailto:pizzia.peru@gmail.com"
                className="flex items-center justify-center gap-3 px-8 py-4 bg-[var(--color-neon-blue)] text-black font-black rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(0,162,255,0.4)] text-sm uppercase tracking-widest">
                ✉️ Enviar Correo
              </a>
              <a href="tel:+51948413244"
                className="flex items-center justify-center gap-3 px-8 py-4 border-2 border-[var(--color-neon-blue)] text-[var(--color-neon-light)] font-bold rounded-xl hover:bg-[var(--color-neon-blue)]/10 transition-all text-sm uppercase tracking-widest">
                📱 +51 948 413 244
              </a>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-t border-white/10 pt-8">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="PizzIA Logo" className="w-8 h-8 grayscale opacity-50" />
              <span className="text-xl font-black italic tracking-widest text-gray-500">PizzIA</span>
            </div>

            <p className="text-gray-500 text-xs uppercase tracking-widest text-center">
              © {new Date().getFullYear()} PizzIA. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* MODAL DE PROYECTO */}
      {selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-[#07080f] border-2 border-[var(--color-neon-blue)]/50 rounded-2xl shadow-[0_0_50px_rgba(0,162,255,0.3)] flex flex-col p-6 md:p-10 scrollbar-hide">

            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-6 right-6 z-10 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>

            <div className="flex flex-col gap-8 md:gap-12 mt-4">
              <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
                <div className="w-full md:w-1/2 shrink-0">
                  <div className="aspect-video w-full bg-black border border-[var(--color-neon-blue)]/30 rounded-xl overflow-hidden shadow-2xl relative">
                    {selectedProject.main_image_url ? (
                      <img src={selectedProject.main_image_url} alt={selectedProject.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[var(--color-neon-blue)]/40 font-bold tracking-widest text-sm">SIN IMAGEN</div>
                    )}
                  </div>
                </div>

                <div className="flex-1">
                  <p className="text-[var(--color-neon-blue)] text-xs font-black uppercase tracking-[0.2em] mb-4 border-l-2 border-[var(--color-neon-blue)] pl-3">Detalle del Proyecto</p>
                  <h2 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tighter mb-6">{selectedProject.title}</h2>

                  <div className="flex flex-wrap items-center gap-4 mb-8 text-sm font-bold text-white">
                    <div className="flex flex-col gap-1">
                      <span className="text-gray-500 text-[10px] uppercase tracking-widest">Estado</span>
                      <span className={`px-3 py-1 text-[11px] tracking-widest uppercase border rounded inline-block w-fit ${selectedProject.status === 'En progreso' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30' :
                        selectedProject.status === 'Abandonado' ? 'bg-red-500/10 text-red-500 border-red-500/30' :
                          'bg-green-500/10 text-green-400 border-green-500/30'
                        }`}>
                        {selectedProject.status || 'Culminado'}
                      </span>
                    </div>
                    <div className="w-px h-8 bg-white/10 hidden sm:block"></div>
                    <div className="flex flex-col gap-1">
                      <span className="text-gray-500 text-[10px] uppercase tracking-widest">Cliente</span>
                      <span className="text-[var(--color-neon-light)]">{selectedProject.client_name}</span>
                    </div>
                    <div className="w-px h-8 bg-white/10 hidden sm:block"></div>
                    <div className="flex flex-col gap-1">
                      <span className="text-gray-500 text-[10px] uppercase tracking-widest">Categoría</span>
                      <span className="text-gray-300">{selectedProject.category || 'Aplicaciones Web'}</span>
                    </div>
                  </div>

                  {selectedProject.preview_link && (
                    <a
                      href={selectedProject.preview_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 px-6 py-3 bg-[var(--color-neon-blue)] text-black font-bold rounded-lg hover:bg-white transition-all shadow-[0_0_15px_rgba(0,162,255,0.3)] text-xs uppercase tracking-widest"
                    >
                      🔗 Visitar Proyecto Web
                    </a>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8 border-t border-white/10">
                <div className="lg:col-span-2 space-y-4">
                  <h4 className="text-[var(--color-neon-blue)] text-xs font-black uppercase tracking-[0.15em]">Sobre el proyecto</h4>
                  <p className="text-gray-300 text-base leading-relaxed whitespace-pre-wrap">{selectedProject.description}</p>
                </div>
                {selectedProject.results && (
                  <div className="bg-[#0a0f1a] border border-[var(--color-neon-blue)]/20 p-6 rounded-xl h-fit">
                    <h4 className="text-green-400 text-xs font-black uppercase tracking-[0.15em] mb-4">Impacto & Resultados</h4>
                    <p className="text-white text-sm font-medium leading-relaxed">{selectedProject.results}</p>
                  </div>
                )}
              </div>

              {selectedProject.images && selectedProject.images.length > 0 && (
                <div className="pt-8 border-t border-white/10">
                  <h4 className="text-[var(--color-neon-blue)] text-xs font-black uppercase tracking-[0.15em] mb-6">Galería de Imágenes</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedProject.images.map((img, idx) => (
                      <div key={img.id || idx} className="aspect-square rounded-xl overflow-hidden border border-white/10 hover:border-[var(--color-neon-blue)]/50 transition-all group relative">
                        <img src={img.image_url} alt={img.caption || ""} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        {img.caption && (
                          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black to-transparent text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            {img.caption}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
