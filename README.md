# SoloForge LLC — Business Website

Professional multi-page website for **SoloForge LLC**, a software development company. Brand theme: deep black background with gold and silver metallic accents matching the logo.

## Pages

| Page | File | Description |
|------|------|-------------|
| Home | `index.html` | Hero, town hall, team photos, video, leadership, testimonials, map |
| About | `about.html` | Story, town hall, admin team, group photo, stats |
| Services | `services.html` | Service cards with imagery |
| Portfolio | `portfolio.html` | Project gallery with photos + client feedback |
| Contact | `contact.html` | Form, office photo, Google Maps embed |
| Sign In | `signin.html` | Client portal login (Google/Microsoft UI) |
| Sign Up | `signup.html` | Account registration |
| Terms | `terms.html` | Terms & Conditions + Privacy Policy |

## Tech Stack

- **HTML5, CSS3, JavaScript** (vanilla)
- **Bootstrap 5.3** — layout & components
- **AOS** — scroll animations
- **Swiper 11** — testimonial & portfolio carousels
- **Font Awesome 6** — icons
- **CountUp.js** — animated statistics
- **Particles.js** — hero background effect
- **Google Fonts** — Inter & Sora
- **Unsplash** — professional stock photography (replace with your own)

## Preview Locally (required for images)

Images use local paths (`./assets/images/`). **Always use a local server** — opening `index.html` directly in the browser can break image paths.

```bash
cd /Users/administrator/Projects/soloforge-website
python3 -m http.server 8080
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

## Project Structure

```
soloforge-website/
├── index.html
├── about.html
├── services.html
├── portfolio.html
├── contact.html
├── signin.html
├── signup.html
├── terms.html
├── css/
│   └── styles.css
├── js/
│   ├── layout.js
│   └── main.js
├── assets/
│   └── images/
│       └── logo.png
└── README.md
```

## Customize

- Update **email/phone** in `contact.html` and footer sections
- Replace portfolio placeholders with real project screenshots
- Connect the contact form to a backend (Formspree, Netlify Forms, etc.)
- Add your real social media URLs in footer links

## Deploy

Static hosting works on **Netlify**, **Vercel**, **GitHub Pages**, or any web server — upload all files as-is.

---

© SoloForge LLC — *Forge Your Own Way.*
