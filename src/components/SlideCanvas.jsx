import React, { useEffect } from 'react';
import { Rnd } from 'react-rnd';
import { QRCodeSVG } from 'qrcode.react';

const hexToRgba = (hex, alpha) => {
  if (!hex || !hex.startsWith('#')) return hex;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
};

const SlideCanvas = ({ slide, selectedElementId, setSelectedElementId, updateElement, readOnly, deleteElement, snapToGrid, gridSize }) => {
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

  const getTextBgStyle = (style) => {
    const bg = style?.backgroundColor;
    const hasBg = bg && bg !== 'transparent';
    if (!hasBg) return { background: 'transparent' };
    const bgOpacity = style?.bgOpacity !== undefined ? style.bgOpacity : 1;
    if (style?.useGradient && style?.gradientColor) {
      const c1 = hexToRgba(bg, bgOpacity);
      const c2 = hexToRgba(style.gradientColor, bgOpacity);
      return { background: `linear-gradient(135deg, ${c1}, ${c2})` };
    }
    return { background: hexToRgba(bg, bgOpacity) };
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (readOnly) return;
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') return;
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElementId && deleteElement) {
        deleteElement(selectedElementId);
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
        border: readOnly ? 'none' : '1px solid var(--border)',
        backgroundImage: snapToGrid ? `radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)` : 'none',
        backgroundSize: snapToGrid ? `${gridSize}px ${gridSize}px` : 'auto'
      }}
    >
      {slide.bgImage && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: `url(${slide.bgImage})`,
          backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
          opacity: slide.bgOpacity !== undefined ? slide.bgOpacity : 1,
          zIndex: 0, pointerEvents: 'none'
        }} />
      )}

      {slide.elements.map((el) => {
        const isSelected = !readOnly && selectedElementId === el.id;
        const opacity = el.style?.opacity !== undefined ? el.style.opacity : 1;
        const rotation = el.rotation || 0;

        const rotationStyle = rotation !== 0
          ? { transform: `rotate(${rotation}deg)`, transformOrigin: 'center center' }
          : {};

        return (
          <Rnd
            key={el.id}
            size={{ width: el.w, height: el.h }}
            position={{ x: el.x, y: el.y }}
            disableDragging={readOnly}
            enableResizing={!readOnly}
            onDragStop={(e, d) => updateElement(el.id, { x: d.x, y: d.y })}
            onResizeStop={(e, direction, ref, delta, position) => {
              updateElement(el.id, { w: ref.style.width, h: ref.style.height, ...position });
            }}
            bounds=""
            onClick={(e) => { if (readOnly) return; e.stopPropagation(); setSelectedElementId(el.id); }}
            className={readOnly && el.style?.animation ? `animate-${el.style.animation}` : ''}
            style={{
              border: isSelected ? '2px solid var(--accent)' : '2px transparent solid',
              zIndex: isSelected ? 100 : 1,
            }}
          >
            {/* Rotation wrapper: applied inside Rnd to avoid conflict with Rnd's own transform */}
            <div style={{ width: '100%', height: '100%', ...rotationStyle }}>
              {el.type === 'text' && (
                <div style={{
                  width: '100%', height: '100%', padding: '10px 20px',
                  color: el.style?.color || '#fff',
                  ...getTextBgStyle(el.style),
                  ...getBorderStyle(el.style),
                  opacity,
                  borderRadius: el.style?.backgroundColor && el.style?.backgroundColor !== 'transparent' ? '4px' : '0',
                  fontSize: el.style?.fontSize || '20px',
                  fontWeight: el.style?.fontWeight || 'normal',
                  fontFamily: el.style?.fontFamily || 'Inter',
                  textAlign: 'center', overflow: 'hidden', wordBreak: 'break-word',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {el.content}
                </div>
              )}
              {el.type === 'image' && (
                <img src={el.src} alt="slide element" style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none', opacity }} />
              )}
              {el.type === 'qrcode' && (
                <div style={{ width: '100%', height: '100%', background: 'white', padding: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity }}>
                  <QRCodeSVG value={String(el.content || 'https://anix.com')} style={{ width: '100%', height: '100%' }} />
                </div>
              )}
              {el.type === 'svg' && (
                <div 
                  className="svg-element-container"
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    opacity, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    color: el.style?.color || '#ffffff' 
                  }}
                  dangerouslySetInnerHTML={{ __html: el.content }}
                />
              )}
              {el.type === 'shape' && (
                <div style={{
                  width: '100%', height: '100%',
                  ...getBackgroundStyle(el.style, '#6366f1'),
                  ...getBorderStyle(el.style),
                  opacity,
                  borderRadius: el.style?.borderRadius || '0px',
                  boxShadow: isSelected ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }} />
              )}
            </div>
          </Rnd>
        );
      })}
    </div>
  );
};

export default SlideCanvas;
