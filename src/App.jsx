import React, { useState, useEffect, useRef } from 'react';
import AdminSidebar from './components/AdminSidebar';
import SlideCanvas from './components/SlideCanvas';
import PropertyPanel from './components/PropertyPanel';
import { Plus, Play, Square, Type, Image as ImageIcon, Circle, Repeat, Video, Undo, Redo, QrCode, Loader2, Sparkles } from 'lucide-react';
import { useHistory } from './hooks/useHistory';
import QRCode from 'qrcode';
import { decorativeElements } from './templates';

const STORAGE_KEY = 'anix_slides_data';

const SLIDE_W = 960;
const SLIDE_H = 540;
const VIDEO_W = 1920;
const VIDEO_H = 1080;
const DEFAULT_DURATION = 5;

const initialSlides = [
  {
    id: 'slide-1',
    name: 'Slide 1',
    duration: DEFAULT_DURATION,
    elements: [
      {
        id: 'el-1',
        type: 'text',
        content: 'Bem-vindo ao Anix Slides',
        x: 50,
        y: 50,
        w: 400,
        h: 80,
        style: { fontSize: '32px', color: '#ffffff', fontWeight: 'bold', backgroundColor: 'rgba(99, 102, 241, 0.8)' }
      }
    ]
  }
];

function App() {
  const [slides, setSlides, undo, redo, setExternalState] = useHistory(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : initialSlides;
    return parsed.map(s => ({ duration: DEFAULT_DURATION, ...s }));
  });
  const [activeSlideId, setActiveSlideId] = useState(slides[0]?.id);
  const [selectedElementId, setSelectedElementId] = useState(null);
  const [isPresenting, setIsPresenting] = useState(false);
  const [showShapeMenu, setShowShapeMenu] = useState(false);
  const [showImageMenu, setShowImageMenu] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState({ current: 0, total: 0, slideName: '' });
  const [showElementsMenu, setShowElementsMenu] = useState(false);
  const [presentationScale, setPresentationScale] = useState(1);
  const [copiedElement, setCopiedElement] = useState(null);
  const activeSlideIdRef = useRef(activeSlideId);
  const assetCache = useRef(new Map()); // Global cache for images and SVGs

  // Derivadas e Refs para evitar TDZ
  const activeSlide = slides.find(s => s.id === activeSlideId) || slides[0];
  const selectedElement = activeSlide?.elements.find(el => el.id === selectedElementId);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slides));
  }, [slides]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isPresenting) return;
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') return;

      if (e.ctrlKey && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (e.ctrlKey && (e.key.toLowerCase() === 'y' || (e.key.toLowerCase() === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      } else if (e.ctrlKey && e.key.toLowerCase() === 'c') {
        const el = activeSlide?.elements.find(item => item.id === selectedElementId);
        if (el) {
          setCopiedElement(JSON.parse(JSON.stringify(el)));
        }
      } else if (e.ctrlKey && e.key.toLowerCase() === 'v') {
        if (copiedElement) {
          const newEl = {
            ...JSON.parse(JSON.stringify(copiedElement)),
            id: `el-${Date.now()}-${Math.random().toString(36).substring(7)}`,
            x: copiedElement.x + 20,
            y: copiedElement.y + 20
          };
          setSlides(slides.map(s => 
            s.id === activeSlideId 
              ? { ...s, elements: [...s.elements, newEl] }
              : s
          ));
          setSelectedElementId(newEl.id);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, isPresenting, activeSlide, selectedElementId, copiedElement]);

  useEffect(() => {
    if (isPresenting) {
      const handleResize = () => {
        setPresentationScale(Math.min(window.innerWidth / 960, window.innerHeight / 540));
      };
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    } else {
      setPresentationScale(1);
    }
  }, [isPresenting]);

  useEffect(() => {
    activeSlideIdRef.current = activeSlideId;
  }, [activeSlideId]);

  useEffect(() => {
    if (!isLooping || slides.length <= 1) return;
    const currentSlide = slides.find(s => s.id === activeSlideId);
    const duration = (currentSlide?.duration || DEFAULT_DURATION) * 1000;
    const timer = setTimeout(() => {
      setSlides(prevSlides => {
        const currentIndex = prevSlides.findIndex(s => s.id === activeSlideIdRef.current);
        const nextIndex = (currentIndex + 1) % prevSlides.length;
        setActiveSlideId(prevSlides[nextIndex].id);
        return prevSlides;
      });
    }, duration);
    return () => clearTimeout(timer);
  }, [isLooping, activeSlideId, slides]);

  const addSlide = (template = null) => {
    const newSlide = {
      id: `slide-${Date.now()}`,
      name: template ? template.name : `Slide ${slides.length + 1}`,
      bgColor: template ? template.bgColor : '#111827',
      bgImage: template ? template.bgImage : null,
      bgOpacity: template ? template.bgOpacity : 1,
      duration: DEFAULT_DURATION,
      elements: template ? template.elements.map(el => ({ ...el, id: `el-${Date.now()}-${Math.random()}` })) : []
    };
    setSlides([...slides, newSlide]);
    setActiveSlideId(newSlide.id);
  };

  const deleteSlide = (id) => {
    const newSlides = slides.filter(s => s.id !== id);
    setSlides(newSlides);
    if (activeSlideId === id && newSlides.length > 0) {
      setActiveSlideId(newSlides[0].id);
    }
  };

  const addElement = (type, preset = {}) => {
    const newElement = {
      id: `el-${Date.now()}`,
      type,
      x: 150,
      y: 150,
      w: preset.w || (type === 'text' ? 200 : 300),
      h: preset.h || (type === 'text' ? 50 : (type === 'shape' ? 150 : 200)),
      content: type === 'text' ? 'Novo Texto' : (type === 'svg' ? preset.svg : ''),
      src: type === 'image' ? 'https://via.placeholder.com/300x200?text=Sua+Imagem' : '',
      shapeType: type === 'shape' ? 'rectangle' : null,
      style: type === 'text' 
        ? { fontSize: '20px', color: '#ffffff' } 
        : (type === 'shape' 
            ? { backgroundColor: '#6366f1', borderRadius: preset.borderRadius || '0px' } 
            : (type === 'svg' ? { color: '#ffffff' } : {}))
    };

    setSlides(slides.map(s => 
      s.id === activeSlideId 
        ? { ...s, elements: [...s.elements, newElement] }
        : s
    ));
    setSelectedElementId(newElement.id);
    setShowShapeMenu(false);
  };

  const handleLocalImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newElement = {
          id: `el-${Date.now()}`,
          type: 'image',
          x: 150,
          y: 150,
          w: 300,
          h: 200,
          src: reader.result,
          style: {}
        };
        setSlides(slides.map(s => 
          s.id === activeSlideId ? { ...s, elements: [...s.elements, newElement] } : s
        ));
        setSelectedElementId(newElement.id);
        setShowImageMenu(false);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = null;
  };

  const handleBgImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSlides(slides.map(s => 
          s.id === activeSlideId ? { ...s, bgImage: reader.result } : s
        ));
        setShowImageMenu(false);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = null;
  };

  const updateElement = (elementId, updates) => {
    setSlides(slides.map(s => 
      s.id === activeSlideId 
        ? {
            ...s,
            elements: s.elements.map(el => 
              el.id === elementId ? { ...el, ...updates } : el
            )
          }
        : s
    ));
  };

  const deleteElement = (elementId) => {
    setSlides(slides.map(s => 
      s.id === activeSlideId 
        ? { ...s, elements: s.elements.filter(el => el.id !== elementId) }
        : s
    ));
    setSelectedElementId(null);
  };

  const reorderElement = (elementId, direction) => {
    setSlides(slides.map(s => {
      if (s.id !== activeSlideId) return s;
      const elements = [...s.elements];
      const index = elements.findIndex(el => el.id === elementId);
      if (index === -1) return s;
      const element = elements[index];
      elements.splice(index, 1);
      if (direction === 'front') elements.push(element);
      else if (direction === 'back') elements.unshift(element);
      else if (direction === 'up') elements.splice(Math.min(elements.length, index + 1), 0, element);
      else if (direction === 'down') elements.splice(Math.max(0, index - 1), 0, element);
      else elements.splice(index, 0, element);
      return { ...s, elements };
    }));
  };

  const updateSlide = (slideIdOrUpdates, updates) => {
    const targetId = typeof slideIdOrUpdates === 'string' ? slideIdOrUpdates : activeSlideId;
    const payload = typeof slideIdOrUpdates === 'string' ? updates : slideIdOrUpdates;
    setSlides(slides.map(s => s.id === targetId ? { ...s, ...payload } : s));
  };

  const loadImage = (src) => new Promise((resolve) => {
    if (!src) return resolve(null);
    if (assetCache.current.has(src)) return resolve(assetCache.current.get(src));

    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      assetCache.current.set(src, img);
      resolve(img);
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  const renderSlideToCanvas = async (ctx, slide, scaleX, scaleY) => {
    ctx.clearRect(0, 0, VIDEO_W, VIDEO_H);
    ctx.fillStyle = slide.bgColor || '#111827';
    ctx.fillRect(0, 0, VIDEO_W, VIDEO_H);

    if (slide.bgImage) {
      const bgImg = await loadImage(slide.bgImage);
      if (bgImg) {
        const opacity = slide.bgOpacity !== undefined ? slide.bgOpacity : 1;
        ctx.globalAlpha = opacity;
        const ar = bgImg.width / bgImg.height;
        const canvasAr = VIDEO_W / VIDEO_H;
        let sx, sy, sw, sh;
        if (ar > canvasAr) {
          sh = bgImg.height; sw = sh * canvasAr;
          sx = (bgImg.width - sw) / 2; sy = 0;
        } else {
          sw = bgImg.width; sh = sw / canvasAr;
          sx = 0; sy = (bgImg.height - sh) / 2;
        }
        ctx.drawImage(bgImg, sx, sy, sw, sh, 0, 0, VIDEO_W, VIDEO_H);
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

      const hexToRgba = (hex, alpha) => {
        const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
        return `rgba(${r},${g},${b},${alpha})`;
      };

      if (el.type === 'image') {
        const img = await loadImage(el.src);
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
      } else if (el.type === 'qrcode') {
        try {
          const qrDataUrl = await QRCode.toDataURL(el.content || 'https://anix.com', { width: Math.round(w), margin: 1, color: { dark: '#000000', light: '#ffffff' } });
          const qrImg = await loadImage(qrDataUrl);
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
          let svgImg = assetCache.current.get(cacheKey);

          if (!svgImg) {
            const svgString = (el.content || '').replace(/currentColor/g, color);
            const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            svgImg = await loadImage(url);
            if (svgImg) assetCache.current.set(cacheKey, svgImg);
            // URL.revokeObjectURL(url); // Don't revoke if we cache the img object
          }

          if (svgImg) ctx.drawImage(svgImg, x, y, w, h);
        } catch (err) {
          console.error("SVG Render Error:", err);
        }
      }
      ctx.restore();
    }
  };

  const exportVideo = async () => {
    if (isRecording) return;
    setIsRecording(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = VIDEO_W; canvas.height = VIDEO_H;
      const ctx = canvas.getContext('2d');
      const scaleX = VIDEO_W / SLIDE_W;
      const scaleY = VIDEO_H / SLIDE_H;

      setRecordingProgress({ current: 0, total: slides.length, slideName: 'Preparando motor...' });
      
      // Warm-up render para ativar o canvas antes da captura
      await renderSlideToCanvas(ctx, slides[0] || initialSlides[0], scaleX, scaleY);
      
      // Pré-carregamento total
      for (const slide of slides) {
        if (slide.bgImage) await loadImage(slide.bgImage);
        for (const el of slide.elements) {
          if (el.type === 'image' && el.src) await loadImage(el.src);
          if (el.type === 'svg') await renderSlideToCanvas(ctx, slide, scaleX, scaleY);
        }
      }

      const types = ['video/webm;codecs=vp8', 'video/webm;codecs=vp9', 'video/webm'];
      const mimeType = types.find(t => MediaRecorder.isTypeSupported(t)) || 'video/webm';
      
      // Captura sem FPS fixo para permitir que o navegador gerencie os frames sob demanda
      const stream = canvas.captureStream(); 
      const recorder = new MediaRecorder(stream, { 
        mimeType,
        videoBitsPerSecond: 5_000_000 // Reduzido para 5Mbps para maior estabilidade
      });
      
      const chunks = [];
      recorder.ondataavailable = (e) => { 
        if (e.data.size > 0) {
          chunks.push(e.data);
          console.log(`Chunk recebido: ${e.data.size} bytes`);
        }
      };
      
      recorder.onerror = (e) => {
        console.error('Erro no MediaRecorder:', e);
        alert('Erro na gravação: O navegador interrompeu o processo.');
      };
      
      const onStopPromise = new Promise((resolve, reject) => {
        recorder.onstop = () => {
          if (chunks.length === 0) {
            reject(new Error('Nenhum dado de vídeo foi capturado (0KB). Verifique se há imagens bloqueadas por CORS.'));
            return;
          }
          const blob = new Blob(chunks, { type: mimeType });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url; a.download = `anixslide-${Date.now()}.webm`; a.click();
          URL.revokeObjectURL(url);
          resolve();
        };
      });

      recorder.start(200); // Emite dados a cada 200ms

      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        const slideDurationMs = (slide.duration || DEFAULT_DURATION) * 1000;
        const startTime = Date.now();
        
        setRecordingProgress({ current: i + 1, total: slides.length, slideName: slide.name });

        while (Date.now() - startTime < slideDurationMs) {
          await renderSlideToCanvas(ctx, slide, scaleX, scaleY);
          // Pequena animação interna ou mudança forçada para garantir emissão de frames
          ctx.fillStyle = 'rgba(0,0,0,0.01)';
          ctx.fillRect(0,0,1,1);
          
          await sleep(50); // ~20 FPS render
          if (!isRecording) break;
        }
      }

      recorder.stop();
      await onStopPromise;
      
      setIsRecording(false);
      setRecordingProgress({ current: 0, total: 0, slideName: '' });
    } catch (err) {
      console.error('Erro na gravação:', err);
      alert(err.message || 'Erro ao gerar vídeo.');
      setIsRecording(false);
      setRecordingProgress({ current: 0, total: 0, slideName: '' });
    }
  };

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      {!isPresenting && (
        <AdminSidebar 
          slides={slides} activeSlideId={activeSlideId} setActiveSlideId={setActiveSlideId}
          addSlide={addSlide} deleteSlide={deleteSlide} setExternalState={setExternalState} updateSlide={updateSlide}
        />
      )}
      
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {!isPresenting && (
          <header className="glass" style={{ height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', zIndex: 10 }}>
            <div style={{ display: 'flex', gap: '15px' }}>
              <button className="button-secondary" onClick={() => addElement('text')}><Type size={18} /> Texto</button>
              <div style={{ position: 'relative' }}>
                <button className="button-secondary" onClick={() => setShowImageMenu(!showImageMenu)}><ImageIcon size={18} /> Imagem</button>
                {showImageMenu && (
                  <div className="glass animate-fade-in" style={{ position: 'absolute', top: '45px', left: '0', width: '200px', padding: '10px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '5px', zIndex: 100 }}>
                    <button className="button-secondary" onClick={() => document.getElementById('local-image-input').click()}>Imagem Local</button>
                    <button className="button-secondary" onClick={() => document.getElementById('bg-image-input').click()}>Imagem de Fundo</button>
                  </div>
                )}
              </div>
              <input type="file" id="local-image-input" style={{ display: 'none' }} onChange={handleLocalImageUpload} />
              <input type="file" id="bg-image-input" style={{ display: 'none' }} onChange={handleBgImageUpload} />
              <button className="button-secondary" onClick={() => setShowShapeMenu(!showShapeMenu)}><Square size={18} /> Forma</button>
              {showShapeMenu && (
                <div className="glass animate-fade-in" style={{ position: 'absolute', top: '110px', left: '230px', width: '180px', padding: '10px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '5px', zIndex: 100 }}>
                  <button className="button-secondary" onClick={() => addElement('shape', { borderRadius: '0px' })}>Retângulo</button>
                  <button className="button-secondary" onClick={() => addElement('shape', { borderRadius: '12px' })}>Arredondado</button>
                  <button className="button-secondary" onClick={() => addElement('shape', { borderRadius: '100px' })}>Círculo</button>
                </div>
              )}
              <div style={{ position: 'relative' }}>
                <button className="button-secondary" onClick={() => setShowElementsMenu(!showElementsMenu)}><Sparkles size={18} /> Elementos</button>
                {showElementsMenu && (
                  <div className="glass animate-fade-in" style={{ position: 'absolute', top: '45px', left: '0', width: '320px', padding: '15px', borderRadius: '8px', zIndex: 100, maxHeight: '400px', overflowY: 'auto' }}>
                    {decorativeElements.map((cat, i) => (
                      <div key={i} style={{ marginBottom: '10px' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{cat.category}</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                          {cat.items.map((it, j) => (
                            <button key={j} className="button-secondary" onClick={() => { addElement('svg', { svg: it.svg }); setShowElementsMenu(false); }} style={{ width: '40px', height: '40px' }}>
                              <div style={{ width: '100%', height: '100%', color: 'white' }} dangerouslySetInnerHTML={{ __html: it.svg }} />
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button className="button-secondary" onClick={() => addElement('qrcode')}><QrCode size={18} /> QR Code</button>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
               <button className="button-secondary" onClick={undo}><Undo size={16} /></button>
               <button className="button-secondary" onClick={redo}><Redo size={16} /></button>
               <button className="button-secondary" onClick={() => setIsLooping(!isLooping)} style={{ color: isLooping ? 'var(--accent)' : 'inherit' }}><Repeat size={18} /> Loop</button>
               <button className="button-secondary" onClick={exportVideo} disabled={isRecording}>{isRecording ? 'Gravando...' : 'Gravar HD'}</button>
               <button className="button-primary" style={{ background: '#22c55e' }} onClick={() => {
                 setIsPresenting(true);
                 if (slides.length > 1) setIsLooping(true);
                 document.getElementById('presentation-container')?.requestFullscreen().catch(() => {});
               }}><Play size={18} /> Apresentar</button>
            </div>
          </header>
        )}

        <div 
          id="presentation-container"
          style={{ 
            position: isPresenting ? 'fixed' : 'relative',
            top: 0, left: 0,
            width: isPresenting ? '100vw' : '100%',
            height: isPresenting ? '100vh' : '100%',
            flex: isPresenting ? 'none' : 1, 
            background: '#020617', 
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: isPresenting ? 1000 : 1,
            overflow: 'hidden'
          }}
        >
          {isPresenting && (
            <button className="button-secondary" style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 1100 }} onClick={() => { setIsPresenting(false); if(document.fullscreenElement) document.exitFullscreen(); }}>Sair</button>
          )}
          <div style={{
            width: '960px', height: '540px',
            transform: isPresenting ? `scale(${presentationScale})` : 'none',
            transformOrigin: 'center center',
            transition: 'transform 0.3s'
          }}>
            <SlideCanvas slide={activeSlide} selectedElementId={selectedElementId} setSelectedElementId={setSelectedElementId} updateElement={updateElement} readOnly={isPresenting} deleteElement={deleteElement} />
          </div>
        </div>
      </main>

      {!isPresenting && (
        <PropertyPanel element={selectedElement} updateElement={updateElement} deleteElement={deleteElement} reorderElement={reorderElement} activeSlide={activeSlide} updateSlide={updateSlide} />
      )}
    </div>
  );
}

export default App;
