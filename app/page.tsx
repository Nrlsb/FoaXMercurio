'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import {
  Play,
  Pause,
  Sparkles,
  Tv,
  Compass,
  Mic,
  Users,
  Search,
  SlidersHorizontal,
  ChevronUp,
  Image as ImageIcon,
  Film,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Save,
  Undo,
  Download,
  Code,
  X,
  Instagram
} from 'lucide-react';

// Tipos de datos
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

const DEFAULT_WEB_TEXTS: Record<string, string> = {
  hero_eyebrow: 'Pinturerías Mercurio × Casa FOA Córdoba 2026',
  hero_title: 'CASA FOA EXPERIENCIA MERCURIO- ALBA',
  hero_subtitle: 'Edicion pocito social life – Cordoba.',

  section_foa_eyebrow: 'El escenario de hoy',
  section_foa_title: '40 años transformando<br/><em>arquitectura en</em><br/>experiencias vivas.',
  section_foa_lead: 'Antes de recorrer, entendamos el espacio. Casa FOA no es una exposición de materiales — es el punto de encuentro definitivo del diseño en el país. Aquí te revelamos curiosidades y datos esenciales que pocos conocen.',

  stat1_num: '1985',
  stat1_label: 'Primera edición',
  stat2_num: '35+',
  stat2_label: 'Espacios de diseño',
  stat3_num: '4.400',
  stat3_label: 'm² de intervención',
  stat4_num: '180K',
  stat4_label: 'Visitantes promedio',

  curiosity1_num: '01',
  curiosity1_title: 'El origen filantrópico',
  curiosity1_text: 'Casa FOA nació en 1985 de la mano de Mercedes Malbrán de Campos con un fin solidario: financiar las actividades de la Fundación Oftalmológica Argentina. Lo que comenzó como un té benéfico en una casona hoy es el polo de diseño más relevante de Latinoamérica.',

  curiosity2_num: '02',
  curiosity2_title: 'Rescate de patrimonio',
  curiosity2_text: 'Cada edición recupera un hito arquitectónico en desuso. A lo largo del tiempo ha restaurado palacios históricos, silos de granos, conventos, fábricas textiles abandonadas y muelles. En 2026, desembarca en Pocito Social Life para fundirse con la vitalidad moderna de Nueva Córdoba.',

  curiosity3_num: '03',
  curiosity3_title: 'Rescate de patrimonio',
  curiosity3_text: 'Cada edición recupera un hito arquitectónico en desuso. A lo largo del tiempo ha restaurado palacios históricos, silos de granos, conventos, fábricas textiles abandonadas y muelles. En 2026, desembarca en Pocito Social Life para fundirse con la vitalidad moderna de Nueva Córdoba.',

  ejes_title: 'Los 4 Ejes del Recorrido',
  eje1_text: 'Diseñar desde lo auténtico — Materialidad honesta y texturas sin refinar.',
  eje2_text: 'Rediseñar lo esencal — Redefinir la habitabilidad mínima con máximo confort.',
  eje3_text: 'Tradición en presente continuo — La herencia artesanal cordobesa adaptada a la vanguardia.',
  eje4_text: 'Habitar la transformación — Plantas flexibles para hogares inteligentes y cambiantes.',

  gallery_eyebrow: 'Experiencia Visual',
  gallery_title: 'Galería de Espacios e<br/><em>Inspiración y Diseño.</em>',
  gallery_lead: 'Un recorrido interactivo por el interiorismo y la arquitectura de vanguardia en Pocito Córdoba 2026. Disfrutá de nuestras 7 postales curadas de diseño y 5 conferencias magistrales.',

  videos_eyebrow: 'Perspectivas globales',
  videos_title: 'Charlas que<br/><em>inspiran la mirada.</em>',
  videos_lead: 'Cuatro pensadores globales discuten la importancia de dotar a los espacios de alma, alegría, sustentabilidad y arraigo local. Haz clic en cualquiera para verla directamente.',

  footer_lead: 'Una iniciativa diseñada para inspirar la práctica profesional diaria de arquitectos y diseñadores. Desarrollado en alianza por Pinturerías Mercurio y Alba AkzoNobel.',
  footer_copy: '© 2026 Pinturerías Mercurio S.A. Todos los derechos reservados.'
};

export default function HomePage() {
  /* ── 1. ESTADOS DE INTERACCIÓN GENERAL ── */
  const [activeSection, setActiveSection] = useState('inicio');
  const [showScrollTop, setShowScrollTop] = useState(false);

  /* ── 1.1. ESTADOS DEL EDITOR DE TEXTOS ── */
  const [editMode, setEditMode] = useState(false);
  const [webTexts, setWebTexts] = useState<Record<string, string>>(DEFAULT_WEB_TEXTS);
  const [savingTexts, setSavingTexts] = useState(false);
  const [saveSuccessTexts, setSaveSuccessTexts] = useState(false);
  const [saveErrorTexts, setSaveErrorTexts] = useState('');
  const [showSqlModal, setShowSqlModal] = useState(false);

  // Helper Component for Inline Editable Text
  const EditableText = ({
    textKey,
    className = '',
    as: Component = 'span',
    allowHtml = false
  }: {
    textKey: string;
    className?: string;
    as?: any;
    allowHtml?: boolean;
  }) => {
    const content = webTexts[textKey] || '';

    const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
      const newValue = allowHtml ? e.currentTarget.innerHTML : e.currentTarget.innerText;
      setWebTexts(prev => ({
        ...prev,
        [textKey]: newValue
      }));
    };

    if (editMode) {
      return (
        <Component
          contentEditable
          suppressContentEditableWarning
          onBlur={handleBlur}
          className={`${className} outline-none border border-dashed border-mercu-accent/50 focus:border-mercu-accent focus:bg-white/5 px-2 py-0.5 rounded transition-all cursor-text`}
          dangerouslySetInnerHTML={allowHtml ? { __html: content } : undefined}
          title="Haz clic para editar este texto"
        >
          {!allowHtml ? content : undefined}
        </Component>
      );
    }

    return (
      <Component
        className={className}
        dangerouslySetInnerHTML={allowHtml ? { __html: content } : undefined}
      >
        {!allowHtml ? content : undefined}
      </Component>
    );
  };

  /* ── 2. ESTADOS DE LA GALERÍA MULTIMEDIA ── */
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(DEFAULT_GALLERY_ITEMS);
  const [loadingGallery, setLoadingGallery] = useState(true);
  const [galleryFilter, setGalleryFilter] = useState<'all' | 'image' | 'video'>('all');

  // Estados para Lightbox interactivo
  const [lightboxActive, setLightboxActive] = useState(false);
  const [lightboxType, setLightboxType] = useState<'image' | 'video'>('image');
  const [lightboxIndex, setLightboxIndex] = useState(0);

  /* ── 4. ESTADOS DEL MODAL TED VIDEOS ── */
  const [modalVideoUrl, setModalVideoUrl] = useState<string | null>(null);

  /* ── 6. EFECTOS: SCROLL OBSERVER Y BOTÓN BACK-TO-TOP ── */
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      // Botón volver arriba
      setShowScrollTop(scrollY > 300);

      // Link activo
      const sections = document.querySelectorAll('section, header, #mercurio, #alba');
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
        } else {
          const local = localStorage.getItem('casafoa_gallery_items');
          if (local) {
            const parsed = JSON.parse(local);
            setGalleryItems(parsed);
          }
        }
      } catch (err) {
        console.warn('Conexión a base de datos de galería no disponible. Usando local/defaults.');
        const local = localStorage.getItem('casafoa_gallery_items');
        if (local) {
          const parsed = JSON.parse(local);
          setGalleryItems(parsed);
        }
      } finally {
        setLoadingGallery(false);
      }
    }

    fetchGallery();
  }, []);

  /* ── 6.6. EFECTO: CARGA DE TEXTOS EDITABLES ── */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('edit') === 'true') {
        setEditMode(true);
      }
    }

    async function fetchWebTexts() {
      try {
        const { data, error } = await supabase
          .from('web_texts')
          .select('*');

        if (error) throw error;

        if (data && data.length > 0) {
          const loadedTexts: Record<string, string> = { ...DEFAULT_WEB_TEXTS };
          data.forEach((item: any) => {
            loadedTexts[item.key] = item.value;
          });
          setWebTexts(loadedTexts);
        } else {
          const local = localStorage.getItem('casafoa_web_texts');
          if (local) {
            setWebTexts(JSON.parse(local));
          }
        }
      } catch (err) {
        console.warn('Conexión a Supabase no disponible para textos o tabla inexistente. Usando local/defaults.');
        const local = localStorage.getItem('casafoa_web_texts');
        if (local) {
          setWebTexts(JSON.parse(local));
        }
      }
    }

    fetchWebTexts();
  }, []);

  const handleSaveWebTexts = async () => {
    setSavingTexts(true);
    setSaveErrorTexts('');
    setSaveSuccessTexts(false);

    try {
      const itemsToSave = Object.entries(webTexts).map(([key, value]) => ({
        key,
        value
      }));

      const { error } = await supabase
        .from('web_texts')
        .upsert(itemsToSave, { onConflict: 'key' });

      if (error) throw error;

      localStorage.setItem('casafoa_web_texts', JSON.stringify(webTexts));
      setSaveSuccessTexts(true);
      setTimeout(() => setSaveSuccessTexts(false), 4000);
    } catch (err: any) {
      console.warn('Error al guardar en Supabase. Guardando localmente:', err.message);
      localStorage.setItem('casafoa_web_texts', JSON.stringify(webTexts));
      setSaveSuccessTexts(true);
      setSaveErrorTexts(
        'Los cambios se guardaron localmente en tu navegador. Para guardarlos en la base de datos de Supabase de forma permanente, haz clic en "Ver SQL Supabase" y crea la tabla.'
      );
      setTimeout(() => setSaveSuccessTexts(false), 8000);
    } finally {
      setSavingTexts(false);
    }
  };

  const handleResetWebTexts = () => {
    if (confirm('¿Estás seguro de que deseas restablecer todos los textos a los valores originales predeterminados? Se perderán las modificaciones locales.')) {
      setWebTexts(DEFAULT_WEB_TEXTS);
      localStorage.removeItem('casafoa_web_texts');
      alert('Textos restablecidos a los valores predeterminados. Para confirmar el cambio, haz clic en "Guardar Cambios".');
    }
  };

  const handleExportWebTextsJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(webTexts, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "textos_casafoa_2026.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

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

  return (
    <div className="min-h-screen bg-mercu-dark text-mercu-cream font-sans selection:bg-mercu-accent selection:text-mercu-dark">

      {/* ── HERO DE ENTRADA ── */}
      <header id="inicio" className="hero relative min-h-[65vh] md:min-h-screen flex flex-col justify-end px-6 py-12 md:p-16 overflow-hidden">
        <div className="hero-bg"></div>
        <div className="hero-grid"></div>
        <div className="hero-corner"></div>
        <div className="hero-corner-br"></div>



        {/* Logotipos */}
        <div className="z-10 mb-8 md:mb-10 flex items-center flex-nowrap gap-3.5 sm:gap-4 md:gap-8 animate-fade-in opacity-0">
          <img src="/logomercurioblanco.png" alt="Pinturerías Mercurio" className="h-9 sm:h-9 md:h-10 w-auto block object-contain" />
          <div className="h-6 sm:h-6 md:h-8 w-[1px] bg-mercu-border flex-shrink-0"></div>
          <img src="/alba_blanco.png" alt="Alba" className="h-8 sm:h-8 md:h-9 w-auto block object-contain" />
          <div className="h-6 sm:h-6 md:h-8 w-[1px] bg-mercu-border flex-shrink-0"></div>
          <img src="/logo_casafoa.svg" alt="Casa FOA" className="h-8 sm:h-8 md:h-9 w-auto block object-contain" />
        </div>

        <EditableText
          textKey="hero_eyebrow"
          className="hero-eyebrow z-10 text-xs font-semibold tracking-[0.25em] uppercase text-mercu-accent mb-6 block"
          as="div"
        />
        <EditableText
          textKey="hero_title"
          className="hero-title z-10 font-serif text-5xl md:text-8xl font-light leading-[0.95] tracking-tight mb-4 block"
          as="h1"
          allowHtml
        />
        <EditableText
          textKey="hero_subtitle"
          className="hero-subtitle z-10 text-sm tracking-widest uppercase text-mercu-muted block"
          as="p"
        />

        <div className="scroll-hint absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10" aria-hidden="true">
          <div className="scroll-line w-[1px] h-10 bg-gradient-to-b from-transparent to-mercu-muted animate-pulse"></div>
        </div>
      </header>

      {/* ── BARRA DE NAVEGACIÓN STICKY ── */}
      <nav className="sticky top-0 bg-mercu-dark/85 backdrop-blur-xl border-b border-mercu-border z-50 px-4 md:px-8 py-0">
        <div className="max-w-6xl mx-auto flex items-center justify-between w-full">
          <div className="nav-logo font-serif text-xs md:text-sm font-light text-mercu-cream py-4 md:py-5 pr-4 md:pr-6 border-r border-mercu-border mr-2 md:mr-4 tracking-wider">
            Mercurio × FOA
          </div>
          <div className="flex gap-1 sm:gap-2 overflow-x-auto scrollbar-none">
            <a href="#casa-foa" className={`text-[9px] md:text-xs font-medium tracking-widest uppercase py-4 md:py-5 px-2 md:px-4 transition-all relative ${activeSection === 'casa-foa' ? 'text-mercu-cream after:scale-x-100' : 'text-mercu-muted hover:text-mercu-cream after:scale-x-0'} after:content-[''] after:absolute after:bottom-[-1px] after:left-2 md:after:left-4 after:right-2 md:after:right-4 after:height-[2px] after:bg-mercu-accent after:transition-transform after:duration-300`}>Casa FOA</a>
            <a href="#mercurio" className={`text-[9px] md:text-xs font-medium tracking-widest uppercase py-4 md:py-5 px-2 md:px-4 transition-all relative ${activeSection === 'mercurio' ? 'text-mercu-cream after:scale-x-100' : 'text-mercu-muted hover:text-mercu-cream after:scale-x-0'} after:content-[''] after:absolute after:bottom-[-1px] after:left-2 md:after:left-4 after:right-2 md:after:right-4 after:height-[2px] after:bg-mercu-accent after:transition-transform after:duration-300`}>Mercurio</a>
            <a href="#alba" className={`text-[9px] md:text-xs font-medium tracking-widest uppercase py-4 md:py-5 px-2 md:px-4 transition-all relative ${activeSection === 'alba' ? 'text-mercu-cream after:scale-x-100' : 'text-mercu-muted hover:text-mercu-cream after:scale-x-0'} after:content-[''] after:absolute after:bottom-[-1px] after:left-2 md:after:left-4 after:right-2 md:after:right-4 after:height-[2px] after:bg-mercu-accent after:transition-transform after:duration-300`}>Alba</a>
            <a href="#charlas" className={`text-[9px] md:text-xs font-medium tracking-widest uppercase py-4 md:py-5 px-2 md:px-4 transition-all relative ${activeSection === 'charlas' ? 'text-mercu-cream after:scale-x-100' : 'text-mercu-muted hover:text-mercu-cream after:scale-x-0'} after:content-[''] after:absolute after:bottom-[-1px] after:left-2 md:after:left-4 after:right-2 md:after:right-4 after:height-[2px] after:bg-mercu-accent after:transition-transform after:duration-300`}>Charlas</a>
          </div>
        </div>
      </nav>

      {/* ── SECCIÓN CASA FOA ── */}
      <section id="casa-foa" className="py-24 px-8 max-w-4xl mx-auto">
        <div className="reveal">
          <EditableText
            textKey="section_foa_eyebrow"
            className="section-eyebrow text-xs font-medium tracking-widest uppercase text-mercu-accent mb-4 block"
            as="div"
          />
          <EditableText
            textKey="section_foa_title"
            className="section-title font-serif text-4xl md:text-6xl font-light leading-tight text-mercu-cream block"
            as="h2"
            allowHtml
          />
          <EditableText
            textKey="section_foa_lead"
            className="section-lead text-base md:text-lg leading-relaxed text-mercu-cream/70 mt-6 max-w-2xl block"
            as="p"
          />
        </div>

        {/* Malla de Datos Estadísticos */}
        <div className="dato-grid reveal grid grid-cols-2 md:grid-cols-4 gap-[1px] bg-mercu-border border border-mercu-border rounded overflow-hidden my-16">
          <div className="dato-item bg-mercu-dark-card p-6 md:p-10 text-center transition-all duration-300 hover:bg-mercu-border/5">
            <EditableText
              textKey="stat1_num"
              className="dato-num font-serif text-4xl md:text-5xl font-light text-mercu-cream mb-3 transition-transform hover:-translate-y-1 block"
              as="div"
            />
            <EditableText
              textKey="stat1_label"
              className="dato-label text-[10px] tracking-widest text-mercu-muted uppercase block"
              as="div"
            />
          </div>
          <div className="dato-item bg-mercu-dark-card p-6 md:p-10 text-center transition-all duration-300 hover:bg-mercu-border/5">
            <EditableText
              textKey="stat2_num"
              className="dato-num font-serif text-4xl md:text-5xl font-light text-mercu-cream mb-3 transition-transform hover:-translate-y-1 block"
              as="div"
            />
            <EditableText
              textKey="stat2_label"
              className="dato-label text-[10px] tracking-widest text-mercu-muted uppercase block"
              as="div"
            />
          </div>
          <div className="dato-item bg-mercu-dark-card p-6 md:p-10 text-center transition-all duration-300 hover:bg-mercu-border/5">
            <EditableText
              textKey="stat3_num"
              className="dato-num font-serif text-4xl md:text-5xl font-light text-mercu-cream mb-3 transition-transform hover:-translate-y-1 block"
              as="div"
            />
            <EditableText
              textKey="stat3_label"
              className="dato-label text-[10px] tracking-widest text-mercu-muted uppercase block"
              as="div"
            />
          </div>
          <div className="dato-item bg-mercu-dark-card p-6 md:p-10 text-center transition-all duration-300 hover:bg-mercu-border/5">
            <EditableText
              textKey="stat4_num"
              className="dato-num font-serif text-4xl md:text-5xl font-light text-mercu-cream mb-3 transition-transform hover:-translate-y-1 block"
              as="div"
            />
            <EditableText
              textKey="stat4_label"
              className="dato-label text-[10px] tracking-widest text-mercu-muted uppercase block"
              as="div"
            />
          </div>
        </div>

        {/* Malla de Curiosidades */}
        <div className="curiosity-grid reveal grid grid-cols-1 gap-[1px] bg-mercu-border border border-mercu-border rounded overflow-hidden mb-16">
          <div className="curiosity-item bg-mercu-dark p-6 md:p-10 flex flex-col sm:flex-row gap-4 md:gap-8 items-start transition-all duration-300 hover:bg-mercu-border/5">
            <EditableText
              textKey="curiosity1_num"
              className="curiosity-num font-serif text-5xl font-light text-mercu-accent/20 transition-colors duration-300 block"
              as="div"
            />
            <div className="curiosity-content w-full">
              <EditableText
                textKey="curiosity1_title"
                className="curiosity-label text-xs font-semibold tracking-wider text-mercu-accent uppercase mb-3 block"
                as="h3"
              />
              <EditableText
                textKey="curiosity1_text"
                className="curiosity-text text-sm leading-relaxed text-mercu-cream/80 block"
                as="p"
                allowHtml
              />
            </div>
          </div>

          <div className="curiosity-item bg-mercu-dark p-6 md:p-10 flex flex-col sm:flex-row gap-4 md:gap-8 items-start transition-all duration-300 hover:bg-mercu-border/5">
            <EditableText
              textKey="curiosity2_num"
              className="curiosity-num font-serif text-5xl font-light text-mercu-accent/20 transition-colors duration-300 block"
              as="div"
            />
            <div className="curiosity-content w-full">
              <EditableText
                textKey="curiosity2_title"
                className="curiosity-label text-xs font-semibold tracking-wider text-mercu-accent uppercase mb-3 block"
                as="h3"
              />
              <EditableText
                textKey="curiosity2_text"
                className="curiosity-text text-sm leading-relaxed text-mercu-cream/80 block"
                as="p"
                allowHtml
              />
            </div>
          </div>
        </div>

        {/* Ejes Conceptuales */}
        <div className="reveal">
          <div className="divider w-16 h-[1px] bg-mercu-accent my-12"></div>
          <EditableText
            textKey="ejes_title"
            className="section-eyebrow text-xs font-medium tracking-widest uppercase text-mercu-accent mb-6 block"
            as="div"
          />
          <div className="ejes-list flex flex-col gap-[1px] bg-mercu-border border border-mercu-border rounded overflow-hidden mt-8">
            <div className="eje-item bg-mercu-dark-card p-5 md:p-8 flex gap-4 md:gap-6 items-center transition-all duration-300 hover:bg-mercu-border/5">
              <div className="eje-mark w-7 h-7 border border-mercu-accent rounded-full flex items-center justify-center flex-shrink-0"><div className="eje-dot w-2 h-2 bg-mercu-accent rounded-full"></div></div>
              <EditableText
                textKey="eje1_text"
                className="eje-text font-serif text-base md:text-lg text-mercu-cream block"
                as="div"
                allowHtml
              />
            </div>
            <div className="eje-item bg-mercu-dark-card p-5 md:p-8 flex gap-4 md:gap-6 items-center transition-all duration-300 hover:bg-mercu-border/5">
              <div className="eje-mark w-7 h-7 border border-mercu-accent rounded-full flex items-center justify-center flex-shrink-0"><div className="eje-dot w-2 h-2 bg-mercu-accent rounded-full"></div></div>
              <EditableText
                textKey="eje2_text"
                className="eje-text font-serif text-base md:text-lg text-mercu-cream block"
                as="div"
                allowHtml
              />
            </div>
            <div className="eje-item bg-mercu-dark-card p-5 md:p-8 flex gap-4 md:gap-6 items-center transition-all duration-300 hover:bg-mercu-border/5">
              <div className="eje-mark w-7 h-7 border border-mercu-accent rounded-full flex items-center justify-center flex-shrink-0"><div className="eje-dot w-2 h-2 bg-mercu-accent rounded-full"></div></div>
              <EditableText
                textKey="eje3_text"
                className="eje-text font-serif text-base md:text-lg text-mercu-cream block"
                as="div"
                allowHtml
              />
            </div>
            <div className="eje-item bg-mercu-dark-card p-5 md:p-8 flex gap-4 md:gap-6 items-center transition-all duration-300 hover:bg-mercu-border/5">
              <div className="eje-mark w-7 h-7 border border-mercu-accent rounded-full flex items-center justify-center flex-shrink-0"><div className="eje-dot w-2 h-2 bg-mercu-accent rounded-full"></div></div>
              <EditableText
                textKey="eje4_text"
                className="eje-text font-serif text-base md:text-lg text-mercu-cream block"
                as="div"
                allowHtml
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── SECCIÓN GALERÍA MULTIMEDIA ── */}
      <section className="py-24 px-8 max-w-6xl mx-auto">
        <div className="reveal">
          <div className="mercu-tag inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-mercu-muted uppercase border border-mercu-border rounded px-4 py-2 mb-8 bg-mercu-dark-card/40">
            <span className="mercu-dot w-2 h-2 bg-mercu-accent rounded-full animate-pulse"></span>
            Galería Casa FOA 2026 (Solo Videos)
          </div>
          <div className="section-header mb-12">
            <span className="section-eyebrow text-xs font-semibold tracking-widest uppercase text-[#eb2891] mb-4 block">
              -EXPERIENCIA VISUAL - CASA FOA 2025
            </span>
            <h2 className="section-title font-serif text-4xl md:text-6xl font-light leading-tight text-mercu-cream block">
              GALERIA
            </h2>
            <p className="section-lead text-base md:text-lg leading-relaxed text-mercu-cream/70 mt-6 max-w-2xl block">
              Explore los recorridos visuales y registros audiovisuales exclusivos a través de las siguientes carpetas compartidas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {/* Tarjeta MERCURIO */}
            <Link
              href="/videos?brand=mercurio"
              id="mercurio"
              className="group relative flex flex-col items-center justify-center p-8 bg-mercu-dark-card border border-mercu-muted/20 rounded-xl transition-all duration-500 hover:border-mercu-accent/40 hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(235,40,145,0.08)] min-h-[250px]"
            >
              <div className="absolute top-4 right-4 text-xs text-mercu-muted font-mono opacity-40 group-hover:opacity-100 transition-opacity">
                Videos ↗
              </div>
              <img
                src="/logomercurioblanco.png"
                alt="Mercurio"
                className="h-10 w-auto object-contain transition-transform duration-500 group-hover:scale-110"
              />
              <span className="text-[10px] tracking-widest text-[#eb2891] uppercase mt-8 font-semibold opacity-60 group-hover:opacity-100 transition-opacity">
                Ver Videos Mercurio
              </span>
            </Link>

            {/* Tarjeta CASA FOA */}
            <Link
              href="/videos?brand=casa-foa"
              id="casa-foa-gallery"
              className="group relative flex flex-col items-center justify-center p-8 bg-mercu-dark-card border border-mercu-muted/20 rounded-xl transition-all duration-500 hover:border-mercu-accent/40 hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(235,40,145,0.08)] min-h-[250px]"
            >
              <div className="absolute top-4 right-4 text-xs text-mercu-muted font-mono opacity-40 group-hover:opacity-100 transition-opacity">
                Videos ↗
              </div>
              <img
                src="/logo_casafoa.svg"
                alt="Casa FOA"
                className="h-16 w-auto object-contain transition-transform duration-500 group-hover:scale-110"
              />
              <span className="text-[10px] tracking-widest text-[#eb2891] uppercase mt-8 font-semibold opacity-60 group-hover:opacity-100 transition-opacity">
                Ver Videos Casa FOA
              </span>
            </Link>

            {/* Tarjeta ALBA */}
            <Link
              href="/videos?brand=alba"
              id="alba"
              className="group relative flex flex-col items-center justify-center p-8 bg-mercu-dark-card border border-mercu-muted/20 rounded-xl transition-all duration-500 hover:border-mercu-accent/40 hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(235,40,145,0.08)] min-h-[250px]"
            >
              <div className="absolute top-4 right-4 text-xs text-mercu-muted font-mono opacity-40 group-hover:opacity-100 transition-opacity">
                Videos ↗
              </div>
              <img
                src="/alba_blanco.png"
                alt="Alba"
                className="h-10 w-auto object-contain transition-transform duration-500 group-hover:scale-110"
              />
              <span className="text-[10px] tracking-widest text-[#eb2891] uppercase mt-8 font-semibold opacity-60 group-hover:opacity-100 transition-opacity">
                Ver Videos Alba
              </span>
            </Link>
          </div>
        </div>
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




      {/* ── SECCIÓN CHARLAS ── */}
      <section id="charlas" className="py-24 px-8 max-w-4xl mx-auto">
        <div className="reveal">
          <div className="section-header mb-16">
            <span className="section-eyebrow text-xs font-medium tracking-widest uppercase text-mercu-accent mb-4 block">
              Perspectivas Conceptuales
            </span>
            <h2 className="section-title font-serif text-4xl md:text-6xl font-light leading-tight text-mercu-cream block">
              Charlas que inspiran la mirada
            </h2>
            <p className="section-lead text-base md:text-lg leading-relaxed text-mercu-cream/70 mt-6 max-w-2xl block">
              Descubra nuevas visiones sobre accesibilidad, neuroarquitectura y prácticas alternativas de diseño arquitectónico.
            </p>
          </div>
        </div>

        {/* Malla de Charlas */}
        <div className="ted-grid reveal grid gap-[1px] bg-mercu-border border border-mercu-border rounded overflow-hidden">
          <div
            onClick={() => setModalVideoUrl("https://www.youtube.com/embed/KeJTUrXYBVs")}
            className="ted-item bg-mercu-dark p-8 md:p-10 cursor-pointer transition-all duration-300 hover:bg-mercu-border/5 grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-6"
          >
            <div>
              <span className="ted-tag inline-block text-[10px] tracking-widest font-semibold uppercase px-3 py-1 rounded-full border border-mercu-accent text-mercu-accent mb-3">Accesibilidad</span>
              <div className="ted-speaker text-xs tracking-wider text-mercu-muted uppercase mb-1 font-semibold">Gabriela Carrillo</div>
              <h3 className="ted-title font-serif text-xl md:text-2xl text-mercu-cream mb-2 transition-colors duration-300">La verdadera accesibilidad en arquitectura</h3>
              <p className="ted-why text-sm text-mercu-muted leading-relaxed max-w-xl">Una reflexión profunda sobre cómo diseñar espacios que sean verdaderamente inclusivos y accesibles para todos.</p>
            </div>
            <div className="ted-right flex items-center gap-6">
              <div className="ted-play-icon w-11 h-11 border border-mercu-border rounded-full flex items-center justify-center text-mercu-cream transition-all duration-300 hover:bg-mercu-cream hover:text-mercu-dark hover:border-mercu-cream">▶</div>
            </div>
          </div>

          <div
            onClick={() => setModalVideoUrl("https://www.youtube.com/embed/FNOnzelCGlM")}
            className="ted-item bg-mercu-dark p-8 md:p-10 cursor-pointer transition-all duration-300 hover:bg-mercu-border/5 grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-6"
          >
            <div>
              <span className="ted-tag inline-block text-[10px] tracking-widest font-semibold uppercase px-3 py-1 rounded-full border border-emerald-400/40 text-emerald-400 mb-3">Neuroarquitectura</span>
              <div className="ted-speaker text-xs tracking-wider text-mercu-muted uppercase mb-1 font-semibold">Ana Monbiedro</div>
              <h3 className="ted-title font-serif text-xl md:text-2xl text-mercu-cream mb-2 transition-colors duration-300">¿Podemos diseñar desde lo que sentimos?: Neuroarquitectura</h3>
              <p className="ted-why text-sm text-mercu-muted leading-relaxed max-w-xl">El impacto neurológico del diseño espacial y cómo las emociones guían la concepción del hábitat humano.</p>
            </div>
            <div className="ted-right flex items-center gap-6">
              <div className="ted-play-icon w-11 h-11 border border-mercu-border rounded-full flex items-center justify-center text-mercu-cream transition-all duration-300 hover:bg-mercu-cream hover:text-mercu-dark hover:border-mercu-cream">▶</div>
            </div>
          </div>

          <div
            onClick={() => setModalVideoUrl("https://www.youtube.com/embed/STvFfOWsarw")}
            className="ted-item bg-mercu-dark p-8 md:p-10 cursor-pointer transition-all duration-300 hover:bg-mercu-border/5 grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-6"
          >
            <div>
              <span className="ted-tag inline-block text-[10px] tracking-widest font-semibold uppercase px-3 py-1 rounded-full border border-amber-500/40 text-amber-500 mb-3">Alternativas</span>
              <div className="ted-speaker text-xs tracking-wider text-mercu-muted uppercase mb-1 font-semibold">Axel Becerra Santacruz</div>
              <h3 className="ted-title font-serif text-xl md:text-2xl text-mercu-cream mb-2 transition-colors duration-300">Otras formas de hacer arquitectura</h3>
              <p className="ted-why text-sm text-mercu-muted leading-relaxed max-w-xl">Una mirada hacia metodologías y prácticas de diseño arquitectónico fuera de los márgenes tradicionales.</p>
            </div>
            <div className="ted-right flex items-center gap-6">
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
        {/* Instagram Links */}
        <div className="flex flex-wrap gap-6 border-b border-mercu-border/40 pb-8 items-center justify-start">
          <span className="text-[10px] tracking-widest text-mercu-muted uppercase font-bold mr-2">Seguinos en Instagram:</span>
          <a
            href="https://www.instagram.com/alba.pinturas/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 text-xs text-mercu-muted hover:text-mercu-cream transition-colors group"
          >
            <Instagram size={16} className="text-mercu-muted group-hover:text-mercu-cream transition-colors" />
            <img src="/alba_blanco.png" alt="Alba" className="w-auto object-contain brightness-95 group-hover:brightness-100 transition-all" style={{ height: '14px' }} />
          </a>
          <div className="w-[1px] h-4 bg-mercu-border"></div>
          <a
            href="https://www.instagram.com/pint_mercurio/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 text-xs text-mercu-muted hover:text-mercu-cream transition-colors group"
          >
            <Instagram size={16} className="text-mercu-muted group-hover:text-mercu-cream transition-colors" />
            <img src="/logomercurioblanco.png" alt="Mercurio" className="w-auto object-contain brightness-95 group-hover:brightness-100 transition-all" style={{ height: '16px' }} />
          </a>
        </div>

        <div className="flex justify-between items-center flex-wrap gap-6">
          <div className="footer-logo flex items-center gap-2.5 select-none">
            <img src="/logomercurioblanco.png" alt="Pinturerías Mercurio" className="w-auto object-contain" style={{ height: '36px' }} />
            <span className="text-mercu-muted/50 font-light text-2xl mx-1">×</span>
            <img src="/logo_casafoa.svg" alt="Casa FOA" className="w-auto object-contain" style={{ height: '32px' }} />
          </div>
          <EditableText
            textKey="footer_lead"
            className="text-xs text-mercu-muted max-w-md leading-relaxed block"
            as="p"
          />
        </div>
        <EditableText
          textKey="footer_copy"
          className="text-[10px] tracking-wider text-mercu-muted/40 uppercase block"
          as="div"
        />
      </footer>

      {/* ── BARRA DE HERRAMIENTAS DE EDICIÓN FLOTANTE (FAB) ── */}
      {editMode && (
        <div className="fixed bottom-6 left-6 z-[999] animate-fade-in flex flex-col gap-3">
          {saveSuccessTexts && (
            <div className="bg-emerald-950/90 backdrop-blur-md border border-emerald-500/30 text-emerald-300 text-xs py-3 px-4 rounded shadow-2xl max-w-sm flex flex-col gap-1 transition-all duration-300">
              <span className="font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                ✓ Cambios guardados con éxito
              </span>
              {saveErrorTexts ? (
                <span className="text-[10px] text-emerald-300/80 leading-relaxed font-light mt-1">
                  {saveErrorTexts}
                </span>
              ) : (
                <span className="text-[10px] text-emerald-300/80">
                  Sincronizado correctamente con Supabase.
                </span>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 bg-neutral-900/90 backdrop-blur-xl border border-mercu-border rounded-full p-2 shadow-2xl">
            <div className="text-[10px] uppercase font-bold tracking-widest text-mercu-accent px-4 py-1.5 border-r border-mercu-border/50 hidden sm:inline-block">
              Editor de Textos
            </div>

            <button
              onClick={handleSaveWebTexts}
              disabled={savingTexts}
              className="flex items-center gap-1.5 bg-mercu-accent hover:bg-mercu-cream text-mercu-dark font-semibold text-xs tracking-wider uppercase px-4 py-2 rounded-full transition-all active:scale-95 disabled:opacity-50"
              title="Guardar todos los cambios en Supabase / LocalStorage"
            >
              <Save size={14} />
              <span>{savingTexts ? 'Guardando...' : 'Guardar'}</span>
            </button>

            <button
              onClick={handleResetWebTexts}
              className="p-2 text-mercu-muted hover:text-mercu-cream rounded-full hover:bg-white/5 transition-all"
              title="Restablecer textos predeterminados"
            >
              <Undo size={16} />
            </button>

            <button
              onClick={handleExportWebTextsJson}
              className="p-2 text-mercu-muted hover:text-mercu-cream rounded-full hover:bg-white/5 transition-all"
              title="Exportar textos como JSON"
            >
              <Download size={16} />
            </button>

            <button
              onClick={() => setShowSqlModal(true)}
              className="p-2 text-mercu-muted hover:text-mercu-accent rounded-full hover:bg-white/5 transition-all flex items-center gap-1"
              title="Ver instrucciones SQL de Supabase"
            >
              <Code size={16} />
              <span className="text-[9px] uppercase tracking-wider font-bold pr-1 hidden md:inline">SQL</span>
            </button>

            <button
              onClick={() => {
                if (confirm('¿Deseas salir del modo editor de textos? No te olvides de guardar tus cambios.')) {
                  setEditMode(false);
                  // Limpiar query param de la URL sin recargar la página
                  if (typeof window !== 'undefined') {
                    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
                    window.history.pushState({ path: newUrl }, '', newUrl);
                  }
                }
              }}
              className="p-2 text-mercu-muted hover:text-red-400 rounded-full hover:bg-white/5 transition-all border-l border-mercu-border/50 pl-3"
              title="Cerrar editor"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ── MODAL SQL SUPABASE DE INSTRUCCIONES ── */}
      {showSqlModal && (
        <div
          onClick={() => setShowSqlModal(false)}
          className="fixed inset-0 bg-black/85 backdrop-blur-md z-[1000] flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-neutral-900 border border-mercu-border rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
          >
            {/* Cabecera */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-mercu-border/50 bg-neutral-950/40">
              <div className="flex items-center gap-2">
                <Code size={18} className="text-mercu-accent" />
                <h3 className="font-serif text-lg text-mercu-cream">Configuración de Supabase</h3>
              </div>
              <button
                onClick={() => setShowSqlModal(false)}
                className="w-8 h-8 rounded-full bg-white/5 text-mercu-cream flex items-center justify-center hover:bg-mercu-accent hover:text-mercu-dark transition-all"
              >
                ✕
              </button>
            </div>

            {/* Contenido */}
            <div className="p-6 overflow-y-auto flex flex-col gap-4 text-xs md:text-sm leading-relaxed text-mercu-muted">
              <p>
                Para habilitar la persistencia de textos en tiempo real en la nube para todos tus usuarios, ejecuta la siguiente consulta en el <strong>SQL Editor</strong> de tu panel de Supabase:
              </p>

              <div className="relative font-mono bg-black text-emerald-400 p-4 rounded-lg overflow-x-auto border border-mercu-border/50 text-[11px] leading-normal select-all">
                <pre>{`create table if not exists public.web_texts (
  key text primary key,
  value text not null
);

alter table public.web_texts enable row level security;

create policy "Permitir lectura pública de textos" 
on public.web_texts for select using (true);

create policy "Permitir inserción pública de textos" 
on public.web_texts for insert with check (true);

create policy "Permitir actualización pública de textos" 
on public.web_texts for update using (true);`}</pre>
              </div>

              <div className="bg-amber-950/30 border border-amber-500/20 text-amber-300/90 p-4 rounded-lg flex flex-col gap-1.5 text-xs">
                <span className="font-bold flex items-center gap-1">
                  ⚠️ Nota sobre Resiliencia
                </span>
                <span>
                  Si no creas esta tabla o la base de datos no está disponible, el sistema guardará automáticamente tus textos de forma local en tu navegador (<strong>LocalStorage</strong>). Podrás seguir editando y guardando de manera 100% funcional.
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-mercu-border/30 bg-neutral-950/40 flex justify-end">
              <button
                onClick={() => setShowSqlModal(false)}
                className="bg-mercu-accent hover:bg-mercu-cream text-mercu-dark font-semibold text-xs tracking-wider uppercase px-5 py-2.5 rounded-full transition-all"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
