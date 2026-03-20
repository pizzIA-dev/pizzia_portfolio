import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './index.css';

import AboutScene from './components/AboutScene';
import ProjectsScene from './components/ProjectsScene';
import ClientsScene from './components/ClientsScene';

const TILE_SIZE = 32;
const MAP_WIDTH = 25; 
const MAP_HEIGHT = 20; // Increased to ensure space below the clients building

const BUILDINGS = [
  { 
    id: 'about', 
    name: '¿QUIÉNES SOMOS?', 
    type: 'skyscraper', 
    x: 3, 
    y: 1, 
    w: 4, 
    h: 8, 
    door_x: 1.5, 
    door_y: 7, 
    color: 'var(--color-neon-blue)',
    icon: '🏢'
  },
  { 
    id: 'projects', 
    name: 'PROYECTOS', 
    type: 'museum', 
    x: 15, 
    y: 2, 
    w: 7, 
    h: 6, 
    door_x: 3, 
    door_y: 5, 
    color: 'var(--color-neon-light)',
    icon: '🏛️'
  },
  { 
    id: 'clients', 
    name: 'CLIENTES', 
    type: 'auditorium', 
    x: 7, 
    y: 12, 
    w: 11, 
    h: 5, 
    door_x: 5, 
    door_y: 4, 
    color: 'var(--color-neon-blue)',
    icon: '🤝'
  },
];

const PizzaSprite = () => (
  <svg width="40" height="40" viewBox="0 0 100 100" className="drop-shadow-[0_0_8px_var(--color-neon-blue)]">
    {/* Piesitos con sutil animación en CSS si quisieramos, pero fijos por ahora */}
    <path d="M 35 85 L 30 95 L 40 95 Z" fill="var(--color-neon-blue)" />
    <path d="M 65 85 L 60 95 L 70 95 Z" fill="var(--color-neon-blue)" />
    
    {/* Base slice outline */}
    <path d="M50 15 L15 85 A50 15 0 0 0 85 85 Z" fill="#151515" stroke="var(--color-neon-blue)" strokeWidth="4" strokeLinejoin="round"/>
    
    {/* Crust outline */}
    <path d="M15 85 A50 15 0 0 0 85 85" fill="transparent" stroke="var(--color-neon-light)" strokeWidth="6" strokeLinecap="round"/>
    
    {/* Cara con expresión (ojos y sonrisa) */}
    <circle cx="40" cy="55" r="4" fill="white" />
    <circle cx="60" cy="55" r="4" fill="white" />
    <path d="M 45 65 Q 50 70 55 65" fill="transparent" stroke="var(--color-neon-light)" strokeWidth="3" strokeLinecap="round" />
    
    {/* Pepperoni / AI Nodes sutiles */}
    <circle cx="50" cy="35" r="3" fill="var(--color-neon-blue)" />
    <circle cx="35" cy="70" r="3" fill="var(--color-neon-light)" opacity="0.5"/>
    <circle cx="65" cy="70" r="3" fill="var(--color-neon-light)" opacity="0.5"/>
  </svg>
);

// URL path → scene name mapping
const PATH_TO_SCENE = { '/': 'city', '/nosotros': 'about', '/proyectos': 'projects', '/clientes': 'clients' };
const SCENE_TO_PATH = { city: '/', about: '/nosotros', projects: '/proyectos', clients: '/clientes' };

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentScene = PATH_TO_SCENE[location.pathname] ?? 'city';
  
  const keys = useRef({});
  const requestRef = useRef();
  
  // DOM Refs para CERO jitter
  const playerRef = useRef(null);
  
  // Estado real sin re-renders
  const posRef = useRef({ x: (MAP_WIDTH * TILE_SIZE) / 2 - 20, y: (MAP_HEIGHT * TILE_SIZE) / 2 - 20 });
  const sceneRef = useRef(currentScene);
  const [scale, setScale] = useState(1);
  const [transitionState, setTransitionState] = useState('idle'); // idle, closing, closed, opening
  const transitionStateRef = useRef('idle');

  const startTransition = (targetScene) => {
    if (transitionStateRef.current !== 'idle') return;
    
    // Phase 1: close (zoom + fade to black: 200ms)
    transitionStateRef.current = 'closing';
    setTransitionState('closing');
    
    setTimeout(() => {
      // Navigate via URL — React Router updates currentScene reactively
      navigate(SCENE_TO_PATH[targetScene] ?? '/');
      
      // Phase 2: open (fade from black: 200ms)
      transitionStateRef.current = 'opening';
      setTransitionState('opening');
      
      setTimeout(() => {
        transitionStateRef.current = 'idle';
        setTransitionState('idle');
      }, 200);
    }, 200); 
  };

  // Resize handler for responsive map
  useEffect(() => {
    const handleResize = () => {
      const padding = 32;
      const availableWidth = window.innerWidth - padding;
      const gameWidth = MAP_WIDTH * TILE_SIZE;
      let newScale = availableWidth / gameWidth;
      
      // Limit scale up on ultra-wide screens to not get absurdly huge, but mostly scale down for mobile
      if (newScale > 1.2) newScale = 1.2;
      
      setScale(newScale);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    sceneRef.current = currentScene;
  }, [currentScene]);

  useEffect(() => {
    const handleKeyDown = (e) => { 
      keys.current[e.key] = true; 
      if(e.key.length === 1) keys.current[e.key.toLowerCase()] = true; 
    };
    const handleKeyUp = (e) => { 
      keys.current[e.key] = false; 
      if(e.key.length === 1) keys.current[e.key.toLowerCase()] = false; 
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const update = () => {
      if (sceneRef.current === 'city' && playerRef.current) {
        let dx = 0; let dy = 0;
        const SPEED = 4; // Constant speed
        
        if (keys.current['w'] || keys.current['ArrowUp']) dy -= SPEED;
        if (keys.current['s'] || keys.current['ArrowDown']) dy += SPEED;
        if (keys.current['a'] || keys.current['ArrowLeft']) dx -= SPEED;
        if (keys.current['d'] || keys.current['ArrowRight']) dx += SPEED;

        if (dx !== 0 || dy !== 0) {
          let nextX = posRef.current.x;
          let nextY = posRef.current.y;
          const PLAYER_SIZE = 40;
          let enterScene = null;

          // X Movement Sliding
          if (dx !== 0) {
              const testX = nextX + dx;
              const pL = testX + 5, pR = testX + 35, pT = nextY + 5, pB = nextY + 35;
              let hitX = false;
              for (const b of BUILDINGS) {
                  const bL = b.x * TILE_SIZE, bR = bL + b.w * TILE_SIZE;
                  const bT = b.y * TILE_SIZE, bB = bT + b.h * TILE_SIZE;
                  if (pL < bR && pR > bL && pT < bB && pB > bT) {
                      const doorL = bL + b.door_x * TILE_SIZE;
                      const doorR = doorL + TILE_SIZE;
                      // Ensure pizza is mostly aligned roughly within the door width
                      const inDoorX = pL >= doorL - 12 && pR <= doorR + 12;
                      
                      if (inDoorX && pT >= bB - 25) {
                          // Allow the pizza to walk *into* the door up to 15 pixels deep
                          if (pT <= bB - 15) {
                              enterScene = b.id;
                          }
                      } else {
                          hitX = true;
                      }
                  }
              }
              if (!hitX) nextX = testX;
          }

          // Y Movement Sliding
          if (dy !== 0) {
              const testY = nextY + dy;
              const pL = nextX + 5, pR = nextX + 35, pT = testY + 5, pB = testY + 35;
              let hitY = false;
              for (const b of BUILDINGS) {
                  const bL = b.x * TILE_SIZE, bR = bL + b.w * TILE_SIZE;
                  const bT = b.y * TILE_SIZE, bB = bT + b.h * TILE_SIZE;
                  if (pL < bR && pR > bL && pT < bB && pB > bT) {
                      const doorL = bL + b.door_x * TILE_SIZE;
                      const doorR = doorL + TILE_SIZE;
                      const inDoorX = pL >= doorL - 12 && pR <= doorR + 12;
                      
                      if (inDoorX && pT >= bB - 25) {
                          // Allow the pizza to walk *into* the door up to 15 pixels deep
                          if (pT <= bB - 15) {
                              enterScene = b.id;
                          }
                      } else {
                          hitY = true;
                      }
                  }
              }
              if (!hitY) nextY = testY;
          }

          if (enterScene && transitionStateRef.current === 'idle') {
             // Hide pizza immediately so it doesn't visibly slide during the fade transition
             if (playerRef.current) playerRef.current.style.opacity = '0';
             startTransition(enterScene);
             keys.current = {};
          } else {
             // Constrain map boundaries strictly
             nextX = Math.max(0, Math.min(nextX, MAP_WIDTH * TILE_SIZE - PLAYER_SIZE));
             nextY = Math.max(0, Math.min(nextY, MAP_HEIGHT * TILE_SIZE - PLAYER_SIZE));
             
             posRef.current.x = nextX;
             posRef.current.y = nextY;
          }
        }
        
        // Update DOM directly! No React state lag.
        playerRef.current.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px)`;
      }
      requestRef.current = requestAnimationFrame(update);
    };
    
    // Force first render position and ensure player is visible
    if (playerRef.current) {
      playerRef.current.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px)`;
      playerRef.current.style.opacity = '1';
    }
    
    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  const renderBuilding = (b) => {
    let content;
    
    // Unified text banner for all buildings — clickable shortcut
    const titleBanner = (
      <div className="absolute top-2 w-full flex flex-col items-center z-10">
        <span className="text-3xl mb-1 drop-shadow-md cursor-pointer hover:scale-110 transition-transform select-none" onClick={() => startTransition(b.id)} title="Clic para entrar">{b.icon}</span>
        <div
          className="text-white text-xs md:text-sm font-bold uppercase tracking-widest text-center px-3 py-1 bg-[#0a0a0a]/90 rounded-md border cursor-pointer hover:brightness-125 hover:scale-105 transition-all select-none"
          style={{ borderColor: b.color, boxShadow: `0 0 10px ${b.color}33` }}
          onClick={() => startTransition(b.id)}
          title="Clic para entrar"
        >
           {b.id === 'about' ? 'QUIÉNES SOMOS' : b.name}
        </div>
      </div>
    );

    if (b.type === 'skyscraper') {
      content = (
        <div className="w-full h-full border-2 rounded-xl flex flex-col items-center justify-start overflow-hidden relative"
             style={{ borderColor: b.color, backgroundColor: 'rgba(10,10,10,0.85)', boxShadow: `0 0 15px ${b.color}22, inset 0 0 15px ${b.color}22` }}>
           {titleBanner}
           {/* Windows patterns */}
           <div className="w-full grid grid-cols-2 gap-3 p-4 mt-20">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-6 rounded-sm bg-[#151515] border border-white/10" style={{boxShadow: `inset 0 0 5px ${b.color}33`}}></div>
              ))}
           </div>
        </div>
      );
    } else if (b.type === 'museum') {
       content = (
        <div className="w-full h-full border-2 rounded-xl flex flex-col items-center justify-end overflow-hidden relative"
             style={{ borderColor: b.color, backgroundColor: 'rgba(10,10,10,0.85)', boxShadow: `0 0 15px ${b.color}22, inset 0 0 15px ${b.color}22` }}>
           {titleBanner}
           {/* Pediment decoration */}
           <div className="absolute top-20 w-3/4 h-2 border-b-2" style={{ borderColor: b.color }}></div>
           {/* Museum pillars */}
           <div className="flex w-full h-1/2 justify-around px-3 pb-8 pt-2">
              <div className="w-5 h-full bg-[#151515] rounded-t-sm border border-cyan-800" style={{boxShadow: `inset 0 0 5px ${b.color}33`}}></div>
              <div className="w-5 h-full bg-[#151515] rounded-t-sm border border-cyan-800" style={{boxShadow: `inset 0 0 5px ${b.color}33`}}></div>
              <div className="w-5 h-full bg-[#151515] rounded-t-sm border border-cyan-800" style={{boxShadow: `inset 0 0 5px ${b.color}33`}}></div>
              <div className="w-5 h-full bg-[#151515] rounded-t-sm border border-cyan-800" style={{boxShadow: `inset 0 0 5px ${b.color}33`}}></div>
           </div>
        </div>
      );
    } else if (b.type === 'auditorium') {
       content = (
        <div className="w-full h-full border-2 rounded-xl relative flex flex-col items-center justify-between py-6 overflow-hidden"
             style={{ borderColor: b.color, backgroundColor: 'rgba(10,10,10,0.85)', boxShadow: `0 0 15px ${b.color}22, inset 0 0 15px ${b.color}22` }}>
           {titleBanner}
           
           {/* Stage Screen (matches Skyscraper window style) */}
           <div className="w-24 h-6 mt-12 rounded-sm bg-[#151515] border border-cyan-800" style={{boxShadow: `inset 0 0 5px ${b.color}55`}}></div>
           
           {/* Tiered Seating (matches Museum/Skyscraper element style) */}
           <div className="flex flex-col items-center gap-2 mb-2 w-full px-4">
              <div className="flex w-3/4 justify-around">
                 <div className="w-8 h-4 bg-[#151515] rounded-sm border border-cyan-800" style={{boxShadow: `inset 0 0 5px ${b.color}33`}}></div>
                 <div className="w-8 h-4 bg-[#151515] rounded-sm border border-cyan-800" style={{boxShadow: `inset 0 0 5px ${b.color}33`}}></div>
                 <div className="w-8 h-4 bg-[#151515] rounded-sm border border-cyan-800" style={{boxShadow: `inset 0 0 5px ${b.color}33`}}></div>
                 <div className="w-8 h-4 bg-[#151515] rounded-sm border border-cyan-800" style={{boxShadow: `inset 0 0 5px ${b.color}33`}}></div>
              </div>
              <div className="flex w-full justify-around">
                 <div className="w-8 h-4 bg-[#151515] rounded-sm border border-cyan-800" style={{boxShadow: `inset 0 0 5px ${b.color}33`}}></div>
                 <div className="w-8 h-4 bg-[#151515] rounded-sm border border-cyan-800" style={{boxShadow: `inset 0 0 5px ${b.color}33`}}></div>
                 <div className="w-8 h-4 bg-[#151515] rounded-sm border border-cyan-800" style={{boxShadow: `inset 0 0 5px ${b.color}33`}}></div>
                 <div className="w-8 h-4 bg-[#151515] rounded-sm border border-cyan-800" style={{boxShadow: `inset 0 0 5px ${b.color}33`}}></div>
                 <div className="w-8 h-4 bg-[#151515] rounded-sm border border-cyan-800" style={{boxShadow: `inset 0 0 5px ${b.color}33`}}></div>
                 <div className="w-8 h-4 bg-[#151515] rounded-sm border border-cyan-800" style={{boxShadow: `inset 0 0 5px ${b.color}33`}}></div>
              </div>
           </div>
        </div>
      );
    }

    return (
      <div 
        key={b.id} 
        className="absolute"
        style={{
          left: b.x * TILE_SIZE,
          top: b.y * TILE_SIZE,
          width: b.w * TILE_SIZE,
          height: b.h * TILE_SIZE,
        }}
      >
        {content}
        {/* Door — clickable */}
        <div
          className="absolute bottom-[-2px] w-[32px] h-[32px] bg-black z-20 cursor-pointer hover:brightness-150 transition-all"
          title="Clic para entrar"
          onClick={() => startTransition(b.id)}
          style={{
            left: b.door_x * TILE_SIZE,
            borderTop: `2px solid ${b.color}`,
            borderLeft: `2px solid ${b.color}`,
            borderRight: `2px solid ${b.color}`,
            borderTopLeftRadius: '6px',
            borderTopRightRadius: '6px',
            boxShadow: `inset 0 10px 10px -10px ${b.color}`
          }}
        >
          <div className="w-full h-full bg-gradient-to-t from-transparent" style={{ '--tw-gradient-to': b.color }}></div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Fade-to-black overlay: opaque when closing, transparent when opening/idle */}
      <div 
         className="fixed inset-0 z-[200] pointer-events-none transition-opacity duration-200 bg-[#02050a]"
         style={{ opacity: transitionState === 'closing' ? 1 : 0 }}
      />
      
      {currentScene === 'about' && <AboutScene onBack={() => { startTransition('city'); }} />}
      {currentScene === 'projects' && <ProjectsScene onBack={() => { startTransition('city'); }} />}
      {currentScene === 'clients' && <ClientsScene onBack={() => { startTransition('city'); }} />}

      {currentScene === 'city' && (
      <div className="game-container w-full h-[100dvh] flex items-center justify-center bg-[#02050a] overflow-hidden relative">
      
      {/* Floating Instructions Overlay */}
      <div className="absolute top-4 md:top-8 left-1/2 -translate-x-1/2 z-40 w-full max-w-3xl px-4 pointer-events-none flex justify-center">
        <div className="flex flex-wrap items-center justify-center gap-4 p-4 bg-black/80 border border-[var(--color-neon-blue)]/60 rounded-xl shadow-[0_0_15px_rgba(0,162,255,0.2)] backdrop-blur-md">
          <div className="flex gap-4 items-center">
            {/* WASD */}
            <div className="flex items-center gap-1">
               <div className="flex flex-col items-center gap-1">
                 <kbd className="w-8 h-8 flex items-center justify-center bg-[#151515] border-b-2 border-[var(--color-neon-blue)]/80 text-white rounded font-mono text-sm shadow-[0_2px_5px_rgba(0,162,255,0.3)]">W</kbd>
                 <div className="flex gap-1">
                   <kbd className="w-8 h-8 flex items-center justify-center bg-[#151515] border-b-2 border-[var(--color-neon-blue)]/80 text-white rounded font-mono text-sm shadow-[0_2px_5px_rgba(0,162,255,0.3)]">A</kbd>
                   <kbd className="w-8 h-8 flex items-center justify-center bg-[#151515] border-b-2 border-[var(--color-neon-blue)]/80 text-white rounded font-mono text-sm shadow-[0_2px_5px_rgba(0,162,255,0.3)]">S</kbd>
                   <kbd className="w-8 h-8 flex items-center justify-center bg-[#151515] border-b-2 border-[var(--color-neon-blue)]/80 text-white rounded font-mono text-sm shadow-[0_2px_5px_rgba(0,162,255,0.3)]">D</kbd>
                 </div>
               </div>
            </div>
            <span className="text-[var(--color-neon-blue)]/50 font-bold">o</span>
            {/* Arrows */}
            <div className="flex items-center gap-1">
               <div className="flex flex-col items-center gap-1">
                 <kbd className="w-8 h-8 flex items-center justify-center bg-[#151515] border-b-2 border-[var(--color-neon-blue)]/80 text-white rounded font-mono text-sm shadow-[0_2px_5px_rgba(0,162,255,0.3)]">↑</kbd>
                 <div className="flex gap-1">
                   <kbd className="w-8 h-8 flex items-center justify-center bg-[#151515] border-b-2 border-[var(--color-neon-blue)]/80 text-white rounded font-mono text-sm shadow-[0_2px_5px_rgba(0,162,255,0.3)]">←</kbd>
                   <kbd className="w-8 h-8 flex items-center justify-center bg-[#151515] border-b-2 border-[var(--color-neon-blue)]/80 text-white rounded font-mono text-sm shadow-[0_2px_5px_rgba(0,162,255,0.3)]">↓</kbd>
                   <kbd className="w-8 h-8 flex items-center justify-center bg-[#151515] border-b-2 border-[var(--color-neon-blue)]/80 text-white rounded font-mono text-sm shadow-[0_2px_5px_rgba(0,162,255,0.3)]">→</kbd>
                 </div>
               </div>
            </div>
          </div>
          
          <div className="w-px h-12 bg-[var(--color-neon-blue)]/30 mx-2"></div>
          
          <div className="text-[var(--color-neon-light)] text-sm font-semibold tracking-wide">
            Camina exactamente sobre la<br/>puerta iluminada para entrar
          </div>
        </div>
      </div>

      {/* The Map */}
      <div 
        className="game-map-wrapper relative shrink-0 transition-all duration-300 ease-in-out origin-center"
        style={{ 
            width: MAP_WIDTH * TILE_SIZE * scale, 
            height: MAP_HEIGHT * TILE_SIZE * scale,
            transform: transitionState === 'closing' ? 'scale(2.5)' : 'scale(1)',
            filter: transitionState === 'closing' ? 'blur(8px)' : 'blur(0px)'
        }}
      >
        <div 
          className="game-map shrink-0 border-[4px] border-[var(--color-neon-blue)]/50 shadow-[0_0_30px_rgba(0,162,255,0.3)] rounded-2xl absolute top-0 left-0 overflow-hidden bg-[#050a12]" 
          style={{ 
            width: MAP_WIDTH * TILE_SIZE, 
            height: MAP_HEIGHT * TILE_SIZE, 
            transform: `scale(${scale})`,
            transformOrigin: 'top left'
          }}
        >
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(0,162,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,162,255,0.05) 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        
        {/* PizzIA Map Logo */}
        <div className="absolute flex flex-col items-center justify-center pointer-events-none z-10"
             style={{ left: 8.5 * TILE_SIZE, top: 6.5 * TILE_SIZE, width: 8 * TILE_SIZE }}>
           <svg width="80" height="80" viewBox="0 0 100 100" className="drop-shadow-[0_0_15px_var(--color-neon-light)] mb-2 animate-pulse">
             <path d="M50 15 L15 85 A50 15 0 0 0 85 85 Z" fill="rgba(10,10,10,0.8)" stroke="var(--color-neon-blue)" strokeWidth="4" strokeLinejoin="round"/>
             <path d="M15 85 A50 15 0 0 0 85 85" fill="transparent" stroke="var(--color-neon-light)" strokeWidth="6" strokeLinecap="round"/>
             <circle cx="50" cy="45" r="5" fill="var(--color-neon-light)" className="animate-ping"/>
             <circle cx="35" cy="70" r="4" fill="var(--color-neon-light)"/>
             <circle cx="65" cy="65" r="4" fill="var(--color-neon-light)"/>
           </svg>
           <h1 className="text-5xl font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-br from-[var(--color-neon-light)] to-[var(--color-neon-blue)]" style={{ filter: 'drop-shadow(0 0 10px var(--color-neon-blue))' }}>
             PizzIA
           </h1>
        </div>
        
        {/* Subtle Paths */}
        {/* Camino desde Sede Principal hacia abajo (por la izquierda de Clientes) */}
        <div className="absolute bg-[#111]/70 border border-[#222]" style={{ left: 4.5 * TILE_SIZE, top: 9 * TILE_SIZE, width: TILE_SIZE, height: 9.5 * TILE_SIZE }}></div>
        {/* Camino desde Museo hacia abajo */}
        <div className="absolute bg-[#111]/70 border border-[#222]" style={{ left: 18 * TILE_SIZE, top: 8 * TILE_SIZE, width: TILE_SIZE, height: 3 * TILE_SIZE }}></div>
        {/* Camino horizontal superior (conecta Sede y Museo) */}
        <div className="absolute bg-[#111]/70 border border-[#222]" style={{ left: 4.5 * TILE_SIZE, top: 10 * TILE_SIZE, width: 14.5 * TILE_SIZE, height: TILE_SIZE }}></div>
        {/* Camino horizontal inferior (rodea Clientes por debajo para entrar a la puerta) */}
        <div className="absolute bg-[#111]/70 border border-[#222]" style={{ left: 4.5 * TILE_SIZE, top: 18.5 * TILE_SIZE, width: 8.5 * TILE_SIZE, height: TILE_SIZE }}></div>
        {/* Camino vertical final subiendo hacia la puerta de Clientes */}
        <div className="absolute bg-[#111]/70 border border-[#222]" style={{ left: 12 * TILE_SIZE, top: 17 * TILE_SIZE, width: TILE_SIZE, height: 1.5 * TILE_SIZE }}></div>

        {/* Buildings */}
        {BUILDINGS.map(renderBuilding)}
        
        {/* Player (Neon Pizza SVG) directly manipulated via refs */}
        <div 
          ref={playerRef}
          className="absolute z-30 will-change-transform"
          style={{ width: 40, height: 40, transform: 'translate(0px,0px)' }}
        >
          <PizzaSprite />
        </div>
        </div>
      </div>

      {/* Mobile Touch Controls */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-black/60 p-4 rounded-full border border-[var(--color-neon-blue)]/50 backdrop-blur-md shadow-[0_0_20px_rgba(0,162,255,0.3)] touch-none select-none">
         <div className="grid grid-cols-3 grid-rows-3 gap-2 w-32 h-32">
            <div />
            <div className="bg-[#151515] rounded-xl flex items-center justify-center text-white border-b-2 border-cyan-800 active:bg-cyan-800/80 active:translate-y-1 transition-all"
                 onPointerDown={(e) => { e.preventDefault(); keys.current['w'] = true; }} onPointerUp={() => keys.current['w'] = false} onPointerLeave={() => keys.current['w'] = false}>↑</div>
            <div />
            <div className="bg-[#151515] rounded-xl flex items-center justify-center text-white border-b-2 border-cyan-800 active:bg-cyan-800/80 active:translate-y-1 transition-all"
                 onPointerDown={(e) => { e.preventDefault(); keys.current['a'] = true; }} onPointerUp={() => keys.current['a'] = false} onPointerLeave={() => keys.current['a'] = false}>←</div>
            <div className="bg-[#0a0f1a] rounded-xl flex items-center justify-center opacity-70">
              <div className="w-4 h-4 rounded-full bg-cyan-800/50"></div>
            </div>
            <div className="bg-[#151515] rounded-xl flex items-center justify-center text-white border-b-2 border-cyan-800 active:bg-cyan-800/80 active:translate-y-1 transition-all"
                 onPointerDown={(e) => { e.preventDefault(); keys.current['d'] = true; }} onPointerUp={() => keys.current['d'] = false} onPointerLeave={() => keys.current['d'] = false}>→</div>
            <div />
            <div className="bg-[#151515] rounded-xl flex items-center justify-center text-white border-b-2 border-cyan-800 active:bg-cyan-800/80 active:translate-y-1 transition-all"
                 onPointerDown={(e) => { e.preventDefault(); keys.current['s'] = true; }} onPointerUp={() => keys.current['s'] = false} onPointerLeave={() => keys.current['s'] = false}>↓</div>
            <div />
         </div>
      </div>

      {/* Contact Bar — full-width impactful strip at bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-40 flex items-center justify-center gap-4 px-6 py-3 bg-gradient-to-r from-[#05111f] via-[#0a1e32] to-[#05111f] border-t-2 border-[var(--color-neon-blue)] shadow-[0_-4px_30px_rgba(0,162,255,0.35)] pointer-events-auto">
        <span className="text-[var(--color-neon-light)] font-bold text-xs uppercase tracking-widest mr-2 hidden md:inline">Contáctanos</span>
        <a href="mailto:pizzia.peru@gmail.com"
           className="flex items-center gap-2 px-4 py-2 bg-[var(--color-neon-blue)] text-black font-bold rounded-lg text-xs hover:opacity-80 transition-opacity shadow-[0_0_15px_rgba(0,162,255,0.7)]">
          ✉️ pizzia.peru@gmail.com
        </a>
        <a href="tel:+51948413244"
           className="flex items-center gap-2 px-4 py-2 border-2 border-[var(--color-neon-blue)] text-[var(--color-neon-light)] font-bold rounded-lg text-xs hover:bg-[var(--color-neon-blue)] hover:text-black transition-all shadow-[0_0_10px_rgba(0,162,255,0.3)]">
          📱 +51 948 413 244
        </a>
      </div>
      </div>
      )}
    </>
  );
}
export default App;
