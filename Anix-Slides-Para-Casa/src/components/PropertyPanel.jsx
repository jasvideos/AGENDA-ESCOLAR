import React from 'react';
import { Settings, Trash2, Type, Image as ImageIcon, Palette } from 'lucide-react';

const PropertyPanel = ({ element, updateElement, deleteElement }) => {
  if (!element) {
    return (
      <aside className="glass" style={{ width: '300px', height: '100%', borderLeft: '1px solid var(--border)', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        <Settings size={40} style={{ marginBottom: '10px', opacity: 0.3 }} />
        <p>Selecione um elemento para editar</p>
      </aside>
    );
  }

  const handleStyleChange = (key, value) => {
    updateElement(element.id, {
      style: { ...element.style, [key]: value }
    });
  };

  return (
    <aside className="glass animate-fade-in" style={{ width: '300px', height: '100%', borderLeft: '1px solid var(--border)', padding: '20px', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {element.type === 'text' ? <Type size={18} /> : <ImageIcon size={18} />} 
          Configurações
        </h3>
        <button onClick={() => deleteElement(element.id)} style={{ color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer' }}>
          <Trash2 size={18} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {element.type === 'text' && (
          <>
            <div className="prop-group">
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '5px', color: 'var(--text-muted)' }}>Conteúdo do Texto</label>
              <textarea 
                value={element.content}
                onChange={(e) => updateElement(element.id, { content: e.target.value })}
                style={{ width: '100%', height: '80px', resize: 'none' }}
              />
            </div>

            <div className="prop-group">
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '5px', color: 'var(--text-muted)' }}>Tamanho da Fonte</label>
              <input 
                type="text" 
                value={element.style?.fontSize}
                onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                style={{ width: '100%' }}
                placeholder="Ex: 24px"
              />
            </div>

            <div className="prop-group">
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '5px', color: 'var(--text-muted)' }}>Cor do Texto</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input 
                  type="color" 
                  value={element.style?.color || '#ffffff'}
                  onChange={(e) => handleStyleChange('color', e.target.value)}
                  style={{ width: '40px', height: '40px', padding: 0, border: 'none' }}
                />
                <input 
                  type="text" 
                  value={element.style?.color}
                  onChange={(e) => handleStyleChange('color', e.target.value)}
                  style={{ flex: 1 }}
                />
              </div>
            </div>

            <div className="prop-group">
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '5px', color: 'var(--text-muted)' }}>Cor da Tarja (Fundo)</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input 
                  type="color" 
                  value={element.style?.backgroundColor || '#000000'}
                  onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                  style={{ width: '40px', height: '40px', padding: 0, border: 'none' }}
                />
                <input 
                  type="text" 
                  value={element.style?.backgroundColor}
                  onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                  style={{ flex: 1 }}
                />
              </div>
              <div style={{ marginTop: '5px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input 
                  type="checkbox" 
                  checked={!!element.style?.backgroundColor && element.style?.backgroundColor !== 'transparent'} 
                  onChange={(e) => handleStyleChange('backgroundColor', e.target.checked ? '#000000' : 'transparent')}
                />
                <span style={{ fontSize: '0.75rem' }}>Ativar Tarja</span>
              </div>
            </div>
          </>
        )}

        {element.type === 'image' && (
          <>
            <div className="prop-group">
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '5px', color: 'var(--text-muted)' }}>URL da Imagem</label>
              <input 
                type="text" 
                value={element.src}
                onChange={(e) => updateElement(element.id, { src: e.target.value })}
                style={{ width: '100%' }}
                placeholder="https://exemplo.com/foto.jpg"
              />
            </div>
            
            <div className="prop-group">
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '5px', color: 'var(--text-muted)' }}>Upload Local</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      updateElement(element.id, { src: reader.result });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                style={{ width: '100%', fontSize: '0.8rem' }}
              />
            </div>
          </>
        )}

        {element.type === 'shape' && (
          <>
            <div className="prop-group">
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '5px', color: 'var(--text-muted)' }}>Cor da Forma</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input 
                  type="color" 
                  value={element.style?.backgroundColor || '#6366f1'}
                  onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                  style={{ width: '40px', height: '40px', padding: 0, border: 'none' }}
                />
                <input 
                  type="text" 
                  value={element.style?.backgroundColor}
                  onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                  style={{ flex: 1 }}
                />
              </div>
            </div>

            <div className="prop-group">
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '5px', color: 'var(--text-muted)' }}>Arredondamento: {element.style?.borderRadius || '0px'}</label>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={parseInt(element.style?.borderRadius) || 0}
                onChange={(e) => handleStyleChange('borderRadius', `${e.target.value}px`)}
                style={{ width: '100%' }}
              />
            </div>
          </>
        )}

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '10px', color: 'var(--text-muted)' }}>Posição & Tamanho (Automático)</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
             <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>X: {Math.round(element.x)}</div>
             <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Y: {Math.round(element.y)}</div>
             <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>W: {typeof element.w === 'string' ? element.w : Math.round(element.w)}px</div>
             <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>H: {typeof element.h === 'string' ? element.h : Math.round(element.h)}px</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default PropertyPanel;
