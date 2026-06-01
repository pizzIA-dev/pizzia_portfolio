import React, { useState, useEffect } from 'react';

export default function ClientsScene({ onBack }) {
  const [clients, setClients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  const totalPages = Math.ceil(clients.length / ITEMS_PER_PAGE);
  const paginatedClients = clients.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Pagination Helper UI
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    return (
      <div className="flex justify-center items-center gap-4 mt-12 w-full">
        <button 
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
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
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
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
    fetch(`${API_URL}/api/clients/`)
      .then(res => res.json())
      .then(json => setClients(json))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onBack(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onBack]);

  return (
    <div className="fixed inset-0 z-50 bg-[var(--color-deep-dark)] text-white overflow-y-auto flex flex-col items-center p-4 py-6">

      {/* Inner bordered box */}
      <div className="relative w-full max-w-6xl border-4 border-[var(--color-neon-blue)] rounded-xl shadow-[0_0_30px_rgba(0,162,255,0.4)] bg-[#07080f] flex flex-col items-center p-8 my-2">

        {/* Exit */}
        <button
          onClick={onBack}
          className="absolute top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 border-2 border-[var(--color-neon-blue)] text-[var(--color-neon-light)] hover:bg-[var(--color-neon-blue)] hover:text-black font-bold rounded-lg transition-all text-sm"
        >
          ← VOLVER  <kbd className="ml-2 w-8 h-8 inline-flex items-center justify-center text-xs font-mono bg-[#151515] border border-[var(--color-neon-blue)]/80 border-b-2 rounded shadow-[0_2px_5px_rgba(0,162,255,0.3)]">ESC</kbd>
        </button>

        <h1 className="text-4xl font-bold text-[var(--color-neon-light)] mb-12 uppercase tracking-widest drop-shadow-[0_0_10px_#00d2ff] mt-8">
          NUESTROS CLIENTES
        </h1>

        <div className="flex flex-wrap justify-center gap-14 w-full">
          {paginatedClients.map(c => (
            <div key={c.id} className="flex flex-col items-center group">
              <div className="w-48 h-48 rounded-full border-2 border-[var(--color-neon-blue)] p-2 bg-[#050505] flex items-center justify-center overflow-hidden mb-4 shadow-[0_0_20px_rgba(0,162,255,0.25)] group-hover:border-white group-hover:shadow-[0_0_30px_rgba(0,162,255,0.5)] transition-all duration-300">
                {c.logo_url ? (
                  <img src={c.logo_url} alt={c.name} className="w-full h-full object-cover rounded-full grayscale group-hover:grayscale-0 transition-all duration-500" />
                ) : (
                  <span className="text-4xl text-[var(--color-neon-blue)] font-bold">
                    {c.name?.charAt(0) ?? '?'}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-[var(--color-neon-blue)] transition-colors">{c.name}</h3>
              <p className="text-sm font-mono text-gray-400">{c.industry}</p>
            </div>
          ))}
          {clients.length === 0 && [1, 2, 3, 4].map(i => (
            <div key={i} className="flex flex-col items-center animate-pulse">
              <div className="w-48 h-48 rounded-full border-2 border-[var(--color-neon-blue)]/30 p-2 bg-[#050505] mb-4" />
              <div className="h-5 bg-gray-800 rounded w-28 mb-3" />
              <div className="h-4 bg-gray-800 rounded w-20" />
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {renderPagination()}
      </div>
    </div>
  );
}
