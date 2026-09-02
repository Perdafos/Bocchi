import type { AssetToPreload } from '../context/PreloaderContext';

// ─────────────────────────────────────────────
// Asset Manifest
// All static assets to preload before app entry
// ─────────────────────────────────────────────
export const assetManifest: AssetToPreload[] = [
  // Background
  { url: '/img/background.jpg', type: 'image' },
  { url: '/img/chairtable.png', type: 'image' },
  { url: '/img/chairtablefront.png', type: 'image' },

  // Characters
  { url: '/img/seiki/seiki.png', type: 'image' },
  { url: '/img/kikkuri/kikkuri.png', type: 'image' },
  { url: '/img/hitori/goto.png', type: 'image' },
  { url: '/img/nijika/nijika.png', type: 'image' },
  { url: '/img/ryo/ryo.png', type: 'image' },
  { url: '/img/kita/kita.png', type: 'image' },
];

// Add more assets here as your project grows
// e.g. { url: '/img/extra/bg-scene.jpg', type: 'image' },
