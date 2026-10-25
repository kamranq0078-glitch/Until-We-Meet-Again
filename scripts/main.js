/**
 * A Light For Dadyy — Main Script
 * Manages sacred text rendering from JSON, family inputs,
 * Sabr verses carousel, interactive lanterns, Ameen du'a sky, and ambient canvas.
 *
 * Sacred text is loaded exclusively from content/sacred-text.json.
 * No sacred text is hardcoded in this script.
 */

(function () {
  'use strict';

  // State
  let sacredData = null;
  let familyData = null;
  let currentSabrSlide = 0;
  let totalSabrSlides = 0;

  // Reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Initialization
  document.addEventListener('DOMContentLoaded', init);

  async function init() {
    initAmbientCanvas();
    initDuaSky();

    try {
      const [sacredResponse, familyResponse] = await Promise.all([
        fetch('content/sacred-text.json'),
        fetch('content/family.json')
      ]);

      if (!sacredResponse.ok || !familyResponse.ok) {
        throw new Error('Failed to load content JSON files.');
      }

      sacredData = await sacredResponse.json();
      familyData = await familyResponse.json();

      renderAll();
    } catch (error) {
      console.error('Error loading content:', error);
      displayFetchNotice();
    }
  }

  /**
   * Displays a calm guidance notice if JSON fetch is blocked by local file:// policy.
   */
  function displayFetchNotice() {
    const ch1Arabic = document.getElementById('ch1-arabic');
    if (ch1Arabic) {
      ch1Arabic.innerHTML = '<span style="font-size: 1.1rem; font-family: var(--font-latin); color: var(--gold-soft); direction: ltr; display: block;">Please open this page using a local web server (e.g. <code>python3 -m http.server 8000</code>) or via your private hosted URL.</span>';
    }
  }

  /**
   * Main render orchestrator
   */
  function renderAll() {
    renderAudioControl();
    renderChapter1();
    renderChapter2();
    renderChapter3();
    renderChapter4();
    renderChapter5();
    renderChapter6();
  }

  /**
   * Optional Recitation Audio Control
   * Silent by default. Rendered only if family.json enables it with an audio source.
   */
  function renderAudioControl() {
    const container = document.getElementById('header-audio-container');
    const audioElement = document.getElementById('recitation-audio');
    if (!container || !audioElement) return;

    if (!familyData.audio || !familyData.audio.enabled || !familyData.audio.src) {
      container.innerHTML = '';
      return;
    }

    audioElement.src = familyData.audio.src;
    audioElement.preload = 'none';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'audio-control-btn';
    btn.setAttribute('aria-label', familyData.audio.label || 'Play recitation');

    const updateBtnUI = (isPlaying) => {
      btn.innerHTML = isPlaying
        ? `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg><span>Pause</span>`
        : `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg><span>${familyData.audio.label || 'Play recitation'}</span>`;
    };

    updateBtnUI(false);

    btn.addEventListener('click', () => {
      if (audioElement.paused) {
        audioElement.play().then(() => updateBtnUI(true)).catch((e) => {
          console.warn('Audio play prevented:', e);
        });
      } else {
        audioElement.pause();
        updateBtnUI(false);
      }
    });

    audioElement.addEventListener('ended', () => updateBtnUI(false));
    container.appendChild(btn);
  }

  /**
   * CHAPTER 1: The Opening
   */
  function renderChapter1() {
    const ch1 = sacredData.chapter1_opening;
    if (!ch1) return;

    const arabicEl = document.getElementById('ch1-arabic');
    const transEl = document.getElementById('ch1-translation');
    const refEl = document.getElementById('ch1-reference');

    if (arabicEl) arabicEl.textContent = ch1.istirja.arabic;
    if (transEl) transEl.textContent = ch1.istirja.translation;
    if (refEl) refEl.textContent = ch1.istirja.reference;

    // Person Identity from family.json (Rendered only if values exist)
    const identityContainer = document.getElementById('ch1-person-identity');
    if (identityContainer) {
      identityContainer.innerHTML = '';
      const name = familyData.fullName || familyData.name || '';
      const years = familyData.years || '';

      if (name.trim()) {
        const nameEl = document.createElement('h1');
        nameEl.className = 'person-name';
        nameEl.textContent = name;
        identityContainer.appendChild(nameEl);
      }

      if (years.trim()) {
        const yearsEl = document.createElement('p');
        yearsEl.className = 'person-years';
        yearsEl.textContent = years;
        identityContainer.appendChild(yearsEl);
      }
    }
  }

  /**
   * CHAPTER 2: His Portrait
   */
  function renderChapter2() {
    // Tribute text below portrait (rendered only if provided in family.json)
    const wordsEl = document.getElementById('ch2-family-words');
    const quoteEl = document.getElementById('ch2-kamran-quote');

    if (wordsEl) {
      if (familyData.familyWords && familyData.familyWords.trim()) {
        wordsEl.textContent = familyData.familyWords.trim();
        wordsEl.style.display = 'block';
      } else {
        wordsEl.style.display = 'none';
      }
    }

    if (quoteEl) {
      if (familyData.showKamranQuote && familyData.kamranQuote && familyData.kamranQuote.trim()) {
        quoteEl.textContent = familyData.kamranQuote.trim();
        quoteEl.style.display = 'block';
      } else {
        quoteEl.style.display = 'none';
      }
    }
  }

  /**
   * CHAPTER 3: What Remains
   */
  function renderChapter3() {
    const ch3 = sacredData.chapter3_remains;
    if (!ch3) return;

    // Populate revealed hadith text (initially hidden)
    const hadithArabic = document.getElementById('hadith-three-arabic');
    const hadithTrans = document.getElementById('hadith-three-translation');
    const hadithRef = document.getElementById('hadith-three-reference');

    if (hadithArabic) hadithArabic.textContent = ch3.hadith.arabic;
    if (hadithTrans) hadithTrans.textContent = ch3.hadith.translation;
    if (hadithRef) hadithRef.textContent = ch3.hadith.reference;

    // Lantern interaction
    const lanterns = [
      document.getElementById('lantern-charity'),
      document.getElementById('lantern-knowledge'),
      document.getElementById('lantern-child')
    ].filter(Boolean);

    const revealedBlock = document.getElementById('revealed-hadith');

    lanterns.forEach((lantern) => {
      lantern.addEventListener('click', () => {
        if (!lantern.classList.contains('is-lit')) {
          lantern.classList.add('is-lit');
          lantern.setAttribute('aria-pressed', 'true');
        }

        // Check if all three are lit
        const allLit = lanterns.every((l) => l.classList.contains('is-lit'));
        if (allLit && revealedBlock && !revealedBlock.classList.contains('is-visible')) {
          revealedBlock.classList.add('is-visible');
        }
      });
    });
  }

  /**
   * CHAPTER 4: Sabr (The Quiet Room)
   */
  function renderChapter4() {
    const ch4 = sacredData.chapter4_sabr;
    if (!ch4 || !Array.isArray(ch4.verses)) return;

    const stage = document.getElementById('sabr-stage');
    const dotsContainer = document.getElementById('sabr-dots');
    const prevBtn = document.getElementById('sabr-prev-btn');
    const nextBtn = document.getElementById('sabr-next-btn');

    if (!stage || !dotsContainer) return;

    stage.innerHTML = '';
    dotsContainer.innerHTML = '';
    totalSabrSlides = ch4.verses.length;

    ch4.verses.forEach((verse, index) => {
      // Create verse slide
      const slide = document.createElement('article');
      slide.className = 'verse-slide' + (index === 0 ? ' is-active' : '');
      if (verse.id === 'prophet-ibrahim') {
        slide.classList.add('is-ibrahim');
      }
      slide.id = `sabr-slide-${index}`;
      slide.setAttribute('role', 'group');
      slide.setAttribute('aria-label', `Verse ${index + 1} of ${totalSabrSlides}`);

      const arabic = document.createElement('p');
      arabic.className = 'sacred-arabic';
      arabic.lang = 'ar';
      arabic.dir = 'rtl';
      arabic.textContent = verse.arabic;

      const trans = document.createElement('p');
      trans.className = 'sacred-translation';
      trans.textContent = verse.translation;

      const ref = document.createElement('span');
      ref.className = 'sacred-reference';
      ref.textContent = verse.reference;

      slide.appendChild(arabic);
      slide.appendChild(trans);
      slide.appendChild(ref);
      stage.appendChild(slide);

      // Create dot
      const dot = document.createElement('span');
      dot.className = 'sabr-dot' + (index === 0 ? ' is-active' : '');
      dotsContainer.appendChild(dot);
    });

    // Navigation events
    if (prevBtn) {
      prevBtn.addEventListener('click', () => changeSabrSlide(currentSabrSlide - 1));
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => changeSabrSlide(currentSabrSlide + 1));
    }

    // Keyboard support for Sabr stage
    stage.setAttribute('tabindex', '0');
    stage.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        changeSabrSlide(currentSabrSlide - 1);
      } else if (e.key === 'ArrowRight') {
        changeSabrSlide(currentSabrSlide + 1);
      }
    });
  }

  function changeSabrSlide(newIndex) {
    if (totalSabrSlides === 0) return;
    if (newIndex < 0) newIndex = totalSabrSlides - 1;
    if (newIndex >= totalSabrSlides) newIndex = 0;

    const slides = document.querySelectorAll('.verse-slide');
    const dots = document.querySelectorAll('.sabr-dot');

    if (slides[currentSabrSlide]) slides[currentSabrSlide].classList.remove('is-active');
    if (dots[currentSabrSlide]) dots[currentSabrSlide].classList.remove('is-active');

    currentSabrSlide = newIndex;

    if (slides[currentSabrSlide]) slides[currentSabrSlide].classList.add('is-active');
    if (dots[currentSabrSlide]) dots[currentSabrSlide].classList.add('is-active');
  }

  /**
   * CHAPTER 5: Du'a for Him
   */
  function renderChapter5() {
    const ch5 = sacredData.chapter5_dua;
    if (!ch5) return;

    // Deceased Du'a
    const decArabic = document.getElementById('ch5-deceased-arabic');
    const decTranslit = document.getElementById('ch5-deceased-transliteration');
    const decTrans = document.getElementById('ch5-deceased-translation');
    const decRef = document.getElementById('ch5-deceased-reference');

    if (decArabic) decArabic.textContent = ch5.forDeceased.arabic;
    if (decTranslit) decTranslit.textContent = ch5.forDeceased.transliteration;
    if (decTrans) decTrans.textContent = ch5.forDeceased.translation;
    if (decRef) decRef.textContent = ch5.forDeceased.reference;

    // Bereaved Du'a
    const berArabic = document.getElementById('ch5-bereaved-arabic');
    const berTranslit = document.getElementById('ch5-bereaved-transliteration');
    const berTrans = document.getElementById('ch5-bereaved-translation');
    const berRef = document.getElementById('ch5-bereaved-reference');

    if (berArabic) berArabic.textContent = ch5.forBereaved.arabic;
    if (berTranslit) berTranslit.textContent = ch5.forBereaved.transliteration;
    if (berTrans) berTrans.textContent = ch5.forBereaved.translation;
    if (berRef) berRef.textContent = ch5.forBereaved.reference;

    // Ameen Button
    const ameenBtn = document.getElementById('ameen-btn');
    if (ameenBtn) {
      ameenBtn.addEventListener('click', handleAmeenClick);
    }
  }

  /**
   * CHAPTER 6: Dawn
   */
  function renderChapter6() {
    const ch6 = sacredData.chapter6_dawn;
    if (!ch6) return;

    const verseArabic = document.getElementById('ch6-verse-arabic');
    const verseTrans = document.getElementById('ch6-verse-translation');
    const verseRef = document.getElementById('ch6-verse-reference');

    if (verseArabic) verseArabic.textContent = ch6.reassuredSoul.arabic;
    if (verseTrans) verseTrans.textContent = ch6.reassuredSoul.translation;
    if (verseRef) verseRef.textContent = ch6.reassuredSoul.reference;

    // Closing du'a personalized with Dadyy's name
    const closingEl = document.getElementById('ch6-closing-dua');
    const sigEl = document.getElementById('ch6-kamran-signature');

    if (closingEl) {
      const name = (familyData && (familyData.name || familyData.fullName)) ? (familyData.name || familyData.fullName) : 'Dadyy';
      closingEl.textContent = ch6.closingDuaTemplate.replace('{name}', name);
    }

    if (sigEl) {
      sigEl.textContent = ch6.signature;
    }
  }

  /**
   * Du'a Sky Animation & Private Star Count
   * Each Ameen tap creates a rising warm light that settles into the heavens.
   * Preserved locally in localStorage. No external servers.
   */
  let skyCanvas, skyCtx;
  let settledStars = [];
  let risingLights = [];
  const LOCAL_STORAGE_KEY = 'dadyy_duas_count';

  function initDuaSky() {
    skyCanvas = document.getElementById('dua-sky-canvas');
    if (!skyCanvas) return;
    skyCtx = skyCanvas.getContext('2d');

    resizeSkyCanvas();
    window.addEventListener('resize', resizeSkyCanvas);

    // Load saved count from localStorage
    const savedCount = parseInt(localStorage.getItem(LOCAL_STORAGE_KEY) || '0', 10);
    seedSettledStars(savedCount);

    requestAnimationFrame(animateSky);
  }

  function resizeSkyCanvas() {
    if (!skyCanvas) return;
    const rect = skyCanvas.parentElement.getBoundingClientRect();
    skyCanvas.width = rect.width * (window.devicePixelRatio || 1);
    skyCanvas.height = rect.height * (window.devicePixelRatio || 1);
  }

  function seedSettledStars(count) {
    settledStars = [];
    const maxToRender = Math.min(count, 120); // aesthetic threshold
    for (let i = 0; i < maxToRender; i++) {
      settledStars.push({
        x: Math.random(),
        y: 0.08 + Math.random() * 0.75,
        radius: 1.2 + Math.random() * 1.8,
        twinkleSpeed: 0.008 + Math.random() * 0.012,
        twinkleOffset: Math.random() * Math.PI * 2,
        baseAlpha: 0.35 + Math.random() * 0.55
      });
    }
  }

  function handleAmeenClick(e) {
    const ameenBtn = e.currentTarget;
    if (!ameenBtn) return;

    // Visual button glow pulse
    ameenBtn.style.transform = 'scale(0.96)';
    setTimeout(() => { ameenBtn.style.transform = ''; }, 180);

    // Increment count in localStorage
    const currentCount = parseInt(localStorage.getItem(LOCAL_STORAGE_KEY) || '0', 10);
    const newCount = currentCount + 1;
    localStorage.setItem(LOCAL_STORAGE_KEY, newCount.toString());

    // Spawn rising light
    if (skyCanvas) {
      const btnRect = ameenBtn.getBoundingClientRect();
      const canvasRect = skyCanvas.getBoundingClientRect();

      // Start position relative to skyCanvas
      const startX = ((btnRect.left + btnRect.width / 2) - canvasRect.left) / canvasRect.width;
      const startY = 1.05; // just below the sky bottom

      // Target position in upper sky
      const targetX = 0.1 + Math.random() * 0.8;
      const targetY = 0.1 + Math.random() * 0.65;

      risingLights.push({
        x: startX,
        y: startY,
        startX: startX,
        startY: startY,
        targetX: targetX,
        targetY: targetY,
        progress: 0,
        speed: prefersReducedMotion ? 0.08 : (0.007 + Math.random() * 0.005),
        radius: 2.2,
        trail: []
      });
    }
  }

  function animateSky(timestamp) {
    if (!skyCtx || !skyCanvas) return;

    const width = skyCanvas.width;
    const height = skyCanvas.height;
    skyCtx.clearRect(0, 0, width, height);

    // Render settled stars
    settledStars.forEach((star) => {
      const alpha = prefersReducedMotion
        ? star.baseAlpha
        : star.baseAlpha + Math.sin(timestamp * star.twinkleSpeed + star.twinkleOffset) * 0.25;

      const px = star.x * width;
      const py = star.y * height;

      // Glow halo
      const grad = skyCtx.createRadialGradient(px, py, 0, px, py, star.radius * 3);
      grad.addColorStop(0, `rgba(255, 223, 148, ${Math.max(0, Math.min(1, alpha))})`);
      grad.addColorStop(0.5, `rgba(230, 184, 92, ${Math.max(0, Math.min(1, alpha * 0.4))})`);
      grad.addColorStop(1, 'rgba(230, 184, 92, 0)');

      skyCtx.fillStyle = grad;
      skyCtx.beginPath();
      skyCtx.arc(px, py, star.radius * 3, 0, Math.PI * 2);
      skyCtx.fill();

      // Core point
      skyCtx.fillStyle = `rgba(255, 250, 235, ${Math.max(0, Math.min(1, alpha * 1.2))})`;
      skyCtx.beginPath();
      skyCtx.arc(px, py, star.radius * 0.7, 0, Math.PI * 2);
      skyCtx.fill();
    });

    // Render rising lights
    for (let i = risingLights.length - 1; i >= 0; i--) {
      const light = risingLights[i];
      light.progress += light.speed;

      // Eased movement
      const ease = easeOutCubic(Math.min(1, light.progress));
      light.x = light.startX + (light.targetX - light.startX) * ease + Math.sin(light.progress * Math.PI * 4) * 0.02;
      light.y = light.startY + (light.targetY - light.startY) * ease;

      const px = light.x * width;
      const py = light.y * height;

      // Light trail
      light.trail.push({ x: px, y: py, alpha: 0.8 });
      if (light.trail.length > 15) light.trail.shift();

      light.trail.forEach((t, idx) => {
        const trailAlpha = (idx / light.trail.length) * 0.35;
        skyCtx.fillStyle = `rgba(255, 215, 120, ${trailAlpha})`;
        skyCtx.beginPath();
        skyCtx.arc(t.x, t.y, 1.2, 0, Math.PI * 2);
        skyCtx.fill();
      });

      // Rising light halo
      const grad = skyCtx.createRadialGradient(px, py, 0, px, py, 14);
      grad.addColorStop(0, 'rgba(255, 245, 215, 0.95)');
      grad.addColorStop(0.4, 'rgba(230, 184, 92, 0.6)');
      grad.addColorStop(1, 'rgba(230, 184, 92, 0)');

      skyCtx.fillStyle = grad;
      skyCtx.beginPath();
      skyCtx.arc(px, py, 14, 0, Math.PI * 2);
      skyCtx.fill();

      // If reached target, settle into stars array
      if (light.progress >= 1) {
        settledStars.push({
          x: light.targetX,
          y: light.targetY,
          radius: 1.5 + Math.random() * 1.5,
          twinkleSpeed: 0.008 + Math.random() * 0.012,
          twinkleOffset: Math.random() * Math.PI * 2,
          baseAlpha: 0.65
        });
        risingLights.splice(i, 1);
      }
    }

    requestAnimationFrame(animateSky);
  }

  function easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
  }

  /**
   * Ambient Night Dust Particles Layer
   * Gentle, calm motes drifting slowly in the background
   */
  let dustCanvas, dustCtx;
  let dustParticles = [];

  function initAmbientCanvas() {
    dustCanvas = document.getElementById('ambient-dust-canvas');
    if (!dustCanvas) return;
    dustCtx = dustCanvas.getContext('2d');

    resizeDustCanvas();
    window.addEventListener('resize', resizeDustCanvas);

    // 32 slow, soothing ambient motes
    const count = 32;
    for (let i = 0; i < count; i++) {
      dustParticles.push({
        x: Math.random(),
        y: Math.random(),
        radius: 0.8 + Math.random() * 1.5,
        vx: (Math.random() - 0.5) * 0.00015,
        vy: -0.00015 - Math.random() * 0.0002,
        alpha: 0.2 + Math.random() * 0.45
      });
    }

    if (!prefersReducedMotion) {
      requestAnimationFrame(animateDust);
    } else {
      renderStaticDust();
    }
  }

  function resizeDustCanvas() {
    if (!dustCanvas) return;
    dustCanvas.width = window.innerWidth * (window.devicePixelRatio || 1);
    dustCanvas.height = window.innerHeight * (window.devicePixelRatio || 1);
  }

  function animateDust() {
    if (!dustCtx || !dustCanvas) return;

    const width = dustCanvas.width;
    const height = dustCanvas.height;
    dustCtx.clearRect(0, 0, width, height);

    dustParticles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.y < 0) p.y = 1;
      if (p.x < 0) p.x = 1;
      if (p.x > 1) p.x = 0;

      const px = p.x * width;
      const py = p.y * height;

      dustCtx.fillStyle = `rgba(230, 184, 92, ${p.alpha * 0.6})`;
      dustCtx.beginPath();
      dustCtx.arc(px, py, p.radius, 0, Math.PI * 2);
      dustCtx.fill();
    });

    requestAnimationFrame(animateDust);
  }

  function renderStaticDust() {
    if (!dustCtx || !dustCanvas) return;
    const width = dustCanvas.width;
    const height = dustCanvas.height;
    dustCtx.clearRect(0, 0, width, height);

    dustParticles.forEach((p) => {
      const px = p.x * width;
      const py = p.y * height;
      dustCtx.fillStyle = `rgba(230, 184, 92, ${p.alpha * 0.4})`;
      dustCtx.beginPath();
      dustCtx.arc(px, py, p.radius, 0, Math.PI * 2);
      dustCtx.fill();
    });
  }

})();
