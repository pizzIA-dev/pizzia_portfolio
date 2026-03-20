import React, { useEffect } from 'react';

const CARDS = [
  { icon: '🎯', title: 'Misión', text: 'Software, hardware e IA para resolver problemas reales y potenciar el crecimiento de nuestros clientes.' },
  { icon: '🔭', title: 'Visión',  text: 'Ser referentes en innovación tecnológica en Perú y Latinoamérica.' },
  { icon: '⚙️', title: '¿Qué hacemos?', text: 'Proyectos a medida: automatización, IA, análisis de datos y soluciones electrónicas.' },
  { icon: '🧩', title: '¿Cómo?', text: 'Analizamos, diseñamos y priorizamos funcionalidad, escalabilidad y resultados medibles.' },
];

const SERVICES = [
  'Software a medida','Inteligencia Artificial','Automatización',
  'Datos & Dashboards','Prototipos','Hardware + Software','Consultoría',
];

export default function AboutScene({ onBack }) {
  useEffect(() => {
    const k = (e) => { if (e.key === 'Escape') onBack(); };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onBack]);

  return (
    /*
      Fixed overlay with its own scroll context — independent of body overflow:hidden.
      This ensures ALL content is reachable on any screen size.
    */
    <div className="fixed inset-0 z-50 bg-[var(--color-deep-dark)] overflow-y-auto flex flex-col items-center justify-start py-6 px-4">

      {/* Bordered box: wider than before (max-w-6xl) but NOT full-screen.
          Centered with auto margins. Naturally sized by its content. */}
      <div className="relative w-full max-w-6xl border-4 border-[var(--color-neon-blue)] rounded-2xl shadow-[0_0_35px_rgba(0,162,255,0.35)] bg-[#07080f] flex flex-col my-4">

        {/* Exit */}
        <button onClick={onBack}
          className="absolute top-3 right-3 z-50 flex items-center gap-1.5 px-3 py-2 border-2 border-[var(--color-neon-blue)] text-[var(--color-neon-light)] hover:bg-[var(--color-neon-blue)] hover:text-black font-bold rounded-xl text-xs transition-all">
          ← VOLVER <kbd className="ml-1.5 w-8 h-8 inline-flex items-center justify-center text-xs font-mono bg-[#151515] border border-[var(--color-neon-blue)]/80 border-b-2 rounded-lg shadow-[0_2px_0_rgba(0,162,255,0.3)]">ESC</kbd>
        </button>

        {/* Content — no overflow:hidden here, let parent scroll */}
        <div className="flex flex-col gap-5 p-5 md:p-8 pt-14">

          {/* HERO */}
          <div className="flex items-center gap-4 pb-5 border-b border-[var(--color-neon-blue)]/20">
            <img src="/logo.png" alt="PizzIA"
              className="w-14 h-14 md:w-20 md:h-20 drop-shadow-[0_0_14px_#00a2ff] shrink-0" />
            <div>
              <h1 className="text-xl md:text-3xl lg:text-4xl font-black text-[var(--color-neon-blue)] uppercase tracking-widest">
                ¿Quiénes Somos?
              </h1>
              <p className="text-gray-300 text-xs md:text-sm lg:text-base leading-6 mt-1 max-w-3xl">
                <span className="text-[var(--color-neon-light)] font-semibold">Empresa peruana de tecnología</span> — transformamos procesos complejos en soluciones de software, hardware e IA: prácticas, eficientes y escalables.
              </p>
            </div>
          </div>

          {/* BODY — two columns on md+ */}
          <div className="flex flex-col md:flex-row gap-5">

            {/* LEFT: 2×2 cards */}
            <div className="grid grid-cols-2 gap-4 md:w-1/2">
              {CARDS.map(c => (
                <div key={c.title} className="bg-[#0d1520] border border-[var(--color-neon-blue)]/40 rounded-xl p-4 md:p-5 hover:shadow-[0_0_16px_rgba(0,162,255,0.2)] hover:border-[var(--color-neon-blue)]/70 transition-all group">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl md:text-2xl group-hover:scale-110 transition-transform">{c.icon}</span>
                    <p className="text-[var(--color-neon-blue)] text-xs md:text-sm font-bold uppercase tracking-wide">{c.title}</p>
                  </div>
                  <p className="text-gray-400 text-xs md:text-sm leading-5">{c.text}</p>
                </div>
              ))}
            </div>

            {/* RIGHT: Why + Services */}
            <div className="flex flex-col gap-4 md:w-1/2">
              <div className="bg-[#0a1628] border-l-4 border-[var(--color-neon-blue)] rounded-xl px-5 py-4 md:py-6">
                <p className="text-[var(--color-neon-light)] font-bold text-xs md:text-sm uppercase tracking-widest mb-2">¿Por qué PizzIA?</p>
                <p className="text-gray-200 text-xs md:text-sm lg:text-base leading-6">
                  Visión técnica + creatividad + innovación = soluciones reales, útiles y alineadas con tus objetivos.
                </p>
              </div>

              <div className="bg-[#0d1520] border border-[var(--color-neon-blue)]/30 rounded-xl px-5 py-4 md:py-5">
                <p className="text-[var(--color-neon-blue)] text-xs md:text-sm font-bold uppercase tracking-widest border-l-4 border-[var(--color-neon-blue)] pl-2 mb-3">Servicios</p>
                <div className="flex flex-wrap gap-2">
                  {SERVICES.map(s => (
                    <span key={s} className="px-3 py-1 bg-[#0a1628] border border-[var(--color-neon-blue)]/50 rounded-full text-xs text-[var(--color-neon-light)] font-medium hover:bg-[var(--color-neon-blue)]/20 transition-colors">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CONTACT BAR */}
        <div className="mx-4 mb-4 mt-2 rounded-xl border-2 border-[var(--color-neon-blue)] shadow-[0_0_25px_rgba(0,162,255,0.4)] bg-gradient-to-r from-[#0a1628] via-[#051020] to-[#0a1628] px-5 py-3 md:py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <p className="text-[var(--color-neon-blue)] text-[0.6rem] uppercase tracking-widest font-bold">Contáctanos</p>
            <h2 className="text-white text-sm md:text-base font-black">¿Listo para transformar tu negocio?</h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            <a href="mailto:pizzia.peru@gmail.com"
               className="flex items-center gap-2 px-4 py-2 bg-[var(--color-neon-blue)] text-black font-bold rounded-lg hover:opacity-80 transition-opacity shadow-[0_0_15px_rgba(0,162,255,0.6)] text-xs whitespace-nowrap">
              ✉️ pizzia.peru@gmail.com
            </a>
            <a href="tel:+51948413244"
               className="flex items-center gap-2 px-4 py-2 border-2 border-[var(--color-neon-blue)] text-[var(--color-neon-light)] font-bold rounded-lg hover:bg-[var(--color-neon-blue)] hover:text-black transition-all text-xs whitespace-nowrap">
              📱 +51 948 413 244
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
