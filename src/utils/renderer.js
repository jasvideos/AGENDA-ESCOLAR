export const loadImage = (src, assetCache) => new Promise((resolve) => {
  if (!src) return resolve(null);
  if (assetCache && assetCache.has(src)) {
    const cached = assetCache.get(src);
    if (cached.complete && cached.naturalWidth !== 0) return resolve(cached);
  }

  const img = new window.Image();
  img.crossOrigin = 'anonymous';
  
  const timeout = setTimeout(() => {
    console.warn('Timeout ao carregar imagem:', src);
    resolve(null);
  }, 8000);

  img.onload = () => {
    clearTimeout(timeout);
    if (assetCache) assetCache.set(src, img);
    resolve(img);
  };
  img.onerror = (e) => {
    clearTimeout(timeout);
    console.error('Erro ao carregar imagem:', src, e);
    resolve(null);
  };
  img.src = src;
});

const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${alpha})`;
};

export const renderSlideToCanvas = async (ctx, slide, options = {}) => {
  const { 
    width = 1280, 
    height = 720, 
    origW = 960, 
    origH = 540, 
    assetCache = null,
    QRCode = null
  } = options;

  const scaleX = width / origW;
  const scaleY = height / origH;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = slide.bgColor || '#111827';
  ctx.fillRect(0, 0, width, height);

  if (slide.bgImage) {
    const bgImg = await loadImage(slide.bgImage, assetCache);
    if (bgImg) {
      const opacity = slide.bgOpacity !== undefined ? slide.bgOpacity : 1;
      ctx.globalAlpha = opacity;
      const ar = bgImg.width / bgImg.height;
      const canvasAr = width / height;
      let sx, sy, sw, sh;
      if (ar > canvasAr) {
        sh = bgImg.height; sw = sh * canvasAr;
        sx = (bgImg.width - sw) / 2; sy = 0;
      } else {
        sw = bgImg.width; sh = sw / canvasAr;
        sx = 0; sy = (bgImg.height - sh) / 2;
      }
      ctx.drawImage(bgImg, sx, sy, sw, sh, 0, 0, width, height);
      ctx.globalAlpha = 1;
    }
  }

  for (const el of slide.elements) {
    const cx = el.x * scaleX;
    const cy = el.y * scaleY;
    const w = (parseFloat(el.w) || 0) * scaleX;
    const h = (parseFloat(el.h) || 0) * scaleY;
    const opacity = el.style?.opacity !== undefined ? el.style.opacity : 1;
    const rotation = el.rotation || 0;

    ctx.save();
    if (rotation !== 0) {
      ctx.translate(cx + w / 2, cy + h / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-(cx + w / 2), -(cy + h / 2));
    }
    ctx.globalAlpha = opacity;
    const x = cx, y = cy;

    if (el.type === 'image') {
      const img = await loadImage(el.src, assetCache);
      if (img) ctx.drawImage(img, x, y, w, h);
    } else if (el.type === 'shape') {
      const radius = Math.min(parseInt(el.style?.borderRadius) || 0, w / 2, h / 2);
      ctx.beginPath();
      if (radius > 0) {
        ctx.moveTo(x + radius, y); ctx.arcTo(x + w, y, x + w, y + h, radius);
        ctx.arcTo(x + w, y + h, x, y + h, radius); ctx.arcTo(x, y + h, x, y, radius);
        ctx.arcTo(x, y, x + w, y, radius); ctx.closePath();
      } else { ctx.rect(x, y, w, h); }
      if (el.style?.useGradient && el.style?.gradientColor) {
        const grad = ctx.createLinearGradient(x, y, x + w, y + h);
        grad.addColorStop(0, el.style.backgroundColor || '#6366f1');
        grad.addColorStop(1, el.style.gradientColor);
        ctx.fillStyle = grad;
      } else { ctx.fillStyle = el.style?.backgroundColor || '#6366f1'; }
      ctx.fill();
      const bw = parseInt(el.style?.borderWidth) || 0;
      if (bw > 0) { ctx.strokeStyle = el.style?.borderColor || '#ffffff'; ctx.lineWidth = bw * scaleX; ctx.stroke(); }
    } else if (el.type === 'text') {
      const fontSize = parseFloat(el.style?.fontSize) || 20;
      const fontFamily = el.style?.fontFamily || 'Inter';
      const fontWeight = el.style?.fontWeight || 'normal';
      const color = el.style?.color || '#ffffff';
      const bg = el.style?.backgroundColor;
      const hasBg = bg && bg !== 'transparent';
      if (hasBg) {
        const bgOpacity = el.style?.bgOpacity !== undefined ? el.style.bgOpacity : 1;
        ctx.globalAlpha = bgOpacity;
        if (el.style?.useGradient && el.style?.gradientColor) {
          const grad = ctx.createLinearGradient(x, y, x + w, y + h);
          const c1 = bg.startsWith('#') ? hexToRgba(bg, bgOpacity) : bg;
          const c2 = el.style.gradientColor.startsWith('#') ? hexToRgba(el.style.gradientColor, bgOpacity) : el.style.gradientColor;
          grad.addColorStop(0, c1); grad.addColorStop(1, c2);
          ctx.fillStyle = grad;
        } else { ctx.fillStyle = bg.startsWith('#') ? hexToRgba(bg, bgOpacity) : bg; }
        const r = 4 * scaleX;
        ctx.beginPath();
        ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); ctx.fill();
        const bw = parseInt(el.style?.borderWidth) || 0;
        if (bw > 0) { ctx.strokeStyle = el.style?.borderColor || '#ffffff'; ctx.lineWidth = bw * scaleX; ctx.stroke(); }
        ctx.globalAlpha = opacity;
      }
      ctx.fillStyle = color;
      ctx.font = `${fontWeight} ${fontSize * scaleY}px '${fontFamily}', sans-serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const words = (el.content || '').split(' ');
      const maxWidth = w - 40 * scaleX;
      const lineHeight = fontSize * scaleY * 1.3;
      const lines = []; let line = '';
      for (const word of words) {
        const test = line ? `${line} ${word}` : word;
        if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = word; } else { line = test; }
      }
      if (line) lines.push(line);
      const totalH = lines.length * lineHeight;
      const startY = y + h / 2 - totalH / 2 + lineHeight / 2;
      lines.forEach((l, i) => ctx.fillText(l, x + w / 2, startY + i * lineHeight, maxWidth));
    } else if (el.type === 'qrcode' && QRCode) {
      try {
        const qrDataUrl = await QRCode.toDataURL(el.content || 'https://anix.com', { width: Math.round(w), margin: 1, color: { dark: '#000000', light: '#ffffff' } });
        const qrImg = await loadImage(qrDataUrl, assetCache);
        if (qrImg) {
          ctx.fillStyle = '#ffffff';
          const pad = 10 * scaleX, r = 8 * scaleX;
          ctx.beginPath();
          ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r);
          ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r);
          ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); ctx.fill();
          ctx.drawImage(qrImg, x + pad, y + pad, w - pad * 2, h - pad * 2);
        }
      } catch {}
    } else if (el.type === 'svg') {
      try {
        const color = el.style?.color || '#ffffff';
        const cacheKey = `svg-${el.id}-${color}`;
        let svgImg = assetCache ? assetCache.get(cacheKey) : null;

        if (!svgImg) {
          const svgString = (el.content || '').replace(/currentColor/g, color);
          const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          svgImg = await loadImage(url, assetCache);
          if (svgImg && assetCache) assetCache.set(cacheKey, svgImg);
        }

        if (svgImg) ctx.drawImage(svgImg, x, y, w, h);
      } catch (err) {
        console.error("SVG Render Error:", err);
      }
    }
    ctx.restore();
  }
};
