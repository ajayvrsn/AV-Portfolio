# Ajay Varsan — Portfolio

A classy editorial portfolio with scroll animations, custom cursor,
parallax, theme switching, responsive layouts, and contact-form feedback.
It intentionally uses vanilla HTML, CSS, and JavaScript so it stays fast,
portable, and easy to deploy as a static site.

### Why not React or Next.js?

A framework is not required for a single-page portfolio like this. React or
Next.js becomes useful when the site needs reusable page components, a CMS,
case-study routes, authentication, server-side data, or a content pipeline.
For the current site, the biggest gains come from strong project storytelling,
real project links, image optimization, accessibility, and performance rather
than adding framework overhead.

The current implementation also includes:

- Keyboard skip navigation and visible focus states
- Reduced-motion and touch-device safeguards for animated effects
- Accessible mobile navigation and theme-toggle state
- A scroll-progress indicator
- Contact form error handling for failed Formspree requests

---

## Project Structure

```
portfolio/
├── index.html          ← All page content (sections, nav, footer)
├── css/
│   └── style.css       ← All styles (variables, layout, animations, responsive)
├── js/
│   └── main.js         ← All interactivity (9 modules, each documented)
└── assets/
    └── photo.jpg       ← YOUR PHOTO — add this file (see Step 3 below)
```

---

## Step-by-Step Setup Guide

### Step 1 — Get the files running locally

Open the `portfolio/` folder in VS Code.

Install the **Live Server** extension in VS Code:
- Press `Ctrl+Shift+X` → search "Live Server" → install
- Right-click `index.html` → "Open with Live Server"
- It opens at `http://127.0.0.1:5500`

Every time you save a file, the browser auto-refreshes.

---

### Step 2 — Customize your content in `index.html`

Search and replace these placeholders:

| Find | Replace with |
|------|--------------|
| `Your Photo` | Your actual photo (see Step 3) |
| `your@email.com` | `ajayvarsan2@gmail.com` |
| `github.com/ajayvrsn` | Your GitHub URL |
| `linkedin.com/ajayvarsanr` | Your LinkedIn URL |
| `href="#"` on project cards | Your actual GitHub project links |

---

### Step 3 — Add your photo

1. Take or find a good portrait photo (square or portrait orientation)
2. Name it `photo.jpg` and put it in the `assets/` folder
3. In `index.html`, find this comment block in the hero section:

```html
<!-- YOU CAN FIND IT THERE AND REPLACE THIS DIV WITH YOUR PHOTO:
  <img src="assets/photo.jpg" alt="Ajay Varsan" />
-->
<div class="photo-label">Your Photo</div>
```

Replace those 4 lines with just:

```html
<img src="assets/photo.jpg" alt="Ajay Varsan" />
```

---

### Step 4 — Customize colors (optional)

Open `css/style.css`. At the very top, find the `:root` block.
Every color lives here as a CSS variable:

```css
:root {
  --gold:    #c8a96e;   /* Change this to your accent color */
  --gold-2:  #a8853e;   /* Darker shade of accent */
  --paper:   #f5f2ed;   /* Background */
  --ink:     #0d0d0d;   /* Text */
  --dark:    #0e0e1a;   /* Work section background */
}
```

Change `--gold` and `--gold-2` to any color you want.
Everything else updates automatically.

---

### Step 5 — Connect a real contact form

Currently the form shows a simulated "sent" state.
To make it actually send emails, use **Formspree** (free):

1. Go to https://formspree.io and create a free account
2. Create a new form — you'll get an ID like `xabcdefg`
3. Open `js/main.js`, find this comment block (around line 105):

```javascript
// TO CONNECT A REAL BACKEND, replace the setTimeout below
// with a fetch() call. Example using Formspree:
//
// const response = await fetch('https://formspree.io/f/YOUR_ID', {
```

4. Replace the `await new Promise(...)` line with:

```javascript
const response = await fetch('https://formspree.io/f/YOUR_ID', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email, project }),
});

if (!response.ok) {
  submitBtn.querySelector('.btn-text').textContent = 'Error — try again';
  submitBtn.disabled = false;
  return;
}
```

5. Replace `YOUR_ID` with your actual Formspree form ID

---

### Step 6 — Deploy for free (Vercel)

1. Push the portfolio folder to a new GitHub repo
2. Go to https://vercel.com → "Add New Project" → import your repo
3. Vercel auto-detects it's a static site — click Deploy
4. You get a live URL like `https://[your-domain-name].vercel.app`
5. Optional: connect a custom domain in Vercel settings
