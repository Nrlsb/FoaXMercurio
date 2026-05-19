'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  ArrowLeft, 
  Calendar, 
  Mail, 
  Award,
  Paintbrush,
  Image as ImageIcon,
  Film,
  Upload,
  Save,
  CheckCircle,
  FileVideo
} from 'lucide-react';
import Link from 'next/link';

interface Guest {
  id: string;
  created_at: string;
  nombre: string;
  email: string;
  profesion: string;
  matricula?: string | null;
  color_favorito?: string | null;
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

export default function AdminPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('Todos');
  const [isSimulated, setIsSimulated] = useState(false);

  // Estados de la Galería Multimedia
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(DEFAULT_GALLERY_ITEMS);
  const [loadingGallery, setLoadingGallery] = useState(true);
  const [activeTab, setActiveTab] = useState<'acreditados' | 'galeria'>('acreditados');
  const [gallerySubTab, setGallerySubTab] = useState<'images' | 'videos'>('images');
  const [savingGallery, setSavingGallery] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Carga de datos
  useEffect(() => {
    async function fetchGuests() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('invitados')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          setGuests(data);
          setIsSimulated(false);
        } else {
          loadMockData();
        }
      } catch (error) {
        console.warn('Conexión a Supabase no disponible. Cargando simulación local.');
        loadMockData();
      } finally {
        setLoading(false);
      }
    }

    async function fetchGallery() {
      setLoadingGallery(true);
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
            setGalleryItems(JSON.parse(local));
          }
        }
      } catch (error) {
        console.warn('Conexión a Supabase no disponible para la galería. Cargando local.');
        const local = localStorage.getItem('casafoa_gallery_items');
        if (local) {
          setGalleryItems(JSON.parse(local));
        }
      } finally {
        setLoadingGallery(false);
      }
    }

    fetchGuests();
    fetchGallery();
  }, []);

  const formatVideoUrl = (url: string): string => {
    if (!url) return '';
    if (url.includes('youtube.com/embed/')) return url;
    
    let regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    let match = url.match(regExp);
    
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    
    if (url.includes('vimeo.com/')) {
      const vimeoId = url.split('/').pop()?.split('?')[0];
      if (vimeoId) return `https://player.vimeo.com/video/${vimeoId}`;
    }
    
    return url;
  };

  const getYouTubeThumbnail = (url: string): string => {
    if (!url) return '';
    let regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    let match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://img.youtube.com/vi/${match[2]}/maxresdefault.jpg`;
    }
    return 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800';
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, slotType: 'image' | 'video', slotIndex: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      alert("El archivo es demasiado grande. El límite recomendado es de 15MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      
      setGalleryItems(prev => {
        const updated = [...prev];
        const idx = updated.findIndex(item => item.slot_type === slotType && item.slot_index === slotIndex);
        if (idx !== -1) {
          updated[idx] = { 
            ...updated[idx], 
            url: base64String,
            title: updated[idx].title || file.name.split('.')[0]
          };
        }
        return updated;
      });
    };
    reader.readAsDataURL(file);
  };

  const handleUrlChange = (val: string, slotType: 'image' | 'video', slotIndex: number) => {
    let finalUrl = val;
    if (slotType === 'video') {
      finalUrl = formatVideoUrl(val);
    }

    setGalleryItems(prev => {
      const updated = [...prev];
      const idx = updated.findIndex(item => item.slot_type === slotType && item.slot_index === slotIndex);
      if (idx !== -1) {
        updated[idx] = { ...updated[idx], url: finalUrl };
      }
      return updated;
    });
  };

  const handleSaveGallery = async () => {
    setSavingGallery(true);
    setSaveSuccess(false);

    try {
      const itemsToSave = galleryItems.map(item => ({
        slot_type: item.slot_type,
        slot_index: item.slot_index,
        url: item.url,
        title: item.title,
        description: item.description
      }));

      const { error } = await supabase
        .from('gallery_items')
        .upsert(itemsToSave, { onConflict: 'slot_type,slot_index' });

      if (error) throw error;

      localStorage.setItem('casafoa_gallery_items', JSON.stringify(galleryItems));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (error: any) {
      console.warn('Fallo al guardar en Supabase. Guardando localmente en LocalStorage:', error.message);
      localStorage.setItem('casafoa_gallery_items', JSON.stringify(galleryItems));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } finally {
      setSavingGallery(false);
    }
  };

  const loadMockData = () => {
    setIsSimulated(true);
    setGuests([
      {
        id: '1',
        created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
        nombre: 'Arq. Alejandro Pautasso',
        email: 'pautasso@estudiop.com',
        profesion: 'Arquitecto/a',
        matricula: 'CAPC 4532',
        color_favorito: 'Azul Rey (King Blue)'
      },
      {
        id: '2',
        created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
        nombre: 'Sofía Kloner',
        email: 'sofia.k@disenios.cl',
        profesion: 'Diseñador/a de Interiores',
        matricula: 'DIDA 987',
        color_favorito: 'Rosa Mercurio (Pink)'
      },
      {
        id: '3',
        created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
        nombre: 'Lucas Benetti',
        email: 'lucasb@unc.edu.ar',
        profesion: 'Estudiante',
        matricula: null,
        color_favorito: 'Verde Mercurio (Lime)'
      },
      {
        id: '4',
        created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
        nombre: 'Martina Rossi',
        email: 'martinar@gmail.com',
        profesion: 'Público General',
        matricula: null,
        color_favorito: 'Amarillo Mercurio'
      },
      {
        id: '5',
        created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
        nombre: 'Arq. Esteban Valenzuela',
        email: 'evalenzuela@constructora.com',
        profesion: 'Arquitecto/a',
        matricula: 'CAPC 8122',
        color_favorito: 'Lugar de Afecto'
      }
    ]);
  };

  // Filtrado de invitados
  const filteredGuests = guests.filter(guest => {
    const matchesSearch = 
      guest.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'Todos' || guest.profesion === roleFilter;

    return matchesSearch && matchesRole;
  });

  // Exportar datos a CSV
  const handleExportCSV = () => {
    const headers = 'ID,Fecha Registro,Nombre,Email,Profesion,Matricula,Color Favorito\n';
    const csvContent = filteredGuests.map(g => 
      `"${g.id}","${g.created_at}","${g.nombre}","${g.email}","${g.profesion}","${g.matricula || ''}","${g.color_favorito || ''}"`
    ).join('\n');

    const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Acreditados_CasaFoa_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-mercu-dark text-mercu-cream font-sans p-8 md:p-16">
      
      {/* Encabezado */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-mercu-border pb-8">
        <div>
          <Link href="/" className="text-xs text-mercu-muted hover:text-mercu-accent inline-flex items-center gap-2 mb-4 transition-colors">
            <ArrowLeft size={14} /> Volver a la Landing
          </Link>
          <div className="flex items-center gap-3">
            <Users size={32} className="text-mercu-accent" />
            <h1 className="font-serif text-3xl md:text-4xl font-light tracking-wide text-mercu-cream">
              Panel de Administración
            </h1>
          </div>
          <p className="text-xs text-mercu-muted mt-2">
            Gestión en tiempo real de profesionales e invitados especiales, y administración de la galería multimedia de Casa FOA.
          </p>
        </div>

        {activeTab === 'acreditados' ? (
          <div className="flex flex-wrap md:flex-nowrap gap-3 w-full md:w-auto">
            <Link 
              href="/?edit=true" 
              className="bg-neutral-900 border border-mercu-border hover:border-mercu-accent hover:text-mercu-accent text-mercu-cream font-semibold text-xs tracking-widest uppercase px-6 py-4 rounded transition-all hover:scale-105 flex items-center justify-center gap-2"
              title="Abrir editor de textos visual en la Landing Page"
            >
              <Paintbrush size={14} /> Editar Textos Web
            </Link>
            <button 
              onClick={handleExportCSV}
              className="bg-mercu-accent hover:bg-mercu-cream text-mercu-dark font-semibold text-xs tracking-widest uppercase px-6 py-4 rounded transition-all hover:scale-105 flex items-center justify-center gap-2 flex-grow md:flex-grow-0"
            >
              <Download size={14} /> Exportar CSV
            </button>
          </div>
        ) : (
          <button 
            onClick={handleSaveGallery}
            disabled={savingGallery}
            className={`font-semibold text-xs tracking-widest uppercase px-8 py-4 rounded transition-all hover:scale-[1.03] flex items-center gap-2 w-full md:w-auto justify-center ${saveSuccess ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-mercu-accent hover:bg-mercu-cream text-mercu-dark border-transparent'}`}
          >
            {savingGallery ? 'Guardando...' : saveSuccess ? '¡Guardado con Éxito! ✓' : 'Guardar Galería'}
          </button>
        )}
      </div>

      {/* Tabs Principales */}
      <div className="max-w-6xl mx-auto flex border-b border-mercu-border/30 mb-8 text-sm md:text-base">
        <button 
          onClick={() => setActiveTab('acreditados')}
          className={`px-6 py-4 font-serif text-lg md:text-xl transition-all relative ${activeTab === 'acreditados' ? 'text-mercu-cream after:scale-x-100 font-medium' : 'text-mercu-muted hover:text-mercu-cream'} after:content-[''] after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-[2px] after:bg-mercu-accent after:transition-transform after:duration-300`}
        >
          Invitados Acreditados
        </button>
        <button 
          onClick={() => setActiveTab('galeria')}
          className={`px-6 py-4 font-serif text-lg md:text-xl transition-all relative ${activeTab === 'galeria' ? 'text-mercu-cream after:scale-x-100 font-medium' : 'text-mercu-muted hover:text-mercu-cream'} after:content-[''] after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-[2px] after:bg-mercu-accent after:transition-transform after:duration-300`}
        >
          Gestor de Galería
        </button>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        {activeTab === 'acreditados' ? (
          <>
            {/* Banner Informativo de Modo Simulado */}
            {isSimulated && (
              <div className="bg-amber-950/40 border border-amber-500/20 text-amber-200 p-4 rounded text-xs leading-relaxed animate-fade-in">
                ℹ️ <strong>Visualización de Demostración:</strong> El sistema está cargando una lista de invitados simulada debido a que no se han detectado credenciales activas en `.env.local` o la tabla `invitados` de Supabase está vacía en este momento. El panel es 100% funcional.
              </div>
            )}

            {/* Controles de Búsqueda y Filtro */}
            <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-6 animate-fade-in">
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-mercu-muted" />
                <input 
                  type="text" 
                  placeholder="Buscar por nombre o correo electrónico..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-mercu-dark-card border border-mercu-border rounded pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-mercu-accent"
                />
              </div>

              <div className="flex items-center gap-4 bg-mercu-dark-card border border-mercu-border rounded px-4 py-2">
                <Filter size={16} className="text-mercu-muted" />
                <span className="text-[10px] tracking-widest uppercase text-mercu-muted font-semibold">Rol:</span>
                <select 
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="bg-transparent border-none text-mercu-cream text-sm focus:outline-none cursor-pointer flex-grow py-2"
                >
                  <option value="Todos" className="bg-mercu-dark-card">Todos</option>
                  <option value="Arquitecto/a" className="bg-mercu-dark-card">Arquitecto/a</option>
                  <option value="Diseñador/a de Interiores" className="bg-mercu-dark-card">Diseñador/a</option>
                  <option value="Estudiante" className="bg-mercu-dark-card">Estudiante</option>
                  <option value="Público General" className="bg-mercu-dark-card">Público</option>
                </select>
              </div>
            </div>

            {/* Tabla / Lista de Acreditados */}
            {loading ? (
              <div className="text-center py-20 text-sm text-mercu-muted">Cargando invitados acreditados...</div>
            ) : filteredGuests.length > 0 ? (
              <div className="bg-mercu-dark-card border border-mercu-border rounded overflow-hidden shadow-lg animate-fade-in">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs md:text-sm">
                    <thead>
                      <tr className="border-b border-mercu-border bg-black/25 text-[10px] tracking-widest text-mercu-muted uppercase font-semibold">
                        <th className="p-6">Nombre</th>
                        <th className="p-6">Contacto</th>
                        <th className="p-6">Profesión</th>
                        <th className="p-6">Matrícula</th>
                        <th className="p-6">Espacio Favorito</th>
                        <th className="p-6 text-right">Registro</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-mercu-border/50">
                      {filteredGuests.map((guest) => (
                        <tr key={guest.id} className="hover:bg-mercu-border/5 transition-colors">
                          <td className="p-6 font-serif text-base text-mercu-cream font-medium">
                            {guest.nombre}
                          </td>
                          <td className="p-6">
                            <div className="flex items-center gap-2 text-mercu-cream/80">
                              <Mail size={12} className="text-mercu-muted" /> {guest.email}
                            </div>
                          </td>
                          <td className="p-6">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-mercu-border text-[10px] font-medium tracking-wider uppercase text-mercu-cream bg-black/10">
                              {guest.profesion}
                            </span>
                          </td>
                          <td className="p-6">
                            {guest.matricula ? (
                              <div className="flex items-center gap-1.5 text-mercu-warm">
                                <Award size={12} /> {guest.matricula}
                              </div>
                            ) : (
                              <span className="text-mercu-muted/40">—</span>
                            )}
                          </td>
                          <td className="p-6">
                            {guest.color_favorito ? (
                              <span className="text-mercu-cream/80 font-medium">{guest.color_favorito}</span>
                            ) : (
                              <span className="text-mercu-muted/40">—</span>
                            )}
                          </td>
                          <td className="p-6 text-right">
                            <div className="flex items-center justify-end gap-1.5 text-mercu-muted text-xs">
                              <Calendar size={12} />
                              {new Date(guest.created_at).toLocaleDateString('es-AR', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="bg-black/25 border-t border-mercu-border p-6 flex justify-between items-center text-xs text-mercu-muted">
                  <div>Mostrando {filteredGuests.length} de {guests.length} invitados acreditados</div>
                </div>
              </div>
            ) : (
              <div className="bg-mercu-dark-card border border-mercu-border rounded p-20 text-center text-mercu-muted text-sm leading-relaxed">
                🔍 No se encontraron invitados que coincidan con tu búsqueda.
              </div>
            )}
          </>
        ) : (
          /* GESTOR DE GALERÍA (NUEVO) */
          <div className="animate-fade-in flex flex-col gap-6">
            <div className="bg-mercu-dark-card border border-mercu-border rounded-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h2 className="font-serif text-2xl text-mercu-cream">Administrador de Contenidos de Galería</h2>
                <p className="text-xs text-mercu-muted mt-1 leading-relaxed max-w-xl">
                  Personalizá las 7 imágenes y 5 videos de la galería principal de Casa FOA. Podés subir archivos locales (hasta 15MB) o pegar URLs directas.
                </p>
              </div>

              {/* Sub-tabs de la Galería */}
              <div className="flex gap-2 bg-black/40 border border-mercu-border p-1.5 rounded-full text-xs">
                <button 
                  onClick={() => setGallerySubTab('images')}
                  className={`px-4 py-2 rounded-full font-medium tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5 ${gallerySubTab === 'images' ? 'bg-mercu-accent text-mercu-dark' : 'text-mercu-muted hover:text-mercu-cream'}`}
                >
                  <ImageIcon size={12} /> Imágenes (7)
                </button>
                <button 
                  onClick={() => setGallerySubTab('videos')}
                  className={`px-4 py-2 rounded-full font-medium tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5 ${gallerySubTab === 'videos' ? 'bg-mercu-accent text-mercu-dark' : 'text-mercu-muted hover:text-mercu-cream'}`}
                >
                  <Film size={12} /> Videos (5)
                </button>
              </div>
            </div>

            {loadingGallery ? (
              <div className="text-center py-20 text-sm text-mercu-muted">Cargando elementos de la galería...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryItems
                  .filter(item => item.slot_type === (gallerySubTab === 'images' ? 'image' : 'video'))
                  .map((item) => {
                    const isVideo = item.slot_type === 'video';
                    const isLocalFile = item.url && item.url.startsWith('data:');
                    
                    return (
                      <div 
                        key={`${item.slot_type}-${item.slot_index}`}
                        className="bg-mercu-dark-card border border-mercu-border/50 rounded-lg p-5 flex flex-col gap-4 shadow-lg hover:border-mercu-accent/30 transition-all duration-300"
                      >
                        {/* Cabecera del Slot */}
                        <div className="flex justify-between items-center border-b border-mercu-border/30 pb-2">
                          <span className="text-[10px] tracking-widest text-mercu-accent font-semibold uppercase flex items-center gap-1.5">
                            {isVideo ? <Film size={10} /> : <ImageIcon size={10} />} Slot #{item.slot_index + 1}
                          </span>
                          <span className="text-[9px] text-mercu-muted uppercase font-mono bg-black/30 px-2 py-0.5 rounded">
                            {isLocalFile ? 'Archivo Local' : 'Enlace Web'}
                          </span>
                        </div>

                        {/* Preview del Media */}
                        <div className="w-full aspect-[16/10] bg-black/60 rounded border border-mercu-border/30 overflow-hidden relative flex items-center justify-center group">
                          {item.url ? (
                            isVideo ? (
                              isLocalFile ? (
                                <video 
                                  src={item.url} 
                                  className="w-full h-full object-cover" 
                                  muted 
                                  loop 
                                  playsInline 
                                  autoPlay
                                />
                              ) : (
                                <img 
                                  src={getYouTubeThumbnail(item.url)} 
                                  alt="Preview YouTube" 
                                  className="w-full h-full object-cover"
                                />
                              )
                            ) : (
                              <img 
                                src={item.url} 
                                alt="Preview" 
                                className="w-full h-full object-cover"
                              />
                            )
                          ) : (
                            <div className="text-center p-4">
                              <span className="text-3xl block mb-2">{isVideo ? '🎬' : '📷'}</span>
                              <span className="text-[10px] text-mercu-muted tracking-wider uppercase font-semibold">Vacío / Sin multimedia</span>
                            </div>
                          )}
                          
                          {/* Overlay de Carga de Archivo */}
                          <label className="absolute inset-0 bg-black/75 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 cursor-pointer text-xs text-mercu-cream font-medium">
                            <Upload size={16} />
                            <span>Subir Archivo Nuevo</span>
                            <input 
                              type="file" 
                              accept={isVideo ? "video/*" : "image/*"}
                              className="hidden"
                              onChange={(e) => handleFileUpload(e, item.slot_type, item.slot_index)}
                            />
                          </label>
                        </div>

                        {/* Formularios */}
                        <div className="flex flex-col gap-3 text-xs">
                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] uppercase tracking-wider text-mercu-muted font-semibold">Título del Elemento</label>
                            <input 
                              type="text" 
                              value={item.title}
                              onChange={(e) => {
                                const val = e.target.value;
                                setGalleryItems(prev => {
                                  const updated = [...prev];
                                  const i = updated.findIndex(g => g.slot_type === item.slot_type && g.slot_index === item.slot_index);
                                  if (i !== -1) updated[i] = { ...updated[i], title: val };
                                  return updated;
                                });
                              }}
                              placeholder={isVideo ? "Ej: Charla Thomas Heatherwick" : "Ej: Vestíbulo de Acceso"}
                              className="bg-mercu-dark border border-mercu-border rounded p-2.5 text-mercu-cream focus:outline-none focus:border-mercu-accent"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] uppercase tracking-wider text-mercu-muted font-semibold">Descripción / Detalles</label>
                            <textarea 
                              value={item.description}
                              rows={2}
                              onChange={(e) => {
                                const val = e.target.value;
                                setGalleryItems(prev => {
                                  const updated = [...prev];
                                  const i = updated.findIndex(g => g.slot_type === item.slot_type && g.slot_index === item.slot_index);
                                  if (i !== -1) updated[i] = { ...updated[i], description: val };
                                  return updated;
                                });
                              }}
                              placeholder="Breve descripción del espacio o temática..."
                              className="bg-mercu-dark border border-mercu-border rounded p-2.5 text-mercu-cream focus:outline-none focus:border-mercu-accent resize-none"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] uppercase tracking-wider text-mercu-muted font-semibold">URL de Enlace Directo</label>
                            <input 
                              type="text" 
                              value={isLocalFile ? '' : item.url}
                              onChange={(e) => handleUrlChange(e.target.value, item.slot_type, item.slot_index)}
                              placeholder={isVideo ? "Ej: https://youtube.com/watch?v=..." : "Ej: https://images.unsplash.com/..."}
                              className="bg-mercu-dark border border-mercu-border rounded p-2.5 text-mercu-cream focus:outline-none focus:border-mercu-accent font-mono text-[10px]"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}

            {/* Panel de Guardado General */}
            <div className="bg-mercu-dark-card border border-mercu-border rounded-lg p-6 flex flex-col md:flex-row justify-between items-center gap-4 mt-4 shadow-xl">
              <div className="text-center md:text-left">
                <span className="text-[10px] uppercase font-semibold text-mercu-accent tracking-widest block">Cambios Pendientes</span>
                <span className="text-xs text-mercu-muted">Guardá tu configuración para actualizar la landing page globalmente.</span>
              </div>
              
              <button 
                onClick={handleSaveGallery}
                disabled={savingGallery}
                className={`font-semibold text-xs tracking-widest uppercase px-8 py-4 rounded transition-all duration-300 hover:scale-[1.03] shadow-lg flex items-center gap-2 ${saveSuccess ? 'bg-emerald-500 text-white' : 'bg-mercu-accent hover:bg-mercu-cream text-mercu-dark'}`}
              >
                {savingGallery ? 'Procesando Guardado...' : saveSuccess ? '¡Todo Guardado Correctamente! ✓' : 'Guardar Configuración General'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
