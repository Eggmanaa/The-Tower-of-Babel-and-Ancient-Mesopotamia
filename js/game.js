// ============================================================
//  THE TOWER OF BABEL — main game
//  World is 480 x 270 pixels drawn on a canvas; UI is HTML on top.
// ============================================================

(() => {
  const W = 480, H = 270;
  const FEET_LEVEL = 250;      // where characters stand on a level
  const FEET_CINE = 218;       // standing line in cinematics (keeps them above the dialog box)
  const feetY = () => (S.scene === 'level' ? FEET_LEVEL : FEET_CINE);
  const ITEM_Y = 158;          // top of item icons on a level
  const ITEM_SCALE = 2.5;      // 16px icon → 40px
  const CHAR_SCALE = 2;        // 16x24 sprite → 32x48
  const STAIRS_X = 330;        // where the explorer walks to climb

  const $ = s => document.querySelector(s);
  const cvs = $('#world'), ctx = cvs.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  const bg = document.createElement('canvas'); bg.width = W; bg.height = H;
  const bgx = bg.getContext('2d');

  // ---------- fit stage to window ----------
  function fit() {
    const u = Math.min(window.innerWidth / W, window.innerHeight / H);
    document.documentElement.style.setProperty('--u', u + 'px');
  }
  window.addEventListener('resize', fit); fit();

  // ---------- state ----------
  const S = {
    scene: 'title', t: 0, levelIdx: 0, found: new Set(), busy: true,
    explorer: { x: 60, dir: 1, frame: 0, animT: 0, walking: false, target: null, onArrive: null, visible: true, speed: 70 },
    priest:   { x: 300, dir: -1, frame: 0, animT: 0, walking: false, target: null, onArrive: null, visible: true, speed: 60, scared: false },
    storm: false, flash: 0, bolt: null, nextFlash: 0, shake: 0,
    particles: [], clouds: [], bgDirty: true, items: [],
  };
  for (let i = 0; i < 6; i++) S.clouds.push({ x: Math.random() * W, y: 10 + Math.random() * 70, w: 30 + Math.random() * 40, v: 4 + Math.random() * 6 });

  // =====================================================
  //  DRAWING
  // =====================================================
  const SKIES = {
    title:   ['#0b0b2a', '#141446', '#1e1e5c', '#2a2a70', '#3a3a80'],
    intro:   ['#6fb6ee', '#8ac6f2', '#a6d6f6', '#c4e4f8', '#e0f0fb'],
    level:   [
      ['#7fc4f2', '#95d0f5', '#aadcf8', '#c2e6fa', '#dcf0fc'],
      ['#6fb6ee', '#8ac6f2', '#a6d6f6', '#c4e4f8', '#e0f0fb'],
      ['#5f9fe0', '#7fb4e8', '#a3c8ee', '#c9dcf2', '#e8ecf4'],
      ['#4a78c0', '#6f8fd0', '#98a8de', '#c0bde8', '#e6cfe0'],
      ['#2c2a5a', '#4a3c7a', '#7a4c8a', '#b06a80', '#e0a070'],
    ],
    finale:  ['#15121e', '#1e1a2c', '#2a2438', '#35304a', '#403a55'],
    victory: ['#3a6ec0', '#5f8fd8', '#ffb070', '#ffd090', '#fff0c0'],
  };

  function skyFor() {
    if (S.scene === 'level') return SKIES.level[S.levelIdx];
    if (S.scene === 'finale' || S.scene === 'theology') return SKIES.finale;
    return SKIES[S.scene] || SKIES.intro;
  }

  function drawBands(c, colors, y0, y1) {
    const h = (y1 - y0) / colors.length;
    colors.forEach((col, i) => { c.fillStyle = col; c.fillRect(0, Math.floor(y0 + i * h), W, Math.ceil(h) + 1); });
  }

  function drawBricks(c, x, y, w, h, base = '#b8865a', dark = '#8a6238', bw = 12, bh = 6) {
    c.fillStyle = base; c.fillRect(x, y, w, h);
    c.fillStyle = dark;
    for (let r = 0, yy = y; yy < y + h; r++, yy += bh) {
      c.fillRect(x, yy, w, 1);
      const off = (r % 2) * (bw / 2);
      for (let xx = x + off; xx < x + w; xx += bw) c.fillRect(xx, yy, 1, bh);
    }
  }

  function drawStars(c) {
    c.fillStyle = '#fff';
    let seed = 7;
    for (let i = 0; i < 70; i++) {
      seed = (seed * 9301 + 49297) % 233280;
      const x = (seed / 233280) * W;
      seed = (seed * 9301 + 49297) % 233280;
      const y = (seed / 233280) * 150;
      c.fillRect(Math.floor(x), Math.floor(y), 1, 1);
    }
  }

  // Big stepped ziggurat used on title / intro / victory
  function drawBigZiggurat(c, cx, baseY, tiers = 7) {
    let w = 300, h = 20;
    for (let i = 0; i < tiers; i++) {
      const y = baseY - (i + 1) * h;
      drawBricks(c, cx - w / 2, y, w, h, i % 2 ? '#c4936a' : '#b8865a', '#7a5230', 10, 5);
      c.fillStyle = 'rgba(0,0,0,.18)'; c.fillRect(cx + w / 2 - 8, y, 8, h);   // shaded side
      w -= 36;
    }
    // central stairway
    c.fillStyle = '#e0c48a';
    c.fillRect(cx - 10, baseY - tiers * h, 20, tiers * h);
    c.fillStyle = '#9a7a4a';
    for (let y = baseY - tiers * h; y < baseY; y += 3) c.fillRect(cx - 10, y, 20, 1);
    // shrine on top
    const topY = baseY - tiers * h;
    c.fillStyle = '#2b4a9a'; c.fillRect(cx - 18, topY - 16, 36, 16);
    c.fillStyle = '#e0b83a'; c.fillRect(cx - 4, topY - 12, 8, 12);
  }

  function drawGround(c, y = 214) {
    drawBands(c, ['#d9b877', '#cfae6c', '#c4a262'], y, H);
    c.fillStyle = '#b8944f';
    for (let x = 0; x < W; x += 24) c.fillRect(x + (Math.floor(y) % 2) * 12, y + 20, 8, 1);
  }

  function drawPalm(c, x, y, h = 26) {
    c.fillStyle = '#7a5230'; c.fillRect(x, y - h, 3, h);
    c.fillStyle = '#2e7a2e';
    [[-9, -4], [-6, -8], [0, -10], [6, -8], [9, -4]].forEach(([dx, dy]) => c.fillRect(x + dx, y - h + dy, 6, 3));
  }

  function drawHorizon(c, y) {
    // fields, river, palms seen from up on the tower
    c.fillStyle = '#7fa84a'; c.fillRect(0, y, W, 14);
    c.fillStyle = '#5a8a3a'; for (let x = 0; x < W; x += 16) c.fillRect(x, y + 6, 8, 2);
    c.fillStyle = '#2f6fb0'; c.fillRect(0, y + 14, W, 8);
    c.fillStyle = '#7fb3e6'; for (let x = 0; x < W; x += 20) c.fillRect(x + 4, y + 17, 6, 1);
    c.fillStyle = '#7fa84a'; c.fillRect(0, y + 22, W, 6);
    for (let x = 20; x < W; x += 70) drawPalm(c, x, y + 14, 14);
  }

  // Cached static background for the current scene
  function renderBackground() {
    const c = bgx;
    c.clearRect(0, 0, W, H);   // sky + clouds are drawn live in render(); everything else is cached here

    if (S.scene === 'title' || S.scene === 'intro' || S.scene === 'victory') {
      drawPalm(c, 30, 214, 34); drawPalm(c, 450, 214, 30); drawPalm(c, 60, 214, 22);
      drawBigZiggurat(c, 240, 214);
      drawGround(c);
    }

    if (S.scene === 'level') {
      drawHorizon(c, 120);
      // low parapet along the open side
      drawBricks(c, 0, 176, W, 38, '#c4936a', '#8a6238', 12, 6);
      c.fillStyle = '#e0c48a'; c.fillRect(0, 174, W, 3);
      // inner wall of the next tier with niches
      drawBricks(c, 0, 50, 340, 164, '#b8865a', '#8a6238', 12, 6);
      c.fillStyle = 'rgba(0,0,0,.15)';
      for (let x = 20; x < 330; x += 48) c.fillRect(x, 60, 10, 150);
      c.fillStyle = '#e0c48a'; c.fillRect(0, 48, 344, 3);
      c.fillStyle = 'rgba(0,0,0,.25)'; c.fillRect(340, 48, 4, 166);
      // decorative band of blue glazed tiles
      c.fillStyle = '#2b4a9a'; c.fillRect(0, 90, 340, 8);
      c.fillStyle = '#e0b83a'; for (let x = 6; x < 340; x += 24) c.fillRect(x, 92, 4, 4);
      // stairs going up on the right
      for (let i = 0; i < 8; i++) {
        const sx = 344 + i * 14, sy = 214 - (i + 1) * 20;
        drawBricks(c, sx, sy, 14, 214 - sy, '#d0a070', '#9a7040', 14, 5);
        c.fillStyle = '#e8d0a0'; c.fillRect(sx, sy, 14, 2);
      }
      // terrace floor
      drawBricks(c, 0, 214, W, 56, '#cfae6c', '#a8884a', 24, 8);
      // pedestals for items
      S.items.forEach(it => {
        drawBricks(c, it.x - 22, 200, 44, 14, '#e0c48a', '#a8884a', 11, 7);
        c.fillStyle = '#f0dca8'; c.fillRect(it.x - 24, 198, 48, 3);
      });
    }

    if (S.scene === 'finale' || S.scene === 'theology') {
      // very top of the tower: narrow terrace and a small shrine
      drawBricks(c, 150, 130, 180, 84, '#2b4a9a', '#1b2f6a', 12, 6);       // blue glazed shrine
      c.fillStyle = '#e0b83a'; c.fillRect(150, 126, 180, 4); c.fillRect(226, 160, 28, 54);
      c.fillStyle = '#1a1a2a'; c.fillRect(230, 166, 20, 48);
      c.fillStyle = '#e0b83a'; for (let x = 156; x < 330; x += 20) c.fillRect(x, 140, 6, 6);
      drawBricks(c, 0, 214, W, 56, '#cfae6c', '#a8884a', 24, 8);
      c.fillStyle = '#e0c48a'; c.fillRect(0, 212, W, 3);
      // low edge walls
      drawBricks(c, 0, 196, 60, 18, '#c4936a', '#8a6238'); drawBricks(c, 420, 196, 60, 18, '#c4936a', '#8a6238');
    }
    S.bgDirty = false;
  }

  function drawCloud(c, cl, dark) {
    c.fillStyle = dark ? '#3a3450' : 'rgba(255,255,255,.9)';
    const x = Math.floor(cl.x), y = Math.floor(cl.y), w = Math.floor(cl.w);
    c.fillRect(x, y + 4, w, 6);
    c.fillRect(x + 6, y, w - 12, 5);
    c.fillRect(x + w * 0.3, y - 3, w * 0.3, 4);
  }

  function drawActor(a, who) {
    if (!a.visible) return;
    const fy = feetY(); let x = Math.floor(a.x - 16), y = fy - 48;
    if (a.scared) { x += Math.floor(Math.sin(S.t * 40) * 2); y -= Math.abs(Math.floor(Math.sin(S.t * 12) * 3)); }
    // shadow
    ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fillRect(x + 6, fy - 2, 20, 3);
    Sprites.drawChar(ctx, who, x, y, CHAR_SCALE, a.walking ? a.frame : 0, a.dir < 0);
  }

  function drawItems() {
    S.items.forEach(it => {
      const found = S.found.has(it.id);
      const bob = found ? 0 : Math.round(Math.sin(S.t * 4 + it.x) * 2);
      const ix = it.x - 20, iy = ITEM_Y + bob;
      if (!found) {
        // glow ring + arrow
        ctx.fillStyle = `rgba(255, 230, 120, ${0.25 + 0.2 * Math.sin(S.t * 5)})`;
        ctx.fillRect(ix - 5, iy - 5, 50, 50);
        ctx.fillStyle = '#ffe66d';
        const ay = iy - 16 + Math.round(Math.sin(S.t * 6) * 3);
        ctx.fillRect(it.x - 2, ay, 4, 6); ctx.fillRect(it.x - 5, ay + 6, 10, 2); ctx.fillRect(it.x - 3, ay + 8, 6, 2); ctx.fillRect(it.x - 1, ay + 10, 2, 2);
      }
      Sprites.drawIcon(ctx, it.icon, ix, iy, ITEM_SCALE);
      if (found) { ctx.fillStyle = '#4caf50'; ctx.fillRect(it.x + 12, iy - 6, 12, 12); ctx.fillStyle = '#fff'; ctx.fillRect(it.x + 15, iy - 1, 2, 4); ctx.fillRect(it.x + 17, iy - 3, 2, 6); }
    });
  }

  function drawParticles() {
    S.particles.forEach(p => { ctx.fillStyle = p.color; ctx.globalAlpha = Math.max(0, p.life); ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size); });
    ctx.globalAlpha = 1;
  }

  function drawStorm() {
    if (S.flash > 0) {
      if (S.bolt) {
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.beginPath();
        S.bolt.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke();
        ctx.strokeStyle = '#ffe66d'; ctx.lineWidth = 1; ctx.stroke();
      }
      ctx.fillStyle = `rgba(255,255,255,${S.flash * 0.7})`; ctx.fillRect(0, 0, W, H);
    }
  }

  function render() {
    if (S.bgDirty) renderBackground();
    ctx.save();
    if (S.shake > 0) ctx.translate(Math.round((Math.random() - .5) * 6 * S.shake), Math.round((Math.random() - .5) * 6 * S.shake));
    drawBands(ctx, skyFor(), 0, 214);
    if (S.scene === 'title') drawStars(ctx);
    const dark = S.scene === 'finale' || S.scene === 'theology';
    if (S.scene !== 'title') S.clouds.forEach(cl => drawCloud(ctx, cl, dark));
    ctx.drawImage(bg, 0, 0);
    if (S.scene === 'level') drawItems();
    drawActor(S.priest, 'priest');
    drawActor(S.explorer, 'explorer');
    drawParticles();
    drawStorm();
    ctx.restore();
  }

  // =====================================================
  //  UPDATE
  // =====================================================
  function moveActor(a, dt) {
    if (a.target == null) { if (a.walking && a === S.explorer) AudioMgr.stopLoop('step'); a.walking = false; return; }
    const dx = a.target - a.x;
    if (Math.abs(dx) < 2) {
      a.x = a.target; a.target = null; a.walking = false; a.frame = 0;
      if (a === S.explorer) AudioMgr.stopLoop('step');
      const cb = a.onArrive; a.onArrive = null; if (cb) cb();
      return;
    }
    a.dir = dx > 0 ? 1 : -1;
    a.x += a.dir * a.speed * dt;
    if (!a.walking && a === S.explorer) AudioMgr.loopSfx('step', 0.5);
    a.walking = true;
    a.animT += dt;
    if (a.animT > 0.16) { a.animT = 0; a.frame ^= 1; if (a === S.explorer && a.frame && !AudioMgr.hasFile('step')) AudioMgr.sfx('step'); }
  }

  function spawnSparkles(x, y, n = 20, colors = ['#fff', '#ffe66d', '#7fb3e6']) {
    for (let i = 0; i < n; i++) S.particles.push({
      x, y, vx: (Math.random() - .5) * 80, vy: -Math.random() * 90, life: 1, size: 2,
      color: colors[Math.floor(Math.random() * colors.length)], g: 60,
    });
  }
  function spawnConfetti() {
    for (let i = 0; i < 6; i++) S.particles.push({
      x: Math.random() * W, y: -5, vx: (Math.random() - .5) * 30, vy: 30 + Math.random() * 40, life: 3, size: 3,
      color: ['#e0b83a', '#c0392b', '#2b4a9a', '#4caf50', '#fff'][i % 5], g: 0, fade: .3,
    });
  }

  function lightning() {
    S.flash = 1;
    const pts = []; let x = 200 + Math.random() * 100, y = 0;
    while (y < 130) { pts.push([x, y]); x += (Math.random() - .5) * 40; y += 15 + Math.random() * 15; }
    pts.push([240, 130]); S.bolt = pts;
    S.shake = 1;
    AudioMgr.sfx('lightning'); setTimeout(() => AudioMgr.sfx('thunder'), 150);
  }

  let last = 0, lastTick = 0;
  function loop(ts) { tick(ts); requestAnimationFrame(loop); }
  // fallback ticker: keeps the game moving if requestAnimationFrame is throttled (background tab)
  setInterval(() => { const now = performance.now(); if (now - lastTick > 90) tick(now); }, 33);
  function tick(ts) {
    lastTick = performance.now();
    const dt = Math.min(0.05, (ts - last) / 1000 || 0); last = ts; S.t += dt;
    moveActor(S.explorer, dt); moveActor(S.priest, dt);
    S.clouds.forEach(cl => { cl.x += cl.v * dt * (S.storm ? 6 : 1); if (cl.x > W + 10) { cl.x = -cl.w - 10; cl.y = 10 + Math.random() * 70; } });
    S.particles.forEach(p => { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += (p.g || 0) * dt; p.life -= (p.fade || 1.2) * dt; });
    S.particles = S.particles.filter(p => p.life > 0 && p.y < H + 10);
    if (S.flash > 0) S.flash = Math.max(0, S.flash - dt * 3);
    if (S.shake > 0) S.shake = Math.max(0, S.shake - dt * 2);
    if (S.storm) { S.nextFlash -= dt; if (S.nextFlash <= 0) { lightning(); S.nextFlash = 2 + Math.random() * 3; } }
    if (S.scene === 'victory' && Math.random() < 0.3) spawnConfetti();
    render();
  }
  requestAnimationFrame(loop);

  // =====================================================
  //  UI: dialog
  // =====================================================
  const dlg = $('#dialog'), dlgText = dlg.querySelector('.text'), dlgWho = dlg.querySelector('.who'),
        dlgPortrait = dlg.querySelector('.portrait'), dlgNext = dlg.querySelector('.next');
  const NAMES = { narrator: 'Narrator', explorer: 'Explorer', priest: 'Ziggurat Priest' };
  let typeTimer = null, dialogNext = null;

  function typeText(el, text) {
    clearInterval(typeTimer); el.textContent = ''; let i = 0;
    typeTimer = setInterval(() => {
      el.textContent = text.slice(0, ++i);
      if (AudioMgr.hasFile('blip') ? text[i - 1] === ' ' : i % 3 === 0) AudioMgr.sfx('blip', 0.35);
      if (i >= text.length) clearInterval(typeTimer);
    }, 28);
  }

  function runDialog(lines, onDone) {
    S.busy = true; dlg.hidden = false; let i = 0;
    const show = () => {
      const ln = lines[i];
      Sprites.drawPortrait(dlgPortrait, ln.who);
      dlgWho.textContent = NAMES[ln.who];
      typeText(dlgText, ln.text);
      if (ln.fx) doFx(ln.fx);
      AudioMgr.speak(ln.voice, ln.text, ln.who);
    };
    dialogNext = () => {
      AudioMgr.sfx('tap');
      i++;
      if (i >= lines.length) { dlg.hidden = true; dialogNext = null; clearInterval(typeTimer); AudioMgr.stopVoice(); S.busy = false; onDone && onDone(); }
      else show();
    };
    show();
  }
  dlgNext.addEventListener('click', () => dialogNext && dialogNext());

  function doFx(fx) {
    const ex = S.explorer, pr = S.priest;
    switch (fx) {
      case 'arrive': ex.visible = true; spawnSparkles(ex.x, feetY() - 24, 40); AudioMgr.sfx('whoosh'); break;
      case 'priest-enter': pr.visible = true; pr.x = 530; pr.target = 310; break;
      case 'storm': S.storm = true; S.nextFlash = 0; AudioMgr.playMusic('mus_finale'); AudioMgr.loopSfx('wind', 0.4); break;
      case 'thunder': lightning(); break;
      case 'confused': pr.scared = true; AudioMgr.sfx('murmur'); break;
      case 'flee': pr.speed = 140; pr.target = 560; pr.onArrive = () => { pr.visible = false; }; AudioMgr.sfx('run'); break;
      case 'calm': S.storm = false; pr.scared = false; AudioMgr.stopLoop('wind'); AudioMgr.playMusic('mus_intro'); break;
    }
  }

  // =====================================================
  //  UI: info card
  // =====================================================
  const card = $('#card'), cardImg = card.querySelector('img'), cardPh = card.querySelector('.placeholder'),
        cardH = card.querySelector('h2'), cardP = card.querySelector('p'), cardCredit = card.querySelector('.credit');
  let cardItem = null, credits = {};
  // photo credits (author + license) shown under each Wikimedia Commons image
  fetch('assets/images/credits.json').then(r => r.ok ? r.json() : {}).then(j => { credits = j || {}; }).catch(() => {});

  function openCard(item) {
    cardItem = item; S.busy = true;
    AudioMgr.sfx('open');
    cardH.textContent = item.name; cardP.textContent = item.text;
    cardImg.hidden = true; cardPh.hidden = false;
    const pc = cardPh.querySelector('canvas'), pcx = pc.getContext('2d');
    pcx.imageSmoothingEnabled = false; pcx.clearRect(0, 0, 96, 96);
    Sprites.drawIcon(pcx, item.icon, 0, 0, 6);
    const cr = credits[item.image.replace(/\.\w+$/, '')];
    cardCredit.textContent = '';
    cardImg.onload = () => {
      cardImg.hidden = false; cardPh.hidden = true;
      if (cr) cardCredit.textContent = `${cr.author || 'Unknown'} · Wikimedia Commons · ${cr.license || ''}`;
    };
    cardImg.onerror = () => { cardImg.hidden = true; cardPh.hidden = false; };
    cardImg.src = 'assets/images/' + item.image;
    card.hidden = false;
    AudioMgr.speak(item.voice, item.text, 'narrator');
  }
  card.querySelector('.speak').addEventListener('click', () => { AudioMgr.sfx('tap'); AudioMgr.speak(cardItem.voice, cardItem.text, 'narrator'); });
  card.querySelector('.ok').addEventListener('click', () => {
    AudioMgr.sfx('close'); AudioMgr.stopVoice(); card.hidden = true; S.busy = false;
    if (!S.found.has(cardItem.id)) {
      S.found.add(cardItem.id); AudioMgr.sfx('item');
      spawnSparkles(cardItem.x, ITEM_Y + 20, 25);
      updateHud();
      if (S.found.size === S.items.length) {
        $('#btn-quiz').hidden = false;
        const h = GAME_DATA.feedback.hintReady; AudioMgr.speak(h.voice, h.text, 'narrator');
      }
    }
  });

  // =====================================================
  //  UI: quiz
  // =====================================================
  const quiz = $('#quiz'), qText = quiz.querySelector('.q-text'), qAns = quiz.querySelector('.answers'), qFb = quiz.querySelector('.feedback');
  let readToken = 0;

  async function readQuestion(q, btns) {
    const tok = ++readToken;
    await AudioMgr.speak(q.voice, q.text, 'narrator');
    for (let i = 0; i < q.answers.length; i++) {
      if (tok !== readToken) return;
      btns[i].classList.add('reading');
      await AudioMgr.speak(q.answers[i].voice, q.answers[i].text, 'narrator');
      btns[i].classList.remove('reading');
    }
  }

  function showQuiz(q, onCorrect) {
    S.busy = true; quiz.hidden = false; qFb.textContent = ''; qFb.className = 'feedback';
    qText.textContent = q.text; qAns.innerHTML = '';
    const btns = q.answers.map((a, i) => {
      const b = document.createElement('button');
      b.innerHTML = `<span class="letter">${'ABC'[i]}</span><span>${a.text}</span>`;
      b.addEventListener('click', async () => {
        readToken++; AudioMgr.stopVoice();
        if (a.correct) {
          btns.forEach(x => x.disabled = true); b.classList.add('right');
          AudioMgr.sfx('correct');
          const f = GAME_DATA.feedback.correct[Math.floor(Math.random() * 3)];
          qFb.textContent = f.text; qFb.className = 'feedback good';
          spawnSparkles(240, 100, 40);
          await AudioMgr.speak(f.voice, f.text, 'narrator');
          quiz.hidden = true; S.busy = false; onCorrect();
        } else {
          b.classList.add('nope'); b.disabled = true;
          AudioMgr.sfx('wrong');
          const f = GAME_DATA.feedback.wrong[Math.floor(Math.random() * 2)];
          qFb.textContent = f.text; qFb.className = 'feedback bad';
          await AudioMgr.speak(f.voice, f.text, 'narrator');
        }
      });
      // tap the letter to hear that answer again
      b.querySelector('.letter').addEventListener('click', e => { e.stopPropagation(); readToken++; AudioMgr.speak(a.voice, a.text, 'narrator'); });
      qAns.appendChild(b); return b;
    });
    readQuestion(q, btns);
  }

  // =====================================================
  //  FLOW
  // =====================================================
  const hud = $('#hud'), btnQuiz = $('#btn-quiz'), fade = $('#fade');

  function fadeTo(fn) { fade.classList.add('on'); setTimeout(() => { fn(); setTimeout(() => fade.classList.remove('on'), 80); }, 520); }

  function updateHud() {
    const L = GAME_DATA.levels[S.levelIdx];
    hud.querySelector('.hud-level').textContent = `Level ${L.id}: ${L.name}`;
    hud.querySelector('.hud-progress').textContent = `Found ${S.found.size} of ${S.items.length}`;
  }

  function resetActors() {
    Object.assign(S.explorer, { x: 60, dir: 1, target: null, onArrive: null, walking: false, visible: true, speed: 70 });
    Object.assign(S.priest, { x: 300, dir: -1, target: null, onArrive: null, walking: false, visible: true, speed: 60, scared: false });
  }

  function startIntro() {
    S.scene = 'intro'; S.bgDirty = true; resetActors();
    S.explorer.x = 110; S.explorer.visible = false; S.priest.visible = false;
    $('#screen-title').hidden = true;
    AudioMgr.playMusic('mus_intro');
    runDialog(GAME_DATA.intro, () => fadeTo(() => startLevel(0)));
  }

  function startLevel(i) {
    S.scene = 'level'; S.levelIdx = i; S.found.clear(); S.storm = false;
    const L = GAME_DATA.levels[i];
    const n = L.items.length, start = 46, end = 296;
    S.items = L.items.map((it, k) => Object.assign({}, it, { x: Math.round(n > 1 ? start + k * (end - start) / (n - 1) : 170) }));
    S.bgDirty = true; resetActors(); S.explorer.x = 24; S.priest.x = 318;
    hud.hidden = false; btnQuiz.hidden = true; updateHud();
    AudioMgr.playMusic('mus_explore'); if (i > 0) AudioMgr.sfx('door');
    const lines = [L.priestIntro]; if (i === 0) lines.push(GAME_DATA.feedback.hintTap);
    runDialog(lines);
  }

  btnQuiz.addEventListener('click', () => {
    AudioMgr.sfx('tap'); btnQuiz.hidden = true;
    AudioMgr.playMusic('mus_quiz');
    showQuiz(GAME_DATA.levels[S.levelIdx].question, levelComplete);
  });

  function levelComplete() {
    AudioMgr.sfx('levelup'); AudioMgr.playMusic('mus_explore');
    const next = S.levelIdx + 1;
    runDialog([GAME_DATA.feedback.levelUp], () => {
      S.busy = true;
      S.priest.target = STAIRS_X + 10; S.priest.onArrive = () => { S.priest.visible = false; };
      S.explorer.target = STAIRS_X;
      S.explorer.onArrive = () => { AudioMgr.sfx('stairs'); fadeTo(() => next < GAME_DATA.levels.length ? startLevel(next) : startFinale()); };
    });
  }

  function startFinale() {
    S.scene = 'finale'; S.bgDirty = true; resetActors(); hud.hidden = true;
    S.explorer.x = 130; S.priest.x = 330;
    AudioMgr.playMusic('mus_explore');
    runDialog(GAME_DATA.finale, () => {
      S.scene = 'theology'; S.bgDirty = true;
      AudioMgr.playMusic('mus_quiz');
      showQuiz(GAME_DATA.theology[0], () => showQuiz(GAME_DATA.theology[1], () => fadeTo(startVictory)));
    });
  }

  function startVictory() {
    S.scene = 'victory'; S.bgDirty = true; resetActors(); S.storm = false; S.flash = 0; AudioMgr.stopLoop('wind');
    S.explorer.x = 200; S.priest.visible = false;
    AudioMgr.playMusic('mus_victory');
    const v = GAME_DATA.victory; AudioMgr.speak(v.voice, v.text, 'narrator');
    $('#screen-victory').hidden = false;
  }

  function backToTitle() {
    S.scene = 'title'; S.bgDirty = true; resetActors(); S.particles = []; S.priest.visible = false; S.explorer.x = 60;
    $('#screen-victory').hidden = true; $('#screen-title').hidden = false;
    AudioMgr.playMusic('mus_title');
  }

  // =====================================================
  //  INPUT
  // =====================================================
  let audioReady = false;
  function ensureAudio() {
    if (!audioReady) { audioReady = true; AudioMgr.init(); if (S.scene === 'title') AudioMgr.playMusic('mus_title'); }
  }
  document.addEventListener('pointerdown', ensureAudio, { capture: true });
  document.addEventListener('keydown', ensureAudio, { capture: true });

  $('#btn-start').addEventListener('click', () => { AudioMgr.sfx('tap'); startIntro(); });
  $('#btn-again').addEventListener('click', () => { AudioMgr.sfx('tap'); backToTitle(); });
  $('#btn-mute').addEventListener('click', e => {
    const m = !AudioMgr.isMuted(); AudioMgr.setMuted(m); e.currentTarget.textContent = m ? '🔇' : '🔊';
  });

  // Tap in the world: walk there, or walk to an item and open it
  cvs.addEventListener('pointerdown', e => {
    if (S.scene !== 'level' || S.busy) return;
    const r = cvs.getBoundingClientRect();
    const wx = (e.clientX - r.left) / r.width * W, wy = (e.clientY - r.top) / r.height * H;
    const ex = S.explorer;
    const hit = S.items.find(it => Math.abs(wx - it.x) < 26 && wy > ITEM_Y - 24 && wy < 216);
    AudioMgr.sfx('tap');
    if (hit) { ex.target = hit.x; ex.onArrive = () => openCard(hit); }
    else if (wy > 100) { ex.target = Math.max(20, Math.min(STAIRS_X, wx)); ex.onArrive = null; }
  });

  // Keyboard: arrows walk, space/enter interacts
  const keys = {};
  document.addEventListener('keydown', e => {
    keys[e.key] = true;
    if (e.key === ' ' || e.key === 'Enter') {
      if (!dlg.hidden && dialogNext) { e.preventDefault(); dialogNext(); return; }
      if (S.scene === 'level' && !S.busy) {
        const near = S.items.find(it => Math.abs(S.explorer.x - it.x) < 26);
        if (near) openCard(near);
      }
    }
  });
  document.addEventListener('keyup', e => { keys[e.key] = false; });
  setInterval(() => {
    if (S.scene !== 'level' || S.busy) return;
    const ex = S.explorer;
    if (keys.ArrowLeft)  { ex.target = Math.max(20, ex.x - 12); ex.onArrive = null; }
    if (keys.ArrowRight) { ex.target = Math.min(STAIRS_X, ex.x + 12); ex.onArrive = null; }
  }, 50);

  // title screen setup
  S.priest.visible = false;

  // Dev shortcut: ?start=level3 | ?start=finale | ?start=victory  (skips straight to that scene)
  const startAt = new URLSearchParams(location.search).get('start');
  if (startAt) {
    const go = () => {
      $('#screen-title').hidden = true;
      const m = /^level(\d)$/.exec(startAt);
      if (m) startLevel(Math.min(4, Math.max(0, +m[1] - 1)));
      else if (startAt === 'finale') startFinale();
      else if (startAt === 'victory') startVictory();
      else if (startAt === 'intro') startIntro();
    };
    document.addEventListener('pointerdown', () => setTimeout(go, 50), { once: true });
    $('#btn-start').textContent = '▶ Jump to ' + startAt;
  }
  window.__game = S; // for debugging in the console
})();
