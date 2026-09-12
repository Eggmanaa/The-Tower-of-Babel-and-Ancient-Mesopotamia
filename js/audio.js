// ============================================================
//  Audio manager
//  - Voice:  assets/audio/voice/<id>.mp3   → fallback: browser text-to-speech
//  - Music:  assets/audio/music/<id>.mp3   → fallback: built-in chiptune synth
//  - SFX:    assets/audio/sfx/<id>.mp3     → fallback: built-in synth blips
//  Drop real files into those folders and they are used automatically.
// ============================================================

const AudioMgr = (() => {
  let ctx = null, master = null, muted = false;
  const known = {};              // url -> true/false (does the file exist?)
  const ROLE_VOICE = {
    narrator: { pitch: 1.0,  rate: 0.88 },
    explorer: { pitch: 1.25, rate: 0.95 },
    priest:   { pitch: 0.7,  rate: 0.9  },
  };

  // ---------- setup ----------
  function init() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = muted ? 0 : 1;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    // warm up speech voices list (Chrome loads it lazily)
    if ('speechSynthesis' in window) speechSynthesis.getVoices();
    // warm the "does this file exist" cache for every sound effect
    Object.values(SFX_FILES).flat().forEach(f => fileExists(`assets/audio/sfx/${f}.mp3`));
  }

  async function fileExists(url) {
    if (url in known) return known[url];
    if (location.protocol === 'file:') { known[url] = false; return false; }
    try {
      const r = await fetch(url, { method: 'HEAD', cache: 'no-cache' });
      // Cloudflare Pages returns 404 for missing files; also make sure it's not an HTML 404 page
      const type = r.headers.get('content-type') || '';
      known[url] = r.ok && !type.includes('text/html');
    } catch (e) { known[url] = false; }
    return known[url];
  }

  function setMuted(m) {
    muted = m;
    if (master) master.gain.value = m ? 0 : 1;
    if (music.el) music.el.muted = m;
    Object.values(loops).forEach(a => a.muted = m);
    if (m) stopVoice();
  }
  function isMuted() { return muted; }

  // ---------- VOICE ----------
  let current = null;
  function stopVoice() { if (current) { const c = current; current = null; c.cancel(); } }

  function pickVoice() {
    const voices = speechSynthesis.getVoices();
    const prefs = [/Google US English/i, /Samantha/i, /Microsoft (Aria|Jenny|Zira)/i, /en[-_]US/i, /en/i];
    for (const p of prefs) { const v = voices.find(v => p.test(v.name) || p.test(v.lang)); if (v) return v; }
    return voices[0] || null;
  }

  // Returns a promise that resolves when the line finishes (or is cancelled)
  function speak(id, text, role = 'narrator') {
    return new Promise(async resolve => {
      stopVoice();
      if (muted) { resolve(); return; }
      let done = false;
      const finish = () => { if (done) return; done = true; if (current && current.id === id) current = null; resolve(); };
      const url = `assets/audio/voice/${id}.mp3`;
      if (await fileExists(url)) {
        const a = new Audio(url);
        a.onended = finish; a.onerror = finish;
        current = { id, cancel: () => { a.pause(); finish(); } };
        a.play().catch(finish);
      } else if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        const rv = ROLE_VOICE[role] || ROLE_VOICE.narrator;
        u.pitch = rv.pitch; u.rate = rv.rate; u.volume = 1;
        const v = pickVoice(); if (v) u.voice = v;
        u.onend = finish; u.onerror = finish;
        current = { id, cancel: () => { speechSynthesis.cancel(); finish(); } };
        setTimeout(() => { if (!done) speechSynthesis.speak(u); }, 60);
        // safety net: some browsers never fire onend
        setTimeout(() => finish(), 1500 + text.length * 90);
      } else {
        setTimeout(finish, Math.max(800, text.length * 50));
      }
    });
  }

  // ---------- SYNTH HELPERS ----------
  const NOTE_IDX = { C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, F: 5, 'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11 };
  function noteFreq(n) {
    const m = /^([A-G][#b]?)(\d)$/.exec(n); if (!m) return 0;
    const semis = NOTE_IDX[m[1]] + (parseInt(m[2]) - 4) * 12 - 9; // relative to A4
    return 440 * Math.pow(2, semis / 12);
  }
  function tone(freq, dur, type = 'square', vol = 0.15, when = 0, slideTo = null) {
    if (!ctx || muted) return;
    const t0 = ctx.currentTime + when;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t0);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(master);
    o.start(t0); o.stop(t0 + dur + 0.05);
  }
  function noise(dur, vol = 0.3, filterFreq = 800, when = 0, sweepTo = null) {
    if (!ctx || muted) return;
    const t0 = ctx.currentTime + when;
    const len = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource(); src.buffer = buf;
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.setValueAtTime(filterFreq, t0);
    if (sweepTo) f.frequency.exponentialRampToValueAtTime(sweepTo, t0 + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(f); f.connect(g); g.connect(master);
    src.start(t0);
  }

  // ---------- SFX ----------
  const SFX_SYNTH = {
    tap:      () => tone(880, 0.05, 'square', 0.1),
    blip:     () => tone(1400, 0.03, 'square', 0.05),
    item:     () => { tone(1200, 0.08, 'square', 0.12); tone(1800, 0.14, 'square', 0.12, 0.08); },
    correct:  () => [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.14, 'square', 0.14, i * 0.1)),
    wrong:    () => { tone(300, 0.18, 'sawtooth', 0.08); tone(220, 0.3, 'sawtooth', 0.08, 0.18); },
    levelup:  () => [392, 523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, 0.16, 'square', 0.14, i * 0.09)),
    thunder:  () => { noise(1.8, 0.6, 500, 0, 60); tone(50, 1.2, 'sine', 0.3, 0, 30); },
    lightning:() => noise(0.15, 0.4, 6000),
    whoosh:   () => noise(0.7, 0.25, 300, 0, 4000),
    step:     () => tone(140, 0.04, 'triangle', 0.08),
    sparkle:  () => [1568, 2093, 2637].forEach((f, i) => tone(f, 0.1, 'sine', 0.1, i * 0.06)),
    run:      () => [0, 0.12, 0.24, 0.36, 0.48].forEach(t => tone(160, 0.04, 'triangle', 0.1, t)),
    open:     () => tone(600, 0.08, 'square', 0.08, 0, 900),
    close:    () => tone(900, 0.08, 'square', 0.08, 0, 600),
  };
  // Play a file and fade out its last `fadeSec` seconds (trimmed stings end abruptly otherwise)
  function playFileWithFade(url, vol = 0.9, fadeSec = 0.8) {
    const a = new Audio(url); a.volume = vol;
    const iv = setInterval(() => {
      if (!a.duration || a.paused) return;
      const left = a.duration - a.currentTime;
      if (left < fadeSec) a.volume = Math.max(0, vol * left / fadeSec);
    }, 50);
    a.onended = a.onerror = () => clearInterval(iv);
    a.play().catch(() => clearInterval(iv));
    return a;
  }
  // game sfx id → file name(s) in assets/audio/sfx (an array = pick one at random)
  const SFX_FILES = {
    tap: 'sfx_tap', blip: 'sfx_text_blip', item: 'sfx_item', correct: 'sfx_correct', wrong: 'sfx_wrong',
    levelup: 'sfx_levelup', thunder: ['sfx_thunder_1', 'sfx_thunder_2'], lightning: 'sfx_lightning',
    whoosh: 'sfx_time_travel', step: 'sfx_footsteps', sparkle: 'sfx_sparkle', run: 'sfx_run_away',
    open: 'sfx_page_turn', close: 'sfx_close', door: 'sfx_door', stairs: 'sfx_stairs', wind: 'sfx_wind',
    murmur: 'sfx_crowd_murmur', glow: 'sfx_item_glow', menu_open: 'sfx_menu_open', menu_close: 'sfx_menu_close',
  };
  function sfxUrl(name) {
    let f = SFX_FILES[name] || `sfx_${name}`;
    if (Array.isArray(f)) f = f[Math.floor(Math.random() * f.length)];
    return `assets/audio/sfx/${f}.mp3`;
  }
  async function sfx(name, vol = 0.9) {
    if (muted) return;
    const url = sfxUrl(name);
    if (await fileExists(url)) { playFileWithFade(url, vol, name === 'blip' ? 0 : 0.3); return; }
    if (!ctx) return;
    (SFX_SYNTH[name] || SFX_SYNTH.tap)();
  }
  // Looping ambience / footsteps. Returns nothing if no file exists (caller falls back to one-shots).
  const loops = {};
  async function loopSfx(name, vol = 0.5) {
    if (loops[name]) return;
    const url = sfxUrl(name);
    if (!(await fileExists(url))) return;
    if (loops[name]) return;
    const a = new Audio(url); a.loop = true; a.volume = vol; a.muted = muted;
    loops[name] = a; a.play().catch(() => {});
  }
  function stopLoop(name) { const a = loops[name]; if (a) { a.pause(); delete loops[name]; } }
  function hasFile(name) { return known[sfxUrl(name)] === true; }

  // ---------- MUSIC ----------
  // Fallback chiptune patterns. Each token = one eighth note. '-' = rest, '=' = hold.
  const TRACKS = {
    mus_title:   { bpm: 132, vol: 0.06,
      lead: 'C5 = E5 G5 C6 = G5 E5 F5 = A5 C6 F6 = C6 A5 G5 = B5 D6 G6 = D6 B5 C6 = G5 E5 C5 = = =',
      bass: 'C3 C3 G3 G3 C3 C3 G3 G3 F3 F3 C4 C4 F3 F3 C4 C4 G3 G3 D4 D4 G3 G3 D4 D4 C3 C3 G3 G3 C3 C3 G3 G3' },
    mus_intro:   { bpm: 92, vol: 0.05,
      lead: 'D5 = F5 = A5 = G5 F5 E5 = = = D5 = = = D5 = F5 = A5 = Bb5 A5 G5 = = = F5 = E5 =',
      bass: 'D3 = = = A3 = = = Bb2 = = = A2 = = = D3 = = = A3 = = = G2 = = = A2 = = =' },
    mus_explore: { bpm: 112, vol: 0.05,
      lead: 'G5 A5 B5 = D6 = B5 A5 G5 = E5 = D5 = = = E5 F#5 G5 = A5 = G5 F#5 E5 = D5 = = = = =',
      bass: 'G3 = D4 = E3 = B3 = C3 = G3 = D3 = A3 = G3 = D4 = E3 = B3 = C3 = G3 = D3 = D3 =' },
    mus_quiz:    { bpm: 100, vol: 0.045,
      lead: 'A4 = C5 = E5 = C5 = A4 = C5 = E5 = G5 = F4 = A4 = C5 = A4 = E4 = G#4 = B4 = = =',
      bass: 'A2 = = = A2 = = = A2 = = = A2 = = = F2 = = = F2 = = = E2 = = = E2 = = =' },
    mus_finale:  { bpm: 140, vol: 0.06,
      lead: 'E5 = E5 = E5 D#5 E5 = B4 = = = C5 = B4 = E5 = E5 = E5 D#5 E5 = G5 = F#5 = E5 = = =',
      bass: 'E2 E2 E2 E2 E2 E2 E2 E2 C2 C2 C2 C2 C2 C2 C2 C2 E2 E2 E2 E2 E2 E2 E2 E2 B1 B1 B1 B1 B1 B1 B1 B1' },
    mus_victory: { bpm: 150, vol: 0.06,
      lead: 'C5 C5 = C5 = G4 = = E5 E5 = E5 = C5 = = G5 = E5 = C5 = E5 = G5 = = = C6 = = =',
      bass: 'C3 = G3 = C3 = G3 = C3 = G3 = C3 = G3 = F3 = C4 = F3 = C4 = G3 = D4 = C3 = = =' },
  };
  const music = { id: null, el: null, timer: null, nextTime: 0, step: 0, seq: null };

  const MUSIC_VOL = 0.45;
  function fadeOutAndStop(el) {
    const iv = setInterval(() => {
      el.volume = Math.max(0, el.volume - 0.05);
      if (el.volume <= 0.01) { clearInterval(iv); el.pause(); }
    }, 50);
  }
  function stopMusic() {
    if (music.el) { fadeOutAndStop(music.el); music.el = null; }
    if (music.timer) { clearInterval(music.timer); music.timer = null; }
    music.id = null;
  }

  async function playMusic(id) {
    if (music.id === id) return;
    stopMusic();
    music.id = id;
    const url = `assets/audio/music/${id}.mp3`;
    if (await fileExists(url)) {
      if (music.id !== id) return;
      const a = new Audio(url); a.loop = true; a.volume = 0; a.muted = muted;
      music.el = a; a.play().catch(() => {});
      const iv = setInterval(() => {              // fade in
        if (music.el !== a) { clearInterval(iv); return; }
        a.volume = Math.min(MUSIC_VOL, a.volume + 0.05);
        if (a.volume >= MUSIC_VOL) clearInterval(iv);
      }, 60);
      return;
    }
    if (!ctx) return;
    const tr = TRACKS[id]; if (!tr) return;
    const lead = tr.lead.split(/\s+/), bass = tr.bass.split(/\s+/);
    const stepDur = 60 / tr.bpm / 2;
    const len = Math.max(lead.length, bass.length);
    music.step = 0; music.nextTime = ctx.currentTime + 0.1;
    const schedule = () => {
      while (music.nextTime < ctx.currentTime + 0.3) {
        const i = music.step % len;
        const play = (arr, type, vol, octaveShift) => {
          const n = arr[i % arr.length];
          if (n && n !== '-' && n !== '=') {
            let hold = 1; for (let k = i + 1; k < i + 8 && arr[k % arr.length] === '='; k++) hold++;
            tone(noteFreq(n) * octaveShift, stepDur * hold * 0.9, type, vol, music.nextTime - ctx.currentTime);
          }
        };
        play(lead, 'square', tr.vol, 1);
        play(bass, 'triangle', tr.vol * 1.6, 1);
        music.nextTime += stepDur; music.step++;
      }
    };
    schedule();
    music.timer = setInterval(schedule, 100);
  }

  return { init, speak, stopVoice, sfx, loopSfx, stopLoop, hasFile, playMusic, stopMusic, setMuted, isMuted, fileExists };
})();
