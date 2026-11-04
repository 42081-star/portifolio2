/**
 * PORTFÓLIO ENZO FAZIO // SCRIPT PRINCIPAL
 * Navegação Completa, Cidade Cyberpunk, Garagem Interativa e Áudio Sintetizado
 */

(function () {
  'use strict';

  // -------------------------------------------------------------------------
  // 1. Verificação de Preferência de Movimento Reduzido (Acessibilidade)
  // -------------------------------------------------------------------------
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let prefersReducedMotion = motionQuery.matches;

  motionQuery.addEventListener('change', (e) => {
    prefersReducedMotion = e.matches;
    if (prefersReducedMotion) {
      stopRain();
    } else {
      initRain();
    }
  });

  // -------------------------------------------------------------------------
  // 2. Sistema de Áudio Sintetizado Web Audio API (100% Nativo, Sem Arquivos)
  // -------------------------------------------------------------------------
  let audioCtx = null;
  let isSoundEnabled = true;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Som de Clique Futurista
  function playUiClickSound() {
    if (!isSoundEnabled || prefersReducedMotion) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(540, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1080, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {
      console.warn('Web Audio error', e);
    }
  }

  // Som de Transmissão / Sucesso de Formulário
  function playTransmitSound() {
    if (!isSoundEnabled || prefersReducedMotion) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(660, now + 0.08);
      osc.frequency.setValueAtTime(880, now + 0.16);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.36);
    } catch (e) {
      console.warn('Web Audio error', e);
    }
  }

  // Som Sintetizado de Ronco de Motor / Aceleração Cyberpunk
  function playEngineRevSound() {
    if (!isSoundEnabled || prefersReducedMotion) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Grave do motor
      const osc1 = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain1 = ctx.createGain();

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(65, now);
      osc1.frequency.linearRampToValueAtTime(140, now + 0.22);
      osc1.frequency.exponentialRampToValueAtTime(70, now + 0.55);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, now);
      filter.frequency.linearRampToValueAtTime(800, now + 0.22);
      filter.frequency.exponentialRampToValueAtTime(280, now + 0.55);

      gain1.gain.setValueAtTime(0.01, now);
      gain1.gain.linearRampToValueAtTime(0.22, now + 0.1);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

      osc1.connect(filter);
      filter.connect(gain1);
      gain1.connect(ctx.destination);

      // Assobio do Turbo
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(400, now);
      osc2.frequency.exponentialRampToValueAtTime(1600, now + 0.35);

      gain2.gain.setValueAtTime(0.001, now);
      gain2.gain.linearRampToValueAtTime(0.06, now + 0.25);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.58);
      osc2.stop(now + 0.52);
    } catch (e) {
      console.warn('Web Audio error on rev', e);
    }
  }

  // Som Sintetizado de Derrapagem / Drift
  function playDriftSound() {
    if (!isSoundEnabled || prefersReducedMotion) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.linearRampToValueAtTime(180, now + 0.16);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(950, now);
      filter.Q.setValueAtTime(2.5, now);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.22);
    } catch (e) {
      console.warn('Web Audio error on drift', e);
    }
  }

  // Alternar Áudio no Header
  const audioToggleBtn = document.getElementById('audioToggle');
  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      isSoundEnabled = !isSoundEnabled;
      const label = audioToggleBtn.querySelector('.audio-label');
      const icon = audioToggleBtn.querySelector('.audio-icon');

      if (isSoundEnabled) {
        if (label) label.textContent = 'FX ON';
        if (icon) icon.textContent = '🔊';
        audioToggleBtn.style.borderColor = 'rgba(0, 230, 118, 0.4)';
        audioToggleBtn.style.color = 'var(--neon-yellow-bright)';
        playUiClickSound();
      } else {
        if (label) label.textContent = 'FX OFF';
        if (icon) icon.textContent = '🔇';
        audioToggleBtn.style.borderColor = 'rgba(130, 168, 190, 0.3)';
        audioToggleBtn.style.color = 'var(--text-muted)';
      }
    });
  }

  // -------------------------------------------------------------------------
  // 3. Sistema de Chuva Fina em Canvas
  // -------------------------------------------------------------------------
  const canvas = document.getElementById('rainCanvas');
  let ctx = null;
  let animationFrameId = null;
  let drops = [];
  let splashes = [];
  let width = 0;
  let height = 0;

  function setupCanvasSize() {
    if (!canvas) return;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }

  function createDrops() {
    drops = [];
    splashes = [];
    if (prefersReducedMotion) return;

    const dropCount = Math.floor(width < 768 ? 55 : 110);
    for (let i = 0; i < dropCount; i++) {
      drops.push({
        x: Math.random() * (width + 200) - 100,
        y: Math.random() * height,
        length: Math.random() * 18 + 10,
        speed: Math.random() * 8 + 12,
        opacity: Math.random() * 0.45 + 0.2,
        thickness: Math.random() * 1.2 + 0.5,
      });
    }
  }

  function addSplash(x, y) {
    if (splashes.length > 25) return;
    splashes.push({
      x: x,
      y: y,
      radius: 1,
      maxRadius: Math.random() * 6 + 3,
      opacity: 0.5,
    });
  }

  function renderRain() {
    if (!ctx || prefersReducedMotion) return;

    ctx.clearRect(0, 0, width, height);

    const windAngle = 0.22;
    const roadY = height * 0.65;

    for (let i = 0; i < drops.length; i++) {
      const d = drops[i];

      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x + d.length * windAngle, d.y + d.length);
      ctx.strokeStyle = `rgba(180, 215, 255, ${d.opacity})`;
      ctx.lineWidth = d.thickness;
      ctx.stroke();

      d.y += d.speed;
      d.x += d.speed * windAngle;

      if (d.y > roadY && Math.random() < 0.12) {
        addSplash(d.x, d.y);
      }

      if (d.y > height) {
        d.y = -20;
        d.x = Math.random() * (width + 200) - 100;
      }
    }

    for (let i = splashes.length - 1; i >= 0; i--) {
      const s = splashes[i];
      ctx.beginPath();
      ctx.ellipse(s.x, s.y, s.radius * 2, s.radius * 0.7, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 0, 127, ${s.opacity * 0.6})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      s.radius += 0.35;
      s.opacity -= 0.04;

      if (s.opacity <= 0 || s.radius >= s.maxRadius) {
        splashes.splice(i, 1);
      }
    }

    animationFrameId = requestAnimationFrame(renderRain);
  }

  function initRain() {
    if (!canvas || prefersReducedMotion) return;
    ctx = canvas.getContext('2d');
    if (!ctx) return;
    setupCanvasSize();
    createDrops();
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    animationFrameId = requestAnimationFrame(renderRain);
  }

  function stopRain() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    if (ctx) ctx.clearRect(0, 0, width, height);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopRain();
    } else {
      if (!prefersReducedMotion) initRain();
    }
  });

  let resizeTimeout = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      setupCanvasSize();
      createDrops();
    }, 150);
  });

  // -------------------------------------------------------------------------
  // 4. Navegação Suave e Destaque do Link Ativo
  // -------------------------------------------------------------------------
  const navLinks = document.querySelectorAll('.cyber-nav .nav-link');
  const sections = document.querySelectorAll('main section');

  // Clique nos links do menu com rolagem e som
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          playUiClickSound();

          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });

          // Atualizar classe ativa
          navLinks.forEach((l) => l.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  });

  // Atualizar link ativo conforme a rolagem da página
  window.addEventListener('scroll', () => {
    let currentSectionId = '';
    const scrollPos = window.scrollY + 180;

    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach((link) => {
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  });

  // Botão CTA "Entrar na garagem"
  const btnEntrarGaragem = document.getElementById('btnEntrarGaragem');
  if (btnEntrarGaragem) {
    btnEntrarGaragem.addEventListener('click', (e) => {
      e.preventDefault();
      playUiClickSound();
      const garagemSec = document.getElementById('garagem');
      if (garagemSec) {
        garagemSec.scrollIntoView({ behavior: 'smooth' });
        // Toca aceleração ao chegar na garagem
        setTimeout(() => {
          playEngineRevSound();
        }, 600);
      }
    });
  }

  // -------------------------------------------------------------------------
  // 5. Interatividade do Carro Hero (Aceleração ao clicar)
  // -------------------------------------------------------------------------
  const heroCarWrapper = document.getElementById('heroCarWrapper');
  const carBadge = document.getElementById('carBadge');
  let isRevving = false;

  function triggerHeroRev() {
    if (isRevving) return;
    isRevving = true;

    playEngineRevSound();

    if (heroCarWrapper) {
      heroCarWrapper.classList.add('revving');
    }

    if (carBadge) {
      const textSpan = carBadge.querySelector('.badge-text');
      if (textSpan) textSpan.textContent = 'MOTOR NO TALO! 💥';
    }

    setTimeout(() => {
      if (heroCarWrapper) {
        heroCarWrapper.classList.remove('revving');
      }
      if (carBadge) {
        const textSpan = carBadge.querySelector('.badge-text');
        if (textSpan) textSpan.textContent = 'TOQUE PARA ACELERAR';
      }
      isRevving = false;
    }, 600);
  }

  if (heroCarWrapper) {
    heroCarWrapper.addEventListener('click', triggerHeroRev);
    heroCarWrapper.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerHeroRev();
      }
    });
  }

  // -------------------------------------------------------------------------
  // 6. Controles Interativos da Garagem (Seção 03)
  // -------------------------------------------------------------------------
  const swatchButtons = document.querySelectorAll('.swatch-btn');
  const paintButtons = document.querySelectorAll('.paint-btn');
  const currentNeonLabel = document.getElementById('currentNeonLabel');
  const garageUnderglow = document.getElementById('garageUnderglow');
  const svgUnderglow1 = document.getElementById('svgUnderglow1');
  const svgUnderglow2 = document.getElementById('svgUnderglow2');
  const garageDecalLine = document.getElementById('garageDecalLine');
  const spoilerLed = document.getElementById('spoilerLed');
  const caliperFront = document.getElementById('caliperFront');
  const caliperRear = document.getElementById('caliperRear');
  const hubFront = document.getElementById('hubFront');
  const hubRear = document.getElementById('hubRear');

  // Troca de Neon Underglow
  swatchButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      playUiClickSound();
      swatchButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const neonColor = btn.getAttribute('data-neon');
      const neonName = btn.getAttribute('data-name');

      if (currentNeonLabel) {
        currentNeonLabel.textContent = `COR ATIVA: ${neonName.toUpperCase()}`;
      }

      // Atualiza o brilho do underglow da garagem
      if (garageUnderglow) {
        garageUnderglow.style.background = `radial-gradient(ellipse at center, ${neonColor} 0%, ${neonColor}88 50%, transparent 100%)`;
      }

      // Atualiza os elementos SVG do carro
      if (svgUnderglow1) svgUnderglow1.setAttribute('fill', neonColor);
      if (svgUnderglow2) svgUnderglow2.setAttribute('fill', neonColor);
      if (garageDecalLine) garageDecalLine.setAttribute('stroke', neonColor);
      if (spoilerLed) spoilerLed.setAttribute('stroke', neonColor);
      if (caliperFront) caliperFront.setAttribute('stroke', neonColor);
      if (caliperRear) caliperRear.setAttribute('stroke', neonColor);
      if (hubFront) hubFront.setAttribute('fill', neonColor);
      if (hubRear) hubRear.setAttribute('fill', neonColor);
    });
  });

  // Troca de Pintura da Lataria
  const paintStop1 = document.getElementById('paintStop1');
  const paintStop2 = document.getElementById('paintStop2');
  const paintStop3 = document.getElementById('paintStop3');

  paintButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      playUiClickSound();
      paintButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const c1 = btn.getAttribute('data-p1');
      const c2 = btn.getAttribute('data-p2');
      const c3 = btn.getAttribute('data-p3');

      if (paintStop1) paintStop1.setAttribute('stop-color', c1);
      if (paintStop2) paintStop2.setAttribute('stop-color', c2);
      if (paintStop3) paintStop3.setAttribute('stop-color', c3);
    });
  });

  // Alternar Faróis na Garagem
  const btnToggleHeadlights = document.getElementById('btnToggleHeadlights');
  const garageHeadlights = document.getElementById('garageHeadlights');
  let headlightsOn = true;

  if (btnToggleHeadlights && garageHeadlights) {
    btnToggleHeadlights.addEventListener('click', () => {
      playUiClickSound();
      headlightsOn = !headlightsOn;
      garageHeadlights.style.opacity = headlightsOn ? '1' : '0.15';
      btnToggleHeadlights.querySelector('span:last-child').textContent = headlightsOn
        ? 'Desligar Faróis'
        : 'Ligar Faróis';
    });
  }

  // Acelerar Carro na Garagem
  const btnGarageRev = document.getElementById('btnGarageRev');
  const garageCarViewport = document.getElementById('garageCarViewport');

  if (btnGarageRev && garageCarViewport) {
    btnGarageRev.addEventListener('click', () => {
      playEngineRevSound();
      garageCarViewport.classList.add('revving');
      setTimeout(() => {
        garageCarViewport.classList.remove('revving');
      }, 500);
    });
  }

  // -------------------------------------------------------------------------
  // 7. Formulário de Contato com Validação e Feedback Futurista
  // -------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');

  if (contactForm && formFeedback) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('formName');
      const emailInput = document.getElementById('formEmail');
      const messageInput = document.getElementById('formMessage');

      const nameVal = nameInput ? nameInput.value.trim() : '';
      const emailVal = emailInput ? emailInput.value.trim() : '';
      const msgVal = messageInput ? messageInput.value.trim() : '';

      if (!nameVal || !emailVal || !msgVal) {
        formFeedback.className = 'form-feedback error';
        formFeedback.textContent = '❌ ALERTA: Preencha todos os campos da frequência de envio.';
        return;
      }

      // Validação simples de email
      if (!emailVal.includes('@') || !emailVal.includes('.')) {
        formFeedback.className = 'form-feedback error';
        formFeedback.textContent = '❌ ALERTA: Frequência de email inválida.';
        return;
      }

      // Sucesso na transmissão
      playTransmitSound();
      formFeedback.className = 'form-feedback success';
      formFeedback.textContent = `⚡ TRANSMISSÃO CONCLUÍDA: Obrigado, ${nameVal}! Enzo Fazio responderá em breve.`;

      contactForm.reset();

      setTimeout(() => {
        formFeedback.style.display = 'none';
      }, 7000);
    });
  }

  // -------------------------------------------------------------------------
  // 8. Modo Jogo: Pilotagem do Carro com WASD & Navegação Interativa (Brasil)
  // -------------------------------------------------------------------------
  const gameHud = document.getElementById('gameHud');
  const btnToggleHud = document.getElementById('btnToggleHud');
  const btnReopenHud = document.getElementById('btnReopenHud');
  const hudSpeedDisplay = document.getElementById('hudSpeedDisplay');
  const hudSpeedGauge = document.getElementById('hudSpeedGauge');
  const hudGear = document.getElementById('hudGear');
  const hudCheckpointName = document.getElementById('hudCheckpointName');
  const hudMiniCar = document.getElementById('hudMiniCar');
  const wasdKeyW = document.getElementById('wasdKeyW');
  const wasdKeyA = document.getElementById('wasdKeyA');
  const wasdKeyS = document.getElementById('wasdKeyS');
  const wasdKeyD = document.getElementById('wasdKeyD');
  const checkpointNodes = document.querySelectorAll('.checkpoint-node');

  const routeCheckpoints = [
    { id: 'hero', name: '01 // INÍCIO', gear: 'D-1', cruiseSpeed: 0, peakSpeed: 160 },
    { id: 'sobre', name: '02 // SOBRE', gear: 'D-2', cruiseSpeed: 85, peakSpeed: 190 },
    { id: 'garagem', name: '03 // GARAGEM', gear: 'D-3', cruiseSpeed: 60, peakSpeed: 210 },
    { id: 'projetos', name: '04 // PROJETOS', gear: 'D-4', cruiseSpeed: 120, peakSpeed: 240 },
    { id: 'contato', name: '05 // CONTATO', gear: 'D-5', cruiseSpeed: 75, peakSpeed: 220 },
  ];

  let currentCheckpointIndex = 0;
  let currentSpeed = 0;
  let speedAnimFrame = null;
  let isNavigating = false;

  function animateSpeed(targetPeak, finalCruise, durationMs) {
    if (speedAnimFrame) cancelAnimationFrame(speedAnimFrame);
    const startTime = performance.now();
    const startSpeed = currentSpeed;

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);

      let displaySpeed;
      if (progress < 0.4) {
        const subProg = progress / 0.4;
        displaySpeed = Math.round(startSpeed + (targetPeak - startSpeed) * subProg);
      } else {
        const subProg = (progress - 0.4) / 0.6;
        displaySpeed = Math.round(targetPeak + (finalCruise - targetPeak) * subProg);
      }

      currentSpeed = displaySpeed;
      if (hudSpeedDisplay) hudSpeedDisplay.textContent = displaySpeed;
      if (hudSpeedGauge) {
        const pct = Math.min(Math.max((displaySpeed / 250) * 100, 10), 100);
        hudSpeedGauge.style.width = `${pct}%`;
      }

      if (progress < 1) {
        speedAnimFrame = requestAnimationFrame(step);
      }
    }
    speedAnimFrame = requestAnimationFrame(step);
  }

  function updateHudCheckpoint(index, gearOverride) {
    const cp = routeCheckpoints[index];
    if (!cp) return;

    if (hudCheckpointName) hudCheckpointName.textContent = cp.name;
    if (hudGear) hudGear.textContent = gearOverride || cp.gear;

    // Atualiza nós de checkpoints
    checkpointNodes.forEach((node) => {
      const dest = node.getAttribute('data-dest');
      if (dest === cp.id) {
        node.classList.add('active');
      } else {
        node.classList.remove('active');
      }
    });

    // Atualiza links do menu principal
    navLinks.forEach((link) => {
      if (link.getAttribute('href') === `#${cp.id}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Animação e texto no mini carro do HUD
    if (hudMiniCar) {
      const labels = ['🏎️ INÍCIO', '🏎️ SOBRE', '🏎️ GARAGEM', '🏎️ PROJETOS', '🏎️ CONTATO'];
      hudMiniCar.textContent = labels[index] || '🏎️ NA PISTA';
      hudMiniCar.style.transform = `scale(1.25)`;
      setTimeout(() => {
        if (hudMiniCar) hudMiniCar.style.transform = 'scale(1)';
      }, 300);
    }
  }

  function driveTo(targetIndex, direction = 'forward') {
    const clampedIndex = Math.max(0, Math.min(targetIndex, routeCheckpoints.length - 1));
    currentCheckpointIndex = clampedIndex;

    const cp = routeCheckpoints[clampedIndex];
    if (!cp) return;

    isNavigating = true;
    playEngineRevSound();

    const targetSection = document.getElementById(cp.id);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    if (direction === 'reverse' || direction === 'drift-left') {
      updateHudCheckpoint(clampedIndex, 'R');
      if (heroCarWrapper) {
        heroCarWrapper.classList.add('driving-reverse');
        setTimeout(() => heroCarWrapper.classList.remove('driving-reverse'), 650);
      }
      setTimeout(() => {
        if (hudGear) hudGear.textContent = cp.gear;
      }, 700);
    } else {
      updateHudCheckpoint(clampedIndex);
      if (heroCarWrapper) {
        heroCarWrapper.classList.add('driving-forward');
        setTimeout(() => heroCarWrapper.classList.remove('driving-forward'), 650);
      }
    }

    animateSpeed(cp.peakSpeed, cp.cruiseSpeed, 900);

    setTimeout(() => {
      isNavigating = false;
    }, 850);
  }

  function driveForward() {
    if (currentCheckpointIndex < routeCheckpoints.length - 1) {
      driveTo(currentCheckpointIndex + 1, 'forward');
    } else {
      // Loop contínuo para o Início
      driveTo(0, 'forward');
    }
  }

  function driveBackward() {
    if (currentCheckpointIndex > 0) {
      driveTo(currentCheckpointIndex - 1, 'reverse');
    } else {
      // Loop contínuo para o Contato
      driveTo(routeCheckpoints.length - 1, 'reverse');
    }
  }

  function steerLeft() {
    playDriftSound();
    if (heroCarWrapper) {
      heroCarWrapper.classList.add('steer-left');
      setTimeout(() => heroCarWrapper.classList.remove('steer-left'), 450);
    }
    if (wasdKeyA) {
      wasdKeyA.classList.add('active');
      setTimeout(() => wasdKeyA.classList.remove('active'), 250);
    }
    driveBackward();
  }

  function steerRight() {
    playDriftSound();
    if (heroCarWrapper) {
      heroCarWrapper.classList.add('steer-right');
      setTimeout(() => heroCarWrapper.classList.remove('steer-right'), 450);
    }
    if (wasdKeyD) {
      wasdKeyD.classList.add('active');
      setTimeout(() => wasdKeyD.classList.remove('active'), 250);
    }
    driveForward();
  }

  // Teclado Físico (WASD, Setas e Atalhos 1-5)
  window.addEventListener('keydown', (e) => {
    const tag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
    if (tag === 'input' || tag === 'textarea' || tag === 'select' || document.activeElement?.isContentEditable) {
      return; // Permite digitação sem interferência no formulário de contato
    }

    const key = e.key.toLowerCase();

    if (key === 'w' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (wasdKeyW) wasdKeyW.classList.add('active');
      driveForward();
    } else if (key === 's' || e.key === 'ArrowDown') {
      e.preventDefault();
      if (wasdKeyS) wasdKeyS.classList.add('active');
      driveBackward();
    } else if (key === 'a' || e.key === 'ArrowLeft') {
      e.preventDefault();
      steerLeft();
    } else if (key === 'd' || e.key === 'ArrowRight') {
      e.preventDefault();
      steerRight();
    } else if (key === '1') {
      e.preventDefault();
      driveTo(0, 'forward');
    } else if (key === '2') {
      e.preventDefault();
      driveTo(1, 'forward');
    } else if (key === '3') {
      e.preventDefault();
      driveTo(2, 'forward');
    } else if (key === '4') {
      e.preventDefault();
      driveTo(3, 'forward');
    } else if (key === '5') {
      e.preventDefault();
      driveTo(4, 'forward');
    }
  });

  window.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    if (key === 'w' || e.key === 'ArrowUp') wasdKeyW?.classList.remove('active');
    if (key === 's' || e.key === 'ArrowDown') wasdKeyS?.classList.remove('active');
    if (key === 'a' || e.key === 'ArrowLeft') wasdKeyA?.classList.remove('active');
    if (key === 'd' || e.key === 'ArrowRight') wasdKeyD?.classList.remove('active');
  });

  // Cliques virtuais no Cockpit WASD
  if (wasdKeyW) wasdKeyW.addEventListener('click', driveForward);
  if (wasdKeyS) wasdKeyS.addEventListener('click', driveBackward);
  if (wasdKeyA) wasdKeyA.addEventListener('click', steerLeft);
  if (wasdKeyD) wasdKeyD.addEventListener('click', steerRight);

  checkpointNodes.forEach((node, idx) => {
    node.addEventListener('click', () => {
      driveTo(idx, idx >= currentCheckpointIndex ? 'forward' : 'reverse');
    });
  });

  // Minimizar e Reabrir Cockpit
  if (btnToggleHud && gameHud) {
    btnToggleHud.addEventListener('click', () => {
      gameHud.classList.add('is-minimized');
      if (btnReopenHud) btnReopenHud.classList.add('show');
      playUiClickSound();
    });
  }

  if (btnReopenHud && gameHud) {
    btnReopenHud.addEventListener('click', () => {
      gameHud.classList.remove('is-minimized');
      btnReopenHud.classList.remove('show');
      playUiClickSound();
    });
  }

  // Sincronizar scroll manual com o HUD
  window.addEventListener('scroll', () => {
    if (isNavigating) return;
    const scrollPos = window.scrollY + 200;

    routeCheckpoints.forEach((cp, idx) => {
      const sec = document.getElementById(cp.id);
      if (sec) {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          if (currentCheckpointIndex !== idx) {
            currentCheckpointIndex = idx;
            updateHudCheckpoint(idx);
          }
        }
      }
    });
  });

  // -------------------------------------------------------------------------
  // 9. Inicialização
  // -------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    initRain();
    updateHudCheckpoint(0);
  });
})();
