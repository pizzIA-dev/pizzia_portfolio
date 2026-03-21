import React, { useState, useEffect } from 'react';

const CATEGORIES = [
  'Todos',
  'Aplicaciones Web',
  'Análisis de Negocios',
  'Inteligencia Artificial',
  'Automatización',
  'Robótica',
  'Desarrollo de Videojuegos'
];

export default function ProjectsScene({ onBack }) {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const filteredProjects = selectedCategory === 'Todos' 
    ? projects 
    : projects.filter(p => p.category === selectedCategory);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
    fetch(`${API_URL}/api/projects/`)
      .then(res => res.json())
      .then(json => setProjects(json))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        if (selectedProject) setSelectedProject(null);
        else onBack();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onBack, selectedProject]);

  return (
    <div className="fixed inset-0 z-50 bg-[var(--color-deep-dark)] text-white overflow-y-auto flex flex-col items-center p-4 py-6 px-4 md:px-8">

      {/* Main Container */}
      <div className="relative w-full max-w-6xl border-4 border-[var(--color-neon-blue)] rounded-xl shadow-[0_0_30px_rgba(0,162,255,0.4)] bg-[#07080f] flex flex-col p-6 md:p-8 my-2">

        {/* Exit Scene */}
        <button
          onClick={onBack}
          className="absolute top-4 right-4 z-40 flex items-center gap-2 px-4 py-2 border-2 border-[var(--color-neon-blue)] text-[var(--color-neon-light)] hover:bg-[var(--color-neon-blue)] hover:text-black font-bold rounded-lg transition-all text-sm"
        >
          ← VOLVER  <kbd className="ml-2 w-8 h-8 inline-flex items-center justify-center text-xs font-mono bg-[#151515] border border-[var(--color-neon-blue)]/80 border-b-2 rounded shadow-[0_2px_5px_rgba(0,162,255,0.3)]">ESC</kbd>
        </button>

        <h1 className="text-3xl md:text-4xl font-black text-[var(--color-neon-blue)] uppercase tracking-widest bg-[#151515] px-6 py-2 border-l-4 border-[var(--color-neon-blue)] shadow-[0_0_15px_rgba(0,162,255,0.2)] mb-8 self-start mt-8">
          PROYECTOS
        </h1>

        {/* Categories Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs md:text-sm font-bold tracking-widest uppercase transition-all border-b-2 ${
                selectedCategory === cat
                  ? 'text-[var(--color-neon-blue)] border-[var(--color-neon-blue)] bg-[var(--color-neon-blue)]/10 text-shadow-neon'
                  : 'text-gray-400 border-transparent hover:text-white hover:border-gray-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid of Projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 w-full">
          {filteredProjects.map(p => (
            <div
              key={p.id}
              onClick={() => setSelectedProject(p)}
              className="cursor-pointer group relative"
            >
              <div className="bg-[#0d1520] border border-[var(--color-neon-blue)]/40 p-5 rounded-xl h-full flex flex-col transition-all duration-300 transform group-hover:-translate-y-2 group-hover:shadow-[0_10px_20px_rgba(0,162,255,0.3)] group-hover:border-[var(--color-neon-blue)]">
                {/* Image Preview */}
                <div className="w-full h-44 bg-black flex items-center justify-center border border-[var(--color-neon-blue)]/30 mb-4 overflow-hidden rounded relative">
                  {p.main_image_url ? (
                    <img src={p.main_image_url} alt={p.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <span className="text-[var(--color-neon-blue)] text-xs font-bold">SIN IMAGEN</span>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-neon-blue)]/20 to-transparent pointer-events-none" />
                </div>

                <h3 className="text-xl font-bold text-[var(--color-neon-light)] mb-1 leading-tight">{p.title}</h3>
                <p className="text-[0.65rem] text-[var(--color-neon-blue)]/70 font-mono uppercase tracking-[0.2em] mb-3">Cliente: {p.client_name}</p>

                <p className="text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">
                  {p.summary || p.description?.substring(0, 120) + '...'}
                </p>

                <div className="mt-auto pt-4 flex items-center justify-between text-[0.65rem] font-black uppercase tracking-widest text-[var(--color-neon-blue)]">
                  <span>Ver Detalle</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </div>
          ))}

          {/* Skeletons */}
          {projects.length === 0 && [1, 2, 3].map(i => (
            <div key={i} className="bg-[#0d1520] border border-[var(--color-neon-blue)]/20 p-5 rounded-xl animate-pulse h-80">
              <div className="w-full h-44 bg-gray-900 border border-[var(--color-neon-blue)]/10 mb-4 rounded" />
              <div className="h-6 bg-gray-800 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-800 rounded w-1/2 mb-4" />
              <div className="h-3 bg-gray-800 rounded w-full mb-1" />
              <div className="h-3 bg-gray-800 rounded w-5/6" />
            </div>
          ))}
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedProject && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0a0a0a] border-4 border-[var(--color-neon-blue)] rounded-2xl shadow-[0_0_50px_rgba(0,162,255,0.5)] flex flex-col p-6 md:p-10 scrollbar-hide">

            {/* Close Modal */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-6 right-6 z-10 p-2 text-[var(--color-neon-light)] hover:text-white hover:scale-110 transition-all text-2xl"
            >
              ✕
            </button>

            <div className="flex flex-col gap-8 md:gap-10">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-full md:w-1/2 shrink-0">
                  <div className="aspect-video w-full bg-black border-2 border-[var(--color-neon-blue)]/50 rounded-xl overflow-hidden shadow-2xl">
                    {selectedProject.main_image_url ? (
                      <img src={selectedProject.main_image_url} alt={selectedProject.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[var(--color-neon-blue)]/50 font-bold">SIN IMAGEN</div>
                    )}
                  </div>
                </div>

                <div className="flex-1">
                  <p className="text-[var(--color-neon-blue)] text-xs font-black uppercase tracking-[0.3em] mb-4 border-l-4 border-[var(--color-neon-blue)] pl-3">Detalle del Proyecto</p>
                  <h2 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tighter mb-4">{selectedProject.title}</h2>
                  <div className="flex items-center gap-2 mb-6 text-sm font-bold text-[var(--color-neon-light)]">
                    <span className="opacity-60 text-xs uppercase tracking-widest font-mono">Cliente:</span>
                    <span className="mr-4">{selectedProject.client_name}</span>
                    <span className="opacity-60 text-xs uppercase tracking-widest font-mono">Categoría:</span>
                    <span className="text-[var(--color-neon-blue)] px-2 py-0.5 border border-[var(--color-neon-blue)]/30 rounded">{selectedProject.category || 'Aplicaciones Web'}</span>
                  </div>

                  {selectedProject.preview_link && (
                    <a
                      href={selectedProject.preview_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 px-8 py-3 bg-[var(--color-neon-blue)] text-black font-black rounded-lg hover:bg-white hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,162,255,0.4)] text-sm mb-6"
                    >
                      🔗 VISITAR PROYECTO
                    </a>
                  )}
                </div>
              </div>

              {/* Description & Results */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-white/10">
                <div className="md:col-span-2 space-y-4">
                  <h4 className="text-[var(--color-neon-blue)] text-sm font-black uppercase tracking-widest">Sobre el proyecto</h4>
                  <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">{selectedProject.description}</p>
                </div>
                <div className="bg-[#0d1520] border-2 border-[var(--color-neon-blue)]/30 p-6 rounded-2xl h-fit">
                  <h4 className="text-green-400 text-xs font-black uppercase tracking-widest mb-4">Impacto & Resultados</h4>
                  <p className="text-white text-base md:text-lg font-bold leading-snug">{selectedProject.results}</p>
                </div>
              </div>

              {/* Auxiliary Gallery */}
              {selectedProject.images && selectedProject.images.length > 0 && (
                <div className="pt-8 border-t border-white/10">
                  <h4 className="text-[var(--color-neon-blue)] text-sm font-black uppercase tracking-widest mb-6">Galería de Imágenes</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedProject.images.map((img, idx) => (
                      <div key={img.id || idx} className="aspect-square rounded-xl overflow-hidden border-2 border-white/5 hover:border-[var(--color-neon-blue)] transition-all group relative cursor-zoom-in">
                        <img src={img.image_url} alt={img.caption || ""} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        {img.caption && (
                          <div className="absolute inset-x-0 bottom-0 p-2 bg-black/60 backdrop-blur-sm text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity">
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
