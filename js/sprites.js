// ============================================================
//  Pixel-art sprites drawn in code (16-bit / SNES style palette)
//  Each sprite is an array of strings; each character is a palette key.
//  '.' = transparent
// ============================================================

const Sprites = (() => {

  const PAL = {
    // explorer
    H: '#6b3e1e', h: '#8a5a2b', f: '#f2c89a', E: '#22181a', S: '#c9a86a',
    b: '#7a4a24', B: '#3a2412', P: '#7a5230', D: '#3b2a1a', m: '#c0392b', z: '#4a2a14',
    // priest
    G: '#e0b83a', g: '#f2d878', k: '#2b1d12', W: '#f4efe0', R: '#b03a2e',
    // items
    c: '#b8865a', d: '#7a5230', v: '#8c6a2e', V: '#c9a24a', s: '#d8cdb0', t: '#a89a78',
    n: '#1a1a2a', l: '#f0e8d0', u: '#2b4a9a', w: '#2f6fb0', x: '#7fb3e6',
    F: '#5a9a3a', a: '#2e6a1e', e: '#a5804a', o: '#4a4a4a', p: '#6a6a6a',
    Y: '#f5d76e', r: '#8b1e1e', q: '#9a9a9a', j: '#5c3b1e',
  };

  // ---------- CHARACTERS (16 x 24) ----------
  // Explorer: girl with long dark hair, explorer hat with a red bow, khaki shirt, skirt, boots
  const explorerBody = [
    '....hhhhhhhh....',
    '...hHHHHHHHHh...',
    '...HHHHmmHHHH...',
    '.HHHHHHHHHHHHHH.',
    '...zzffffffzz...',
    '...zzfEffEfzz...',
    '...zzffffffzz...',
    '...zzffffffzz...',
    '...zzffmmffzz...',
    '...zzzffffzzz...',
    '..zzSSSSSSSSzz..',
    '..zzSSSSSSSSzz..',
    '..zSSSSSSSSSSz..',
    '..SS.SSbbSS.SS..',
    '..ff.SSbbSS.ff..',
    '.....BBBBBB.....',
    '....PPPPPPPP....',
    '...PPPPPPPPPP...',
  ];
  const explorerLegsA = [
    '.....ff..ff.....',
    '.....ff..ff.....',
    '.....ff..ff.....',
    '.....ff..ff.....',
    '....DDD..DDD....',
    '....DDD..DDD....',
  ];
  const explorerLegsB = [
    '....fff..fff....',
    '...fff....fff...',
    '...ff......ff...',
    '...ff......ff...',
    '..DDD......DDD..',
    '..DDD......DDD..',
  ];

  const priestBody = [
    '.......gg.......',
    '......gGGg......',
    '......GGGG......',
    '.....GGGGGG.....',
    '.....GGGGGG.....',
    '....GGGGGGGG....',
    '....ffffffff....',
    '....fEffffEf....',
    '....ffffffff....',
    '...kkkkkkkkkk...',
    '...kkkkkkkkkk...',
    '....kkkkkkkk....',
    '.....kkkkkk.....',
    '...WWWWWWWWWW...',
    '..WWWWWWWWWWWW..',
    '..WWRWWWWWWRWW..',
    '..ffWWWWWWWWff..',
    '..WWWWWWWWWWWW..',
  ];
  const priestLegsA = [
    '..WWWWWWWWWWWW..',
    '..WRWRWRWRWRWR..',
    '..WWWWWWWWWWWW..',
    '..WRWRWRWRWRWR..',
    '..WWWWWWWWWWWW..',
    '..DD........DD..',
  ];
  const priestLegsB = [
    '..WWWWWWWWWWWW..',
    '..WRWRWRWRWRWR..',
    '.WWWWWWWWWWWWWW.',
    '.WRWRWRWRWRWRWR.',
    '.WWWWWWWWWWWWWW.',
    '.DD..........DD.',
  ];

  const CHARS = {
    explorer: [explorerBody.concat(explorerLegsA), explorerBody.concat(explorerLegsB)],
    priest:   [priestBody.concat(priestLegsA),     priestBody.concat(priestLegsB)],
  };

  // ---------- ITEM ICONS (16 x 16) ----------
  const ICONS = {
    tablet: [
      '................',
      '..cccccccccccc..',
      '.cccccccccccccc.',
      '.ccdcdccdcdcccc.',
      '.cccccccccccccc.',
      '.cdccdcdccdcdcc.',
      '.cccccccccccccc.',
      '.ccdcdccccdcdcc.',
      '.cccccccccccccc.',
      '.cdccdccdcdcccc.',
      '.cccccccccccccc.',
      '.ccdcdccdcdcdcc.',
      '.cccccccccccccc.',
      '..cccccccccccc..',
      '................',
      '................',
    ],
    vessel: [
      '......vvvv......',
      '.....v....v.....',
      '......vvvv......',
      '.......vv.......',
      '......vvvv......',
      '.....vvvvvv.....',
      '....vvVVVVvv....',
      '...vvVVVVVVvv...',
      '...vvVVVVVVvv...',
      '...vvVVVVVVvv...',
      '....vvVVVVvv....',
      '.....vvvvvv.....',
      '......vvvv......',
      '.....vvvvvv.....',
      '....vvvvvvvv....',
      '................',
    ],
    statue: [
      '.....ssssss.....',
      '....ssssssss....',
      '....sEEssEEs....',
      '....sEEssEEs....',
      '....ssssssss....',
      '...kkkkkkkkkk...',
      '...kkkkkkkkkk...',
      '....kkkkkkkk....',
      '...ssssssssss...',
      '..ssssssssssss..',
      '..ssssstttsssss.',
      '..ssssstttsssss.',
      '..ssssssssssss..',
      '..ssssssssssss..',
      '..ssssssssssss..',
      '.ssssssssssssss.',
    ],
    stele: [
      '.....oooooo.....',
      '....oooooooo....',
      '...oooooooooo...',
      '...ooGooooGoo...',
      '...oooooooooo...',
      '...oppppppppo...',
      '...opopopopoo...',
      '...oppppppppo...',
      '...opopopopoo...',
      '...oppppppppo...',
      '...opopopopoo...',
      '...oppppppppo...',
      '...opopopopoo...',
      '...oooooooooo...',
      '...oooooooooo...',
      '..oooooooooooo..',
    ],
    flood: [
      '................',
      '................',
      '.......HH.......',
      '......HHHH......',
      '......HHHH......',
      '...HHHHHHHHHH...',
      '....HHHHHHHH....',
      'wwwwwwwwwwwwwwww',
      'xwwxwwxwwxwwxwwx',
      'wwwwwwwwwwwwwwww',
      'wxwwwxwwwxwwwxww',
      'wwwwwwwwwwwwwwww',
      'xwwxwwxwwxwwxwwx',
      'wwwwwwwwwwwwwwww',
      '................',
      '................',
    ],
    rivers: [
      'FFwwFFFFFFFFwwFF',
      'FFwwFFFaFFFFwwFF',
      'FFFwwFFFFFFwwFFF',
      'FFFwwFFaFFFwwFFF',
      'FFFFwwFFFFwwFFFF',
      'FaFFwwFFFFwwFFaF',
      'FFFFwwFFaFwwFFFF',
      'FFFFFwwFFFwwFFFF',
      'FFFFFwwFFwwFFFFF',
      'FFaFFwwFFwwFFaFF',
      'FFFFFFwwwwFFFFFF',
      'FFFFFFwwwwFFFFFF',
      'FFFaFFwxwwFFaFFF',
      'FFFFFFwwwwFFFFFF',
      'wwwwwwwwwwwwwwww',
      'wxwwxwwxwwxwwxww',
    ],
    canal: [
      'FFFFFFFFFFFFFFFF',
      'FaFFaFFaFFaFFaFF',
      'FFFFFFFFFFFFFFFF',
      'eeeeeeeeeeeeeeee',
      'wwwwwwwwwwwwwwww',
      'wxwwwxwwwxwwwxww',
      'wwwwwwwwwwwwwwww',
      'eeeeeeeeeeeeeeee',
      'FFFFFFFFFFFFFFFF',
      'FaFFaFFaFFaFFaFF',
      'FFFFFFFFFFFFFFFF',
      'eeeeeeeeeeeeeeee',
      'wwwwwwwwwwwwwwww',
      'wxwwwxwwwxwwwxww',
      'eeeeeeeeeeeeeeee',
      'FFFFFFFFFFFFFFFF',
    ],
    tomb: [
      '......ssss......',
      '....ssssssss....',
      '...ssnnnnnnss...',
      '..ssnnnnnnnnss..',
      '..ssnnGGGGnnss..',
      '..ssnGGGGGGnss..',
      '..ssnGGGGGGnss..',
      '..ssnnGGGGnnss..',
      '..ssnnnnnnnnss..',
      '..ssnGGnnGGnss..',
      '..ssnGGnnGGnss..',
      '..ssnnnnnnnnss..',
      '..ssnnnnnnnnss..',
      '..ssnnnnnnnnss..',
      'ssssssssssssssss',
      'ssssssssssssssss',
    ],
    lyre: [
      '..GG........GG..',
      '..GG........GG..',
      '..GG........GG..',
      '..GG.l.l.l..GG..',
      '..GG.l.l.l..GG..',
      '..GG.l.l.l..GG..',
      '..GG.l.l.l..GG..',
      '..GGGGGGGGGGGG..',
      '...GGGGGGGGGG...',
      '....GGGGGGGG....',
      '.....GGGGGG.....',
      '....GGGGGGGG....',
      '....GEGGGGEG....',
      '....GGGGGGGG....',
      '.....uuuuuu.....',
      '......uuuu......',
    ],
  };

  // Generic standing figure; palette swapped per person type.
  // Keys: C = headwear, K = hair/beard, T = tunic, f = skin
  const FIGURE = [
    '......CCCC......',
    '......CCCC......',
    '......ffff......',
    '......fEEf......',
    '......ffff......',
    '.....KKKKKK.....',
    '......KKKK......',
    '.....TTTTTT.....',
    '....TTTTTTTT....',
    '...fTTTTTTTTf...',
    '....TTTTTTTT....',
    '....TTTTTTTT....',
    '....TTTTTTTT....',
    '....TTTTTTTT....',
    '....TTTTTTTT....',
    '....DD....DD....',
  ];
  const FIGURE_PAL = {
    king:      { C: PAL.G, K: PAL.k, T: PAL.r },
    priest:    { C: PAL.f, K: PAL.k, T: PAL.W },
    worker:    { C: PAL.f, K: PAL.f, T: PAL.c },
    slave:     { C: PAL.f, K: PAL.f, T: PAL.q },
    gilgamesh: { C: PAL.G, K: PAL.k, T: PAL.R },
    enkidu:    { C: PAL.j, K: PAL.j, T: PAL.j },
  };

  // ---------- DRAWING ----------
  function drawGrid(ctx, rows, x, y, scale, flip, palOverride) {
    const w = rows[0].length;
    for (let r = 0; r < rows.length; r++) {
      const row = rows[r];
      for (let c = 0; c < w; c++) {
        const ch = row[c];
        if (ch === '.') continue;
        const col = (palOverride && palOverride[ch]) || PAL[ch];
        if (!col) continue;
        ctx.fillStyle = col;
        const px = flip ? x + (w - 1 - c) * scale : x + c * scale;
        ctx.fillRect(px, y + r * scale, scale, scale);
      }
    }
  }

  function drawChar(ctx, who, x, y, scale, frame, flip) {
    const frames = CHARS[who];
    drawGrid(ctx, frames[frame % frames.length], x, y, scale, flip);
  }

  function drawIcon(ctx, name, x, y, scale) {
    if (name === 'helpers') {
      const s = Math.max(1, Math.round(scale * 0.6));
      drawGrid(ctx, FIGURE, x, y + 16 * scale - 16 * s, s, false, FIGURE_PAL.worker);
      drawGrid(ctx, FIGURE, x + 5 * scale, y + 16 * scale - 16 * s, s, false, FIGURE_PAL.slave);
      drawGrid(ctx, FIGURE, x + 10 * scale, y + 16 * scale - 16 * s, s, false, FIGURE_PAL.worker);
      return;
    }
    if (FIGURE_PAL[name]) { drawGrid(ctx, FIGURE, x, y, scale, false, FIGURE_PAL[name]); return; }
    if (ICONS[name]) drawGrid(ctx, ICONS[name], x, y, scale, false);
  }

  // Draw the head of a character into a small portrait canvas
  function drawPortrait(canvas, who) {
    const c = canvas.getContext('2d');
    c.imageSmoothingEnabled = false;
    c.clearRect(0, 0, canvas.width, canvas.height);
    if (who === 'narrator') {
      // an open book icon for the narrator
      c.fillStyle = '#f4efe0'; c.fillRect(4, 8, 24, 18);
      c.fillStyle = '#6b3e1e'; c.fillRect(15, 8, 2, 18);
      c.fillStyle = '#8a8a8a';
      for (let i = 0; i < 4; i++) { c.fillRect(7, 12 + i * 3, 6, 1); c.fillRect(19, 12 + i * 3, 6, 1); }
      return;
    }
    const rows = CHARS[who][0].slice(0, 10);
    drawGrid(c, rows, 0, 2, 2, false);
  }

  return { drawChar, drawIcon, drawPortrait, drawGrid, PAL };
})();
