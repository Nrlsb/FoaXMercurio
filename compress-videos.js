const fs = require('fs');
const path = require('path');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

const videosToCompress = [
  {
    input: path.join(__dirname, 'fix-video-institucional.mp4'),
    output: path.join(__dirname, 'mercurio-1-compressed.mp4'),
    label: 'Video Institucional (mercurio-1)',
    crf: 24,
    scale: 'scale=trunc(iw/2)*2:trunc(ih/2)*2'
  },
  {
    input: path.join(__dirname, 'video induccion.mp4'),
    output: path.join(__dirname, 'mercurio-2-compressed.mp4'),
    label: 'Video Inducción / Historia (mercurio-2)',
    crf: 28, // Mayor factor de compresión (menos peso)
    scale: 'scale=-2:720' // Reducimos resolución a 720p
  }
];

async function compress(video) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(video.input)) {
      console.error(`❌ Archivo de entrada no encontrado: ${video.input}`);
      return resolve(); // Continuar con el siguiente si no existe
    }

    console.log(`\n--------------------------------------------------`);
    console.log(`🎬 Iniciando compresión de: ${video.label}`);
    console.log(`   Entrada: ${video.input}`);
    console.log(`   Salida: ${video.output}`);

    ffmpeg(video.input)
      .outputOptions([
        '-vcodec libx264',
        `-crf ${video.crf}`,
        '-preset fast',     // Velocidad de compresión
        '-acodec aac',
        '-b:a 128k',
        `-vf ${video.scale}`
      ])
      .on('start', (commandLine) => {
        // console.log('Comando de ffmpeg iniciado...');
      })
      .on('progress', (progress) => {
        if (progress.percent) {
          process.stdout.write(`   Progreso: ${progress.percent.toFixed(2)}%\r`);
        }
      })
      .on('end', () => {
        console.log(`\n✅ Compresión terminada para: ${video.label}`);
        const sizeInput = (fs.statSync(video.input).size / (1024 * 1024)).toFixed(2);
        const sizeOutput = (fs.statSync(video.output).size / (1024 * 1024)).toFixed(2);
        console.log(`   Tamaño original: ${sizeInput} MB`);
        console.log(`   Tamaño comprimido: ${sizeOutput} MB`);
        resolve();
      })
      .on('error', (err) => {
        console.error(`\n❌ Error al comprimir ${video.label}:`, err.message);
        reject(err);
      })
      .save(video.output);
  });
}

async function run() {
  for (const video of videosToCompress) {
    try {
      await compress(video);
    } catch (e) {
      console.error('Error en la compresión:', e);
    }
  }
  console.log('\n==================================================');
  console.log('🎉 ¡Proceso de compresión local finalizado!');
}

run();
