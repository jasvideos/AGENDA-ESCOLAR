import React, { useState, useEffect } from 'react';
import AdminSidebar from './components/AdminSidebar';
import SlideCanvas from './components/SlideCanvas';
import PropertyPanel from './components/PropertyPanel';
import { Plus, Play, Square, Type, Image as ImageIcon, Circle, Repeat, Clock, X, Download, Video } from 'lucide-react';

const STORAGE_KEY = 'anix_slides_data';

const initialSlides = [
  {
    id: 'slide-1',
    name: 'Slide 1',
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
  const [slides, setSlides] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialSlides;
  });
  const [activeSlideId, setActiveSlideId] = useState(slides[0]?.id);
  const [selectedElementId, setSelectedElementId] = useState(null);
  const [isPresenting, setIsPresenting] = useState(false);
  const [showShapeMenu, setShowShapeMenu] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [slideDuration, setSlideDuration] = useState(5); // seconds

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slides));
  }, [slides]);

  // Auto-play loop logic
  useEffect(() => {
    let interval;
    if (isLooping && slides.length > 1) {
      interval = setInterval(() => {
        setSlides(prevSlides => {
          const currentIndex = prevSlides.findIndex(s => s.id === activeSlideId);
          const nextIndex = (currentIndex + 1) % prevSlides.length;
          setActiveSlideId(prevSlides[nextIndex].id);
          return prevSlides;
        });
      }, slideDuration * 1000);
    }
    return () => clearInterval(interval);
  }, [isLooping, activeSlideId, slideDuration, slides.length]);

  const activeSlide = slides.find(s => s.id === activeSlideId) || slides[0];

  const addSlide = () => {
    const newSlide = {
      id: `slide-${Date.now()}`,
      name: `Slide ${slides.length + 1}`,
      elements: []
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
      content: type === 'text' ? 'Novo Texto' : '',
      src: type === 'image' ? 'https://via.placeholder.com/300x200?text=Sua+Imagem' : '',
      shapeType: type === 'shape' ? 'rectangle' : null,
      style: type === 'text' 
        ? { fontSize: '20px', color: '#ffffff' } 
        : (type === 'shape' 
            ? { backgroundColor: '#6366f1', borderRadius: preset.borderRadius || '0px' } 
            : {})
    };

    setSlides(slides.map(s => 
      s.id === activeSlideId 
        ? { ...s, elements: [...s.elements, newElement] }
        : s
    ));
    setSelectedElementId(newElement.id);
    setShowShapeMenu(false);
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

  const selectedElement = activeSlide?.elements.find(el => el.id === selectedElementId);

  const exportVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: 30 },
        audio: false
      });

      const recorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
      });

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
        setIsLooping(false);
        setIsPresenting(false);
      };

      recorder.start();
      setIsPresenting(true);
      setIsLooping(true);

      alert("A gravação começou. Selecione esta aba para gravar. Pare a partilha de ecrã para terminar e guardar o vídeo.");
      
      stream.getVideoTracks()[0].onended = () => {
        recorder.stop();
      };

    } catch (err) {
      console.error("Erro ao exportar vídeo:", err);
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
        />
      )}
      
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {!isPresenting && (
          <header className="glass" style={{ height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', zIndex: 10 }}>
            <div style={{ display: 'flex', gap: '15px', position: 'relative' }}>
              <button className="button-secondary" onClick={() => addElement('text')}>
                <Type size={18} /> Texto
              </button>
              <button className="button-secondary" onClick={() => addElement('image')}>
                <ImageIcon size={18} /> Imagem
              </button>
              
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
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginRight: '10px', padding: '5px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)' }}>
                 <Clock size={16} className="text-muted" />
                 <input 
                   type="number" 
                   value={slideDuration}
                   onChange={(e) => setSlideDuration(Number(e.target.value))}
                   style={{ width: '45px', background: 'transparent', border: 'none', padding: '2px', fontSize: '0.9rem', textAlign: 'center' }}
                   title="Segundos por slide"
                 />
                 <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>s</span>
               </div>

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
                title="Gravar apresentação e baixar vídeo"
              >
                <Video size={18} style={{ marginRight: '5px' }} /> Gravar Vídeo
              </button>

               <button className="button-primary" style={{ background: '#22c55e' }} onClick={() => {
                 setIsPresenting(true);
                 if (slides.length > 1) setIsLooping(true);
               }}>
                <Play size={18} /> Apresentar
              </button>
            </div>
          </header>
        )}

        <div style={{ 
          flex: 1, 
          overflow: 'auto', 
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
              onClick={() => setIsPresenting(false)}
            >
              Sair da Apresentação
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
          updateElement={updateElement}
          deleteElement={deleteElement}
        />
      )}
    </div>
  );
}

export default App;
