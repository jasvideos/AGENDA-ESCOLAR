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

  img.onerror = () => {
    clearTimeout(timeout);
    console.error('Erro ao carregar imagem:', src);
    resolve(null);
  };

  img.src = src;
});

export const hexToRgba = (hex, alpha = 1) => {
  if (!hex) return `rgba(0,0,0,${alpha})`;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const renderSlideToCanvas = async (ctx, slide, options = {}) => {
  if (!slide) return;
  const { assetCache, QRCode } = options;

  const scaleX = ctx.canvas.width / 960;
  const scaleY = ctx.canvas.height / 540;
  
  // Limpar fundo
  ctx.fillStyle = slide.bgColor || '#111827';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  if (slide.bgImage) {
    const bgImg = await loadImage(slide.bgImage, assetCache);
    if (bgImg) {
      ctx.globalAlpha = slide.bgOpacity !== undefined ? slide.bgOpacity : 1;
      ctx.drawImage(bgImg, 0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.globalAlpha = 1;
    }
  }

  for (const el of (slide.elements || [])) {
    try {
      if (!el) continue;
    const x = el.x * scaleX;
    const y = el.y * scaleY;
    const w = (parseFloat(el.w) || 0) * scaleX;
    const h = (parseFloat(el.h) || 0) * scaleY;
    const opacity = el.style?.opacity !== undefined ? el.style.opacity : 1;

    ctx.save();
    ctx.globalAlpha = opacity;

    if (el.type === 'text') {
      const fontSize = (parseInt(el.style?.fontSize) || 24) * scaleX;
      ctx.font = `${el.style?.fontWeight || 'normal'} ${fontSize}px sans-serif`;
      ctx.fillStyle = el.style?.color || '#ffffff';
      ctx.textBaseline = 'top';
      
      if (el.style?.backgroundColor) {
        ctx.fillStyle = el.style.backgroundColor;
        ctx.fillRect(x, y, w, h);
        ctx.fillStyle = el.style.color || '#ffffff';
      }

      const words = (el.content || '').toString().split(' ');
      let line = '';
      let currentY = y;
      const lineHeight = fontSize * 1.2;

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > w && n > 0) {
          ctx.fillText(line, x, currentY);
          line = words[n] + ' ';
          currentY += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, x, currentY);

    } else if (el.type === 'shape') {
      ctx.fillStyle = el.style?.backgroundColor || '#6366f1';
      const radius = (parseInt(el.style?.borderRadius) || 0) * scaleX;
      
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.arcTo(x + w, y, x + w, y + h, radius);
      ctx.arcTo(x + w, y + h, x, y + h, radius);
      ctx.arcTo(x, y + h, x, y, radius);
      ctx.arcTo(x, y, x + w, y, radius);
      ctx.closePath();
      ctx.fill();

    } else if (el.type === 'image') {
      const img = await loadImage(el.src, assetCache);
      if (img) {
        ctx.drawImage(img, x, y, w, h);
      }
    } else if (el.type === 'qrcode') {
      try {
        const qrDataUrl = await QRCode.toDataURL(String(el.content || 'https://anix.com'), { width: Math.round(w), margin: 1 });
        const qrImg = await loadImage(qrDataUrl, assetCache);
        if (qrImg) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(x, y, w, h);
          ctx.drawImage(qrImg, x + 5, y + 5, w - 10, h - 10);
        }
      } catch {}
    } else if (el.type === 'svg') {
      try {
        const color = el.style?.color || '#ffffff';
        const svgString = (el.content || '').replace(/currentColor/g, color);
        const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const svgImg = await loadImage(url, assetCache);
        if (svgImg) ctx.drawImage(svgImg, x, y, w, h);
        URL.revokeObjectURL(url);
      } catch {}
    }
    } catch (err) {
      console.error('Error rendering element:', err);
    }
    ctx.restore();
  }
};
