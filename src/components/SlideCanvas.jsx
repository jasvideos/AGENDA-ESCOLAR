import React, { useEffect } from 'react';
import { Rnd } from 'react-rnd';
import { QRCodeSVG } from 'qrcode.react';

const SlideCanvas = ({ slide, selectedElementId, setSelectedElementId, updateElement, readOnly, deleteElement }) => {
  if (!slide) return <div className="flex-center" style={{ height: '100%', color: 'var(--text-muted)' }}>Selecione ou crie um slide</div>;

  const canvasWidth = 960;
  const canvasHeight = 540;

  const getBackgroundStyle = (style, defaultBg = 'transparent') => {
    if (!style) return { backgroundColor: defaultBg };
    const bg = style.backgroundColor || defaultBg;
    if (style.useGradient && style.gradientColor) {
      return { background: `linear-gradient(135deg, ${bg}, ${style.gradientColor})` };
    }
    return { background: bg };
  };

  const getBorderStyle = (style) => {
    if (!style || !style.borderWidth || parseInt(style.borderWidth) === 0) return {};
    return { border: `${style.borderWidth} solid ${style.borderColor || '#ffffff'}` };
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (readOnly) return;
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const activeTag = document.activeElement?.tagName.toLowerCase();
        if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') {
          return;
        }
        if (selectedElementId && deleteElement) {
          deleteElement(selectedElementId);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [readOnly, selectedElementId, deleteElement]);

  return (
    <div 
      id="slide-canvas"
      onClick={() => !readOnly && setSelectedElementId(null)}
      style={{
        width: `${canvasWidth}px`,
        height: `${canvasHeight}px`,
        backgroundColor: slide.bgColor || '#111827',
        boxShadow: readOnly ? 'none' : '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
        border: readOnly ? 'none' : '1px solid var(--border)'
      }}
    >
      {slide.bgImage && (
        <div 
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundImage: `url(${slide.bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: slide.bgOpacity !== undefined ? slide.bgOpacity : 1,
            zIndex: 0,
            pointerEvents: 'none'
          }}
        />
      )}
      {slide.elements.map((el) => {
        const isSelected = !readOnly && selectedElementId === el.id;
        const opacity = el.style?.opacity !== undefined ? el.style.opacity : 1;

        return (
          <Rnd
            key={el.id}
            size={{ width: el.w, height: el.h }}
            position={{ x: el.x, y: el.y }}
            disableDragging={readOnly}
            enableResizing={!readOnly}
            onDragStop={(e, d) => {
              updateElement(el.id, { x: d.x, y: d.y });
            }}
            onResizeStop={(e, direction, ref, delta, position) => {
              updateElement(el.id, {
                w: ref.style.width,
                h: ref.style.height,
                ...position,
              });
            }}
            bounds="parent"
            onClick={(e) => {
              if (readOnly) return;
              e.stopPropagation();
              setSelectedElementId(el.id);
            }}
            className={readOnly && el.style?.animation ? `animate-${el.style.animation}` : ''}
            style={{
              border: isSelected ? '2px solid var(--accent)' : '2px transparent solid',
              zIndex: isSelected ? 100 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {el.type === 'text' ? (
              <div 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  padding: '10px 20px', 
                  color: el.style?.color || '#fff', 
                  ...getBackgroundStyle(el.style, 'transparent'),
                  ...getBorderStyle(el.style),
                  opacity,
                  borderRadius: el.style?.backgroundColor && el.style?.backgroundColor !== 'transparent' ? '4px' : '0',
                  fontSize: el.style?.fontSize || '20px',
                  fontWeight: el.style?.fontWeight || 'normal',
                  fontFamily: el.style?.fontFamily || 'Inter',
                  textAlign: 'center',
                  overflow: 'hidden',
                  wordBreak: 'break-word',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {el.content}
              </div>
            ) : el.type === 'image' ? (
              <img 
                src={el.src} 
                alt="slide element"
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover', 
                  pointerEvents: 'none',
                  opacity
                }}
              />
            ) : el.type === 'qrcode' ? (
              <div style={{ width: '100%', height: '100%', background: 'white', padding: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity }}>
                <QRCodeSVG value={el.content || 'https://anix.com'} style={{ width: "100%", height: "100%" }} />
              </div>
            ) : (
              <div 
                style={{
                  width: '100%',
                  height: '100%',
                  ...getBackgroundStyle(el.style, '#6366f1'),
                  ...getBorderStyle(el.style),
                  opacity,
                  borderRadius: el.style?.borderRadius || '0px',
                  boxShadow: isSelected ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
            )}
          </Rnd>
        );
      })}
    </div>
  );
};

export default SlideCanvas;
