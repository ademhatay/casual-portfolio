# casual-portfolio

A minimal, fast personal portfolio built with [Eleventy](https://www.11ty.dev/). Designed around the Editorial Precision design system — Swiss graphic aesthetic, variable typography, dark mode, bilingual (TR/EN), and an RSS feed out of the box.

**Live demo:** [ademhatay.com](https://ademhatay.com)

---

## Features

- Static site generation via Eleventy v3
- Dark mode with smooth transitions, persisted in `localStorage`
- Bilingual — Turkish (`/`) and English (`/en/`) with separate URLs
- Writing (blog posts) with full Markdown support and copy buttons on code blocks
- Notes — text, photo, and YouTube video embed cards
- Combined homepage feed (articles + notes) sorted by date, with "load more"
- Atom RSS feed at `/feed.xml`
- Fraunces display font + Instrument Sans body font
- No frameworks, no build pipeline — just HTML, CSS, and a little vanilla JS

---

## Getting Started

### Prerequisites

- Node.js 18+

### Clone and install

```bash
git clone https://github.com/ademhatay/casual-portfolio.git
cd casual-portfolio
npm install
```

### Run locally

```bash
npm start
```

Open `http://localhost:8080` in your browser.

---

## Customisation

### 1. Your personal info

Edit `_data/site.json`:

```json
{
  "brand": "Your Name",
  "bio": "short bio in Turkish",
  "bioEn": "short bio in English",
  "location": "City, Country",
  "year": "2026",
  "socials": [
    { "key": "github", "label": "GitHub", "icon": "github", "href": "https://github.com/yourusername" },
    { "key": "rss",    "label": "RSS",    "icon": "rss",    "href": "/feed.xml" },
    { "key": "email",  "label": "Email",  "icon": "at-sign","href": "mailto:you@example.com" }
  ]
}
```

Icon names come from [Lucide](https://lucide.dev/icons/) — use any icon key there.

### 2. Avatar

Replace `assets/avatar.png` with your own photo (square, minimum 200×200px recommended).

### 3. Writing (blog posts)

Add a Markdown file to `yazilar/` for Turkish posts:

```
---
title: "Post Title"
date: "2026-01-15"
excerpt: "A short summary shown in listings."
---

Your content here. Full Markdown supported.
```

For English posts, add to `en/writing/`:

```
---
title: "Post Title"
date: "2026-01-15"
excerpt: "A short summary shown in listings."
---

Your content here.
```

### 4. Notes

Add a Markdown file to `notlar/` for Turkish notes:

**Text note:**
```
---
title: "A short thought"
date: "2026-01-20"
---
```

**Photo note:**
```
---
title: "Istanbul, Turkey"
date: "2026-01-20"
photo1Url: "/assets/images/istanbul.jpg"
photo1Alt: "A photo of Istanbul"
---
```

Put your image in `assets/images/`.

**Video note (YouTube embed):**
```
---
title: "Interesting talk title"
date: "2026-01-20"
videoUrl: "https://www.youtube.com/embed/VIDEO_ID"
---
```

For English notes, add to `en/notes/`.

### 5. Navigation labels

Turkish nav labels are in `_data/nav.json` under `"tr"`, English labels under `"en"`.

### 6. About / Hakkımda pages

Edit `hakkimda.html` for the Turkish about page and `en/about.html` for the English version. Both are plain HTML inside the page layout — edit freely.

### 7. Colours and typography

All design tokens live in `css/colors_and_type.css`. Dark mode token overrides are in `css/portfolio.css` under the `html.dark { }` block. Change the accent colour, fonts, or spacing there.

### 8. RSS feed URL

Update the `<link>` tags in `feed.liquid` to match your domain:

```liquid
<link href="https://yourdomain.com/feed.xml" rel="self" .../>
<link href="https://yourdomain.com/" rel="alternate" .../>
```

---

## Deploying

### Netlify (recommended)

1. Push your fork to GitHub.
2. Connect the repo on [netlify.com](https://netlify.com).
3. Build command: `npm run build`
4. Publish directory: `_site`

### Vercel

```bash
npm i -g vercel
vercel
```

Set the output directory to `_site`.

---

## Project structure

```
.
├── _data/          # Global data (site.json, nav.json)
├── _includes/      # Layouts and partials (base.html, yazi.html, footer.html …)
├── assets/         # Images and avatar
├── css/            # Stylesheets
├── en/             # English pages (/en/ prefix)
├── notlar/         # Turkish notes (Markdown)
├── yazilar/        # Turkish blog posts (Markdown)
├── index.html      # Homepage
├── notlar.html     # Notes listing page
├── yazilar.html    # Writing listing page
├── hakkimda.html   # About page (TR)
└── feed.liquid     # Atom RSS feed
```

---

## Credits

Design inspired by [Vincent Pickering](https://vincentp.me/) — Editorial Precision design system.

---

## License

MIT © [Adem Hatay](https://ademhatay.com)
