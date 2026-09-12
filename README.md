# The Tower of Babel — a Bible History Explorer game

A 16-bit, SNES-style educational adventure for young children (kindergarten) about ancient
Mesopotamia and the Tower of Babel, told from a Judeo-Christian perspective.

Play: **https://thetowerofbabel.pages.dev**

## How the game works

1. **Intro** — the Explorer travels back in time and meets a boastful Ziggurat Priest.
2. **Five levels** climbing the tower. On each level, tap the glowing objects to hear a fact,
   then answer one question to climb higher:
   - Level 1 · Foundation & Writing — cuneiform
   - Level 2 · Kings & Law — King Hammurabi
   - Level 3 · Epic Literature — the Epic of Gilgamesh
   - Level 4 · People & Farming — social roles and canals
   - Level 5 · Royal Tombs — the Royal Cemetery at Ur
3. **Finale** — thunder, lightning, and God confuses the languages. The priest flees.
4. **Two final questions** — "Can we reach God, or must God reach us?" and "How does God reach us?"

Everything on screen is read aloud, since the player can't read yet. Wrong answers are silly on
purpose so a five-year-old can find the right one and keep having fun.

## Running it

It's a static site — no build step.

```bash
npm run dev
```

then open http://localhost:8787. (Or just open `index.html`; voice files won't load over `file://`,
so the browser's text-to-speech is used instead.)

Handy URL shortcuts while reviewing: `?start=level3`, `?start=finale`, `?start=victory`.

## Project layout

```
index.html          page + all UI panels (title, dialog box, info card, quiz, victory)
css/style.css       styling; everything scales off --u (one world pixel)
js/data.js          the whole script: every line, level, item, question, and asset id
js/sprites.js       pixel art drawn in code (explorer, priest, 16 item icons)
js/audio.js         voice / music / sfx loader with text-to-speech + chiptune fallbacks
js/game.js          scenes, drawing, game flow, input
assets/audio/       voice/  music/  sfx/   (see AUDIO_ASSETS.md for the full list)
assets/images/      Wikimedia Commons photos + credits.json (see IMAGE_ASSETS.md)
```

## Adding or replacing assets

- **Voice lines**: drop `vo_<id>.mp3` into `assets/audio/voice/`. Ids are in `js/data.js`
  and `AUDIO_ASSETS.md`. Missing lines fall back to browser text-to-speech.
- **Music**: `assets/audio/music/mus_<name>.mp3` (title, intro, explore, quiz, finale, victory).
- **Sound effects**: `assets/audio/sfx/sfx_<name>.mp3`. The id → file map is `SFX_FILES` in `js/audio.js`.
- **Photos**: `assets/images/<name>.jpg` from Wikimedia Commons only, plus an entry in
  `assets/images/credits.json` so the credit shows on the card.

## Deploying to Cloudflare Pages

One-time: create the project (project name `thetowerofbabel` gives the URL above).

```bash
npx wrangler login
npx wrangler pages project create thetowerofbabel --production-branch main
```

Every deploy after that:

```bash
npm run deploy
```

Or connect the GitHub repo in the Cloudflare dashboard (Workers & Pages → Create → Pages →
Connect to Git) with **no build command** and output directory `/` — then every push to `main`
deploys automatically.

## Content rules

- Art: 16-bit pixel style, drawn in code. Photos: Wikimedia Commons only. **No AI-generated images.**
- Chronological precision is not the goal; clear, kind, memorable teaching is.
- Level 5 is deliberately gentle about the royal burials.
