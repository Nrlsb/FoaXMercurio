document.addEventListener('DOMContentLoaded', () => {
  
  /* ── 1. REVELACIÓN AL HACER SCROLL (INTERSECTION OBSERVER) ── */
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Solo se anima una vez
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  /* ── 2. NAVEGACIÓN ACTIVA EN SCROLL ── */
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('nav a');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });

    // Control del botón de volver arriba
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
      if (scrollY > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  });

  /* ── 3. VISUALIZADOR INTERACTIVO DE COLOR (CASA FOA × MERCURIO) ── */
  const colorCards = document.querySelectorAll('.color-card');
  const roomWall = document.getElementById('roomWall');
  const visualizerColorName = document.getElementById('visualizerColorName');
  const visualizerColorHex = document.getElementById('visualizerColorHex');
  const visualizerColorDesc = document.getElementById('visualizerColorDesc');

  colorCards.forEach(card => {
    card.addEventListener('click', () => {
      // Remover activo de las demás tarjetas
      colorCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      // Obtener los datos del color seleccionado
      const hex = card.getAttribute('data-hex');
      const name = card.getAttribute('data-name');
      const desc = card.getAttribute('data-desc');

      // Cambiar el color de la pared en el SVG con transición suave
      if (roomWall) {
        roomWall.style.fill = hex;
      }

      // Actualizar los textos del visualizador
      if (visualizerColorName) visualizerColorName.textContent = name;
      if (visualizerColorHex) visualizerColorHex.textContent = hex;
      if (visualizerColorDesc) visualizerColorDesc.textContent = desc;

      // Hacer destello sutil de brillo en el visualizador
      const visualizerView = document.querySelector('.visualizer-view');
      if (visualizerView) {
        visualizerView.style.filter = 'brightness(1.1)';
        setTimeout(() => {
          visualizerView.style.filter = 'none';
        }, 150);
      }
    });
  });

  /* ── 4. REPRODUCTOR INTERACTIVO Y SÍNTESIS DE AUDIO (WEB AUDIO API) ── */
  // Datos de las pistas de la playlist
  const tracks = [
    {
      id: 'track1',
      title: 'Focus & Flow',
      artist: 'Mercurio Deep Ambient',
      duration: '3:45',
      emoji: '🎧',
      type: 'synth'
    },
    {
      id: 'track2',
      title: 'Texturas Orgánicas',
      artist: 'Alba Soundscapes',
      duration: '4:20',
      emoji: '🌿',
      type: 'ocean'
    },
    {
      id: 'track3',
      title: 'Espacios Acústicos',
      artist: 'Pocito Lo-Fi',
      duration: '3:10',
      emoji: '📐',
      type: 'chime'
    }
  ];

  let activeTrackIndex = 0;
  let isPlaying = false;
  let progressInterval = null;
  let currentProgressPercent = 0;
  let audioCtx = null;
  let synthNodes = []; // Almacena nodos de audio activos

  const playlistItems = document.querySelectorAll('.playlist-item');
  const mainPlayBtn = document.getElementById('mainPlayBtn');
  const mainPlayIcon = document.getElementById('mainPlayIcon');
  const playerTitle = document.getElementById('playerTitle');
  const playerArtist = document.getElementById('playerArtist');
  const playerArtwork = document.getElementById('playerArtwork');
  const playerProgressFill = document.getElementById('playerProgressFill');
  const playerProgressBar = document.getElementById('playerProgressBar');

  // Inicializar Web Audio Context
  function initAudioContext() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  // Detener la síntesis actual
  function stopSynthesis() {
    synthNodes.forEach(node => {
      try {
        node.stop();
      } catch (e) {}
    });
    synthNodes = [];
  }

  // Generar sonido ambiente con Web Audio API
  function playSynthesis(type) {
    initAudioContext();
    stopSynthesis();

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.15, audioCtx.currentTime + 1.5); // Fade in suave
    masterGain.connect(audioCtx.destination);

    if (type === 'synth') {
      // Focus & Flow: Sintetizador Pad profundo y cálido
      // Nota base C3 (130.81Hz) + G3 (196.00Hz) + C4 (261.63Hz) + E4 (329.63Hz)
      const frequencies = [130.81, 196.00, 261.63, 329.63];
      
      frequencies.forEach((freq, index) => {
        const osc = audioCtx.createOscillator();
        const oscGain = audioCtx.createGain();
        
        // Osciladores de onda triangular suave
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        
        // Modulación lenta de volumen por oscilador para dar efecto orgánico
        const lfo = audioCtx.createOscillator();
        const lfoGain = audioCtx.createGain();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.1 + (index * 0.05), audioCtx.currentTime);
        
        lfoGain.gain.setValueAtTime(0.03, audioCtx.currentTime);
        lfo.connect(lfoGain.gain);
        oscGain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        
        osc.connect(oscGain);
        lfoGain.connect(oscGain.gain);
        oscGain.connect(masterGain);
        
        osc.start();
        lfo.start();
        
        synthNodes.push(osc);
        synthNodes.push(lfo);
      });

    } else if (type === 'ocean') {
      // Texturas Orgánicas: Simulación de Olas de Mar con Ruido Blanco Filtrado
      const bufferSize = audioCtx.sampleRate * 2;
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      
      const whiteNoise = audioCtx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;
      
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, audioCtx.currentTime);
      filter.Q.setValueAtTime(1, audioCtx.currentTime);
      
      // LFO lento para simular la fuerza de la ola (subida y bajada)
      const waveLfo = audioCtx.createOscillator();
      const waveLfoGain = audioCtx.createGain();
      waveLfo.type = 'sine';
      waveLfo.frequency.setValueAtTime(0.12, audioCtx.currentTime); // Ola cada ~8 segundos
      
      waveLfoGain.gain.setValueAtTime(200, audioCtx.currentTime);
      
      waveLfo.connect(waveLfoGain);
      waveLfoGain.connect(filter.frequency);
      
      whiteNoise.connect(filter);
      filter.connect(masterGain);
      
      whiteNoise.start();
      waveLfo.start();
      
      synthNodes.push(whiteNoise);
      synthNodes.push(waveLfo);

    } else if (type === 'chime') {
      // Espacios Acústicos: Secuencia cíclica de campanadas cristalinas
      const chimeInterval = setInterval(() => {
        if (!isPlaying) {
          clearInterval(chimeInterval);
          return;
        }
        
        // Frecuencia aleatoria de escala pentatónica de Do Mayor (C5, D5, E5, G5, A5, C6)
        const scale = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];
        const randomFreq = scale[Math.floor(Math.random() * scale.length)];
        
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const filter = audioCtx.createBiquadFilter();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(randomFreq, audioCtx.currentTime);
        
        gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.12, audioCtx.currentTime + 0.05); // Pluck rápido
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2.0);  // Decaimiento largo
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2000, audioCtx.currentTime);
        
        osc.connect(gain);
        gain.connect(filter);
        filter.connect(masterGain);
        
        osc.start();
        osc.stop(audioCtx.currentTime + 2.5);
      }, 2500);
      
      // Añadir un acorde base continuo para que no haya silencio absoluto
      const baseFreqs = [65.41, 98.00, 130.81]; // C2, G2, C3
      baseFreqs.forEach(freq => {
        const baseOsc = audioCtx.createOscillator();
        const baseGain = audioCtx.createGain();
        baseOsc.type = 'triangle';
        baseOsc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        baseGain.gain.setValueAtTime(0.03, audioCtx.currentTime);
        baseOsc.connect(baseGain);
        baseGain.connect(masterGain);
        baseOsc.start();
        synthNodes.push(baseOsc);
      });
      
      // Guardamos la referencia para detener el intervalo
      isPlayingInterval = chimeInterval;
    }
    
    // Guardar el nodo de ganancia maestro para fadeouts al pausar
    activeMasterGain = masterGain;
  }

  let activeMasterGain = null;
  let isPlayingInterval = null;

  function fadeOutAndStop() {
    if (activeMasterGain && audioCtx) {
      activeMasterGain.gain.setValueAtTime(activeMasterGain.gain.value, audioCtx.currentTime);
      activeMasterGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5); // Fadeout de 0.5s
      setTimeout(() => {
        stopSynthesis();
        if (isPlayingInterval) {
          clearInterval(isPlayingInterval);
          isPlayingInterval = null;
        }
      }, 500);
    } else {
      stopSynthesis();
    }
  }

  // Sincronizar UI de la lista
  function updatePlaylistUI() {
    playlistItems.forEach((item, index) => {
      item.classList.remove('active');
      const arrowElement = item.querySelector('.playlist-arrow');
      
      if (index === activeTrackIndex) {
        item.classList.add('active');
        if (isPlaying) {
          arrowElement.innerHTML = `
            <div class="wave-animation">
              <div class="wave-bar"></div>
              <div class="wave-bar"></div>
              <div class="wave-bar"></div>
              <div class="wave-bar"></div>
            </div>
          `;
        } else {
          arrowElement.innerHTML = 'En pausa <span>▶</span>';
        }
      } else {
        arrowElement.innerHTML = 'Escuchar <span>▶</span>';
      }
    });
  }

  // Cargar datos en el reproductor widget
  function loadTrack(index) {
    const track = tracks[index];
    if (playerTitle) playerTitle.textContent = track.title;
    if (playerArtist) playerArtist.textContent = track.artist;
    if (playerArtwork) playerArtwork.textContent = track.emoji;
  }

  // Reproducir/Pausar
  function togglePlay() {
    if (isPlaying) {
      // Pausar
      isPlaying = false;
      if (mainPlayIcon) {
        mainPlayIcon.innerHTML = `<polygon points="5 3 19 12 5 21 5 3" fill="currentColor"/>`;
      }
      fadeOutAndStop();
      clearInterval(progressInterval);
    } else {
      // Reproducir
      isPlaying = true;
      if (mainPlayIcon) {
        mainPlayIcon.innerHTML = `
          <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
          <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
        `;
      }
      playSynthesis(tracks[activeTrackIndex].type);
      startProgressBar();
    }
    updatePlaylistUI();
  }

  // Temporizador y barra de progreso simulada
  function startProgressBar() {
    clearInterval(progressInterval);
    progressInterval = setInterval(() => {
      if (isPlaying) {
        currentProgressPercent += 0.4; // Incremento
        if (currentProgressPercent >= 100) {
          // Cambiar a siguiente pista al terminar
          currentProgressPercent = 0;
          activeTrackIndex = (activeTrackIndex + 1) % tracks.length;
          loadTrack(activeTrackIndex);
          playSynthesis(tracks[activeTrackIndex].type);
        }
        if (playerProgressFill) {
          playerProgressFill.style.width = `${currentProgressPercent}%`;
        }
      }
    }, 100);
  }

  // Agregar eventos a las tarjetas de playlist
  playlistItems.forEach((item, index) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      
      if (activeTrackIndex === index) {
        // Mismo track: toggle play/pause
        togglePlay();
      } else {
        // Otro track
        activeTrackIndex = index;
        currentProgressPercent = 0;
        if (playerProgressFill) playerProgressFill.style.width = '0%';
        loadTrack(activeTrackIndex);
        
        if (!isPlaying) {
          isPlaying = true;
          if (mainPlayIcon) {
            mainPlayIcon.innerHTML = `
              <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
              <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
            `;
          }
          startProgressBar();
        }
        playSynthesis(tracks[activeTrackIndex].type);
        updatePlaylistUI();
      }
    });
  });

  // Evento al botón principal del Widget
  if (mainPlayBtn) {
    mainPlayBtn.addEventListener('click', togglePlay);
  }

  // Barra de progreso interactiva (hacer clic para adelantar/atrasar)
  if (playerProgressBar) {
    playerProgressBar.addEventListener('click', (e) => {
      const rect = playerProgressBar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.right - rect.left;
      currentProgressPercent = (clickX / width) * 100;
      if (playerProgressFill) {
        playerProgressFill.style.width = `${currentProgressPercent}%`;
      }
      if (!isPlaying) {
        togglePlay();
      }
    });
  }

  // Inicializar cargando el primer track
  loadTrack(0);

  /* ── 5. MODAL PARA REPRODUCCIÓN DE VIDEOS DE CHARLAS TED ── */
  const tedItems = document.querySelectorAll('.ted-item');
  const modal = document.getElementById('videoModal');
  const modalIframe = document.getElementById('modalIframe');
  const modalClose = document.getElementById('modalClose');

  tedItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const videoUrl = item.getAttribute('data-video');
      
      if (modal && modalIframe && videoUrl) {
        // Pausar la música si se reproduce
        if (isPlaying) togglePlay();

        modalIframe.setAttribute('src', videoUrl);
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Detener scroll de fondo
      }
    });
  });

  function closeModal() {
    if (modal && modalIframe) {
      modal.classList.remove('active');
      modalIframe.setAttribute('src', '');
      document.body.style.overflow = ''; // Restaurar scroll
    }
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  // Cerrar modal al presionar ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });

  /* ── 6. CONTROL DE BOTÓN VOLVER ARRIBA ── */
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
  
});
