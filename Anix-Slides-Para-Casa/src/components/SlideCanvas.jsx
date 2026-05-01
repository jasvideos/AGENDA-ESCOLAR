import React, { useState, useEffect, useRef } from 'react';
import { Rnd } from 'react-rnd';
import { motion, AnimatePresence } from 'framer-motion';

const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;

const SlideCanvas = ({ slide, selectedElementId, setSelectedElementId, updateElement, readOnly }) => {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        const scaleX = clientWidth / CANVAS_WIDTH;
        const scaleY = clientHeight / CANVAS_HEIGHT;
        const newScale = Math.min(scaleX, scaleY, 1) * 0.95; // 0.95 to give some margin
        setScale(newScale);
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  if (!slide) return <div className="flex-center" style={{ flex: 1, color: 'var(--text-muted)' }}>Nenhum slide selecionado</div>;

  return (
    <div 
      ref={containerRef}
      style={{ 
        flex: 1, 
        height: '100%', 
        width: '100%',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#020617',
        overflow: 'hidden'
      }}
      onClick={() => setSelectedElementId(null)}
    >
      <div 
        style={{
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          background: slide.background || '#000',
          position: 'relative',
          boxShadow: '0 0 50px rgba(0,0,0,0.5)',
          overflow: 'hidden',
          flexShrink: 0
        }}
      >
        {/* Slide Background Image */}
        {slide.bgImage && (
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `url(${slide.bgImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: (slide.bgOpacity || 100) / 100,
              pointerEvents: 'none'
            }}
          />
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            style={{ width: '100%', height: '100%', position: 'relative' }}
          >
            {slide.elements.map((el, index) => (
              <Rnd
                key={el.id}
                size={{ width: el.w, height: el.h }}
                position={{ x: el.x, y: el.y }}
                disableDragging={readOnly}
                enableResizing={!readOnly}
                onDragStop={(e, d) => updateElement(el.id, { x: d.x, y: d.y })}
                onResizeStop={(e, direction, ref, delta, position) => {
                  updateElement(el.id, {
                    w: ref.offsetWidth,
                    h: ref.offsetHeight,
                    ...position,
                  });
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedElementId(el.id);
                }}
                bounds="parent"
                scale={scale}
                style={{
                  zIndex: index + 1,
                  border: selectedElementId === el.id && !readOnly ? '2px solid var(--accent)' : 'none',
                }}
              >
                <div style={{ width: '100%', height: '100%', position: 'relative', opacity: el.type !== 'text' ? ((el.style?.opacity ?? 100) / 100) : 1 }}>
                  {el.type === 'text' ? (
                    <div 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        padding: '10px', 
                        color: el.style?.color || '#fff', 
                        backgroundColor: (el.style?.backgroundColor && el.style?.backgroundColor !== 'transparent') ? `color-mix(in srgb, ${el.style.backgroundColor} ${el.style?.opacity ?? 100}%, transparent)` : 'transparent',
                        borderRadius: (el.style?.backgroundColor && el.style?.backgroundColor !== 'transparent') ? '12px' : '0',
                        border: parseInt(el.style?.borderWidth) > 0 ? `${parseInt(el.style?.borderWidth)}px solid ${el.style?.borderColor || '#ffffff'}` : 'none',
                        fontSize: el.style?.fontSize || '64px',
                        fontWeight: el.style?.fontWeight || 'bold',
                        textAlign: el.style?.textAlign || 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: el.style?.textAlign === 'left' ? 'flex-start' : el.style?.textAlign === 'right' ? 'flex-end' : 'center',
                        wordBreak: 'break-word',
                        textShadow: (el.style?.backgroundColor && el.style?.backgroundColor !== 'transparent') ? 'none' : '0 2px 10px rgba(0,0,0,0.5)'
                      }}
                    >
                      {el.content}
                    </div>
                  ) : el.type === 'image' ? (
                    <img 
                      src={el.src} 
                      alt="" 
                      draggable={false}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', pointerEvents: 'none' }} 
                    />
                  ) : el.type === 'qr' ? (
                    <div style={{ width: '100%', height: '100%', padding: el.style?.padding || '20px', background: el.style?.backgroundColor || '#fff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(el.content || '')}`} 
                        alt="QR Code" 
                        draggable={false}
                        style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }} 
                      />
                    </div>
                  ) : (
                    <div 
                      style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: el.style?.backgroundColor || '#6366f1',
                        borderRadius: el.shapeType === 'circle' ? '50%' : (el.style?.borderRadius || '0px'),
                        clipPath: el.shapeType === 'triangle' 
                          ? 'polygon(50% 0%, 0% 100%, 100% 100%)' 
                          : el.shapeType === 'star'
                          ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
                          : 'none',
                        border: parseInt(el.style?.borderWidth) > 0 ? `${parseInt(el.style?.borderWidth)}px solid ${el.style?.borderColor || '#ffffff'}` : 'none',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                      }}
                    />
                  )}
                </div>
              </Rnd>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SlideCanvas;
