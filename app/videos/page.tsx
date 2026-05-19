'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Film, 
  Download, 
  FolderOpen, 
  Play, 
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

// Definimos la estructura de marcas y sus videos predeterminados de YouTube/Vimeo
interface VideoItem {
  id: string;
  title: string;
  duration: string;
  youtubeId: string;
  description: string;
}

interface BrandConfig {
  name: string;
  logo: string;
  accentColor: string;
  hoverColor: string;
  driveFolderId: string;
  driveUrl: string;
  description: string;
  featuredVideos: VideoItem[];
}

const BRANDS: Record<string, BrandConfig> = {
  mercurio: {
    name: 'Pinturerías Mercurio',
    logo: '/logomercurioblanco.png',
    accentColor: '#eb2891', // Rosa
    hoverColor: 'hover:border-[#eb2891] hover:shadow-[0_0_30px_rgba(235,40,145,0.2)]',
    driveFolderId: '19d2XHXwQefpMaoU6d38WUKHhykdz23pX',
    driveUrl: 'https://drive.google.com/drive/folders/19d2XHXwQefpMaoU6d38WUKHhykdz23pX?usp=sharing',
    description: 'Explorá los registros de diseño, entrevistas y recorridos exclusivos en los espacios auspiciados por Pinturerías Mercurio en Casa FOA Córdoba 2026.',
    featuredVideos: [
      {
        id: 'mercurio-1',
        title: 'Recorrido Espacio Creativo Mercurio - Casa FOA 2026',
        duration: '3:45',
        youtubeId: 'Z67_1kP_yqY',
        description: 'Un viaje sensorial a través del Estudio Creativo Mercurio, analizando la aplicación de colores vibrantes y el diseño de espacios flexibles para el teletrabajo.'
      },
      {
        id: 'mercurio-2',
        title: 'El Arte de Combinar Texturas y Colores en Obra',
        duration: '5:12',
        youtubeId: 'rV58K0l9L4k',
        description: 'Entrevista con los diseñadores del espacio para descubrir la inspiración detrás de la paleta elegida y las técnicas de aplicación utilizadas.'
      },
      {
        id: 'mercurio-3',
        title: 'Detrás de Escena: La Preparación de Espacios',
        duration: '4:20',
        youtubeId: '5_dKzT6TsmA',
        description: 'Conocé el proceso creativo y el trabajo técnico de pintura que dio vida a las texturas en las paredes principales del espacio de exposición.'
      }
    ]
  },
  'casa-foa': {
    name: 'Casa FOA',
    logo: '/logo_casafoa.svg',
    accentColor: '#eb2891', // Rosa (Acento general)
    hoverColor: 'hover:border-[#eb2891] hover:shadow-[0_0_30px_rgba(235,40,145,0.2)]',
    driveFolderId: '1jV2jPWKyd8xoTQmrv7PW5lyeEuzBMKWH',
    driveUrl: 'https://drive.google.com/drive/folders/1jV2jPWKyd8xoTQmrv7PW5lyeEuzBMKWH?usp=sharing',
    description: 'Accedé a los videos oficiales, testimonios de los arquitectos premiados y el registro cinematográfico de la Edición Pocito Social Life en Córdoba.',
    featuredVideos: [
      {
        id: 'foa-1',
        title: 'Casa FOA Córdoba 2026 - Inauguración Oficial',
        duration: '6:15',
        youtubeId: 'FNOnzelCGlM',
        description: 'Reviví la ceremonia de apertura y los primeros testimonios de los creadores en esta edición que recupera el valor de la arquitectura en Córdoba.'
      },
      {
        id: 'foa-2',
        title: 'Los Espacios Premiados de Casa FOA Córdoba 2026',
        duration: '4:50',
        youtubeId: 'fAifF2nZ_1Q',
        description: 'Análisis detallado de los espacios galardonados por el jurado, destacando el uso de la iluminación, la sostenibilidad y la optimización del espacio.'
      },
      {
        id: 'foa-3',
        title: 'Arquitectura Ancestral y Futuro Urbano',
        duration: '5:30',
        youtubeId: 'cZ34GqRyhpc',
        description: 'Un panel interactivo sobre cómo los nuevos desarrollos habitacionales incorporan materiales sustentables y conceptos bioclimáticos.'
      }
    ]
  },
  alba: {
    name: 'Alba Pinturas',
    logo: '/alba_blanco.png',
    accentColor: '#ffcd28', // Amarillo (o arcoíris / acento vivo)
    hoverColor: 'hover:border-[#ffcd28] hover:shadow-[0_0_30px_rgba(255,205,40,0.2)]',
    driveFolderId: '19qF3mUt52-il45RnUOnBLjsz-PYmEaAL',
    driveUrl: 'https://drive.google.com/drive/folders/19qF3mUt52-il45RnUOnBLjsz-PYmEaAL?usp=drive_link',
    description: 'Descubrí el Color del Año 2026 "Lugar de Afecto" y mirá los videos informativos sobre tendencias cromáticas aplicadas en Casa FOA.',
    featuredVideos: [
      {
        id: 'alba-1',
        title: 'Lugar de Afecto - Color del Año 2026 de Alba',
        duration: '2:50',
        youtubeId: 'KeJTUrXYBVs',
        description: 'Presentación del tono que protagoniza los muros de esta edición de Casa FOA. Un color inspirado en la calidez, el cobijo y la calma.'
      },
      {
        id: 'alba-2',
        title: 'Neuroarquitectura y el Impacto de las Emociones en el Color',
        duration: '5:40',
        youtubeId: 'STvFfOWsarw',
        description: 'Especialistas debaten cómo la elección de tonalidades en el hogar puede reducir el estrés cotidiano y mejorar la concentración.'
      },
      {
        id: 'alba-3',
        title: 'Paletas de Tendencias 2026 - Cómo Aplicarlas',
        duration: '4:15',
        youtubeId: '5_dKzT6TsmA',
        description: 'Guía práctica basada en los espacios reales de Casa FOA Pocito para combinar colores neutros cálidos con acentos energizantes.'
      }
    ]
  }
};

function VideoPlayerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialBrand = searchParams.get('brand') || 'mercurio';
  
  const [activeBrand, setActiveBrand] = useState<string>(
    BRANDS[initialBrand] ? initialBrand : 'mercurio'
  );
  const [selectedVideo, setSelectedVideo] = useState<VideoItem>(
    BRANDS[activeBrand]?.featuredVideos[0]
  );

  // Sincronizar tab activa con cambios de query param
  useEffect(() => {
    const brandParam = searchParams.get('brand');
    if (brandParam && BRANDS[brandParam]) {
      setActiveBrand(brandParam);
      setSelectedVideo(BRANDS[brandParam].featuredVideos[0]);
    }
  }, [searchParams]);

  const handleBrandChange = (brandKey: string) => {
    setActiveBrand(brandKey);
    setSelectedVideo(BRANDS[brandKey].featuredVideos[0]);
    // Actualizar la URL de forma limpia
    router.replace(`/videos?brand=${brandKey}`);
  };

  const currentBrand = BRANDS[activeBrand];

  return (
    <div className="min-h-screen bg-mercu-dark text-mercu-cream font-sans selection:bg-mercu-accent selection:text-mercu-dark pb-20">
      
      {/* ── ENCABEZADO Y CONTROL DE NAVEGACIÓN ── */}
      <header className="border-b border-mercu-border/40 bg-black/20 backdrop-blur-md sticky top-0 z-40 px-6 py-4 md:py-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <Link 
            href="/" 
            className="text-xs text-mercu-muted hover:text-mercu-accent inline-flex items-center gap-2 transition-colors self-start md:self-auto group"
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" /> 
            Volver a la Galería Principal
          </Link>
          
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-mercu-accent rounded-full animate-pulse"></span>
            <span className="font-serif text-lg tracking-wider text-mercu-cream">
              Videoteca Interactiva Casa FOA
            </span>
          </div>
        </div>
      </header>

      {/* ── HERO BANNER CINEMATOGRÁFICO ── */}
      <section className="relative overflow-hidden py-16 md:py-24 border-b border-mercu-border/20 bg-gradient-to-b from-mercu-dark-card/50 to-mercu-dark">
        <div className="absolute top-0 right-0 w-96 h-96 bg-mercu-accent/5 rounded-full filter blur-[100px] pointer-events-none"></div>
        <div className="absolute -left-10 bottom-0 w-80 h-80 bg-mercu-accent2/10 rounded-full filter blur-[120px] pointer-events-none"></div>
        
        <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">
          <span className="text-[10px] tracking-[0.25em] font-semibold text-mercu-accent uppercase mb-4 block">
            Registros Audiovisuales Exclusivos
          </span>
          <h1 className="font-serif text-4xl md:text-6xl font-light tracking-tight text-mercu-cream mb-6">
            Salón de Proyecciones
          </h1>
          <p className="text-sm md:text-base text-mercu-muted max-w-xl leading-relaxed">
            Navegá por los recorridos visuales y materiales cinematográficos oficiales. Alterná entre las marcas patrocinadoras para reproducir los videos destacados o explorar la carpeta compartida completa.
          </p>

          {/* Selector de Marcas (Pestañas) */}
          <div className="flex gap-2 md:gap-4 bg-black/45 border border-mercu-border/60 p-1.5 rounded-full mt-12 overflow-x-auto max-w-full scrollbar-none">
            {Object.entries(BRANDS).map(([key, brand]) => (
              <button
                key={key}
                onClick={() => handleBrandChange(key)}
                style={{ 
                  backgroundColor: activeBrand === key ? brand.accentColor : 'transparent',
                  color: activeBrand === key ? '#05070f' : 'inherit'
                }}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
                  activeBrand === key 
                    ? 'font-bold shadow-lg scale-105' 
                    : 'text-mercu-muted hover:text-mercu-cream'
                }`}
              >
                <Film size={12} />
                {brand.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECCIÓN CONTENEDORA PRINCIPAL ── */}
      <main className="max-w-6xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* REPRODUCTOR PRINCIPAL (2 COLUMNAS EN LG) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-mercu-dark-card border border-mercu-border/50 rounded-xl overflow-hidden shadow-2xl relative">
            {/* Reproductor de Video */}
            <div className="w-full aspect-[16/9] bg-black/80 flex items-center justify-center relative">
              {selectedVideo ? (
                <iframe
                  className="w-full h-full border-none"
                  src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0`}
                  title={selectedVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="text-center p-8">
                  <Play size={48} className="text-mercu-accent/40 mx-auto mb-4 animate-pulse" />
                  <p className="text-sm text-mercu-muted uppercase tracking-wider">Seleccioná un video para comenzar</p>
                </div>
              )}
            </div>

            {/* Info del Video Reproduciéndose */}
            <div className="p-6 md:p-8 bg-gradient-to-t from-black/40 to-transparent">
              <div className="flex justify-between items-start gap-4 mb-4">
                <span className="text-[10px] tracking-widest text-mercu-accent font-semibold uppercase px-2 py-1 rounded bg-mercu-accent/10 border border-mercu-accent/20">
                  {currentBrand.name} - En Reproducción
                </span>
                {selectedVideo && (
                  <span className="text-xs text-mercu-muted font-mono">{selectedVideo.duration} min</span>
                )}
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-light text-mercu-cream leading-snug mb-3">
                {selectedVideo?.title}
              </h2>
              <p className="text-sm leading-relaxed text-mercu-cream/80 font-light">
                {selectedVideo?.description}
              </p>
            </div>
          </div>

          {/* VISOR DE CARPETA COMPARTIDA GOOGLE DRIVE (EMBEBIDO EN LUGAR DEL DRIVE EXTERNO) */}
          <div className="bg-mercu-dark-card border border-mercu-border/40 rounded-xl p-6 md:p-8 flex flex-col gap-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-mercu-border/20 pb-4">
              <div>
                <h3 className="font-serif text-xl font-light text-mercu-cream flex items-center gap-2.5">
                  <FolderOpen size={20} className="text-mercu-accent" />
                  Explorador de Registros Originales
                </h3>
                <p className="text-xs text-mercu-muted mt-1 leading-relaxed">
                  Visualizá y descargá el material crudo guardado en la carpeta de Google Drive directamente desde acá.
                </p>
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                <a 
                  href={currentBrand.driveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-neutral-900 border border-mercu-border hover:border-mercu-accent hover:text-mercu-accent text-mercu-cream font-semibold text-xs tracking-widest uppercase px-4 py-3 rounded-lg transition-all flex items-center justify-center gap-2 flex-1 md:flex-initial"
                >
                  <ExternalLink size={12} />
                  Abrir Drive ↗
                </a>
                <a 
                  href={currentBrand.driveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-mercu-accent hover:bg-mercu-cream text-mercu-dark font-semibold text-xs tracking-widest uppercase px-4 py-3 rounded-lg transition-all flex items-center justify-center gap-2 flex-1 md:flex-initial"
                >
                  <Download size={12} />
                  Descargar Todo
                </a>
              </div>
            </div>

            {/* Frame de Google Drive Embebido */}
            <div className="w-full aspect-[16/10] md:aspect-[16/8] bg-black/30 border border-mercu-border/30 rounded-lg overflow-hidden relative group">
              <iframe
                src={`https://drive.google.com/embeddedfolderview?id=${currentBrand.driveFolderId}#grid`}
                className="w-full h-full border-none opacity-85 hover:opacity-100 transition-opacity duration-300"
                allowFullScreen
              ></iframe>
            </div>

            <div className="text-[11px] text-mercu-muted/70 leading-relaxed bg-black/20 p-4 rounded border border-mercu-border/10 flex items-start gap-2.5">
              <span>💡</span>
              <span>
                <strong>Nota de visualización:</strong> Los videos subidos recientemente pueden tardar unos minutos en procesarse por Google Drive para su visualización online. Si no podés reproducir alguno, hacé clic en <strong>"Abrir Drive"</strong> o descargalo a tu dispositivo.
              </span>
            </div>
          </div>
        </div>

        {/* LISTA DE VIDEOS LATERAL (1 COLUMNA EN LG) */}
        <div className="flex flex-col gap-6">
          <div className="bg-mercu-dark-card border border-mercu-border/50 rounded-xl p-6 md:p-8 flex flex-col gap-6">
            <div>
              <span className="text-[9px] tracking-widest font-semibold text-mercu-muted uppercase block mb-1">
                Lista de Reproducción
              </span>
              <h3 className="font-serif text-xl font-light text-mercu-cream">
                Videos Destacados
              </h3>
            </div>

            <div className="flex flex-col gap-3">
              {currentBrand.featuredVideos.map((video) => {
                const isSelected = selectedVideo?.id === video.id;
                
                return (
                  <div
                    key={video.id}
                    onClick={() => setSelectedVideo(video)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 flex gap-4 ${
                      isSelected 
                        ? `bg-mercu-accent/5 border-mercu-accent shadow-[0_0_15px_rgba(235,40,145,0.08)]` 
                        : 'bg-black/20 border-mercu-border/40 hover:border-mercu-muted hover:bg-black/30'
                    }`}
                  >
                    {/* Thumbnail Miniatura del video (YouTube) */}
                    <div className="w-20 h-14 bg-black/60 rounded overflow-hidden flex-shrink-0 relative flex items-center justify-center">
                      <img 
                        src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`} 
                        alt={video.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Play size={12} className={isSelected ? 'text-mercu-accent' : 'text-mercu-cream'} fill="currentColor" />
                      </div>
                    </div>

                    <div className="flex flex-col justify-between flex-grow">
                      <h4 className={`text-xs font-medium leading-normal line-clamp-2 ${
                        isSelected ? 'text-mercu-accent' : 'text-mercu-cream'
                      }`}>
                        {video.title}
                      </h4>
                      <span className="text-[10px] text-mercu-muted font-mono mt-1">{video.duration} min</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* TARJETA INFORMATIVA / DECORATIVA DE LA MARCA */}
          <div className="bg-mercu-dark-card border border-mercu-border/50 rounded-xl p-6 md:p-8 flex flex-col items-center text-center relative overflow-hidden shadow-xl">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-mercu-accent via-mercu-warm to-mercu-green"></div>
            
            <img 
              src={currentBrand.logo} 
              alt={currentBrand.name} 
              className="h-12 w-auto object-contain mb-6 max-w-[80%]" 
            />

            <h4 className="font-serif text-lg text-mercu-cream mb-3">
              {currentBrand.name}
            </h4>

            <p className="text-xs leading-relaxed text-mercu-muted mb-6">
              {currentBrand.description}
            </p>

            <div className="w-full border-t border-mercu-border/30 pt-6 flex justify-between items-center text-[10px] text-mercu-muted font-semibold tracking-wider uppercase">
              <span className="flex items-center gap-1.5">
                <Sparkles size={12} className="text-mercu-accent" />
                Patrocinador Oficial
              </span>
              <span>Casa FOA 2026</span>
            </div>
          </div>
        </div>

      </main>

    </div>
  );
}

export default function VideoPlayerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-mercu-dark text-mercu-cream font-sans flex items-center justify-center text-sm tracking-wider uppercase">
        Cargando salón de proyecciones...
      </div>
    }>
      <VideoPlayerContent />
    </Suspense>
  );
}
