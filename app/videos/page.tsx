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
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

// Estructura de videos con Drive ID y Miniaturas de Unsplash
interface VideoItem {
  id: string;
  title: string;
  duration: string;
  driveId: string;
  description: string;
  thumbnail: string;
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
    description: 'Explorá los registros de diseño, entrevistas y recorridos exclusivos en los espacios auspiciados por Pinturerías Mercurio en Casa FOA Córdoba.',
    featuredVideos: [
      {
        id: 'mercurio-1',
        title: 'Registro de Espacio Creativo Mercurio - Video 1',
        duration: '1:45',
        driveId: '1b7xFBOvgucxJi9i2zEOwHQLmE1yUUoye',
        description: 'Recorrido visual interactivo que muestra las terminaciones y el juego de colores aplicados en el espacio de teletrabajo de Casa FOA.',
        thumbnail: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=400'
      },
      {
        id: 'mercurio-2',
        title: 'Detalle de Texturas y Colores - Video 2',
        duration: '2:10',
        driveId: '1r7tfVfDEKeHsWV1zIzccqbFJSiN_YuVT',
        description: 'Acercamientos detallados sobre la calidad de la pintura y la interacción de la luz natural sobre los muros de la exposición.',
        thumbnail: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=400'
      }
    ]
  },
  'casa-foa': {
    name: 'Casa FOA',
    logo: '/logo_casafoa.svg',
    accentColor: '#eb2891', // Rosa
    hoverColor: 'hover:border-[#eb2891] hover:shadow-[0_0_30px_rgba(235,40,145,0.2)]',
    driveFolderId: '1jV2jPWKyd8xoTQmrv7PW5lyeEuzBMKWH',
    driveUrl: 'https://drive.google.com/drive/folders/1jV2jPWKyd8xoTQmrv7PW5lyeEuzBMKWH?usp=sharing',
    description: 'Accedé a los videos oficiales, testimonios y el registro cinematográfico de la Edición Pocito Social Life en Córdoba.',
    featuredVideos: [
      {
        id: 'foa-1',
        title: 'Casa FOA Córdoba - Recorrido General 1',
        duration: '2:30',
        driveId: '1HjXLpEANA6L2HUN9R7JfjHFhrDtOohDM',
        description: 'Imágenes generales y tomas panorámicas de la exposición donde se aprecia el valor arquitectónico recuperado de Pocito.',
        thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=400'
      },
      {
        id: 'foa-2',
        title: 'Atmósfera y Diseño de Luces - Recorrido 2',
        duration: '1:50',
        driveId: '1I57mR3lyaYK4X3xWdnpOsBrsPcEdvqAr',
        description: 'Enfoque en las instalaciones de iluminación y la propuesta conceptual de habitabilidad mínima del recorrido.',
        thumbnail: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=400'
      },
      {
        id: 'foa-3',
        title: 'Espacios Destacados e Interiorismo - Recorrido 3',
        duration: '3:05',
        driveId: '1PRI4Mh58JYsg98Ay5mGxvfk3CJjcaHJi',
        description: 'Detalle de los acabados de madera, piedras sinterizadas y mobiliario que visten las salas de estar principales.',
        thumbnail: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=400'
      },
      {
        id: 'foa-4',
        title: 'Experiencia Sensorial y Cierre - Recorrido 4',
        duration: '2:15',
        driveId: '1Sm6Jj2ZD8IXl_Aid3Sg81pDX_JTGTqZ2',
        description: 'El recorrido final por los pasillos interactivos, sintetizando el espíritu de la arquitectura cordobesa contemporánea.',
        thumbnail: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=400'
      }
    ]
  },
  alba: {
    name: 'Alba Pinturas',
    logo: '/alba_blanco.png',
    accentColor: '#ffcd28', // Amarillo
    hoverColor: 'hover:border-[#ffcd28] hover:shadow-[0_0_30px_rgba(255,205,40,0.2)]',
    driveFolderId: '19qF3mUt52-il45RnUOnBLjsz-PYmEaAL',
    driveUrl: 'https://drive.google.com/drive/folders/19qF3mUt52-il45RnUOnBLjsz-PYmEaAL?usp=drive_link',
    description: 'Descubrí el Color del Año "Lugar de Afecto" y las paletas cromáticas aplicadas en los muros de Casa FOA.',
    featuredVideos: [
      {
        id: 'alba-1',
        title: 'Tendencias de Color y Calidez - Alba 1',
        duration: '1:40',
        driveId: '15KkezwkVOLBImZkSGp2YPufqT_iCj4kv',
        description: 'Exploración del uso de tonos neutros y cálidos para inducir serenidad y generar un "Lugar de Afecto" en el hogar.',
        thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400'
      },
      {
        id: 'alba-2',
        title: 'Registro de Aplicación en Muros - Alba 2',
        duration: '2:20',
        driveId: '1UPqCvKHv8UzpJyBwg_9L6D8kcMi5KgYH',
        description: 'El proceso práctico de recubrimiento y textura sobre muros interactivos con las gamas oficiales Alba.',
        thumbnail: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=400'
      },
      {
        id: 'alba-3',
        title: 'Combinaciones Cromáticas de Vanguardia - Alba 3',
        duration: '2:05',
        driveId: '1IjVEgxIAV-SWqg_sjppkmhTWRpEhTkoe',
        description: 'Cómo conviven los acentos de color con las bases de tonos tierras y grises en los pasillos principales de Pocito.',
        thumbnail: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=400'
      },
      {
        id: 'alba-4',
        title: 'Diseño del Espacio de Descanso - Alba 4',
        duration: '1:55',
        driveId: '1GiBbcxqECbMu1MGoxgut8uDdeIMWhgFS',
        description: 'Tomas detalladas del dormitorio biofílico que destaca la combinación de maderas naturales con verdes Mercurio.',
        thumbnail: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=400'
      },
      {
        id: 'alba-5',
        title: 'Iluminación y Percepción de Color - Alba 5',
        duration: '2:40',
        driveId: '11gv9BJKA7pN2imUO9gmcL6fG_MT1gXrx',
        description: 'Demostración visual de cómo la temperatura de la luz altera el acabado final de la pintura sobre muros de tendencia.',
        thumbnail: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=400'
      },
      {
        id: 'alba-6',
        title: 'Presentación de Productos Premium - Alba 6',
        duration: '2:15',
        driveId: '1Ys9MOykfQmp-FMoDqBMb6_nef0SwB_fB',
        description: 'Explicación técnica del comportamiento de la pintura y su acabado mate sedoso en condiciones de tránsito elevado.',
        thumbnail: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=400'
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
            className="text-xs text-mercu-muted hover:text-mercu-accent inline-flex items-center gap-2 transition-colors self-start md:self-auto group font-medium"
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" /> 
            Volver a la Landing Principal
          </Link>
          
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-mercu-accent rounded-full animate-pulse"></span>
            <span className="font-serif text-lg tracking-wider text-mercu-cream">
              Videoteca Interactiva Casa FOA
            </span>
          </div>
        </div>
      </header>

      {/* ── HERO BANNER ── */}
      <section className="relative overflow-hidden py-16 md:py-24 border-b border-mercu-border/20 bg-gradient-to-b from-mercu-dark-card/50 to-mercu-dark">
        <div className="absolute top-0 right-0 w-96 h-96 bg-mercu-accent/5 rounded-full filter blur-[100px] pointer-events-none"></div>
        <div className="absolute -left-10 bottom-0 w-80 h-80 bg-mercu-accent2/10 rounded-full filter blur-[120px] pointer-events-none"></div>
        
        <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">
          <span className="text-[10px] tracking-[0.25em] font-semibold text-mercu-accent uppercase mb-4 block">
            Registros Audiovisuales Oficiales
          </span>
          <h1 className="font-serif text-4xl md:text-6xl font-light tracking-tight text-mercu-cream mb-6">
            Salón de Proyecciones
          </h1>
          <p className="text-sm md:text-base text-mercu-muted max-w-xl leading-relaxed">
            Mirá los videos registrados directamente de los espacios en exposición. Alterná entre las marcas patrocinadoras para reproducir los videos oficiales en alta definición o explorar la carpeta completa.
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
        
        {/* REPRODUCTOR PRINCIPAL */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-mercu-dark-card border border-mercu-border/50 rounded-xl overflow-hidden shadow-2xl relative">
            {/* Reproductor de Google Drive Embebido */}
            <div className="w-full aspect-[16/9] bg-black/80 flex items-center justify-center relative">
              {selectedVideo ? (
                <iframe
                  className="w-full h-full border-none"
                  src={`https://drive.google.com/file/d/${selectedVideo.driveId}/preview`}
                  title={selectedVideo.title}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="text-center p-8">
                  <Play size={48} className="text-mercu-accent/40 mx-auto mb-4 animate-pulse" />
                  <p className="text-sm text-mercu-muted uppercase tracking-wider">Seleccioná un video para comenzar</p>
                </div>
              )}
            </div>

            {/* Info del Video */}
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

          {/* VISOR DE CARPETA COMPARTIDA */}
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

            {/* Frame de Google Drive */}
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
                <strong>Nota de visualización:</strong> Los videos en Google Drive pueden requerir permisos de visualización compartida pública. Si algún archivo solicita inicio de sesión, hacé clic en <strong>"Abrir Drive"</strong> para verlo directamente en una pestaña de Google o descargalo en tu dispositivo.
              </span>
            </div>
          </div>
        </div>

        {/* LISTA DE VIDEOS LATERAL */}
        <div className="flex flex-col gap-6">
          <div className="bg-mercu-dark-card border border-mercu-border/50 rounded-xl p-6 md:p-8 flex flex-col gap-6">
            <div>
              <span className="text-[9px] tracking-widest font-semibold text-mercu-muted uppercase block mb-1">
                Lista de Reproducción
              </span>
              <h3 className="font-serif text-xl font-light text-mercu-cream">
                Videos Registrados
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
                    {/* Thumbnail Miniatura del video (Unsplash según Marca) */}
                    <div className="w-20 h-14 bg-black/60 rounded overflow-hidden flex-shrink-0 relative flex items-center justify-center">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title} 
                        className="w-full h-full object-cover opacity-80"
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

          {/* TARJETA INFORMATIVA */}
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
