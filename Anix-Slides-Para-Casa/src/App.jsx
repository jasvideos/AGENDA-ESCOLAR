import React, { useState, useEffect, useCallback, useRef } from 'react';
import AdminSidebar from './components/AdminSidebar';
import SlideCanvas from './components/SlideCanvas';
import PropertyPanel from './components/PropertyPanel';
import SettingsModal from './components/SettingsModal';
import { 
  Plus, Play, Square, Type, Image as ImageIcon, Circle, 
  Repeat, Clock, X, Download, Video, QrCode, Undo2, Redo2, 
  Save, FolderOpen, Sparkles, LogOut 
} from 'lucide-react';

const STORAGE_KEY = 'anix_slides_data_v2';
const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;

const initialSlides = [
  {
    id: 'slide-1',
    name: 'Slide 1',
    background: '#020617',
    bgImage: '',
    bgOpacity: 100,
    elements: [
      {
        id: 'el-1',
        type: 'text',
        content: 'Bem-vindo ao Anix Slides',
        x: 400,
        y: 400,
        w: 1120,
        h: 280,
        style: { fontSize: '120px', color: '#ffffff', fontWeight: 'bold', textAlign: 'center' }
      }
    ]
  }
];

function App() {
  const [slides, setSlides] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialSlides;
  });
  const [activeSlideId, setActiveSlideId] = useState(slides[0]?.id);
  const [selectedElementId, setSelectedElementId] = useState(null);
  const [isPresenting, setIsPresenting] = useState(false);
  const [showShapeMenu, setShowShapeMenu] = useState(false);
  const [showImageMenu, setShowImageMenu] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [slideDuration, setSlideDuration] = useState(5);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProcessingBg, setIsProcessingBg] = useState(false);
  
  // History for Undo/Redo
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const saveToHistory = useCallback((currentSlides) => {
    setHistory(prev => [...prev.slice(-20), JSON.stringify(currentSlides)]);
    setRedoStack([]);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slides));
  }, [slides]);

  // Auto-play loop logic
  useEffect(() => {
    let interval;
    if (isLooping && slides.length > 1 && isPresenting) {
      interval = setInterval(() => {
        const currentIndex = slides.findIndex(s => s.id === activeSlideId);
        const nextIndex = (currentIndex + 1) % slides.length;
        setActiveSlideId(slides[nextIndex].id);
      }, slideDuration * 1000);
    }
    return () => clearInterval(interval);
  }, [isLooping, activeSlideId, slideDuration, slides, isPresenting]);

  const activeSlide = slides.find(s => s.id === activeSlideId) || slides[0];

  const undo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setRedoStack(prev => [...prev, JSON.stringify(slides)]);
    setSlides(JSON.parse(previous));
    setHistory(prev => prev.slice(0, -1));
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setHistory(prev => [...prev, JSON.stringify(slides)]);
    setSlides(JSON.parse(next));
    setRedoStack(prev => prev.slice(0, -1));
  };

  const addSlide = () => {
    saveToHistory(slides);
    const newSlide = {
      id: `slide-${Date.now()}`,
      name: `Slide ${slides.length + 1}`,
      background: '#020617',
      bgImage: '',
      bgOpacity: 100,
      elements: []
    };
    setSlides([...slides, newSlide]);
    setActiveSlideId(newSlide.id);
  };

  const deleteSlide = (id) => {
    saveToHistory(slides);
    const newSlides = slides.filter(s => s.id !== id);
    setSlides(newSlides);
    if (activeSlideId === id && newSlides.length > 0) {
      setActiveSlideId(newSlides[0].id);
    }
  };

  const addElement = (type, preset = {}) => {
    saveToHistory(slides);
    const newElement = {
      id: `el-${Date.now()}`,
      type,
      x: 400,
      y: 400,
      w: preset.w || (type === 'text' ? 800 : 400),
      h: preset.h || (type === 'text' ? 150 : 400),
      content: type === 'text' ? 'Novo Texto' : (type === 'qr' ? 'https://anix.com' : ''),
      src: type === 'image' ? (preset.src || 'https://via.placeholder.com/800x600?text=Sua+Imagem') : '',
      shapeType: type === 'shape' ? (preset.shapeType || 'rectangle') : null,
      style: type === 'text' 
        ? { fontSize: '64px', color: '#ffffff', textAlign: 'center', opacity: 100, backgroundColor: 'transparent', spellCheck: false } 
        : (type === 'shape' 
            ? { backgroundColor: '#8b5cf6', borderRadius: preset.borderRadius || '0px', opacity: 100 } 
            : (type === 'qr' ? { backgroundColor: '#ffffff', padding: '10px' } : { opacity: 100 }))
    };

    setSlides(slides.map(s => 
      s.id === activeSlideId 
        ? { ...s, elements: [...s.elements, newElement] }
        : s
    ));
    setSelectedElementId(newElement.id);
    setShowShapeMenu(false);
    setShowImageMenu(false);
  };

  const handleLocalImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            let w = img.width;
            let h = img.height;
            const maxW = 800;
            const maxH = 800;
            if (w > maxW) {
              h = Math.round((h * maxW) / w);
              w = maxW;
            }
            if (h > maxH) {
              w = Math.round((w * maxH) / h);
              h = maxH;
            }
            addElement('image', { src: event.target.result, w, h });
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleLocalBg = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          updateSlide(activeSlideId, { bgImage: event.target.result });
          setShowImageMenu(false);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const updateElement = (elementId, updates) => {
    // Only save history if it's not a continuous move (maybe later)
    // For now, update state with safety checks
    setSlides(prevSlides => prevSlides.map(s => 
      s.id === activeSlideId 
        ? {
            ...s,
            elements: s.elements.map(el => {
              if (el.id !== elementId) return el;
              const normalized = { ...updates };
              if (updates.w && typeof updates.w === 'string') normalized.w = parseFloat(updates.w);
              if (updates.h && typeof updates.h === 'string') normalized.h = parseFloat(updates.h);
              return { ...el, ...normalized };
            })
          }
        : s
    ));
  };

  const updateSlide = (slideId, updates) => {
    saveToHistory(slides);
    setSlides(slides.map(s => s.id === slideId ? { ...s, ...updates } : s));
  };

  const bringForward = (elementId) => {
    saveToHistory(slides);
    setSlides(slides.map(s => {
      if (s.id !== activeSlideId) return s;
      const idx = s.elements.findIndex(el => el.id === elementId);
      if (idx < 0 || idx === s.elements.length - 1) return s;
      const newElements = [...s.elements];
      [newElements[idx], newElements[idx + 1]] = [newElements[idx + 1], newElements[idx]];
      return { ...s, elements: newElements };
    }));
  };

  const sendBackward = (elementId) => {
    saveToHistory(slides);
    setSlides(slides.map(s => {
      if (s.id !== activeSlideId) return s;
      const idx = s.elements.findIndex(el => el.id === elementId);
      if (idx <= 0) return s;
      const newElements = [...s.elements];
      [newElements[idx], newElements[idx - 1]] = [newElements[idx - 1], newElements[idx]];
      return { ...s, elements: newElements };
    }));
  };

  const removeBackground = async (elementId, imageSrc) => {
    const apiKey = localStorage.getItem('anix_removebg_key') || 'w5oUe8ovULeQvCzuyeox2Lwu';
    if (!apiKey) {
      alert('Por favor, configure sua API Key do remove.bg nas Configurações (IA).');
      return;
    }

    setIsProcessingBg(true);
    try {
      const formData = new FormData();
      formData.append('size', 'auto');
      
      // Checar se é base64 (upload local) ou URL externa
      if (imageSrc.startsWith('data:image')) {
        const res = await fetch(imageSrc);
        const blob = await res.blob();
        formData.append('image_file', blob, 'image.png');
      } else {
        formData.append('image_url', imageSrc);
      }

      const response = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: { 'X-Api-Key': apiKey },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.statusText}`);
      }

      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        updateElement(elementId, { src: reader.result });
        setIsProcessingBg(false);
      };
      reader.readAsDataURL(blob);

    } catch (error) {
      console.error('Erro ao remover fundo:', error);
      alert('Falha ao remover o fundo. Verifique sua conexão ou se a API Key é válida.');
      setIsProcessingBg(false);
    }
  };

  const deleteElement = (elementId) => {
    saveToHistory(slides);
    setSlides(slides.map(s => 
      s.id === activeSlideId 
        ? { ...s, elements: s.elements.filter(el => el.id !== elementId) }
        : s
    ));
    setSelectedElementId(null);
  };

  const saveProject = () => {
    const data = JSON.stringify({ slides, slideDuration, isLooping });
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `projeto-anix-${Date.now()}.anix`;
    a.click();
  };

  const openProject = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.anix';
    input.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = JSON.parse(event.target.result);
        setSlides(data.slides);
        setSlideDuration(data.slideDuration || 5);
        setIsLooping(data.isLooping || false);
        setActiveSlideId(data.slides[0]?.id);
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const selectedElement = activeSlide?.elements.find(el => el.id === selectedElementId);

  const exportVideo = async () => {
    const CANVAS_W = 1920;
    const CANVAS_H = 1080;
    const FPS = 60;
    const FRAME_DURATION = slideDuration * 1000; // ms per slide

    const offscreen = document.createElement('canvas');
    offscreen.width = CANVAS_W;
    offscreen.height = CANVAS_H;
    const ctx = offscreen.getContext('2d');

    const stream = offscreen.captureStream(FPS);
    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : 'video/webm';
    const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 12000000 });
    const chunks = [];
    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `apresentacao-anix-${Date.now()}.webm`;
      a.click();
      URL.revokeObjectURL(url);
    };

    recorder.start();
    setIsPresenting(true);

    const renderText = (ctx, el) => {
      ctx.save();
      ctx.globalAlpha = 1; // text always fully opaque
      if (el.style?.backgroundColor && el.style.backgroundColor !== 'transparent') {
        const opacity = (el.style?.opacity ?? 100) / 100;
        ctx.globalAlpha = opacity;
        ctx.fillStyle = el.style.backgroundColor;
        const bw = parseInt(el.style?.borderWidth) || 0;
        if (bw > 0) {
          ctx.strokeStyle = el.style?.borderColor || '#fff';
          ctx.lineWidth = bw;
          roundRect(ctx, el.x, el.y, el.w, el.h, 12);
          ctx.fill(); ctx.stroke();
        } else {
          roundRect(ctx, el.x, el.y, el.w, el.h, 12);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = el.style?.color || '#fff';
      ctx.font = `${el.style?.fontWeight || 'bold'} ${el.style?.fontSize || '64px'} Outfit, sans-serif`;
      ctx.textAlign = el.style?.textAlign || 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(el.content || '', el.x + el.w / 2, el.y + el.h / 2);
      ctx.restore();
    };

    const roundRect = (ctx, x, y, w, h, r) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    };

    const renderShape = (ctx, el) => {
      ctx.save();
      ctx.globalAlpha = (el.style?.opacity ?? 100) / 100;
      ctx.fillStyle = el.style?.backgroundColor || '#6366f1';
      if (el.shapeType === 'circle') {
        ctx.beginPath();
        ctx.ellipse(el.x + el.w/2, el.y + el.h/2, el.w/2, el.h/2, 0, 0, Math.PI*2);
        ctx.fill();
      } else {
        ctx.fillRect(el.x, el.y, el.w, el.h);
      }
      const bw = parseInt(el.style?.borderWidth) || 0;
      if (bw > 0) {
        ctx.strokeStyle = el.style?.borderColor || '#fff';
        ctx.lineWidth = bw;
        ctx.strokeRect(el.x, el.y, el.w, el.h);
      }
      ctx.restore();
    };

    const renderImageEl = (ctx, el) => new Promise(resolve => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        ctx.save();
        ctx.globalAlpha = (el.style?.opacity ?? 100) / 100;
        ctx.drawImage(img, el.x, el.y, el.w, el.h);
        ctx.restore();
        resolve();
      };
      img.onerror = () => resolve();
      img.src = el.src;
    });

    const renderSlide = async (slide) => {
      // Background colour
      ctx.fillStyle = slide.background || '#020617';
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      // Background image
      if (slide.bgImage) {
        await new Promise(res => {
          const bg = new Image();
          bg.crossOrigin = 'anonymous';
          bg.onload = () => { ctx.drawImage(bg, 0, 0, CANVAS_W, CANVAS_H); res(); };
          bg.onerror = res;
          bg.src = slide.bgImage;
        });
      }

      // Elements in order
      for (const el of slide.elements) {
        if (el.type === 'text') {
          renderText(ctx, el);
        } else if (el.type === 'image') {
          await renderImageEl(ctx, el);
        } else if (el.type === 'shape') {
          renderShape(ctx, el);
        }
      }
    };

    const allSlides = isLooping ? [...slides, ...slides] : slides;
    for (const slide of allSlides) {
      await renderSlide(slide);
      await new Promise(res => setTimeout(res, FRAME_DURATION));
    }

    recorder.stop();
    setIsPresenting(false);
  };

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', backgroundColor: '#020617' }}>
      {!isPresenting && (
        <AdminSidebar 
          slides={slides} 
          activeSlideId={activeSlideId} 
          setActiveSlideId={setActiveSlideId}
          addSlide={addSlide}
          deleteSlide={deleteSlide}
          saveProject={saveProject}
          openProject={openProject}
          openSettings={() => setIsSettingsOpen(true)}
        />
      )}
      
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
        {!isPresenting && (
          <header className="glass" style={{ height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 25px', zIndex: 10 }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="button-secondary" onClick={() => addElement('text')} title="Adicionar Texto">
                <Type size={20} /> <span className="hide-mobile">Texto</span>
              </button>
              
              <div style={{ position: 'relative' }}>
                <button className="button-secondary" onClick={() => setShowImageMenu(!showImageMenu)} title="Adicionar Imagem">
                  <ImageIcon size={20} /> <span className="hide-mobile">Imagem</span>
                </button>
                {showImageMenu && (
                  <div className="glass animate-fade-in" style={{ position: 'absolute', top: '50px', left: 0, width: '200px', padding: '10px', borderRadius: '12px', zIndex: 100, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <button className="button-secondary" onClick={handleLocalImage}>Upload Local (Elemento)</button>
                    <button className="button-secondary" onClick={handleLocalBg}>Upload Local (Fundo)</button>
                    <button className="button-secondary" onClick={() => addElement('image')}>Imagem da Web</button>
                  </div>
                )}
              </div>

              <div style={{ position: 'relative' }}>
                <button className="button-secondary" onClick={() => setShowShapeMenu(!showShapeMenu)}>
                  <Square size={20} /> <span className="hide-mobile">Forma</span>
                </button>
                {showShapeMenu && (
                  <div className="glass animate-fade-in" style={{ position: 'absolute', top: '50px', left: 0, width: '200px', padding: '10px', borderRadius: '12px', zIndex: 100, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <button className="button-secondary" onClick={() => addElement('shape', { borderRadius: '0px' })}>Retângulo</button>
                    <button className="button-secondary" onClick={() => addElement('shape', { borderRadius: '20px' })}>Arredondado</button>
                    <button className="button-secondary" onClick={() => addElement('shape', { borderRadius: '1000px', w: 400, h: 400 })}>Círculo</button>
                    <button className="button-secondary" onClick={() => addElement('shape', { shapeType: 'triangle', w: 400, h: 400 })}>Triângulo</button>
                    <button className="button-secondary" onClick={() => addElement('shape', { shapeType: 'star', w: 400, h: 400 })}>Estrela</button>
                  </div>
                )}
              </div>
              <button className="button-secondary" onClick={() => addElement('qr')} title="Gerador de Código QR">
                <QrCode size={20} /> <span className="hide-mobile">Código QR</span>
              </button>
              <div style={{ width: '1px', height: '30px', background: 'var(--border)', margin: '0 5px' }} />
              <button className="button-secondary" onClick={undo} disabled={history.length === 0} title="Desfazer">
                <Undo2 size={20} />
              </button>
              <button className="button-secondary" onClick={redo} disabled={redoStack.length === 0} title="Refazer">
                <Redo2 size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)' }}>
                 <Clock size={18} className="text-muted" />
                 <input type="number" value={slideDuration} onChange={(e) => setSlideDuration(Number(e.target.value))} style={{ width: '40px', background: 'transparent', border: 'none', color: 'white', textAlign: 'center', fontSize: '1rem' }} />
                 <span style={{ fontSize: '0.9rem', opacity: 0.6 }}>s</span>
               </div>
               <button className={`button-secondary ${isLooping ? 'active' : ''}`} onClick={() => setIsLooping(!isLooping)} style={{ color: isLooping ? 'var(--accent)' : 'inherit' }}>
                <Repeat size={20} /> <span className="hide-mobile">Laço</span>
              </button>
              <button className="button-secondary" onClick={exportVideo} title="Gravar Vídeo">
                <Video size={20} /> <span className="hide-mobile">Gravar</span>
              </button>
              <button className="button-primary" onClick={() => setIsPresenting(true)} style={{ background: '#22c55e' }}>
                <Play size={20} /> Apresentador
              </button>
            </div>
          </header>
        )}

        <div style={{ flex: 1, padding: isPresenting ? '0' : '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#020617', overflow: 'hidden' }}>
          {isPresenting && (
            <button className="button-secondary" style={{ position: 'absolute', top: '30px', right: '30px', zIndex: 1000, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)' }} onClick={() => {
              setIsPresenting(false);
              if (document.exitFullscreen) document.exitFullscreen();
            }}>
              <LogOut size={20} /> Sair
            </button>
          )}
          <SlideCanvas 
            slide={activeSlide} 
            selectedElementId={selectedElementId}
            setSelectedElementId={setSelectedElementId}
            updateElement={updateElement}
            readOnly={isPresenting}
          />
        </div>
      </main>

      {!isPresenting && (
        <PropertyPanel 
          element={selectedElement} 
          activeSlide={activeSlide}
          updateElement={updateElement}
          updateSlide={updateSlide}
          deleteElement={deleteElement}
          bringForward={bringForward}
          sendBackward={sendBackward}
          removeBackground={removeBackground}
          isProcessingBg={isProcessingBg}
        />
      )}

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </div>
  );
}

export default App;
