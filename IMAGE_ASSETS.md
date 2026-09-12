# The Tower of Babel — Image Assets (Wikimedia Commons only)

Rule for this project: every photograph comes from **Wikimedia Commons**. No AI-generated images.
Pixel art drawn in code (sprites, backgrounds, icons) is fine.

Save each photo as `assets/images/<name>.jpg` (about 900 px wide is plenty). If a file is missing
the game shows a pixel-art placeholder card instead, so nothing breaks.

Record the license and author of every file in `assets/images/credits.json` (the game reads this
file and prints the credit under each photo) and in `CREDITS.md`.

## Selected files

| Game file | Wikimedia Commons file | Shows |
|---|---|---|
| `l1_tablet.jpg` | `File:Cuneiform tablet- administrative account concerning the distribution of barley and emmer MET DP293244.jpg` | Clay tablet with cuneiform (Met Museum, CC0) |
| `l1_bronze.jpg` | `File:Gudea copper alloy foundation figurines gods BM.jpg` | Cast metal figurines (British Museum) |
| `l1_statue.jpg` | `File:Mesopotamia male worshiper 2750-2600 B.C.jpg` | Tell Asmar-style worshiper statue |
| `l2_hammurabi.jpg` | `File:Tête royale dite « tête de Hammurabi » - 1792 -1750 av. J.-C. - .Babylonie - Louvre - SB 95.jpg` | Royal head, "Hammurabi" (Louvre) |
| `l2_code.jpg` | `File:Code of Hammurabi-Sb 8-IMG 7753-gradient.jpg` | The Code of Hammurabi stele (Louvre) |
| `l3_gilgamesh.jpg` | `File:Hero lion Dur-Sharrukin Louvre AO19862.jpg` | Hero holding a lion, often called Gilgamesh |
| `l3_enkidu.jpg` | `File:Enkidu, Gilgamesh's friend. From Ur, Iraq, 2027-1763 BCE. Iraq Museum.jpg` | Enkidu plaque (Iraq Museum) |
| `l3_flood.jpg` | `File:British Museum Flood Tablet.jpg` | Tablet XI, the Flood Tablet |
| `l4_king.jpg` | `File:Standard of Ur - Peace - Detail Top Left.jpg` | The king, seated, larger than everyone |
| `l4_priest.jpg` | `File:Ebih-Il Louvre AO17551 n01.jpg` | Statue of Ebih-Il, a temple official |
| `l4_worker.jpg` | `File:Standard of Ur - Peace - Detail Bottom Center.jpg` | Workers bringing goods and animals |
| `l4_slave.jpg` | `File:Lachish Relief, British Museum 13.jpg` | Captives on an Assyrian relief |
| `l4_canal.jpg` | `File:Irrigation canal Fira Shia, Iraq (1).jpg` | A modern irrigation canal in Iraq |
| `l5_tomb.jpg` | `File:The Queen's Jewelry. Royal Cemetery at Ur.jpg` | Queen Puabi's jewelry from her tomb |
| `l5_helpers.jpg` | `File:Young attendant wearing gold headdress and jewelry ... from the royal cemetery of Ur 2550-2450 BCE.jpg` | Reconstructed attendant from the tomb |
| `l5_lyre.jpg` | `File:Bull Headed Lyre of Ur.jpg` | The golden Bull-Headed Lyre |

## How to download them yourself (if not done already)

1. Open `https://commons.wikimedia.org/wiki/<file name above>`
2. Click **Download** → pick the ~1024 px size
3. Save as the game file name into `assets/images/`
4. Copy the author + license from the file page into `assets/images/credits.json`:

```json
{
  "l1_tablet": {
    "file": "Cuneiform tablet- ... MET DP293244.jpg",
    "page": "https://commons.wikimedia.org/wiki/File:...",
    "author": "Metropolitan Museum of Art",
    "license": "CC0",
    "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/"
  }
}
```

## Alternatives that were also good

- Standard of Ur, whole Peace panel: `File:Standard of Ur - Peace Panel - Sumer.jpg`
- Copper bull from Tell al-'Ubaid: `File:Copper alloy bull from Tell Al-Ubaid.jpg`
- Silver lyre: `File:Silver Lyre from the Great Death pit in Ur Sumerian about 2600 BCE.jpg`
- The real Ziggurat of Ur today: `File:Ziggurat of Ur Site in Nasiriyah 10.jpg`
