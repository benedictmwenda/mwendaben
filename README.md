# QAQA SOFTWARE | Benedict Mwenda Portfolio

A responsive one-page portfolio website for Benedict Mwenda (web design, development, M-Pesa integration, branding and graphics) with a built-in dashboard for managing portfolio items. Built with HTML5, CSS3, JavaScript and jQuery, using Supabase as the database.

## Features

- **Responsive design**: works on desktop, tablet and mobile
- **Dark mode and 12 colour themes** via the settings panel
- **Portfolio loaded from a database** and filtered by category (Web Development, Web Design, Logo & Branding, Graphic Design, plus any categories you add)
- **Admin dashboard** (`admin.html`) to add, edit, hide and delete portfolio items, with automatic image resizing before upload
- **CV management**: upload a new CV PDF from the dashboard and the site's "Download CV" button updates automatically
- **Item types**: full-size image, details popup (description, extra images, project link), YouTube, Vimeo and SoundCloud
- **Sections**: Home, About (with downloadable CV), Skills, Resume, Portfolio, Services, Blog, Contact
- **Contact form** powered by Formspree, with validation and a spam trap
- **Smooth animations**, magic cursor and mobile menu

## Project structure

```
.
├── index.html                  Main page
├── admin.html                  Portfolio dashboard (login required)
├── SETUP.md                    Step-by-step database + dashboard setup
├── README.md
├── supabase/
│   ├── schema.sql              Tables, security rules and storage bucket
│   └── add_cv_settings.sql     CV setting only (for projects created before the CV feature)
├── assets/
│   ├── css/                    colors.css, dark.css, plugins.css, style.css
│   ├── img/                    about, hero, logo, news, portfolio (demo), service, svg, thumbs
│   └── js/
│       ├── config.js           Supabase URL + anon key (you fill this in)
│       ├── portfolio.js        Loads portfolio items by category
│       ├── site-settings.js    Points the Download CV button at the uploaded CV
│       ├── script.js           Contact form handler (Formspree)
│       ├── closebtn.js         Modal behaviour for demo items
│       ├── init.js             Template initialisation
│       ├── plugins.js          Template plugins
│       └── jquery.js
└── video/                      Video assets
```

## Quick start

1. **Preview locally** (any static server works):
   ```bash
   python3 -m http.server 8000
   ```
   Open http://localhost:8000
2. **Turn on the dashboard**: follow [SETUP.md](SETUP.md). Until the database is connected, the site shows demo portfolio items so nothing breaks.
3. **Deploy** the repository to any static host (Netlify, GitHub Pages, Vercel, and so on). Then open `/admin.html` on your live site to manage the portfolio.

## Managing the portfolio

Sign in at `/admin.html`:

- **CV tab**: upload a PDF to replace your CV, or remove it to fall back to the bundled file.
- **Categories tab**: add, rename, reorder or delete categories. They become the filter buttons on the site, and a category appears once it has at least one published item.
- **Portfolio items tab**: add an item with a title, category, cover image, how it should open, display order and visibility. "Hide" removes an item from the site without deleting it.

## Security notes

- `assets/js/config.js` must contain only the Supabase **anon** key. Never commit the `service_role` key.
- The database rules in `supabase/schema.sql` let the public read published items only. Only the admin email set in that file can add, change or delete anything.
- Turn off public sign-ups in Supabase (see SETUP.md) so nobody else can create an account.

## Customisation

- **Colours**: edit `assets/css/colors.css`, or use the in-page colour picker.
- **Personal content**: update the hero, about, skills, resume, services and blog text in `index.html`. The skills percentages and the counters in the stats section are values you should set to your own.
- **Contact form**: replace the Formspree endpoint (`https://formspree.io/f/...`) in the `<form action>` of `index.html` with your own.
- **CV**: upload a new one in the dashboard's CV tab. `assets/img/about/Benedict-Mwenda-CV.pdf` is only the fallback used until you upload one.

## Technologies

- HTML5, CSS3, JavaScript, jQuery
- Plugins: WOW.js, Owl Carousel, Isotope, Magnific Popup
- Supabase (Postgres, Auth, Storage) for the portfolio database and dashboard
- Formspree for the contact form
- Google Fonts: Open Sans, Josefin Sans, Montserrat

## Contact

- Email: beneditc64@gmail.com
- Phone: +254 794 536 597
- WhatsApp: https://wa.me/message/AEDRFOEVA3WMN1
- GitHub: https://github.com/benedictmwenda
- Instagram: https://www.instagram.com/qaqaspecq

## License

© 2025 QAQA SOFTWARES. All rights reserved. The page layout is based on a third-party ThemeForest template; make sure you hold a valid license for it before publishing or redistributing.
