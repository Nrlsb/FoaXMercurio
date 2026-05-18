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
  Paintbrush
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

export default function AdminPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('Todos');
  const [isSimulated, setIsSimulated] = useState(false);

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
          // Activar datos mock/simulados si no hay registros o si es un proyecto Supabase nuevo vacío
          loadMockData();
        }
      } catch (error) {
        console.warn('Conexión a Supabase no disponible. Cargando simulación local.');
        loadMockData();
      } finally {
        setLoading(false);
      }
    }

    fetchGuests();
  }, []);

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
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-mercu-border pb-8">
        <div>
          <Link href="/" className="text-xs text-mercu-muted hover:text-mercu-accent inline-flex items-center gap-2 mb-4 transition-colors">
            <ArrowLeft size={14} /> Volver a la Landing
          </Link>
          <div className="flex items-center gap-3">
            <Users size={32} className="text-mercu-accent" />
            <h1 className="font-serif text-3xl md:text-4xl font-light tracking-wide text-mercu-cream">
              Panel de Acreditados
            </h1>
          </div>
          <p className="text-xs text-mercu-muted mt-2">
            Gestión en tiempo real de profesionales e invitados especiales de Pinturerías Mercurio en Casa FOA.
          </p>
        </div>

        <button 
          onClick={handleExportCSV}
          className="bg-mercu-accent hover:bg-mercu-cream text-mercu-dark font-semibold text-xs tracking-widest uppercase px-6 py-4 rounded transition-all hover:scale-105 flex items-center gap-2"
        >
          <Download size={14} /> Exportar CSV
        </button>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        
        {/* Banner Informativo de Modo Simulado */}
        {isSimulated && (
          <div className="bg-amber-950/40 border border-amber-500/20 text-amber-200 p-4 rounded text-xs leading-relaxed">
            ℹ️ <strong>Visualización de Demostración:</strong> El sistema está cargando una lista de invitados simulada debido a que no se han detectado credenciales activas en `.env.local` o la tabla `invitados` de Supabase está vacía en este momento. El panel es 100% funcional.
          </div>
        )}

        {/* Controles de Búsqueda y Filtro */}
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-6">
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
          <div className="bg-mercu-dark-card border border-mercu-border rounded overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-mercu-border bg-black/25 text-[10px] tracking-widest text-mercu-muted uppercase font-semibold">
                    <th className="p-6">Nombre</th>
                    <th className="p-6">Contacto</th>
                    <th className="p-6">Profesión</th>
                    <th className="p-6">Matrícula</th>
                    <th className="p-6">Color Favorito</th>
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
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: 
                              guest.color_favorito === 'Azul Rey (King Blue)' ? '#1e3773' :
                              guest.color_favorito === 'Amarillo Mercurio' ? '#ffcd28' :
                              guest.color_favorito === 'Rosa Mercurio (Pink)' ? '#eb2891' :
                              guest.color_favorito === 'Verde Mercurio (Lime)' ? '#aacd46' :
                              guest.color_favorito === 'Lugar de Afecto' ? '#dfc3b5' : '#7d859d'
                            }}></span>
                            <span className="text-mercu-cream/80 font-medium">{guest.color_favorito}</span>
                          </div>
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
      </div>
    </div>
  );
}
