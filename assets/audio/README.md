# Audio files go here

Drop files in with these exact names and the game uses them automatically.
Missing files fall back to browser text-to-speech (voice) or the built-in
chiptune synth (music / sound effects), so the game always plays.

- `voice/vo_*.mp3`  — every line in AUDIO_ASSETS.md (section 2)
- `music/mus_*.mp3` — 6 looping tracks (section 3)
- `sfx/sfx_*.mp3`   — sound effects (section 4). Ids used by the game:
  tap, blip, item, correct, wrong, levelup, thunder, lightning, whoosh, step,
  sparkle, run, open, close

Format: .mp3, 128 kbps. Voice mono; music stereo with clean loop points.
