# PWA Setup Guide

## Icons Required

The PWA requires the following icon files in the `public` folder:

- `icon-192.png` - 192x192 pixels (for Android home screen)
- `icon-512.png` - 512x512 pixels (for Android splash screen and high-res displays)

### Generating Icons

You can generate these icons from your app logo using:

1. **Online Tools:**
   - [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator)
   - [RealFaviconGenerator](https://realfavicongenerator.net/)
   - [PWA Builder](https://www.pwabuilder.com/imageGenerator)

2. **Manual Creation:**
   - Use your app logo (`app logo.png` in the public folder)
   - Resize to 192x192 and 512x512 pixels
   - Ensure icons are square and have transparent or solid backgrounds
   - Save as PNG format

3. **Using ImageMagick (CLI):**
   ```bash
   convert "public/app logo.png" -resize 192x192 public/icon-192.png
   convert "public/app logo.png" -resize 512x512 public/icon-512.png
   ```

## Testing PWA

1. **Development:**
   - Run `npm run dev`
   - Open Chrome DevTools → Application tab
   - Check "Service Workers" section
   - Check "Manifest" section

2. **Production Build:**
   - Run `npm run build && npm start`
   - Test on HTTPS (required for service workers)
   - Use Chrome DevTools → Lighthouse → Run PWA audit

3. **Installation:**
   - On Android: Chrome will show "Add to Home Screen" prompt
   - On iOS: Use Safari Share → Add to Home Screen
   - On Desktop: Chrome/Edge will show install button in address bar

## Features Enabled

- ✅ Service Worker for offline support
- ✅ Web App Manifest
- ✅ Install prompt
- ✅ Cache management
- ✅ Offline fallback
- ✅ Background sync (ready for implementation)
- ✅ Push notifications (ready for implementation)

## Service Worker Behavior

- **Caches:** Static assets and pages
- **Network First:** API requests always fetch fresh data
- **Cache First:** Static assets served from cache when available
- **Offline Fallback:** Returns cached homepage if network fails

## Customization

### Update Cache Version
Edit `public/sw.js` and change `CACHE_NAME` version to force cache refresh.

### Add More Assets to Cache
Edit `PRECACHE_ASSETS` array in `public/sw.js`.

### Customize Manifest
Edit `public/manifest.json` to change app name, colors, shortcuts, etc.
