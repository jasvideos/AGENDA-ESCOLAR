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
    // Ensure all slides have a duration field
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
  const activeSlideIdRef = useRef(activeSlideId);

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
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, isPresenting]);

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

  // Auto-play loop logic (uses per-slide duration)
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

  const activeSlide = slides.find(s => s.id === activeSlideId) || slides[0];

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
    e.target.value = null; // reset input
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
    e.target.value = null; // reset input
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

      if (direction === 'front') {
        elements.push(element);
      } else if (direction === 'back') {
        elements.unshift(element);
      } else if (direction === 'up') {
        elements.splice(Math.min(elements.length, index + 1), 0, element);
      } else if (direction === 'down') {
        elements.splice(Math.max(0, index - 1), 0, element);
      } else {
        elements.splice(index, 0, element);
      }
      return { ...s, elements };
    }));
  };

  const updateSlide = (slideIdOrUpdates, updates) => {
    // If called with (updates) — updates active slide
    // If called with (slideId, updates) — updates specific slide
    const targetId = typeof slideIdOrUpdates === 'string' ? slideIdOrUpdates : activeSlideId;
    const payload = typeof slideIdOrUpdates === 'string' ? updates : slideIdOrUpdates;
    setSlides(slides.map(s => s.id === targetId ? { ...s, ...payload } : s));
  };

  const selectedElement = activeSlide?.elements.find(el => el.id === selectedElementId);

  // ─── Canvas-based Full HD video export ───────────────────────────────────
  const loadImage = (src) => new Promise((resolve) => {
    if (!src) return resolve(null);
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  const renderSlideToCanvas = async (ctx, slide, scaleX, scaleY) => {
    ctx.clearRect(0, 0, VIDEO_W, VIDEO_H);

    // Background color
    ctx.fillStyle = slide.bgColor || '#111827';
    ctx.fillRect(0, 0, VIDEO_W, VIDEO_H);

    // Background image
    if (slide.bgImage) {
      const bgImg = await loadImage(slide.bgImage);
      if (bgImg) {
        const opacity = slide.bgOpacity !== undefined ? slide.bgOpacity : 1;
        ctx.globalAlpha = opacity;
        // Cover fit
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

    // Elements (in order)
    for (const el of slide.elements) {
      const cx = el.x * scaleX;
      const cy = el.y * scaleY;
      const w = (parseFloat(el.w) || 0) * scaleX;
      const h = (parseFloat(el.h) || 0) * scaleY;
      const opacity = el.style?.opacity !== undefined ? el.style.opacity : 1;
      const rotation = el.rotation || 0;

      // Apply rotation transform around element center
      ctx.save();
      if (rotation !== 0) {
        ctx.translate(cx + w / 2, cy + h / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.translate(-(cx + w / 2), -(cy + h / 2));
      }
      ctx.globalAlpha = opacity;

      const x = cx, y = cy;

      // Helper: hex+alpha to rgba string
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
          // FIX: use bgOpacity for tarja, independent of text opacity
          const bgOpacity = el.style?.bgOpacity !== undefined ? el.style.bgOpacity : 1;
          ctx.globalAlpha = bgOpacity;
          if (el.style?.useGradient && el.style?.gradientColor) {
            const grad = ctx.createLinearGradient(x, y, x + w, y + h);
            const c1 = bg.startsWith('#') ? hexToRgba(bg, bgOpacity) : bg;
            const c2 = el.style.gradientColor.startsWith('#') ? hexToRgba(el.style.gradientColor, bgOpacity) : el.style.gradientColor;
            grad.addColorStop(0, c1); grad.addColorStop(1, c2);
            ctx.fillStyle = grad;
          } else {
            ctx.fillStyle = bg.startsWith('#') ? hexToRgba(bg, bgOpacity) : bg;
          }
          const r = 4 * scaleX;
          ctx.beginPath();
          ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r);
          ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r);
          ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
          ctx.fill();
          const bw = parseInt(el.style?.borderWidth) || 0;
          if (bw > 0) { ctx.strokeStyle = el.style?.borderColor || '#ffffff'; ctx.lineWidth = bw * scaleX; ctx.stroke(); }
          ctx.globalAlpha = opacity; // restore for text
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
          const svgString = (el.content || '').replace(/currentColor/g, el.style?.color || '#ffffff');
          const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const svgImg = await loadImage(url);
          if (svgImg) {
             ctx.drawImage(svgImg, x, y, w, h);
          }
          URL.revokeObjectURL(url);
        } catch {}
      }
      ctx.restore();
    }
  };

  const exportVideo = async () => {
    if (isRecording) return;
    setIsRecording(true);

    try {
      const canvas = document.createElement('canvas');
      canvas.width = VIDEO_W;
      canvas.height = VIDEO_H;
      const ctx = canvas.getContext('2d');
      const scaleX = VIDEO_W / SLIDE_W;
      const scaleY = VIDEO_H / SLIDE_H;

      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm';

      const stream = canvas.captureStream(30);
      const recorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 12_000_000 // 12 Mbps — cinema quality for TV
      });

      const chunks = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `anixslide-fullhd-${Date.now()}.webm`;
        a.click();
        URL.revokeObjectURL(url);
        setIsRecording(false);
        setRecordingProgress({ current: 0, total: 0, slideName: '' });
      };

      recorder.start(100); // collect data every 100ms

      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        const duration = (slide.duration || DEFAULT_DURATION) * 1000;
        setRecordingProgress({ current: i + 1, total: slides.length, slideName: slide.name });
        await renderSlideToCanvas(ctx, slide, scaleX, scaleY);
        await sleep(duration);
      }

      recorder.stop();
    } catch (err) {
      console.error('Erro ao gravar vídeo:', err);
      alert('Erro ao gravar o vídeo. Verifique o console para mais detalhes.');
      setIsRecording(false);
    }
  };

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      {!isPresenting && (
        <AdminSidebar 
          slides={slides} 
          activeSlideId={activeSlideId} 
          setActiveSlideId={setActiveSlideId}
          addSlide={addSlide}
          deleteSlide={deleteSlide}
          setExternalState={setExternalState}
          updateSlide={updateSlide}
        />
      )}
      
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {!isPresenting && (
          <header className="glass" style={{ height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', zIndex: 10 }}>
            <div style={{ display: 'flex', gap: '15px', position: 'relative' }}>
              <button className="button-secondary" onClick={() => addElement('text')}>
                <Type size={18} /> Texto
              </button>
              
              <div style={{ position: 'relative' }}>
                <button className="button-secondary" onClick={() => setShowImageMenu(!showImageMenu)}>
                  <ImageIcon size={18} /> Imagem
                </button>
                {showImageMenu && (
                  <div className="glass animate-fade-in" style={{ 
                    position: 'absolute', 
                    top: '45px', 
                    left: '0', 
                    width: '200px', 
                    padding: '10px', 
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px',
                    zIndex: 100,
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                  }}>
                    <button className="button-secondary" style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px' }} onClick={() => document.getElementById('local-image-input').click()}>
                      <ImageIcon size={14} /> Imagem Local
                    </button>
                    <button className="button-secondary" style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px' }} onClick={() => document.getElementById('bg-image-input').click()}>
                      <ImageIcon size={14} /> Imagem de Fundo (BG)
                    </button>
                  </div>
                )}
              </div>
              <input type="file" id="local-image-input" style={{ display: 'none' }} accept="image/*" onChange={handleLocalImageUpload} />
              <input type="file" id="bg-image-input" style={{ display: 'none' }} accept="image/*" onChange={handleBgImageUpload} />
              
              <div style={{ position: 'relative' }}>
                <button className="button-secondary" onClick={() => setShowShapeMenu(!showShapeMenu)}>
                  <Square size={18} /> Forma
                </button>
                
                {showShapeMenu && (
                  <div className="glass animate-fade-in" style={{ 
                    position: 'absolute', 
                    top: '45px', 
                    left: '0', 
                    width: '180px', 
                    padding: '10px', 
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px',
                    zIndex: 100,
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                  }}>
                    <button className="button-secondary" style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px' }} onClick={() => addElement('shape', { borderRadius: '0px' })}>
                      <Square size={14} /> Retângulo
                    </button>
                    <button className="button-secondary" style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px' }} onClick={() => addElement('shape', { borderRadius: '12px' })}>
                      <div style={{ width: '14px', height: '14px', border: '1.5px solid currentColor', borderRadius: '4px' }} /> Arredondado
                    </button>
                    <button className="button-secondary" style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px' }} onClick={() => addElement('shape', { borderRadius: '100px', w: 150, h: 150 })}>
                      <Circle size={14} /> Círculo
                    </button>
                    <button className="button-secondary" style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px' }} onClick={() => addElement('shape', { borderRadius: '0px', w: 100, h: 100 })}>
                      <Square size={14} /> Quadrado
                    </button>
                  </div>
                )}
              </div>
              
              <div style={{ position: 'relative' }}>
                <button className="button-secondary" onClick={() => setShowElementsMenu(!showElementsMenu)}>
                  <Sparkles size={18} /> Elementos
                </button>
                
                {showElementsMenu && (
                  <div className="glass animate-fade-in" style={{ 
                    position: 'absolute', 
                    top: '45px', 
                    left: '0', 
                    width: '320px', 
                    padding: '15px', 
                    borderRadius: '8px',
                    zIndex: 100,
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                    maxHeight: '400px',
                    overflowY: 'auto'
                  }}>
                    <h4 style={{ marginBottom: '10px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Repositório Grátis</h4>
                    {decorativeElements.map((category, i) => (
                      <div key={i} style={{ marginBottom: '15px' }}>
                        <div style={{ fontSize: '0.8rem', marginBottom: '8px', fontWeight: 'bold' }}>{category.category}</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {category.items.map((item, j) => (
                            <button
                              key={j}
                              className="button-secondary"
                              style={{ width: '40px', height: '40px', padding: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              onClick={() => {
                                addElement('svg', { svg: item.svg, w: 100, h: 100 });
                                setShowElementsMenu(false);
                              }}
                              title={item.name}
                            >
                              <div style={{ width: '100%', height: '100%', color: 'white' }} dangerouslySetInnerHTML={{ __html: item.svg }} />
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button className="button-secondary" onClick={() => addElement('qrcode', { content: 'https://exemplo.com', w: 150, h: 150 })}>
                <QrCode size={18} /> QR Code
              </button>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
               <button className="button-secondary" onClick={undo} title="Desfazer (Ctrl+Z)" style={{ padding: '8px' }}>
                 <Undo size={16} />
               </button>
               <button className="button-secondary" onClick={redo} title="Refazer (Ctrl+Y)" style={{ padding: '8px' }}>
                 <Redo size={16} />
               </button>
               
               <div style={{ width: '1px', height: '24px', background: 'var(--border)', margin: '0 5px' }}></div>

               <button 
                className="button-secondary" 
                style={{ 
                  color: isLooping ? 'var(--accent)' : 'inherit',
                  borderColor: isLooping ? 'var(--accent)' : 'var(--border)'
                }}
                onClick={() => setIsLooping(!isLooping)}
               >
                <Repeat size={18} style={{ marginRight: '5px' }} /> Loop
              </button>

              <button 
                className="button-secondary" 
                onClick={exportVideo}
                disabled={isRecording}
                title="Gravar apresentação em Full HD (1920×1080) para TV"
                style={{
                  opacity: isRecording ? 0.7 : 1,
                  cursor: isRecording ? 'not-allowed' : 'pointer',
                  background: isRecording ? 'linear-gradient(45deg, #dc2626, #991b1b)' : undefined,
                  color: isRecording ? 'white' : undefined,
                  border: isRecording ? 'none' : undefined,
                  minWidth: '160px'
                }}
              >
                {isRecording ? (
                  <><Loader2 size={16} style={{ marginRight: '6px', animation: 'spin 1s linear infinite' }} />
                  {recordingProgress.current}/{recordingProgress.total} — {recordingProgress.slideName}</>
                ) : (
                  <><Video size={18} style={{ marginRight: '5px' }} /> Gravar Full HD</>
                )}
              </button>

               <button className="button-primary" style={{ background: '#22c55e' }} onClick={() => {
                 setIsPresenting(true);
                 if (slides.length > 1) setIsLooping(true);
                 const elem = document.getElementById('presentation-container');
                 if (elem?.requestFullscreen) {
                   elem.requestFullscreen().catch(err => console.log(err));
                 }
               }}>
                <Play size={18} /> Apresentar
              </button>
            </div>
          </header>
        )}

        <div 
          id="presentation-container"
          style={{ 
          flex: 1, 
          overflow: 'hidden', 
          padding: isPresenting ? '0' : '40px', 
          background: '#020617', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          position: 'relative'
        }}>
          {isPresenting && (
            <button 
              className="button-secondary" 
              style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 200, opacity: 0.5 }}
              onClick={() => {
                setIsPresenting(false);
                if (document.fullscreenElement) {
                  document.exitFullscreen().catch(err => console.log(err));
                }
              }}
            >
              Sair da Apresentação
            </button>
          )}
          <div style={{
            transform: isPresenting ? `scale(${presentationScale})` : 'none',
            transformOrigin: 'center center',
            transition: 'transform 0.3s'
          }}>
            <SlideCanvas 
              slide={activeSlide} 
              selectedElementId={selectedElementId}
              setSelectedElementId={setSelectedElementId}
              updateElement={updateElement}
              readOnly={isPresenting}
              deleteElement={deleteElement}
            />
          </div>
        </div>
      </main>

      {!isPresenting && (
        <PropertyPanel 
          element={selectedElement} 
          updateElement={updateElement}
          deleteElement={deleteElement}
          reorderElement={reorderElement}
          activeSlide={activeSlide}
          updateSlide={updateSlide}
        />
      )}
    </div>
  );
}

export default App;
