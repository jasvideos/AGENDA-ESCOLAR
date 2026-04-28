import React from 'react';
import { Rnd } from 'react-rnd';

const SlideCanvas = ({ slide, selectedElementId, setSelectedElementId, updateElement, readOnly }) => {
  if (!slide) return <div className="flex-center" style={{ height: '100%', color: 'var(--text-muted)' }}>Selecione ou crie um slide</div>;

  const canvasWidth = 960;
  const canvasHeight = 540;

  return (
    <div 
      id="slide-canvas"
      onClick={() => !readOnly && setSelectedElementId(null)}
      style={{
        width: `${canvasWidth}px`,
        height: `${canvasHeight}px`,
        background: '#111827',
        boxShadow: readOnly ? 'none' : '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
        border: readOnly ? 'none' : '1px solid var(--border)'
      }}
    >
      {slide.elements.map((el) => (
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
          style={{
            border: !readOnly && selectedElementId === el.id ? '2px solid var(--accent)' : '1px transparent solid',
            zIndex: !readOnly && selectedElementId === el.id ? 100 : 1,
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
                backgroundColor: el.style?.backgroundColor || 'transparent',
                borderRadius: el.style?.backgroundColor && el.style?.backgroundColor !== 'transparent' ? '4px' : '0',
                fontSize: el.style?.fontSize || '20px',
                fontWeight: el.style?.fontWeight || 'normal',
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
              style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
            />
          ) : (
            <div 
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: el.style?.backgroundColor || '#6366f1',
                borderRadius: el.style?.borderRadius || '0px',
                border: selectedElementId === el.id ? 'none' : '1px solid rgba(255,255,255,0.1)'
              }}
            />
          )}
        </Rnd>
      ))}
    </div>
  );
};

export default SlideCanvas;
