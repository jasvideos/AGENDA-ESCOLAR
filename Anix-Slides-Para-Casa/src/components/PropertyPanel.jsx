import React from 'react';
import { 
  Settings, Trash2, Type, Image as ImageIcon, 
  Palette, MousePointer2, AlignLeft, AlignCenter, 
  AlignRight, QrCode, Sliders, ArrowUpToLine, ArrowDownToLine,
  Sparkles, Wand2
} from 'lucide-react';

const PropertyPanel = ({ element, activeSlide, updateElement, updateSlide, deleteElement, bringForward, sendBackward, removeBackground, isProcessingBg }) => {
  
  const handleStyleChange = (key, value) => {
    if (!element) return;
    updateElement(element.id, {
      style: { ...element.style, [key]: value }
    });
  };

  const bgGallery = [
    { name: 'Deep Space', url: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80' },
    { name: 'Soft Gradient', url: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=800&q=80' },
    { name: 'Mountains', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80' },
    { name: 'Abstract Blue', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80' },
    { name: 'Minimal Night', url: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&w=800&q=80' }
  ];

  if (!element) {
    return (
      <aside className="glass" style={{ width: '320px', height: '100%', borderLeft: '1px solid var(--border)', padding: '25px', overflowY: 'auto', background: 'rgba(2, 6, 23, 0.4)' }}>
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem', fontWeight: '700', marginBottom: '20px' }}>
            <Sliders size={20} className="text-muted" /> 
            Configurações do Slide
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="prop-group">
              <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-muted)' }}>Cor de Fundo Base</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input 
                  type="color" 
                  value={activeSlide?.background || '#020617'}
                  onChange={(e) => updateSlide(activeSlide.id, { background: e.target.value })}
                  style={{ width: '40px', height: '40px', padding: 0, border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '0.9rem' }}>Base de Cor</span>
              </div>
            </div>

            <div className="prop-group">
              <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-muted)' }}>Transparência da Imagem BG</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={activeSlide?.bgOpacity || 100}
                  onChange={(e) => updateSlide(activeSlide.id, { bgOpacity: parseInt(e.target.value) })}
                  style={{ flex: 1 }}
                />
                <span style={{ fontSize: '0.8rem', width: '35px' }}>{activeSlide?.bgOpacity || 100}%</span>
              </div>
            </div>

            {activeSlide?.bgImage && (
               <button className="button-secondary" style={{ width: '100%', color: '#ef4444' }} onClick={() => updateSlide(activeSlide.id, { bgImage: '' })}>
                 <Trash2 size={16} style={{ marginRight: '8px' }} /> Remover imagem BG
               </button>
            )}

            <div className="prop-group">
              <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-muted)' }}>Galeria de Fundos Premium</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {bgGallery.map(bg => (
                  <div 
                    key={bg.name}
                    onClick={() => updateSlide(activeSlide.id, { bgImage: bg.url })}
                    style={{ 
                      aspectRatio: '16/9', 
                      borderRadius: '8px', 
                      backgroundImage: `url(${bg.url})`, 
                      backgroundSize: 'cover',
                      cursor: 'pointer',
                      border: activeSlide?.bgImage === bg.url ? '2px solid var(--accent)' : '1px solid var(--border)',
                      transition: 'transform 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="glass animate-fade-in" style={{ width: '320px', height: '100%', borderLeft: '1px solid var(--border)', padding: '25px', overflowY: 'auto', background: 'rgba(2, 6, 23, 0.4)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem', fontWeight: '700' }}>
          <Settings size={20} className="text-muted" /> 
          Editar {element.type === 'text' ? 'Texto' : element.type === 'image' ? 'Imagem' : element.type === 'qr' ? 'QR Code' : 'Forma'}
        </h3>
        <button 
          onClick={() => deleteElement(element.id)} 
          className="button-secondary"
          style={{ padding: '8px', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)' }}
          title="Excluir"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
        <button className="button-secondary" onClick={() => bringForward(element.id)} style={{ flex: 1, justifyContent: 'center' }} title="Trazer para Frente">
          <ArrowUpToLine size={18} /> Frente
        </button>
        <button className="button-secondary" onClick={() => sendBackward(element.id)} style={{ flex: 1, justifyContent: 'center' }} title="Enviar para Trás">
          <ArrowDownToLine size={18} /> Trás
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
        {(element.type === 'text' || element.type === 'qr') && (
          <div className="prop-group">
            <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-muted)' }}>
              {element.type === 'text' ? 'Conteúdo' : 'URL / Dados'}
            </label>
            <textarea 
              value={element.content}
              onChange={(e) => updateElement(element.id, { content: e.target.value })}
              spellCheck={element.style?.spellCheck || false}
              style={{ width: '100%', height: element.type === 'qr' ? '60px' : '100px', resize: 'none' }}
            />
          </div>
        )}

        {element.type === 'text' && (
          <>
            <div className="prop-group">
              <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-muted)' }}>Alinhamento</label>
              <div style={{ display: 'flex', gap: '5px' }}>
                <button className={`button-secondary ${element.style?.textAlign === 'left' ? 'active' : ''}`} onClick={() => handleStyleChange('textAlign', 'left')} style={{ flex: 1 }}><AlignLeft size={18} /></button>
                <button className={`button-secondary ${(!element.style?.textAlign || element.style?.textAlign === 'center') ? 'active' : ''}`} onClick={() => handleStyleChange('textAlign', 'center')} style={{ flex: 1 }}><AlignCenter size={18} /></button>
                <button className={`button-secondary ${element.style?.textAlign === 'right' ? 'active' : ''}`} onClick={() => handleStyleChange('textAlign', 'right')} style={{ flex: 1 }}><AlignRight size={18} /></button>
              </div>
            </div>
            
            <div className="prop-group">
              <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-muted)' }}>Tamanho da Fonte</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input 
                  type="range" 
                  min="20" max="300" 
                  value={parseInt(element.style?.fontSize) || 64}
                  onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`)}
                  style={{ flex: 1 }}
                />
                <span style={{ fontSize: '0.8rem', width: '40px' }}>{parseInt(element.style?.fontSize) || 64}px</span>
              </div>
            </div>

            <div className="prop-group">
              <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-muted)' }}>Fundo do Texto</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input 
                  type="color" 
                  value={element.style?.backgroundColor !== 'transparent' ? element.style?.backgroundColor : '#000000'}
                  onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                  style={{ width: '40px', height: '40px', padding: 0, border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                />
                <button className="button-secondary" style={{ flex: 1 }} onClick={() => handleStyleChange('backgroundColor', 'transparent')}>Remover Fundo</button>
              </div>
            </div>

            <div className="prop-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={element.style?.spellCheck || false}
                  onChange={(e) => handleStyleChange('spellCheck', e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                Habilitar Correção Ortográfica
              </label>
            </div>
          </>
        )}

        {element.type === 'image' && (
          <div className="prop-group">
            <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-muted)' }}>URL da Imagem</label>
            <input 
              type="text" 
              value={element.src}
              onChange={(e) => updateElement(element.id, { src: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>
        )}

        {element.type === 'image' && (
          <div className="prop-group">
            <button
              className="button-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                background: isProcessingBg
                  ? 'rgba(139,92,246,0.4)'
                  : 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                gap: '10px',
                opacity: isProcessingBg ? 0.7 : 1,
                cursor: isProcessingBg ? 'not-allowed' : 'pointer',
              }}
              onClick={() => !isProcessingBg && removeBackground(element.id, element.src)}
              disabled={isProcessingBg}
            >
              {isProcessingBg ? (
                <><Sparkles size={18} className="spin-animation" /> Processando IA...</>
              ) : (
                <><Wand2 size={18} /> Remover Fundo (IA ✨)</>
              )}
            </button>
          </div>
        )}

        <div className="prop-group">
          <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-muted)' }}>Cor Principal</label>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input 
              type="color" 
              value={element.style?.color || element.style?.backgroundColor || '#ffffff'}
              onChange={(e) => handleStyleChange(element.type === 'text' ? 'color' : 'backgroundColor', e.target.value)}
              style={{ width: '40px', height: '40px', padding: 0, border: 'none', borderRadius: '8px', cursor: 'pointer' }}
            />
            <input 
              type="text" 
              value={element.style?.color || element.style?.backgroundColor || '#ffffff'}
              onChange={(e) => handleStyleChange(element.type === 'text' ? 'color' : 'backgroundColor', e.target.value)}
              style={{ flex: 1, fontSize: '0.9rem' }}
            />
          </div>
        </div>

        {(element.type === 'shape' || element.type === 'text') && (
          <div className="prop-group">
            <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-muted)' }}>Contorno (Borda)</label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
              <input 
                type="color" 
                value={element.style?.borderColor || '#ffffff'}
                onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                style={{ width: '40px', height: '40px', padding: 0, border: 'none', borderRadius: '8px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '0.8rem', flex: 1 }}>Cor do Contorno</span>
              <button className="button-secondary" style={{ padding: '5px' }} onClick={() => handleStyleChange('borderWidth', '0px')}>Remover</button>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input 
                type="range" 
                min="0" max="20" 
                value={parseInt(element.style?.borderWidth) || 0}
                onChange={(e) => handleStyleChange('borderWidth', `${e.target.value}px`)}
                style={{ flex: 1 }}
              />
              <span style={{ fontSize: '0.8rem', width: '40px' }}>{parseInt(element.style?.borderWidth) || 0}px</span>
            </div>
          </div>
        )}

        {(element.type === 'text' || element.type === 'shape' || element.type === 'image') && (
          <div className="prop-group">
            <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-muted)' }}>Transparência</label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input 
                type="range" 
                min="0" max="100" 
                value={element.style?.opacity ?? 100}
                onChange={(e) => handleStyleChange('opacity', parseInt(e.target.value))}
                style={{ flex: 1 }}
              />
              <span style={{ fontSize: '0.8rem', width: '40px' }}>{element.style?.opacity ?? 100}%</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default PropertyPanel;
