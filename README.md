# MERCH — Minimal Clothing Showcase

A clean, minimal website to showcase your clothing. No backend, no cart — just pure visual presentation.

## Features

- **Upload clothes** — drag & drop or browse images
- **Category tags** — Tops, Bottoms, Outerwear, Accessories
- **Filter by category** — via the top nav
- **Lightbox** — click any item for a full detail view
- **Persistent storage** — items saved in localStorage, survive page refresh
- **Fully responsive** — looks great on mobile, tablet, and desktop

## File Structure

```
merch-website/
├── index.html   — markup & structure
├── style.css    — all styling
├── app.js       — upload logic, grid rendering, filters, lightbox
└── README.md    — this file
```

## How to Deploy on GitHub Pages

1. Create a new GitHub repository (e.g. `merch`)
2. Upload all three files (`index.html`, `style.css`, `app.js`)
3. Go to **Settings → Pages**
4. Under **Source**, select **Deploy from a branch** → `main` → `/ (root)`
5. Save — your site will be live at `https://yourusername.github.io/merch`

## How to Use

1. Open the site and click **+ Add clothing**
2. Drag an image or click **browse** to pick one
3. Fill in the item name, price, and category
4. Click **Add Item** — it appears in the grid instantly
5. Use the nav links to filter by category
6. Click any card to open the full lightbox view
7. Hover a card and click **×** to remove it

## Notes

- Items are stored in the browser's `localStorage`. They persist across refreshes on the same device/browser but won't sync across devices.
- For multi-device sharing, consider connecting a backend like Supabase or Firebase.
- Images are stored as base64 data URLs. Very large/high-res images may hit the ~5MB localStorage limit — use compressed images for best results.
