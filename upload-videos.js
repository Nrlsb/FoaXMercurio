const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 1. Cargar las credenciales de .env.local
const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('No se encontró el archivo .env.local en la raíz del proyecto.');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const getEnvVar = (key) => {
  const match = envContent.match(new RegExp(`^${key}=(.*)$`, 'm'));
  return match ? match[1].trim() : null;
};

const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL');
const supabaseServiceKey = getEnvVar('SUPABASE_SERVICE_ROLE_KEY');

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Faltan variables de Supabase en .env.local.');
  process.exit(1);
}

console.log('Proyecto Supabase:', supabaseUrl);
console.log('Inicializando cliente de Supabase...');
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Definición de videos y su ubicación correspondiente en Supabase
const VIDEOS = [
  // Mercurio
  {
    brandFolder: 'Mercurio',
    driveId: '1b7xFBOvgucxJi9i2zEOwHQLmE1yUUoye',
    filename: 'mercurio-1.mp4',
    title: 'Mercurio Pinturerías: Soluciones Integrales para tu Obra'
  },
  {
    brandFolder: 'Mercurio',
    driveId: '1r7tfVfDEKeHsWV1zIzccqbFJSiN_YuVT',
    filename: 'mercurio-2.mp4',
    title: '45 Años de Historia: De La Casa del Pintor a Pinturerías Mercurio'
  },
  // CasaFoa
  {
    brandFolder: 'CasaFoa',
    driveId: '1HjXLpEANA6L2HUN9R7JfjHFhrDtOohDM',
    filename: 'foa-1.mp4',
    title: 'Casa FOA Córdoba 2024: La Obra en Construcción'
  },
  {
    brandFolder: 'CasaFoa',
    driveId: '1I57mR3lyaYK4X3xWdnpOsBrsPcEdvqAr',
    filename: 'foa-2.mp4',
    title: 'Reflexiones sobre el Aniversario de Casa FOA'
  },
  {
    brandFolder: 'CasaFoa',
    driveId: '1PRI4Mh58JYsg98Ay5mGxvfk3CJjcaHJi',
    filename: 'foa-3.mp4',
    title: '40 Años de Historia y Diseño'
  },
  {
    brandFolder: 'CasaFoa',
    driveId: '1Sm6Jj2ZD8IXl_Aid3Sg81pDX_JTGTqZ2',
    filename: 'foa-4.mp4',
    title: 'Detrás de Escena en Pocito'
  },
  // Alba
  {
    brandFolder: 'Alba',
    driveId: '15KkezwkVOLBImZkSGp2YPufqT_iCj4kv',
    filename: 'alba-1.mp4',
    title: 'Alba Efectos Especiales Design'
  },
  {
    brandFolder: 'Alba',
    driveId: '1UPqCvKHv8UzpJyBwg_9L6D8kcMi5KgYH',
    filename: 'alba-2.mp4',
    title: 'Inspiración en Azul Puro'
  },
  {
    brandFolder: 'Alba',
    driveId: '1IjVEgxIAV-SWqg_sjppkmhTWRpEhTkoe',
    filename: 'alba-3.mp4',
    title: 'Historia y Arte (Homenaje)'
  },
  {
    brandFolder: 'Alba',
    driveId: '1GiBbcxqECbMu1MGoxgut8uDdeIMWhgFS',
    filename: 'alba-4.mp4',
    title: 'Albaxpert Látex'
  },
  {
    brandFolder: 'Alba',
    driveId: '11gv9BJKA7pN2imUO9gmcL6fG_MT1gXrx',
    filename: 'alba-5.mp4',
    title: 'Lanzamiento: Nuevo Alba Multisuperficies Epoxi al Agua'
  },
  {
    brandFolder: 'Alba',
    driveId: '1Ys9MOykfQmp-FMoDqBMb6_nef0SwB_fB',
    filename: 'alba-6.mp4',
    title: 'Alba en Casa FOA Córdoba 2024'
  }
];

// Parsea el formulario de la página de advertencia de Drive y obtiene la URL de confirmación completa
function parseDownloadForm(htmlText) {
  // 1. Extraer la URL de acción del formulario
  const actionMatch = htmlText.match(/<form[^>]+action="([^"]+)"/i);
  const actionUrl = actionMatch ? actionMatch[1] : 'https://drive.usercontent.google.com/download';
  
  // 2. Extraer todos los campos input hidden (name y value)
  const fields = {};
  const inputRegex = /<input[^>]+>/gi;
  let match;
  while ((match = inputRegex.exec(htmlText)) !== null) {
    const inputTag = match[0];
    const nameMatch = inputTag.match(/name="([^"]+)"/i);
    const valueMatch = inputTag.match(/value="([^"]+)"/i);
    if (nameMatch && valueMatch) {
      fields[nameMatch[1]] = valueMatch[1];
    }
  }
  
  return { actionUrl, fields };
}

// Función para descargar de Google Drive manejando redirecciones y advertencias de virus de archivos grandes
async function downloadFromDrive(driveId) {
  const url = `https://drive.google.com/uc?export=download&id=${driveId}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Fallo HTTP al conectar con Drive (Status: ${response.status})`);
  }
  
  const contentType = response.headers.get('content-type') || '';
  
  if (contentType.includes('text/html')) {
    const htmlText = await response.text();
    
    // Guardar el HTML para inspección temporal si es necesario
    fs.writeFileSync('debug-drive.html', htmlText);
    
    const { actionUrl, fields } = parseDownloadForm(htmlText);
    
    if (fields.confirm) {
      const queryParams = new URLSearchParams(fields).toString();
      const retryUrl = `${actionUrl}?${queryParams}`;
      
      console.log(`   [Drive] Detectada advertencia de archivo grande. Reintentando descarga en dominio de descargas...`);
      const retryResponse = await fetch(retryUrl);
      
      if (!retryResponse.ok) {
        throw new Error(`Fallo HTTP en el reintento de descarga (Status: ${retryResponse.status})`);
      }
      
      const retryContentType = retryResponse.headers.get('content-type') || '';
      if (retryContentType.includes('text/html')) {
        const retryHtml = await retryResponse.text();
        fs.writeFileSync('debug-drive-retry.html', retryHtml);
        throw new Error('El reintento con los parámetros del formulario también devolvió una página HTML (ver debug-drive-retry.html).');
      }
      
      const arrayBuffer = await retryResponse.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } else {
      throw new Error('Google Drive devolvió una página HTML y no se pudo encontrar un token de confirmación en el formulario.');
    }
  }
  
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function processVideos() {
  console.log(`\nIniciando descarga y subida de ${VIDEOS.length} videos...`);
  
  for (let i = 0; i < VIDEOS.length; i++) {
    const video = VIDEOS[i];
    
    // Verificamos si ya existen en el bucket de Supabase.
    // Esto es muy útil para no volver a descargar los 10 videos que ya subimos correctamente.
    const supabasePath = `${video.brandFolder}/${video.filename}`;
    
    console.log(`\n========================================`);
    console.log(`[${i + 1}/${VIDEOS.length}] Procesando: ${video.title}`);
    console.log(`Carpeta destino en Supabase: videos/${video.brandFolder}`);

    try {
      // 1. Verificar si el archivo ya existe en Supabase Storage
      console.log(`   Verificando si el video ya existe en Supabase...`);
      const { data: listData, error: listError } = await supabase.storage
        .from('videos')
        .list(video.brandFolder, {
          search: video.filename
        });

      if (!listError && listData && listData.some(file => file.name === video.filename)) {
        console.log(`✅ El video ya existe en Supabase Storage. Omitiendo descarga.`);
        console.log(`   URL pública: ${supabaseUrl}/storage/v1/object/public/videos/${supabasePath}`);
        continue;
      }

      // 2. Si no existe, descargar de Drive
      console.log(`1. Descargando de Google Drive (ID: ${video.driveId})...`);
      const buffer = await downloadFromDrive(video.driveId);
      const sizeMB = (buffer.length / (1024 * 1024)).toFixed(2);
      console.log(`   Descarga completada con éxito. Tamaño: ${sizeMB} MB`);

      // 3. Subir a Supabase
      console.log(`2. Subiendo a Supabase Storage en: videos/${supabasePath}...`);
      const { data, error } = await supabase.storage
        .from('videos')
        .upload(supabasePath, buffer, {
          contentType: 'video/mp4',
          upsert: true
        });

      if (error) {
        throw new Error(`Fallo al subir a Supabase: ${error.message}`);
      }

      console.log(`✅ ¡Subido con éxito!`);
      console.log(`   URL pública: ${supabaseUrl}/storage/v1/object/public/videos/${supabasePath}`);

    } catch (err) {
      console.error(`❌ Error en el video ${video.filename}:`, err.message);
    }
  }

  // Eliminar archivos temporales de depuración si existen
  if (fs.existsSync('debug-drive.html')) {
    try { fs.unlinkSync('debug-drive.html'); } catch (e) {}
  }
  if (fs.existsSync('debug-drive-retry.html')) {
    try { fs.unlinkSync('debug-drive-retry.html'); } catch (e) {}
  }

  console.log(`\n========================================`);
  console.log(`Proceso completado.`);
}

processVideos();
