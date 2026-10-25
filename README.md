# A Light For Dadyy (نُورٌ لَهُ)
### Islamic Remembrance, Sabr & Du'a for Dadyy

A quiet, contemplative private sanctuary built for Ainain and her family (Mama, Abbu, Mairah, Duha, and all loved ones) following the passing of her beloved grandfather, Dadyy.

---

## Important Pre-Launch Checklist for Kamran

Before sharing this link with Ainain or the family, please review:
1. **Check every sacred text yourself:** Verify each Ayah and Hadith in `content/sacred-text.json` against Quran.com (Sahih International) and Sunnah.com. Hadith numbering can vary between editions.
2. **Family consent:** Ensure Mama, Abbu, Ainain, Mairah, and Duha are comfortable with Dadyy's photo and name being on this private page.
3. **Photo check:** A clean crop of Dadyy's portrait is installed at `assets/photos/dadyy.jpg`. If you obtain the uncompressed original from the family, replace that file without applying any filters or animations.
4. **No past contradictory copy:** This site completely replaces earlier drafts. It carries no false promises and strictly follows the Islamic tradition of hope, du'a, and sabr.

---

## Project Structure

```
├── index.html                  # Single-page journey across six quiet chapters
├── styles/
│   └── main.css                # Pure CSS, dark theme, Islamic geometry & typography
├── scripts/
│   └── main.js                 # Vanilla JS for interactive lanterns, Ameen sky & canvas
├── content/
│   ├── sacred-text.json        # All Quranic verses, Hadiths, transliterations & references
│   └── family.json             # Family words, names, years, and optional audio toggle
├── assets/
│   ├── photos/
│   │   └── dadyy.jpg           # Clean portrait of Dadyy (never animated or altered)
│   └── audio/
│       └── .gitkeep            # Silent by default; family-supplied recitation only
└── README.md
```

---

## 1. How to Preview Locally

Modern browsers block local JavaScript `fetch()` calls on `file:///` URLs due to CORS security policies. To preview the site locally on your computer:

### Option A: Python 3 (Installed by default on macOS)
In your terminal, navigate to this project folder and run:
```bash
python3 -m http.server 8000
```
Then open your browser to:
[http://localhost:8000](http://localhost:8000)

### Option B: Node / npx
```bash
npx serve .
```

---

## 2. How to Personalize `content/family.json`

All fields in `content/family.json` are completely optional. If a field is left empty (`""`), the corresponding element will **never** render, and no blank space or placeholder will show.

```json
{
  "_comment": "Fill in what only you or the family know. Leave empty ('') to omit.",
  "name": "Dadyy",
  "fullName": "",
  "years": "",
  "familyWords": "",
  "showKamranQuote": true,
  "kamranQuote": "A proud man. A life lived well.",
  "audio": {
    "enabled": false,
    "src": "",
    "label": "Play recitation"
  }
}
```

- **`name`**: The name the family uses (e.g. `"Dadyy"`). Used in Chapter 1 and in the closing prayer in Chapter 6.
- **`fullName`**: Dadyy's full formal name, if the family wishes to include it in Chapter 1. Leave `""` if not desired.
- **`years`**: E.g. `"1945 – 2026"`. Leave `""` if the family prefers no dates.
- **`familyWords`**: 2–3 sentences from Abbu, Mama, or the grandchildren expressing who he was. If left `""`, nothing displays under the portrait.
- **`showKamranQuote`**: Set to `true` to show *"A proud man. A life lived well."* under the portrait, or `false` to hide it.
- **`audio`**:
  - `enabled`: Set to `true` only if the family provides a recitation audio file.
  - `src`: Path to file (e.g. `"assets/audio/recitation.mp3"`).
  - Site is completely silent by default; audio will never auto-play.

---

## 3. How to Replace the Portrait Photo

The photo is placed at:
`assets/photos/dadyy.jpg`

- If you receive the original high-resolution photo from the family, simply save it over `assets/photos/dadyy.jpg`.
- **Ground rules:**
  - Do not use AI enhancement, colorization, age modification, or face animations.
  - Keep the photo completely still. The site animates only the ambient halo and mihrab frame around it.

---

## 4. Sacred Text Reference & Verification (`content/sacred-text.json`)

Every sacred text string lives exclusively in `content/sacred-text.json`. Nothing is hardcoded in HTML or JS.

| Chapter | Context | Reference | Arabic Summary |
|---|---|---|---|
| **Ch 1: The Opening** | Istirja' | Surah Al-Baqarah 2:156 | إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ |
| **Ch 3: What Remains** | Three Enduring Deeds | Sahih Muslim 1631 | إِذَا مَاتَ الْإِنْسَانُ انْقَطَعَ عَنْهُ عَمَلُهُ إِلَّا مِنْ ثَلَاثَةٍ... |
| **Ch 4: Sabr** | Allah is with the patient | Surah Al-Baqarah 2:153 | يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ |
| **Ch 4: Sabr** | Glad tidings to the patient | Surah Al-Baqarah 2:155–156 | وَلَنَبْلُوَنَّكُم بِشَيْءٍ مِّنَ الْخَوْفِ وَالْجُوعِ... |
| **Ch 4: Sabr** | Hearts find rest | Surah Ar-Ra'd 13:28 | الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ اللَّهِ... |
| **Ch 4: Sabr** | Ease with hardship | Surah Ash-Sharh 94:5–6 | فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ الْعُسْرِ يُسْرًا |
| **Ch 4: Sabr** | Prophet ﷺ on Ibrahim's passing | Sahih al-Bukhari 1303 | إِنَّ الْعَيْنَ تَدْمَعُ، وَالْقَلْبَ يَحْزَنُ... |
| **Ch 5: Du'a** | Du'a for the Deceased | Sahih Muslim 963 | اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ وَعَافِهِ وَاعْفُ عَنْهُ |
| **Ch 5: Du'a** | Du'a for the Bereaved | Sahih Muslim 918 | إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ، اللَّهُمَّ أْجُرْنِي فِي مُصِيبَتِي... |
| **Ch 6: Dawn** | Reassured Soul | Surah Al-Fajr 89:27–28 | يَا أَيَّتُهَا النَّفْسُ الْمُطْمَئِنَّةُ ارْجِعِي إِلَىٰ رَبِّكِ رَاضِيَةً مَّرْضِيَّةً |

---

## 5. Private Deployment & Sharing

To keep this site private for the family without search engines finding it:

1. **Robots Meta Tag:** The site includes `<meta name="robots" content="noindex, nofollow">` to prevent web crawlers from indexing it.
2. **Deploy to Netlify (Free, fast, drag & drop):**
   - Go to [Netlify Drop](https://app.netlify.com/drop).
   - Drag this entire project folder into Netlify.
   - Go to **Site settings > Change site name** and pick an unguessable private name (e.g. `a-light-for-dadyy-7f9x2.netlify.app`).
   - Alternatively, deploy via Vercel (`npx vercel`) or Cloudflare Pages.
3. **Sharing:** Share the private link with Ainain first, or the family directly.

---

## 6. Confirmation of Ground Rules

- **Hope, not verdicts:** Uses *"We ask Allah to grant him Jannat al-Firdaus..."* Never presumes judgment.
- **Grief is honored:** Contains the words of the Prophet ﷺ weeping for Ibrahim (*Sahih al-Bukhari 1303*). Never tells anyone to stop weeping.
- **No figurative depictions:** No drawings of prophets, angels, or human figures. The only human photograph is Dadyy.
- **Static portrait:** The photo of Dadyy is strictly static. No parallax, no zooming, no AI facial movement.
- **Silence:** Completely silent by default. No background music or instruments.
- **Private Ameen Sky:** Each tap of "Ameen" sends a light to the sky, stored in the browser's `localStorage`. No server counters, no leaderboards, no public numbers.
- **Pure JSON Sacred Text:** All Arabic text is rendered with full Tashkeel, directly from `content/sacred-text.json`.
