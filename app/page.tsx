'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Play, 
  Pause, 
  Sparkles, 
  Tv, 
  Compass, 
  Music, 
  Mic, 
  ArrowRight, 
  CheckCircle, 
  Users,
  Search,
  SlidersHorizontal,
  ChevronUp,
  Image as ImageIcon,
  Film,
  Maximize2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// Tipos de datos
interface Track {
  id: string;
  title: string;
  artist: string;
  emoji: string;
  type: 'synth' | 'ocean' | 'chime';
}

interface GalleryItem {
  id?: string;
  slot_type: 'image' | 'video';
  slot_index: number;
  url: string;
  title: string;
  description: string;
}

const DEFAULT_GALLERY_ITEMS: GalleryItem[] = [
  // 7 Imágenes
  {
    slot_type: 'image',
    slot_index: 0,
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200',
    title: 'Lobby Principal Pocito',
    description: 'El espacio de bienvenida de Casa FOA Córdoba 2026. Un diseño minimalista que fusiona mármol pulido con iluminación indirecta de alta temperatura.'
  },
  {
    slot_type: 'image',
    slot_index: 1,
    url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800',
    title: 'Muro de Tendencias Alba',
    description: 'Estudio de texturas y colores donde se destaca "Lugar de Afecto", el color del año 2026 de Alba. Calidez, cobijo y serenidad.'
  },
  {
    slot_type: 'image',
    slot_index: 2,
    url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=800',
    title: 'Cocina de Habitar Mínimo',
    description: 'Concepto de habitabilidad optimizada. Superficies lisas, electrodomésticos empotrados y una isla flotante revestida de piedra sinterizada.'
  },
  {
    slot_type: 'image',
    slot_index: 3,
    url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=800',
    title: 'Espacio de Luz y Sombras',
    description: 'Intervención lumínica en pasillos interactivos. Diseñado para mostrar cómo el ángulo de luz altera la percepción cromática de los muros.'
  },
  {
    slot_type: 'image',
    slot_index: 4,
    url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800',
    title: 'Fachada Interior Pocito',
    description: 'La transición entre el patrimonio histórico y la modernidad de Nueva Córdoba. Integración de acero corten y hormigón visto.'
  },
  {
    slot_type: 'image',
    slot_index: 5,
    url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=800',
    title: 'Dormitorio de Descanso Profundo',
    description: 'Un santuario de bienestar biofílico. Maderas claras, linos orgánicos y tonalidades verdes Mercurio que inducen a la calma.'
  },
  {
    slot_type: 'image',
    slot_index: 6,
    url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800',
    title: 'Estudio Creativo Mercurio',
    description: 'Un espacio flexible diseñado para el teletrabajo. Colores vibrantes como el Amarillo y Rosa Mercurio para estimular el enfoque intelectual.'
  },
  // 5 Videos
  {
    slot_type: 'video',
    slot_index: 0,
    url: 'https://www.youtube.com/embed/Z67_1kP_yqY',
    title: 'Thomas Heatherwick - Building the Soul of Cities',
    description: 'Por qué el aburrimiento arquitectónico genera problemas de salud mental urbana y cómo diseñar fachadas con emociones.'
  },
  {
    slot_type: 'video',
    slot_index: 1,
    url: 'https://www.youtube.com/embed/5_dKzT6TsmA',
    title: 'Ingrid Fetell Lee - Where Joy Hides',
    description: 'El impacto neurológico del color vibrante y las formas curvas en el hogar como antídotos directos al estrés diario.'
  },
  {
    slot_type: 'video',
    slot_index: 2,
    url: 'https://www.youtube.com/embed/fAifF2nZ_1Q',
    title: 'Francis Kéré - How to Build with Clay',
    description: 'El ganador del Premio Pritzker demuestra cómo la arquitectura ancestral con barro genera espacios más eficientes y democráticos.'
  },
  {
    slot_type: 'video',
    slot_index: 3,
    url: 'https://www.youtube.com/embed/cZ34GqRyhpc',
    title: 'Bjarke Ingels - Floating Cities of the Future',
    description: 'Una visión audaz sobre cómo la arquitectura sostenible y las comunidades flotantes pueden responder al cambio climático.'
  },
  {
    slot_type: 'video',
    slot_index: 4,
    url: 'https://www.youtube.com/embed/rV58K0l9L4k',
    title: 'Kelly Wearstler - Interior Design Masterclass',
    description: 'La célebre diseñadora comparte sus secretos sobre cómo mezclar texturas, patrones e iluminación para crear espacios memorables.'
  }
];

export default function HomePage() {
  /* ── 1. ESTADOS DE INTERACCIÓN GENERAL ── */
  const [activeSection, setActiveSection] = useState('inicio');
  const [showScrollTop, setShowScrollTop] = useState(false);

  /* ── 2. ESTADOS DE LA GALERÍA MULTIMEDIA ── */
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(DEFAULT_GALLERY_ITEMS);
  const [loadingGallery, setLoadingGallery] = useState(true);
  const [galleryFilter, setGalleryFilter] = useState<'all' | 'image' | 'video'>('all');
  
  // Estados para Lightbox interactivo
  const [lightboxActive, setLightboxActive] = useState(false);
  const [lightboxType, setLightboxType] = useState<'image' | 'video'>('image');
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Espacio favorito seleccionado en el formulario de acreditación
  const [selectedSpace, setSelectedSpace] = useState(DEFAULT_GALLERY_ITEMS[0].title);

  /* ── 3. ESTADOS DEL REPRODUCTOR DE MÚSICA SINTÉTICA (WEB AUDIO) ── */
  const tracks: Track[] = [
    {
      id: 'track1',
      title: 'Focus & Flow',
      artist: 'Mercurio Deep Ambient',
      emoji: '🎧',
      type: 'synth'
    },
    {
      id: 'track2',
      title: 'Texturas Orgánicas',
      artist: 'Alba Soundscapes',
      emoji: '🌿',
      type: 'ocean'
    },
    {
      id: 'track3',
      title: 'Espacios Acústicos',
      artist: 'Pocito Lo-Fi',
      emoji: '📐',
      type: 'chime'
    }
  ];

  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const [synthNodes, setSynthNodes] = useState<any[]>([]);
  const [activeMasterGain, setActiveMasterGain] = useState<GainNode | null>(null);
  const [chimeIntervalId, setChimeIntervalId] = useState<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  /* ── 4. ESTADOS DEL MODAL TED VIDEOS ── */
  const [modalVideoUrl, setModalVideoUrl] = useState<string | null>(null);

  /* ── 5. ESTADOS DE ACREDITACIÓN (SUPABASE FORM) ── */
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [profesion, setProfesion] = useState('Público General');
  const [matricula, setMatrícula] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [registeredUser, setRegisteredUser] = useState<any>(null);
  const [formError, setFormError] = useState('');

  /* ── 6. EFECTOS: SCROLL OBSERVER Y BOTÓN BACK-TO-TOP ── */
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      
      // Botón volver arriba
      setShowScrollTop(scrollY > 300);

      // Link activo
      const sections = document.querySelectorAll('section, header');
      let current = 'inicio';
      sections.forEach(section => {
        const top = (section as HTMLElement).offsetTop - 180;
        const height = (section as HTMLElement).offsetHeight;
        if (scrollY >= top && scrollY < top + height) {
          current = section.getAttribute('id') || 'inicio';
        }
      });
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Intersection Observer para reveal
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => observer.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
      clearInterval(progressIntervalRef.current!);
    };
  }, []);

  /* ── 6.5. EFECTO: CARGA DE GALERÍA MULTIMEDIA ── */
  useEffect(() => {
    async function fetchGallery() {
      try {
        const { data, error } = await supabase
          .from('gallery_items')
          .select('*')
          .order('slot_type', { ascending: true })
          .order('slot_index', { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          const merged = [...DEFAULT_GALLERY_ITEMS];
          data.forEach((dbItem: any) => {
            const idx = merged.findIndex(
              item => item.slot_type === dbItem.slot_type && item.slot_index === dbItem.slot_index
            );
            if (idx !== -1) {
              merged[idx] = {
                slot_type: dbItem.slot_type,
                slot_index: dbItem.slot_index,
                url: dbItem.url,
                title: dbItem.title || '',
                description: dbItem.description || ''
              };
            }
          });
          setGalleryItems(merged);
          // Actualizar el espacio favorito seleccionado al cargar las imágenes reales
          const firstImg = merged.find(i => i.slot_type === 'image');
          if (firstImg) setSelectedSpace(firstImg.title);
        } else {
          const local = localStorage.getItem('casafoa_gallery_items');
          if (local) {
            const parsed = JSON.parse(local);
            setGalleryItems(parsed);
            const firstImg = parsed.find((i: any) => i.slot_type === 'image');
            if (firstImg) setSelectedSpace(firstImg.title);
          }
        }
      } catch (err) {
        console.warn('Conexión a base de datos de galería no disponible. Usando local/defaults.');
        const local = localStorage.getItem('casafoa_gallery_items');
        if (local) {
          const parsed = JSON.parse(local);
          setGalleryItems(parsed);
          const firstImg = parsed.find((i: any) => i.slot_type === 'image');
          if (firstImg) setSelectedSpace(firstImg.title);
        }
      } finally {
        setLoadingGallery(false);
      }
    }

    fetchGallery();
  }, []);

  const openLightbox = (type: 'image' | 'video', index: number) => {
    setLightboxType(type);
    setLightboxIndex(index);
    setLightboxActive(true);
  };

  const handleLightboxPrev = () => {
    const filtered = galleryItems.filter(item => item.slot_type === lightboxType);
    setLightboxIndex(prev => (prev === 0 ? filtered.length - 1 : prev - 1));
  };

  const handleLightboxNext = () => {
    const filtered = galleryItems.filter(item => item.slot_type === lightboxType);
    setLightboxIndex(prev => (prev === filtered.length - 1 ? 0 : prev + 1));
  };

  const getYouTubeThumbnail = (url: string) => {
    if (!url) return '';
    let regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    let match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://img.youtube.com/vi/${match[2]}/maxresdefault.jpg`;
    }
    return 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800';
  };

  /* ── 7. LÓGICA DE SÍNTESIS DE AUDIO (WEB AUDIO API) ── */
  const initAudio = () => {
    if (!audioCtx) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioCtx(ctx);
      return ctx;
    }
    return audioCtx;
  };

  const stopActiveAudio = () => {
    synthNodes.forEach(node => {
      try {
        node.stop();
      } catch (e) {}
    });
    setSynthNodes([]);
    if (chimeIntervalId) {
      clearInterval(chimeIntervalId);
      setChimeIntervalId(null);
    }
  };

  const playSynthSound = (type: 'synth' | 'ocean' | 'chime', ctx: AudioContext) => {
    stopActiveAudio();
    
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 1.2); // Fade-in de ganancia
    masterGain.connect(ctx.destination);
    setActiveMasterGain(masterGain);

    const nodes: any[] = [];

    if (type === 'synth') {
      // Focus & Flow: Sintetizador profundo y suave
      const freqs = [130.81, 196.00, 261.63, 329.63]; // Do3, Sol3, Do4, Mi4
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        
        // Modulación para dar profundidad orgánica
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.1 + (idx * 0.05), ctx.currentTime);
        lfoGain.gain.setValueAtTime(0.02, ctx.currentTime);
        
        lfo.connect(lfoGain.gain);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        
        osc.connect(gain);
        lfoGain.connect(gain.gain);
        gain.connect(masterGain);
        
        osc.start();
        lfo.start();
        nodes.push(osc);
        nodes.push(lfo);
      });
      setSynthNodes(nodes);

    } else if (type === 'ocean') {
      // Texturas Orgánicas: Olas de Mar con Ruido Blanco
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      
      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, ctx.currentTime);
      filter.Q.setValueAtTime(0.8, ctx.currentTime);
      
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.12, ctx.currentTime); // Frecuencia de la ola
      lfoGain.gain.setValueAtTime(220, ctx.currentTime);
      
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      whiteNoise.connect(filter);
      filter.connect(masterGain);
      
      whiteNoise.start();
      lfo.start();
      nodes.push(whiteNoise);
      nodes.push(lfo);
      setSynthNodes(nodes);

    } else if (type === 'chime') {
      // Espacios Acústicos: Campanadas cristalinas pentatónicas
      const interval = setInterval(() => {
        const scale = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50]; // Pentatónica C5
        const freq = scale[Math.floor(Math.random() * scale.length)];
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        
        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.1, ctx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8);
        
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start();
        osc.stop(ctx.currentTime + 2.0);
      }, 2400);
      
      setChimeIntervalId(interval);

      // Pad continuo base
      const baseFreqs = [65.41, 130.81];
      baseFreqs.forEach(freq => {
        const baseOsc = ctx.createOscillator();
        const baseGain = ctx.createGain();
        baseOsc.type = 'triangle';
        baseOsc.frequency.setValueAtTime(freq, ctx.currentTime);
        baseGain.gain.setValueAtTime(0.02, ctx.currentTime);
        baseOsc.connect(baseGain);
        baseGain.connect(masterGain);
        baseOsc.start();
        nodes.push(baseOsc);
      });
      setSynthNodes(nodes);
    }
  };

  const handlePlayToggle = () => {
    const ctx = initAudio();
    if (isPlaying) {
      setIsPlaying(false);
      // Fade out
      if (activeMasterGain) {
        activeMasterGain.gain.setValueAtTime(activeMasterGain.gain.value, ctx.currentTime);
        activeMasterGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        setTimeout(() => {
          stopActiveAudio();
        }, 400);
      } else {
        stopActiveAudio();
      }
      clearInterval(progressIntervalRef.current!);
    } else {
      setIsPlaying(true);
      playSynthSound(tracks[activeTrackIndex].type, ctx);
      
      // Control de barra de progreso
      progressIntervalRef.current = setInterval(() => {
        setCurrentProgress(prev => {
          if (prev >= 100) {
            // Siguiente track
            const nextIdx = (activeTrackIndex + 1) % tracks.length;
            setActiveTrackIndex(nextIdx);
            playSynthSound(tracks[nextIdx].type, ctx);
            return 0;
          }
          return prev + 0.3;
        });
      }, 100);
    }
  };

  const handleTrackChange = (idx: number) => {
    const ctx = initAudio();
    setActiveTrackIndex(idx);
    setCurrentProgress(0);
    if (!isPlaying) {
      setIsPlaying(true);
      progressIntervalRef.current = setInterval(() => {
        setCurrentProgress(prev => {
          if (prev >= 100) return 0;
          return prev + 0.3;
        });
      }, 100);
    }
    playSynthSound(tracks[idx].type, ctx);
  };

  /* ── 8. LÓGICA DE ACREDITACIÓN EN SUPABASE ── */
  const handleAccreditation = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError('');

    const userData = {
      nombre,
      email,
      profesion,
      matricula: profesion === 'Arquitecto/a' || profesion === 'Diseñador/a de Interiores' ? matricula : null,
      color_favorito: selectedSpace
    };

    try {
      // Intentar insertar en Supabase
      const { data, error } = await supabase
        .from('invitados')
        .insert([userData])
        .select();

      if (error) {
        if (error.code === '23505') {
          throw new Error('Este correo electrónico ya está acreditado.');
        }
        throw error;
      }

      setRegisteredUser(data ? data[0] : userData);
      setSubmitSuccess(true);
    } catch (error: any) {
      console.warn('Error en conexión Supabase, activando modo simulación:', error.message);
      
      setRegisteredUser({
        ...userData,
        created_at: new Date().toISOString(),
        id: Math.random().toString(36).substring(2, 9).toUpperCase()
      });
      setSubmitSuccess(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-mercu-dark text-mercu-cream font-sans selection:bg-mercu-accent selection:text-mercu-dark">
      
      {/* ── HERO DE ENTRADA ── */}
      <header id="inicio" className="hero relative min-h-screen flex flex-col justify-end p-8 md:p-16 overflow-hidden">
        <div className="hero-bg"></div>
        <div className="hero-grid"></div>
        <div className="hero-corner"></div>
        <div className="hero-corner-br"></div>

        <div className="hero-date z-10" aria-hidden="true">
          <div className="hero-date-num font-serif text-8xl font-light text-mercu-accent opacity-20">20</div>
          <div className="hero-date-label text-xs tracking-widest uppercase text-mercu-muted">Mayo 2026</div>
        </div>

        {/* Logotipos */}
        <div className="logo-bar z-10 mb-10 flex items-center gap-8 flex-wrap animate-fade-in opacity-0">
          <div className="logo-svg-wrap flex flex-col gap-1">
            <span className="logo-label text-[10px] tracking-widest text-mercu-muted uppercase">Pinturerías</span>
            <img src="/logomercurioblanco.png" alt="Pinturerías Mercurio" className="h-10 w-auto block object-contain" />
          </div>
          
          <div className="logo-separator h-8 w-[1px] bg-mercu-border"></div>
          
          <div className="logo-svg-wrap flex flex-col gap-1">
            <span className="logo-label text-[10px] tracking-widest text-mercu-muted uppercase">con</span>
            <img src="/alba_blanco.png" alt="Alba" className="h-9 w-auto block object-contain" />
          </div>

          <div className="logo-separator h-8 w-[1px] bg-mercu-border"></div>

          <div className="logo-svg-wrap flex flex-col gap-1">
            <span className="logo-label text-[10px] tracking-widest text-mercu-muted uppercase">en</span>
            <img src="/logo_casafoa.svg" alt="Casa FOA" className="h-9 w-auto block object-contain" />
          </div>
        </div>

        <div className="hero-eyebrow z-10 text-xs font-semibold tracking-[0.25em] uppercase text-mercu-accent mb-6">
          Pinturerías Mercurio × Casa FOA Córdoba 2026
        </div>
        <h1 className="hero-title z-10 font-serif text-5xl md:text-8xl font-light leading-[0.95] tracking-tight mb-4">
          Una jornada<br/><em>para ver</em><br/>diferente.
        </h1>
        <p className="hero-subtitle z-10 text-sm tracking-widest uppercase text-mercu-muted">
          Edición Pocito Social Life · Nueva Córdoba
        </p>

        <div className="scroll-hint absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10" aria-hidden="true">
          <div className="scroll-line w-[1px] h-10 bg-gradient-to-b from-transparent to-mercu-muted animate-pulse"></div>
        </div>
      </header>

      {/* ── BARRA DE NAVEGACIÓN STICKY ── */}
      <nav className="sticky top-0 bg-mercu-dark/85 backdrop-blur-xl border-b border-mercu-border z-50 px-8 py-0">
        <div className="max-w-6xl mx-auto flex items-center justify-between w-full">
          <div className="nav-logo font-serif text-sm font-light text-mercu-cream py-5 pr-6 border-r border-mercu-border mr-4 tracking-wider">
            Mercurio × FOA
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-none">
            <a href="#casa-foa" className={`text-[10px] md:text-xs font-medium tracking-widest uppercase py-5 px-4 transition-all relative ${activeSection === 'casa-foa' ? 'text-mercu-cream after:scale-x-100' : 'text-mercu-muted hover:text-mercu-cream after:scale-x-0'} after:content-[''] after:absolute after:bottom-[-1px] after:left-4 after:right-4 after:height-[2px] after:bg-mercu-accent after:transition-transform after:duration-300`}>Casa FOA</a>
            <a href="#galeria" className={`text-[10px] md:text-xs font-medium tracking-widest uppercase py-5 px-4 transition-all relative ${activeSection === 'galeria' ? 'text-mercu-cream after:scale-x-100' : 'text-mercu-muted hover:text-mercu-cream after:scale-x-0'} after:content-[''] after:absolute after:bottom-[-1px] after:left-4 after:right-4 after:height-[2px] after:bg-mercu-accent after:transition-transform after:duration-300`}>Galería</a>
            <a href="#musica" className={`text-[10px] md:text-xs font-medium tracking-widest uppercase py-5 px-4 transition-all relative ${activeSection === 'musica' ? 'text-mercu-cream after:scale-x-100' : 'text-mercu-muted hover:text-mercu-cream after:scale-x-0'} after:content-[''] after:absolute after:bottom-[-1px] after:left-4 after:right-4 after:height-[2px] after:bg-mercu-accent after:transition-transform after:duration-300`}>Música</a>
            <a href="#acreditar" className={`text-[10px] md:text-xs font-medium tracking-widest uppercase py-5 px-4 transition-all relative ${activeSection === 'acreditar' ? 'text-mercu-cream after:scale-x-100' : 'text-mercu-muted hover:text-mercu-cream after:scale-x-0'} after:content-[''] after:absolute after:bottom-[-1px] after:left-4 after:right-4 after:height-[2px] after:bg-mercu-accent after:transition-transform after:duration-300`}>Acreditación</a>
            <a href="#videos" className={`text-[10px] md:text-xs font-medium tracking-widest uppercase py-5 px-4 transition-all relative ${activeSection === 'videos' ? 'text-mercu-cream after:scale-x-100' : 'text-mercu-muted hover:text-mercu-cream after:scale-x-0'} after:content-[''] after:absolute after:bottom-[-1px] after:left-4 after:right-4 after:height-[2px] after:bg-mercu-accent after:transition-transform after:duration-300`}>Charlas</a>
          </div>
        </div>
      </nav>

      {/* ── SECCIÓN CASA FOA ── */}
      <section id="casa-foa" className="py-24 px-8 max-w-4xl mx-auto">
        <div className="reveal">
          <div className="section-eyebrow text-xs font-medium tracking-widest uppercase text-mercu-accent mb-4 flex items-center gap-3">
            El escenario de hoy
          </div>
          <h2 className="section-title font-serif text-4xl md:text-6xl font-light leading-tight text-mercu-cream">
            40 años transformando<br/><em>arquitectura en</em><br/>experiencias vivas.
          </h2>
          <p className="section-lead text-base md:text-lg leading-relaxed text-mercu-cream/70 mt-6 max-w-2xl">
            Antes de recorrer, entendamos el espacio. Casa FOA no es una exposición de materiales — es el punto de encuentro definitivo del diseño en el país. Aquí te revelamos curiosidades y datos esenciales que pocos conocen.
          </p>
        </div>

        {/* Malla de Datos Estadísticos */}
        <div className="dato-grid reveal grid grid-cols-2 md:grid-cols-4 gap-[1px] bg-mercu-border border border-mercu-border rounded overflow-hidden my-16">
          <div className="dato-item bg-mercu-dark-card p-10 text-center transition-all duration-300 hover:bg-mercu-border/5">
            <div className="dato-num font-serif text-5xl font-light text-mercu-cream mb-3 transition-transform hover:-translate-y-1">1985</div>
            <div className="dato-label text-[10px] tracking-widest text-mercu-muted uppercase">Primera edición</div>
          </div>
          <div className="dato-item bg-mercu-dark-card p-10 text-center transition-all duration-300 hover:bg-mercu-border/5">
            <div className="dato-num font-serif text-5xl font-light text-mercu-cream mb-3 transition-transform hover:-translate-y-1">35+</div>
            <div className="dato-label text-[10px] tracking-widest text-mercu-muted uppercase">Espacios de diseño</div>
          </div>
          <div className="dato-item bg-mercu-dark-card p-10 text-center transition-all duration-300 hover:bg-mercu-border/5">
            <div className="dato-num font-serif text-5xl font-light text-mercu-cream mb-3 transition-transform hover:-translate-y-1">4.400</div>
            <div className="dato-label text-[10px] tracking-widest text-mercu-muted uppercase">m² de intervención</div>
          </div>
          <div className="dato-item bg-mercu-dark-card p-10 text-center transition-all duration-300 hover:bg-mercu-border/5">
            <div className="dato-num font-serif text-5xl font-light text-mercu-cream mb-3 transition-transform hover:-translate-y-1">180K</div>
            <div className="dato-label text-[10px] tracking-widest text-mercu-muted uppercase">Visitantes promedio</div>
          </div>
        </div>

        {/* Malla de Curiosidades */}
        <div className="curiosity-grid reveal grid grid-cols-1 gap-[1px] bg-mercu-border border border-mercu-border rounded overflow-hidden mb-16">
          <div className="curiosity-item bg-mercu-dark p-10 flex gap-8 items-start transition-all duration-300 hover:bg-mercu-border/5">
            <div className="curiosity-num font-serif text-5xl font-light text-mercu-accent/20 transition-colors duration-300">01</div>
            <div className="curiosity-content">
              <h3 className="curiosity-label text-xs font-semibold tracking-wider text-mercu-accent uppercase mb-3">El origen filantrópico</h3>
              <p className="curiosity-text text-sm leading-relaxed text-mercu-cream/80">
                Casa FOA nació en 1985 de la mano de <strong>Mercedes Malbrán de Campos</strong> con un fin solidario: financiar las actividades de la Fundación Oftalmológica Argentina. Lo que comenzó como un té benéfico en una casona hoy es el polo de diseño más relevante de Latinoamérica.
              </p>
            </div>
          </div>

          <div className="curiosity-item bg-mercu-dark p-10 flex gap-8 items-start transition-all duration-300 hover:bg-mercu-border/5">
            <div className="curiosity-num font-serif text-5xl font-light text-mercu-accent/20 transition-colors duration-300">02</div>
            <div className="curiosity-content">
              <h3 className="curiosity-label text-xs font-semibold tracking-wider text-mercu-accent uppercase mb-3">La inspiración internacional</h3>
              <p className="curiosity-text text-sm leading-relaxed text-mercu-cream/80">
                El modelo de Casa FOA se inspiró en la célebre Kips Bay Decorator Showhouse de Nueva York. Su enorme repercusión local sirvió como modelo directo para la creación de franquicias similares en la región como <strong>Casa Cor (Brasil, Uruguay) y Casa Decor (España)</strong>.
              </p>
            </div>
          </div>

          <div className="curiosity-item bg-mercu-dark p-10 flex gap-8 items-start transition-all duration-300 hover:bg-mercu-border/5">
            <div className="curiosity-num font-serif text-5xl font-light text-mercu-accent/20 transition-colors duration-300">03</div>
            <div className="curiosity-content">
              <h3 className="curiosity-label text-xs font-semibold tracking-wider text-mercu-accent uppercase mb-3">Rescate de patrimonio</h3>
              <p className="curiosity-text text-sm leading-relaxed text-mercu-cream/80">
                Cada edición recupera un hito arquitectónico en desuso. A lo largo del tiempo ha restaurado palacios históricos, silos de granos, conventos, fábricas textiles abandonadas y muelles. En 2026, desembarca en <strong>Pocito Social Life</strong> para fundirse con la vitalidad moderna de Nueva Córdoba.
              </p>
            </div>
          </div>
        </div>

        {/* Ejes Conceptuales */}
        <div className="reveal">
          <div className="divider w-16 h-[1px] bg-mercu-accent my-12"></div>
          <div className="section-eyebrow text-xs font-medium tracking-widest uppercase text-mercu-accent mb-6">Los 4 Ejes del Recorrido</div>
          <div className="ejes-list flex flex-col gap-[1px] bg-mercu-border border border-mercu-border rounded overflow-hidden mt-8">
            <div className="eje-item bg-mercu-dark-card p-8 flex gap-6 items-center transition-all duration-300 hover:bg-mercu-border/5">
              <div className="eje-mark w-7 h-7 border border-mercu-accent rounded-full flex items-center justify-center flex-shrink-0"><div className="eje-dot w-2 h-2 bg-mercu-accent rounded-full"></div></div>
              <div className="eje-text font-serif text-lg text-mercu-cream"><em>Diseñar desde lo auténtico</em> — Materialidad honesta y texturas sin refinar.</div>
            </div>
            <div className="eje-item bg-mercu-dark-card p-8 flex gap-6 items-center transition-all duration-300 hover:bg-mercu-border/5">
              <div className="eje-mark w-7 h-7 border border-mercu-accent rounded-full flex items-center justify-center flex-shrink-0"><div className="eje-dot w-2 h-2 bg-mercu-accent rounded-full"></div></div>
              <div className="eje-text font-serif text-lg text-mercu-cream"><em>Rediseñar lo esencial</em> — Redefinir la habitabilidad mínima con máximo confort.</div>
            </div>
            <div className="eje-item bg-mercu-dark-card p-8 flex gap-6 items-center transition-all duration-300 hover:bg-mercu-border/5">
              <div className="eje-mark w-7 h-7 border border-mercu-accent rounded-full flex items-center justify-center flex-shrink-0"><div className="eje-dot w-2 h-2 bg-mercu-accent rounded-full"></div></div>
              <div className="eje-text font-serif text-lg text-mercu-cream"><em>Tradición en presente continuo</em> — La herencia artesanal cordobesa adaptada a la vanguardia.</div>
            </div>
            <div className="eje-item bg-mercu-dark-card p-8 flex gap-6 items-center transition-all duration-300 hover:bg-mercu-border/5">
              <div className="eje-mark w-7 h-7 border border-mercu-accent rounded-full flex items-center justify-center flex-shrink-0"><div className="eje-dot w-2 h-2 bg-mercu-accent rounded-full"></div></div>
              <div className="eje-text font-serif text-lg text-mercu-cream"><em>Habitar la transformación</em> — Plantas flexibles para hogares inteligentes y cambiantes.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECCIÓN GALERÍA MULTIMEDIA ── */}
      <section id="galeria" className="py-24 px-8 max-w-6xl mx-auto">
        <div className="reveal">
          <div className="mercu-tag inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-mercu-muted uppercase border border-mercu-border rounded px-4 py-2 mb-8 bg-mercu-dark-card/40">
            <span className="mercu-dot w-2 h-2 bg-mercu-accent rounded-full animate-pulse"></span>
            Galería Casa FOA 2026
          </div>
          <div className="section-header mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="section-eyebrow text-xs font-medium tracking-widest uppercase text-mercu-accent mb-4">Experiencia Visual</div>
              <h2 className="section-title font-serif text-4xl md:text-6xl font-light leading-tight text-mercu-cream">Galería de Espacios e<br/><em>Inspiración y Diseño.</em></h2>
              <p className="section-lead text-base md:text-lg leading-relaxed text-mercu-cream/70 mt-6 max-w-2xl">
                Un recorrido interactivo por el interiorismo y la arquitectura de vanguardia en Pocito Córdoba 2026. Disfrutá de nuestras 7 postales curadas de diseño y 5 conferencias magistrales.
              </p>
            </div>
            
            {/* Controles de Filtro */}
            <div className="flex gap-2 bg-mercu-dark-card border border-mercu-border p-1.5 rounded-full text-xs self-start md:self-end">
              <button 
                onClick={() => setGalleryFilter('all')}
                className={`px-4 py-2 rounded-full font-medium tracking-wider uppercase transition-all duration-300 ${galleryFilter === 'all' ? 'bg-mercu-accent text-mercu-dark shadow-md' : 'text-mercu-muted hover:text-mercu-cream'}`}
              >
                Todo
              </button>
              <button 
                onClick={() => setGalleryFilter('image')}
                className={`px-4 py-2 rounded-full font-medium tracking-wider uppercase transition-all duration-300 ${galleryFilter === 'image' ? 'bg-mercu-accent text-mercu-dark shadow-md' : 'text-mercu-muted hover:text-mercu-cream'}`}
              >
                Imágenes (7)
              </button>
              <button 
                onClick={() => setGalleryFilter('video')}
                className={`px-4 py-2 rounded-full font-medium tracking-wider uppercase transition-all duration-300 ${galleryFilter === 'video' ? 'bg-mercu-accent text-mercu-dark shadow-md' : 'text-mercu-muted hover:text-mercu-cream'}`}
              >
                Videos (5)
              </button>
            </div>
          </div>
        </div>

        {loadingGallery ? (
          <div className="text-center py-20 text-sm text-mercu-muted">Cargando la galería de Casa FOA...</div>
        ) : (
          <div className="reveal">
            {/* VISTA DE IMÁGENES (Asymmetrical Premium Grid) */}
            {(galleryFilter === 'all' || galleryFilter === 'image') && (
              <div className="mb-16">
                {galleryFilter === 'all' && (
                  <div className="text-xs font-semibold tracking-widest text-mercu-muted uppercase mb-6 border-b border-mercu-border pb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-mercu-accent rounded-full"></span>
                    Postales de Arquitectura y Espacio
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {galleryItems.filter(item => item.slot_type === 'image').map((img, idx) => {
                    let gridClass = "col-span-1 row-span-1";
                    if (idx === 0) gridClass = "sm:col-span-2 sm:row-span-2 aspect-[4/3] sm:aspect-auto";
                    else if (idx === 1) gridClass = "sm:col-span-2 col-span-1";
                    else if (idx === 6) gridClass = "sm:col-span-2 col-span-1";
                    
                    return (
                      <div 
                        key={`img-${idx}`}
                        onClick={() => openLightbox('image', idx)}
                        className={`group relative overflow-hidden rounded-lg bg-mercu-dark-card border border-mercu-border cursor-pointer transition-all duration-500 hover:border-mercu-accent shadow-md ${gridClass}`}
                      >
                        <div className="w-full h-full min-h-[220px] aspect-[4/3] sm:aspect-auto overflow-hidden relative">
                          <img 
                            src={img.url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800'} 
                            alt={img.title}
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-hover:brightness-90"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-85 transition-opacity duration-300"></div>
                          
                          <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col justify-end translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                            <span className="text-[9px] tracking-widest text-mercu-accent font-semibold uppercase mb-1">
                              Imagen #{idx + 1}
                            </span>
                            <h3 className="font-serif text-lg md:text-xl text-mercu-cream leading-snug group-hover:text-mercu-warm transition-colors duration-300">
                              {img.title || `Espacio ${idx + 1}`}
                            </h3>
                            <p className="text-xs text-mercu-muted mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 line-clamp-2 font-light leading-relaxed">
                              {img.description}
                            </p>
                          </div>
                          
                          <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-mercu-border flex items-center justify-center text-mercu-cream opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
                            <span className="text-xs">🔍</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* VISTA DE VIDEOS (Modern Curated Row/Grid) */}
            {(galleryFilter === 'all' || galleryFilter === 'video') && (
              <div className="mb-12">
                {galleryFilter === 'all' && (
                  <div className="text-xs font-semibold tracking-widest text-mercu-muted uppercase mb-6 border-b border-mercu-border pb-2 flex items-center gap-2 mt-8">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                    Charlas y Conferencias en Video
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {galleryItems.filter(item => item.slot_type === 'video').map((vid, idx) => {
                    let gridClass = "col-span-1";
                    if (idx === 0) gridClass = "md:col-span-2";
                    
                    const isLocal = vid.url && (vid.url.startsWith('data:video/') || vid.url.endsWith('.mp4') || vid.url.includes('.webm'));
                    const thumbUrl = isLocal ? '' : getYouTubeThumbnail(vid.url);
                    
                    return (
                      <div 
                        key={`vid-${idx}`}
                        onClick={() => openLightbox('video', idx)}
                        className={`group relative overflow-hidden rounded-lg bg-mercu-dark-card border border-mercu-border cursor-pointer transition-all duration-500 hover:border-emerald-400 shadow-md ${gridClass}`}
                      >
                        <div className="w-full aspect-[16/9] overflow-hidden relative bg-black">
                          {isLocal ? (
                            <video 
                              src={vid.url} 
                              className="w-full h-full object-cover opacity-70 group-hover:opacity-50 transition-opacity duration-300"
                              muted 
                              loop 
                              playsInline
                              autoPlay
                            />
                          ) : (
                            <img 
                              src={thumbUrl} 
                              alt={vid.title}
                              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-hover:brightness-75"
                              loading="lazy"
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent opacity-75 group-hover:opacity-90 transition-opacity duration-300"></div>
                          
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-14 h-14 rounded-full border border-mercu-border/50 bg-black/60 backdrop-blur-md flex items-center justify-center text-mercu-cream shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:border-emerald-400 group-hover:bg-emerald-400 group-hover:text-mercu-dark">
                              <span className="text-xl translate-x-[2px]">▶</span>
                            </div>
                          </div>

                          <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col justify-end">
                            <span className="text-[9px] tracking-widest text-emerald-400 font-semibold uppercase mb-1 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                              Video #{idx + 1}
                            </span>
                            <h3 className="font-serif text-lg md:text-xl text-mercu-cream leading-snug group-hover:text-emerald-300 transition-colors duration-300 line-clamp-1">
                              {vid.title || `Conferencia ${idx + 1}`}
                            </h3>
                            <p className="text-xs text-mercu-muted mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 line-clamp-2 font-light leading-relaxed">
                              {vid.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ── MODAL LIGHTBOX MULTIMEDIA COMPLETO ── */}
      {lightboxActive && (
        <div 
          onClick={() => setLightboxActive(false)}
          className="fixed inset-0 bg-black/95 backdrop-blur-md z-[1000] flex flex-col justify-between p-4 md:p-8 animate-fade-in"
        >
          <div className="flex justify-between items-center w-full max-w-6xl mx-auto z-10 py-2 border-b border-mercu-border/30">
            <div className="text-left">
              <span className="text-[10px] tracking-widest text-mercu-accent font-semibold uppercase">
                {lightboxType === 'image' ? `Postal de Diseño #${lightboxIndex + 1}` : `Conferencia en Video #${lightboxIndex + 1}`}
              </span>
              <h4 className="font-serif text-lg md:text-2xl text-mercu-cream">
                {galleryItems.filter(item => item.slot_type === lightboxType)[lightboxIndex]?.title}
              </h4>
            </div>
            
            <button 
              onClick={() => setLightboxActive(false)}
              className="w-10 h-10 rounded-full bg-neutral-900 border border-mercu-border/50 text-mercu-cream flex items-center justify-center text-sm font-semibold hover:bg-mercu-accent hover:text-mercu-dark hover:border-mercu-accent transition-all"
            >
              ✕
            </button>
          </div>

          <div className="flex-grow w-full max-w-6xl mx-auto flex items-center justify-between gap-4 py-6">
            <button 
              onClick={(e) => { e.stopPropagation(); handleLightboxPrev(); }}
              className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-neutral-900/80 border border-mercu-border/30 text-mercu-cream flex items-center justify-center hover:bg-mercu-accent hover:text-mercu-dark transition-all duration-300 flex-shrink-0"
              aria-label="Anterior"
            >
              ◀
            </button>

            <div 
              onClick={(e) => e.stopPropagation()}
              className="flex-grow max-h-[65vh] md:max-h-[70vh] aspect-[16/10] bg-black/40 border border-mercu-border/50 rounded-lg overflow-hidden flex items-center justify-center relative shadow-2xl"
            >
              {lightboxType === 'image' ? (
                <img 
                  src={galleryItems.filter(item => item.slot_type === 'image')[lightboxIndex]?.url} 
                  alt="Lightbox"
                  className="w-full h-full object-contain max-h-[65vh] md:max-h-[70vh]"
                />
              ) : (
                <iframe 
                  className="w-full h-full border-none aspect-[16/9]"
                  src={galleryItems.filter(item => item.slot_type === 'video')[lightboxIndex]?.url} 
                  allow="autoplay; encrypted-media" 
                  allowFullScreen
                ></iframe>
              )}
            </div>

            <button 
              onClick={(e) => { e.stopPropagation(); handleLightboxNext(); }}
              className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-neutral-900/80 border border-mercu-border/30 text-mercu-cream flex items-center justify-center hover:bg-mercu-accent hover:text-mercu-dark transition-all duration-300 flex-shrink-0"
              aria-label="Siguiente"
            >
              ▶
            </button>
          </div>

          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl mx-auto text-center z-10 py-4 px-6 bg-neutral-950/70 backdrop-blur-md border border-mercu-border/30 rounded-lg mb-4"
          >
            <p className="text-xs md:text-sm leading-relaxed text-mercu-cream/80 font-light">
              {galleryItems.filter(item => item.slot_type === lightboxType)[lightboxIndex]?.description}
            </p>
          </div>
        </div>
      )}

      {/* ── SECCIÓN MÚSICA ── */}
      <section id="musica" className="py-24 px-8 max-w-4xl mx-auto">
        <div className="reveal">
          <div className="section-header mb-16">
            <div className="section-eyebrow text-xs font-medium tracking-widest uppercase text-mercu-accent mb-4">Estimulación sensorial</div>
            <h2 className="section-title font-serif text-4xl md:text-6xl font-light leading-tight text-mercu-cream">Música para<br/><em>proyectar y crear.</em></h2>
            <p className="section-lead text-base md:text-lg leading-relaxed text-mercu-cream/70 mt-6 max-w-2xl">
              Diseñamos paisajes sonoros especiales para sumergirte en el flujo creativo. Clickeá en los tracks para reproducir composiciones ambientales en tiempo real sintetizadas por tu navegador.
            </p>
          </div>
        </div>

        {/* Widget del Reproductor de Audio */}
        <div className="music-player-widget reveal bg-mercu-dark-card border border-mercu-border rounded p-8 flex flex-col md:flex-row items-center gap-6 my-16">
          <div className="player-artwork w-24 h-24 bg-mercu-dark border border-mercu-border rounded flex items-center justify-center text-4xl relative flex-shrink-0 shadow-lg after:content-[''] after:absolute after:inset-0 after:rounded after:bg-gradient-to-tr after:from-mercu-accent/10 after:to-transparent">
            {tracks[activeTrackIndex].emoji}
          </div>
          <div className="flex-grow w-full flex flex-col gap-3">
            <div className="player-info-artist text-xs tracking-wider text-mercu-muted uppercase">{tracks[activeTrackIndex].artist}</div>
            <h3 className="player-info-title font-serif text-2xl text-mercu-cream">{tracks[activeTrackIndex].title}</h3>
            <div className="flex items-center gap-6 mt-2">
              <button 
                onClick={handlePlayToggle}
                className="w-12 h-12 bg-mercu-accent text-mercu-dark rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:bg-mercu-cream hover:scale-105 active:scale-95"
                aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
              >
                {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} className="translate-x-[2px]" fill="currentColor" />}
              </button>
              <div 
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const percent = ((e.clientX - rect.left) / rect.width) * 100;
                  setCurrentProgress(percent);
                  if (!isPlaying) handlePlayToggle();
                }}
                className="w-full h-1 bg-mercu-muted/20 rounded-full cursor-pointer relative overflow-hidden"
              >
                <div className="h-full bg-mercu-accent absolute left-0 top-0 transition-all duration-100" style={{ width: `${currentProgress}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Playlists */}
        <div className="playlist-grid reveal grid gap-[1px] bg-mercu-border border border-mercu-border rounded overflow-hidden">
          {tracks.map((track, index) => (
            <div 
              key={track.id}
              onClick={() => handleTrackChange(index)}
              className={`playlist-item bg-mercu-dark p-6 grid grid-cols-[auto_1fr_auto] items-center gap-8 cursor-pointer transition-all duration-300 ${activeTrackIndex === index ? 'bg-mercu-border/5' : 'hover:bg-mercu-border/5'}`}
            >
              <div className="playlist-cover w-14 h-14 bg-mercu-dark-card border border-mercu-border rounded flex items-center justify-center text-2xl transition-transform hover:scale-105">
                {track.emoji}
              </div>
              <div className="playlist-info flex flex-col gap-1">
                <h3 className={`playlist-title font-serif text-lg ${activeTrackIndex === index ? 'text-mercu-warm' : 'text-mercu-cream'}`}>{track.title}</h3>
                <span className="playlist-meta text-xs text-mercu-muted">{track.artist}</span>
              </div>
              <div className="playlist-arrow text-xs text-mercu-muted tracking-wider uppercase flex items-center gap-2 transition-transform hover:translate-x-1">
                {activeTrackIndex === index && isPlaying ? (
                  <div className="wave-animation flex items-end gap-[2px] h-4 w-5">
                    <div className="wave-bar w-[2px] bg-mercu-accent h-4 animate-bounce"></div>
                    <div className="wave-bar w-[2px] bg-mercu-accent h-3 animate-bounce [animation-delay:0.15s]"></div>
                    <div className="wave-bar w-[2px] bg-mercu-accent h-2 animate-bounce [animation-delay:0.3s]"></div>
                    <div className="wave-bar w-[2px] bg-mercu-accent h-3 animate-bounce [animation-delay:0.45s]"></div>
                  </div>
                ) : (
                  <span>{activeTrackIndex === index ? 'En pausa' : 'Escuchar'} ▶</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECCIÓN ACREDITACIÓN (NUEVA CON SUPABASE) ── */}
      <section id="acreditar" className="py-24 px-8 max-w-2xl mx-auto">
        <div className="reveal">
          <div className="section-header mb-12 text-center">
            <div className="section-eyebrow text-xs font-medium tracking-widest uppercase text-mercu-accent mb-4 justify-center">
              Pase Digital Exclusivo
            </div>
            <h2 className="section-title font-serif text-4xl md:text-5xl font-light leading-tight text-mercu-cream">Registrá tu<br/><em>acreditación online.</em></h2>
            <p className="section-lead text-sm md:text-base leading-relaxed text-mercu-cream/70 mt-6 max-w-xl mx-auto">
              Completá tu registro para formar parte de la jornada especial Mercurio × Alba en Casa FOA. Recibirás tu credencial digital con acceso prioritario.
            </p>
          </div>

          {!submitSuccess ? (
            <form onSubmit={handleAccreditation} className="bg-mercu-dark-card border border-mercu-border rounded-lg p-8 flex flex-col gap-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-mercu-accent to-mercu-accent2"></div>
              
              {formError && (
                <div className="bg-red-950/40 border border-red-500/30 text-red-300 p-4 rounded text-xs leading-relaxed">
                  ⚠️ {formError}
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label htmlFor="nombre" className="text-[10px] tracking-widest text-mercu-muted uppercase font-semibold">Nombre Completo</label>
                <input 
                  type="text" 
                  id="nombre" 
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Sofía Martínez"
                  className="bg-mercu-dark border border-mercu-border text-mercu-cream p-3 rounded focus:outline-none focus:border-mercu-accent text-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-[10px] tracking-widest text-mercu-muted uppercase font-semibold">Correo Electrónico</label>
                <input 
                  type="email" 
                  id="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ej: sofia@estudio.com"
                  className="bg-mercu-dark border border-mercu-border text-mercu-cream p-3 rounded focus:outline-none focus:border-mercu-accent text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="profesion" className="text-[10px] tracking-widest text-mercu-muted uppercase font-semibold">Profesión / Rol</label>
                  <select 
                    id="profesion"
                    value={profesion}
                    onChange={(e) => setProfesion(e.target.value)}
                    className="bg-mercu-dark border border-mercu-border text-mercu-cream p-3 rounded focus:outline-none focus:border-mercu-accent text-sm"
                  >
                    <option value="Arquitecto/a">Arquitecto/a</option>
                    <option value="Diseñador/a de Interiores">Diseñador/a de Interiores</option>
                    <option value="Estudiante">Estudiante</option>
                    <option value="Público General">Público General</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="color_favorito" className="text-[10px] tracking-widest text-mercu-muted uppercase font-semibold">Espacio Favorito</label>
                  <select 
                    id="color_favorito" 
                    value={selectedSpace}
                    onChange={(e) => setSelectedSpace(e.target.value)}
                    className="bg-mercu-dark border border-mercu-border text-mercu-cream p-3 rounded focus:outline-none focus:border-mercu-accent text-sm"
                  >
                    {galleryItems.filter(item => item.slot_type === 'image').map(img => (
                      <option key={img.slot_index} value={img.title}>{img.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              {(profesion === 'Arquitecto/a' || profesion === 'Diseñador/a de Interiores') && (
                <div className="flex flex-col gap-2 animate-fade-in">
                  <label htmlFor="matricula" className="text-[10px] tracking-widest text-mercu-muted uppercase font-semibold">Matrícula Profesional</label>
                  <input 
                    type="text" 
                    id="matricula" 
                    required
                    value={matricula}
                    onChange={(e) => setMatrícula(e.target.value)}
                    placeholder="Ej: CAPC 12543"
                    className="bg-mercu-dark border border-mercu-border text-mercu-cream p-3 rounded focus:outline-none focus:border-mercu-accent text-sm"
                  />
                </div>
              )}

              <button 
                type="submit"
                disabled={submitting}
                className="w-full mt-4 bg-mercu-accent hover:bg-mercu-cream text-mercu-dark hover:text-mercu-dark py-4 rounded font-semibold text-xs tracking-widest uppercase transition-all duration-300 shadow-lg hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                {submitting ? 'Procesando...' : 'Obtener Credencial Acreditada'}
                <ArrowRight size={16} />
              </button>
            </form>
          ) : (
            /* Credencial Digital Generada */
            <div className="bg-mercu-dark-card border border-mercu-border rounded-lg p-8 flex flex-col items-center gap-8 shadow-2xl relative overflow-hidden animate-fade-in">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-mercu-accent to-mercu-accent2"></div>
              
              <CheckCircle size={48} className="text-emerald-400 animate-pulse" />
              
              <div className="text-center">
                <h3 className="font-serif text-2xl text-mercu-cream mb-1">¡Acreditación Confirmada!</h3>
                <p className="text-xs text-mercu-muted uppercase tracking-wider">Tu pase digital ha sido registrado en Supabase</p>
              </div>

              {/* Tarjeta de Acreditación (Visual) */}
              <div className="w-full max-w-sm bg-neutral-900 border border-mercu-border p-6 rounded-md flex flex-col gap-6 relative shadow-lg">
                <div className="flex justify-between items-start border-b border-mercu-border pb-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] tracking-widest text-mercu-accent uppercase font-bold">Invitado de Mercurio</span>
                    <span className="font-serif text-lg text-mercu-cream leading-tight">{registeredUser?.nombre}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] text-mercu-muted uppercase block">Credencial ID</span>
                    <span className="font-mono text-xs text-mercu-warm">{registeredUser?.id ? registeredUser.id.substring(0, 8) : 'GUEST-26'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[8px] text-mercu-muted uppercase block">Profesión</span>
                    <span className="font-medium text-mercu-cream">{registeredUser?.profesion}</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-mercu-muted uppercase block">Espacio Favorito</span>
                    <span className="font-medium text-mercu-accent">{registeredUser?.color_favorito}</span>
                  </div>
                </div>

                {registeredUser?.matricula && (
                  <div className="text-xs">
                    <span className="text-[8px] text-mercu-muted uppercase block">Matrícula</span>
                    <span className="font-medium text-mercu-cream">{registeredUser.matricula}</span>
                  </div>
                )}

                {/* QR Vectorial Simulado */}
                <div className="flex justify-center border-t border-mercu-border pt-4">
                  <svg className="w-24 h-24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100" height="100" fill="#181716" rx="4"/>
                    {/* Marcos esquineros QR */}
                    <rect x="10" y="10" width="20" height="20" stroke="var(--c-cream)" strokeWidth="2" fill="none"/>
                    <rect x="15" y="15" width="10" height="10" fill="var(--c-cream)"/>
                    
                    <rect x="70" y="10" width="20" height="20" stroke="var(--c-cream)" strokeWidth="2" fill="none"/>
                    <rect x="75" y="15" width="10" height="10" fill="var(--c-cream)"/>
                    
                    <rect x="10" y="70" width="20" height="20" stroke="var(--c-cream)" strokeWidth="2" fill="none"/>
                    <rect x="15" y="75" width="10" height="10" fill="var(--c-cream)"/>
                    
                    {/* Patrón central de QR simulado */}
                    <rect x="40" y="20" width="10" height="10" fill="var(--c-accent)"/>
                    <rect x="55" y="35" width="10" height="10" fill="var(--c-warm)"/>
                    <rect x="45" y="45" width="15" height="15" fill="var(--c-accent)"/>
                    <rect x="70" y="70" width="20" height="20" fill="var(--c-cream)"/>
                    <rect x="40" y="70" width="10" height="10" fill="var(--c-warm)"/>
                  </svg>
                </div>
              </div>

              <button 
                onClick={() => {
                  setSubmitSuccess(false);
                  setNombre('');
                  setEmail('');
                  setMatrícula('');
                }}
                className="text-xs text-mercu-muted hover:text-mercu-cream underline transition-colors"
              >
                Registrar otra acreditación
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── SECCIÓN PODCASTS / CHARLAS (TED VIDEOS) ── */}
      <section id="videos" className="py-24 px-8 max-w-4xl mx-auto">
        <div className="reveal">
          <div className="section-header mb-16">
            <div className="section-eyebrow text-xs font-medium tracking-widest uppercase text-mercu-accent mb-4">Perspectivas globales</div>
            <h2 className="section-title font-serif text-4xl md:text-6xl font-light leading-tight text-mercu-cream">Charlas que<br/><em>inspiran la mirada.</em></h2>
            <p className="section-lead text-base md:text-lg leading-relaxed text-mercu-cream/70 mt-6 max-w-2xl">
              Cuatro pensadores globales discuten la importancia de dotar a los espacios de alma, alegría, sustentabilidad y arraigo local. Haz clic en cualquiera para verla directamente.
            </p>
          </div>
        </div>

        {/* Malla de Charlas TED */}
        <div className="ted-grid reveal grid gap-[1px] bg-mercu-border border border-mercu-border rounded overflow-hidden">
          <div 
            onClick={() => setModalVideoUrl("https://www.youtube.com/embed/Z67_1kP_yqY")}
            className="ted-item bg-mercu-dark p-8 md:p-10 cursor-pointer transition-all duration-300 hover:bg-mercu-border/5 grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-6"
          >
            <div>
              <span className="ted-tag inline-block text-[10px] tracking-widest font-semibold uppercase px-3 py-1 rounded-full border border-mercu-accent text-mercu-accent mb-3">Diseño</span>
              <div className="ted-speaker text-xs tracking-wider text-mercu-muted uppercase mb-1 font-semibold">Thomas Heatherwick</div>
              <h3 className="ted-title font-serif text-xl md:text-2xl text-mercu-cream mb-2 transition-colors duration-300">Building the Soul of Cities</h3>
              <p className="ted-why text-sm text-mercu-muted leading-relaxed max-w-xl">Por qué el aburrimiento arquitectónico genera problemas de salud mental urbana y cómo diseñar fachadas con emociones.</p>
            </div>
            <div className="ted-right flex items-center gap-6">
              <span className="ted-duration font-mono text-xs text-mercu-accent/30 tracking-wider">16:42</span>
              <div className="ted-play-icon w-11 h-11 border border-mercu-border rounded-full flex items-center justify-center text-mercu-cream transition-all duration-300 hover:bg-mercu-cream hover:text-mercu-dark hover:border-mercu-cream">▶</div>
            </div>
          </div>

          <div 
            onClick={() => setModalVideoUrl("https://www.youtube.com/embed/5_dKzT6TsmA")}
            className="ted-item bg-mercu-dark p-8 md:p-10 cursor-pointer transition-all duration-300 hover:bg-mercu-border/5 grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-6"
          >
            <div>
              <span className="ted-tag inline-block text-[10px] tracking-widest font-semibold uppercase px-3 py-1 rounded-full border border-emerald-400/40 text-emerald-400 mb-3">Vida</span>
              <div className="ted-speaker text-xs tracking-wider text-mercu-muted uppercase mb-1 font-semibold">Ingrid Fetell Lee</div>
              <h3 className="ted-title font-serif text-xl md:text-2xl text-mercu-cream mb-2 transition-colors duration-300">Where Joy Hides and Where to Find It</h3>
              <p className="ted-why text-sm text-mercu-muted leading-relaxed max-w-xl">El impacto neurológico del color vibrante y las formas curvas en el hogar como antídotos directos al estrés diario.</p>
            </div>
            <div className="ted-right flex items-center gap-6">
              <span className="ted-duration font-mono text-xs text-mercu-accent/30 tracking-wider">13:35</span>
              <div className="ted-play-icon w-11 h-11 border border-mercu-border rounded-full flex items-center justify-center text-mercu-cream transition-all duration-300 hover:bg-mercu-cream hover:text-mercu-dark hover:border-mercu-cream">▶</div>
            </div>
          </div>

          <div 
            onClick={() => setModalVideoUrl("https://www.youtube.com/embed/fAifF2nZ_1Q")}
            className="ted-item bg-mercu-dark p-8 md:p-10 cursor-pointer transition-all duration-300 hover:bg-mercu-border/5 grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-6"
          >
            <div>
              <span className="ted-tag inline-block text-[10px] tracking-widest font-semibold uppercase px-3 py-1 rounded-full border border-amber-500/40 text-amber-500 mb-3">Ciudad</span>
              <div className="ted-speaker text-xs tracking-wider text-mercu-muted uppercase mb-1 font-semibold">Francis Kéré</div>
              <h3 className="ted-title font-serif text-xl md:text-2xl text-mercu-cream mb-2 transition-colors duration-300">How to Build with Clay and Community</h3>
              <p className="ted-why text-sm text-mercu-muted leading-relaxed max-w-xl">El ganador del Premio Pritzker demuestra cómo la arquitectura ancestral con barro genera espacios más eficientes y democráticos.</p>
            </div>
            <div className="ted-right flex items-center gap-6">
              <span className="ted-duration font-mono text-xs text-mercu-accent/30 tracking-wider">12:05</span>
              <div className="ted-play-icon w-11 h-11 border border-mercu-border rounded-full flex items-center justify-center text-mercu-cream transition-all duration-300 hover:bg-mercu-cream hover:text-mercu-dark hover:border-mercu-cream">▶</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MODAL DE VIDEO EMBEBIDO ── */}
      {modalVideoUrl && (
        <div 
          onClick={() => setModalVideoUrl(null)}
          className="fixed inset-0 bg-black/85 backdrop-blur-md z-[1000] flex items-center justify-center p-8 animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-mercu-dark border border-mercu-border rounded-lg w-full max-w-3xl aspect-[16/9] relative overflow-hidden shadow-2xl scale-100 transition-transform duration-300"
          >
            <button 
              onClick={() => setModalVideoUrl(null)}
              className="absolute top-4 right-4 bg-black/70 border border-mercu-border text-mercu-cream px-4 py-2 rounded text-xs font-semibold hover:bg-mercu-cream hover:text-mercu-dark transition-all"
            >
              Cerrar ✕
            </button>
            <iframe 
              className="w-full h-full border-none"
              src={modalVideoUrl} 
              allow="autoplay; encrypted-media" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      {/* ── BOTÓN FLOTANTE VOLVER ARRIBA ── */}
      {showScrollTop && (
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 bg-mercu-dark-card/90 border border-mercu-border text-mercu-cream w-12 h-12 rounded-full flex items-center justify-center cursor-pointer z-50 hover:bg-mercu-cream hover:text-mercu-dark transition-all duration-300 animate-fade-in"
        >
          <ChevronUp size={20} />
        </button>
      )}

      {/* ── FOOTER FINAL ── */}
      <footer className="border-t border-mercu-border py-16 px-8 max-w-4xl mx-auto flex flex-col gap-8">
        <div className="flex justify-between items-center flex-wrap gap-6">
          <div className="footer-logo font-serif text-2xl text-mercu-cream">Mercurio × <em className="italic text-mercu-warm">Casa FOA</em></div>
          <p className="text-xs text-mercu-muted max-w-md leading-relaxed">
            Una iniciativa diseñada para inspirar la práctica profesional diaria de arquitectos y diseñadores. Desarrollado en alianza por Pinturerías Mercurio y Alba AkzoNobel.
          </p>
        </div>
        <div className="text-[10px] tracking-wider text-mercu-muted/40 uppercase">
          © 2026 Pinturerías Mercurio S.A. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
