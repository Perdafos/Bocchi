import type { AssetToPreload } from '../context/PreloaderContext';

// ─────────────────────────────────────────────────────────────────────────────
// Asset Manifest
//
// WAJIB di-update setiap kali ada asset baru ditambahkan ke project.
// Scan src/pages/** dan src/components/** untuk src="...", imgSrc="...",
// atau backgroundImage: url("...") yang mengarah ke folder img/ atau /img/,
// lalu tambahkan path-nya di sini.
//
// Skip: inline SVG/data URI, font CDN (handled by document.fonts), audio.
// ─────────────────────────────────────────────────────────────────────────────
export const assetManifest: AssetToPreload[] = [
  // ── Menu ────────────────────────────────────────────────────────────────
  { url: '/img/starry.jpg', type: 'image' },

  // ── Scene (backgrounds + karakter di Scene) ─────────────────────────────
  { url: '/img/background.jpg', type: 'image' },
  { url: '/img/chairtable.png', type: 'image' },
  { url: '/img/chairtablefront.png', type: 'image' },
  { url: '/img/seiki/seiki.png', type: 'image' },
  { url: '/img/kikkuri/kikkuri.png', type: 'image' },
  { url: '/img/hitori/goto.png', type: 'image' },
  { url: '/img/nijika/nijika.png', type: 'image' },
  { url: '/img/ryo/ryo.png', type: 'image' },
  { url: '/img/kita/kita.png', type: 'image' },

  // ── Shared textures ─────────────────────────────────────────────────────
  { url: '/img/image-texture.jpg', type: 'image' },

  // ── Bocchi (hitori) ────────────────────────────────────────────────────
  { url: '/img/hitori/photocard.png', type: 'image' },
  { url: '/img/hitori/aboutme.jpg', type: 'image' },
  { url: '/img/hitori/funfact.jpg', type: 'image' },
  { url: '/img/hitori/gear.jpg', type: 'image' },
  { url: '/img/hitori/contactme.jpg', type: 'image' },
  { url: '/img/hitori/album.png', type: 'image' },

  // ── Seika ──────────────────────────────────────────────────────────────
  { url: '/img/seiki/photocard.png', type: 'image' },
  { url: '/img/seiki/aboutme.jpg', type: 'image' },
  { url: '/img/seiki/funfact.jpg', type: 'image' },
  { url: '/img/seiki/gear.jpg', type: 'image' },
  { url: '/img/seiki/contactme.jpg', type: 'image' },
  { url: '/img/seiki/album.jpg', type: 'image' },

  // ── Kikuri ──────────────────────────────────────────────────────────────
  { url: '/img/kikkuri/photocard.png', type: 'image' },
  { url: '/img/kikkuri/aboutme.jpg', type: 'image' },
  { url: '/img/kikkuri/funfact.jpg', type: 'image' },
  { url: '/img/kikkuri/gear.jpg', type: 'image' },
  { url: '/img/kikkuri/contactme.jpg', type: 'image' },
  { url: '/img/kikkuri/album.jpg', type: 'image' },

  // ── Nijika ──────────────────────────────────────────────────────────────
  { url: '/img/nijika/photocard.png', type: 'image' },
  { url: '/img/nijika/aboutme.jpg', type: 'image' },
  { url: '/img/nijika/funfact.jpg', type: 'image' },
  { url: '/img/nijika/gear.jpg', type: 'image' },
  { url: '/img/nijika/contactme.jpg', type: 'image' },
  { url: '/img/nijika/album.jpg', type: 'image' },

  // ── Ryo ─────────────────────────────────────────────────────────────────
  { url: '/img/ryo/photocard.png', type: 'image' },
  { url: '/img/ryo/aboutme.jpg', type: 'image' },
  { url: '/img/ryo/funfact.jpg', type: 'image' },
  { url: '/img/ryo/gear.jpg', type: 'image' },
  { url: '/img/ryo/contactme.jpg', type: 'image' },
  { url: '/img/ryo/album.png', type: 'image' },

  // ── Kita ────────────────────────────────────────────────────────────────
  { url: '/img/kita/amaze.png', type: 'image' },
  { url: '/img/kita/about.jpg', type: 'image' },
  { url: '/img/kita/funfact.jpg', type: 'image' },
  { url: '/img/kita/gear.jpg', type: 'image' },
  { url: '/img/kita/contact.jpg', type: 'image' },
  { url: '/img/kita/album.webp', type: 'image' },
];
