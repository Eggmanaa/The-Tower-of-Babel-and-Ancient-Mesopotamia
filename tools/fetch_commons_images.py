"""
Fetch the game's photographs from Wikimedia Commons (user-approved download).

Reads the file list below, downloads a ~900px thumbnail of each into assets/images/<id>.jpg,
and writes assets/images/credits.json with author + license from the Commons API so the game
can show the credit under each photo.  Re-run any time to refresh.
"""
import json, urllib.request, urllib.parse, re, html, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'assets', 'images')
UA = {'User-Agent': 'TowerOfBabelKidsGame/1.0 (educational game; https://thetowerofbabel.pages.dev)'}

PICK = {
    'l1_tablet':    'File:Cuneiform tablet- administrative account concerning the distribution of barley and emmer MET DP293244.jpg',
    'l1_bronze':    'File:Gudea copper alloy foundation figurines gods BM.jpg',
    'l1_statue':    'File:Mesopotamia male worshiper 2750-2600 B.C.jpg',
    'l2_hammurabi': None,  # resolved by search below (title has accented characters)
    'l2_code':      'File:Code of Hammurabi-Sb 8-IMG 7753-gradient.jpg',
    'l3_gilgamesh': 'File:Hero lion Dur-Sharrukin Louvre AO19862.jpg',
    'l3_enkidu':    "File:Enkidu, Gilgamesh's friend. From Ur, Iraq, 2027-1763 BCE. Iraq Museum.jpg",
    'l3_flood':     'File:British Museum Flood Tablet.jpg',
    'l4_king':      'File:Standard of Ur - Peace - Detail Top Left.jpg',
    'l4_priest':    'File:Ebih-Il Louvre AO17551 n01.jpg',
    'l4_worker':    'File:Standard of Ur - Peace - Detail Bottom Center.jpg',
    'l4_slave':     'File:Lachish Relief, British Museum 13.jpg',
    'l4_canal':     'File:Irrigation canal Fira Shia, Iraq (1).jpg',
    'l5_tomb':      "File:The Queen's Jewelry. Royal Cemetery at Ur.jpg",
    'l5_helpers':   'File:Young attendant wearing gold headdress and jewelry of gold, lapis lazuli, carnelian and shell from the royal cemetery of Ur 2550-2450 BCE.jpg',
    'l5_lyre':      'File:Bull Headed Lyre of Ur.jpg',
}


def api(params):
    params.update({'format': 'json'})
    url = 'https://commons.wikimedia.org/w/api.php?' + urllib.parse.urlencode(params)
    return json.load(urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60))


def strip_html(s):
    return html.unescape(re.sub(r'<[^>]+>', '', s or '')).strip()


def main():
    os.makedirs(OUT, exist_ok=True)
    r = api({'action': 'query', 'list': 'search', 'srsearch': 'Hammurabi head Louvre SB 95', 'srnamespace': 6, 'srlimit': 5})
    PICK['l2_hammurabi'] = next(h['title'] for h in r['query']['search'] if 'SB 95' in h['title'])

    credits = {}
    for key, title in PICK.items():
        r = api({'action': 'query', 'titles': title, 'prop': 'imageinfo',
                 'iiprop': 'url|extmetadata|size', 'iiurlwidth': 900})
        page = next(iter(r['query']['pages'].values()))
        if 'imageinfo' not in page:
            print('MISSING', key, title); continue
        ii = page['imageinfo'][0]
        em = ii.get('extmetadata', {})
        g = lambda f: strip_html(em.get(f, {}).get('value'))
        url = ii.get('thumburl') or ii['url']
        data = urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=120).read()
        with open(os.path.join(OUT, key + '.jpg'), 'wb') as f:
            f.write(data)
        credits[key] = {
            'file': title.replace('File:', ''),
            'page': ii['descriptionurl'],
            'author': g('Artist')[:120] or 'Unknown',
            'license': g('LicenseShortName'),
            'licenseUrl': g('LicenseUrl'),
            'source': g('Credit')[:160],
        }
        print(f"{key:13s} {len(data)//1000:4d} KB  {credits[key]['license']:14s} {credits[key]['author'][:45]}")

    with open(os.path.join(OUT, 'credits.json'), 'w', encoding='utf-8') as f:
        json.dump(credits, f, indent=2, ensure_ascii=False)
    print('wrote credits.json with', len(credits), 'entries')


if __name__ == '__main__':
    sys.exit(main())
