import React, { useState } from 'react';
import { Settings, Trash2, Type, Image as ImageIcon, Palette, ArrowUp, ArrowDown, ArrowUpToLine, ArrowDownToLine, Wand2, Loader2, Sparkles } from 'lucide-react';
import { removeBackground } from '@imgly/background-removal';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { bgGallery } from '../templates';

const PropertyPanel = ({ element, updateElement, deleteElement, reorderElement, activeSlide, updateSlide }) => {
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [isGeneratingText, setIsGeneratingText] = useState(false);

  if (!element) {
    return (
      <aside className="glass animate-fade-in" style={{ width: '300px', height: '100%', borderLeft: '1px solid var(--border)', padding: '20px', overflowY: 'auto' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <Settings size={18} /> Configurações do Slide
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="prop-group">
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '5px', color: 'var(--text-muted)' }}>Cor de Fundo Base</label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input 
                type="color" 
                value={activeSlide?.bgColor || '#111827'} 
                onChange={(e) => updateSlide({ bgColor: e.target.value })} 
                style={{ width: '30px', height: '30px', padding: 0, border: 'none' }} 
              />
              <span style={{ fontSize: '0.8rem' }}>Cor Base</span>
            </div>
          </div>

          {activeSlide?.bgImage ? (
            <div className="prop-group">
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '5px', color: 'var(--text-muted)' }}>Transparência da Imagem BG</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={(activeSlide.bgOpacity !== undefined ? activeSlide.bgOpacity : 1) * 100} 
                  onChange={(e) => updateSlide({ bgOpacity: e.target.value / 100 })} 
                  style={{ flex: 1 }} 
                />
                <span style={{ fontSize: '0.8rem', width: '40px' }}>{Math.round((activeSlide.bgOpacity !== undefined ? activeSlide.bgOpacity : 1) * 100)}%</span>
              </div>
              <button 
                className="button-secondary" 
                style={{ width: '100%', marginTop: '15px', color: '#ef4444', borderColor: '#ef4444', display: 'flex', justifyContent: 'center', alignItems: 'center' }} 
                onClick={() => updateSlide({ bgImage: null })}
              >
                <Trash2 size={16} style={{ marginRight: '8px' }} /> Remover Imagem BG
              </button>
            </div>
          ) : (
            <div className="prop-group" style={{ opacity: 0.5, textAlign: 'center', marginTop: '20px' }}>
              <p style={{ fontSize: '0.8rem' }}>Adicione uma Imagem de Fundo (BG) usando o botão "Imagem" no topo.</p>
            </div>
          )}

          <div className="prop-group" style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '10px', color: 'var(--text-muted)' }}>Galeria de Fundos Premium</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {bgGallery.map((bg, idx) => (
                <div 
                  key={idx} 
                  onClick={() => updateSlide({ bgImage: bg, bgOpacity: 0.5 })}
                  style={{
                    height: '60px',
                    borderRadius: '6px',
                    backgroundImage: `url(${bg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    cursor: 'pointer',
                    border: '1px solid var(--border)',
                    transition: 'transform 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
              ))}
            </div>
          </div>
        </div>
      </aside>
    );
  }

  const handleRemoveBackground = async () => {
    if (!element.src) return;
    setIsRemovingBg(true);
    try {
      const config = {
        publicPath: 'https://unpkg.com/@imgly/background-removal@1.4.5/dist/'
      };
      const blob = await removeBackground(element.src, config);
      const reader = new FileReader();
      reader.onloadend = () => {
        updateElement(element.id, { src: reader.result });
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      console.error("Erro ao remover fundo:", err);
      alert("Não foi possível remover o fundo desta imagem. Tente outra imagem.");
    } finally {
      setIsRemovingBg(false);
    }
  };

  const generateAIText = async (promptType) => {
    if (!element.content) return;
    
    const apiKey = localStorage.getItem('gemini_api_key');
    if (!apiKey) {
      alert("Por favor, configure sua Chave de API do Gemini (API Key) nas Configurações (painel esquerdo) primeiro.");
      return;
    }
    
    setIsGeneratingText(true);
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      let prompt = "";
      if (promptType === 'fix') {
        prompt = `Corrija a ortografia e gramática do seguinte texto, mantendo o idioma original. Responda APENAS com o texto corrigido, sem aspas ou marcações markdown:\n\n${element.content}`;
      } else if (promptType === 'improve') {
        prompt = `Melhore o seguinte texto para um slide de apresentação. Deixe-o mais profissional, engajador e direto ao ponto. Responda APENAS com o texto melhorado, sem aspas:\n\n${element.content}`;
      } else if (promptType === 'summarize') {
        prompt = `Resuma o seguinte texto para caber perfeitamente em um slide de apresentação (curto e impactante). Responda APENAS com o resumo, sem aspas:\n\n${element.content}`;
      }
      
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      
      if (text) {
        updateElement(element.id, { content: text });
      }
    } catch (error) {
      console.error("Erro na IA:", error);
      alert("Erro ao processar IA. Verifique se a sua API Key é válida e tem saldo/cota disponível.");
    } finally {
      setIsGeneratingText(false);
    }
  };

  const handleStyleChange = (key, value) => {
    updateElement(element.id, {
      style: { ...element.style, [key]: value }
    });
  };

  const renderBackgroundAndBorderControls = (labelPrefix, defaultBgColor = '#000000') => (
    <>
      <div className="prop-group">
        <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '5px', color: 'var(--text-muted)' }}>{labelPrefix}</label>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
          <input 
            type="color" 
            value={element.style?.backgroundColor && element.style.backgroundColor !== 'transparent' ? element.style.backgroundColor : defaultBgColor} 
            onChange={(e) => handleStyleChange('backgroundColor', e.target.value)} 
            style={{ width: '30px', height: '30px', padding: 0, border: 'none' }} 
          />
          <span style={{fontSize: '0.8rem'}}>Cor Principal</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '10px' }}>
          <input 
            type="checkbox" 
            checked={!!element.style?.useGradient} 
            onChange={(e) => handleStyleChange('useGradient', e.target.checked)} 
          />
          <span style={{ fontSize: '0.8rem' }}>Usar Gradiente</span>
        </div>
        
        {element.style?.useGradient && (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
            <input 
              type="color" 
              value={element.style?.gradientColor || '#ffffff'} 
              onChange={(e) => handleStyleChange('gradientColor', e.target.value)} 
              style={{ width: '30px', height: '30px', padding: 0, border: 'none' }} 
            />
            <span style={{fontSize: '0.8rem'}}>Cor 2 (Gradiente)</span>
          </div>
        )}
      </div>

      <div className="prop-group">
        <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '5px', color: 'var(--text-muted)' }}>Transparência (Opacidade)</label>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={(element.style?.opacity !== undefined ? element.style.opacity : 1) * 100} 
            onChange={(e) => handleStyleChange('opacity', e.target.value / 100)} 
            style={{ flex: 1 }} 
          />
          <span style={{ fontSize: '0.8rem', width: '40px' }}>{Math.round((element.style?.opacity !== undefined ? element.style.opacity : 1) * 100)}%</span>
        </div>
      </div>

      <div className="prop-group">
        <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '5px', color: 'var(--text-muted)' }}>Contorno (Borda)</label>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
           <input 
             type="range" 
             min="0" 
             max="20" 
             value={parseInt(element.style?.borderWidth) || 0} 
             onChange={(e) => handleStyleChange('borderWidth', `${e.target.value}px`)} 
             style={{ flex: 1 }} 
           />
           <span style={{ fontSize: '0.8rem', width: '30px' }}>{parseInt(element.style?.borderWidth) || 0}px</span>
        </div>
        {parseInt(element.style?.borderWidth) > 0 && (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input 
              type="color" 
              value={element.style?.borderColor || '#ffffff'} 
              onChange={(e) => handleStyleChange('borderColor', e.target.value)} 
              style={{ width: '30px', height: '30px', padding: 0, border: 'none' }} 
            />
            <span style={{fontSize: '0.8rem'}}>Cor do Contorno</span>
          </div>
        )}
      </div>
    </>
  );

  const hasTarja = !!element.style?.backgroundColor && element.style?.backgroundColor !== 'transparent';

  return (
    <aside className="glass animate-fade-in" style={{ width: '300px', height: '100%', borderLeft: '1px solid var(--border)', padding: '20px', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {element.type === 'text' ? <Type size={18} /> : element.type === 'image' ? <ImageIcon size={18} /> : <Palette size={18} />} 
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
                style={{ width: '100%', height: '80px', resize: 'none', marginBottom: '10px' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <button 
                  className="button-secondary" 
                  onClick={() => generateAIText('fix')} 
                  disabled={isGeneratingText}
                  style={{ fontSize: '0.75rem', padding: '6px', background: 'linear-gradient(45deg, #10b981, #059669)', color: 'white', border: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                  <Sparkles size={12} style={{ marginRight: '5px' }} /> Corrigir Ortografia
                </button>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <button 
                    className="button-secondary" 
                    onClick={() => generateAIText('improve')} 
                    disabled={isGeneratingText}
                    style={{ flex: 1, fontSize: '0.75rem', padding: '6px', background: 'linear-gradient(45deg, #3b82f6, #2563eb)', color: 'white', border: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                  >
                    <Wand2 size={12} style={{ marginRight: '5px' }} /> Melhorar
                  </button>
                  <button 
                    className="button-secondary" 
                    onClick={() => generateAIText('summarize')} 
                    disabled={isGeneratingText}
                    style={{ flex: 1, fontSize: '0.75rem', padding: '6px', background: 'linear-gradient(45deg, #f59e0b, #d97706)', color: 'white', border: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                  >
                    Resumir
                  </button>
                </div>
              </div>
            </div>

            <div className="prop-group">
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '5px', color: 'var(--text-muted)' }}>Fonte</label>
              <select 
                value={element.style?.fontFamily || 'Inter'}
                onChange={(e) => handleStyleChange('fontFamily', e.target.value)}
                style={{ width: '100%', marginBottom: '10px' }}
              >
                <option value="Inter">Inter (Padrão)</option>
                <option value="Roboto">Roboto</option>
                <option value="Montserrat">Montserrat</option>
                <option value="Oswald">Oswald</option>
                <option value="Playfair Display">Playfair Display (Serifa)</option>
              </select>
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

            <div className="prop-group" style={{ borderTop: '1px solid var(--border)', paddingTop: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '10px' }}>
                <input 
                  type="checkbox" 
                  checked={hasTarja} 
                  onChange={(e) => handleStyleChange('backgroundColor', e.target.checked ? '#000000' : 'transparent')}
                />
                <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Ativar Tarja (Fundo)</span>
              </div>
              
              {hasTarja && renderBackgroundAndBorderControls('Cores da Tarja', '#000000')}
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

            <div className="prop-group">
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '5px', color: 'var(--text-muted)' }}>Ferramentas Mágicas (IA)</label>
              <button 
                className="button-secondary" 
                style={{ 
                  width: '100%', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
                  color: 'white',
                  border: 'none',
                  opacity: isRemovingBg ? 0.7 : 1,
                  cursor: isRemovingBg ? 'not-allowed' : 'pointer'
                }} 
                onClick={handleRemoveBackground}
                disabled={isRemovingBg}
              >
                {isRemovingBg ? (
                  <><Loader2 size={16} className="animate-spin" style={{ marginRight: '8px', animation: 'spin 1s linear infinite' }} /> Processando IA...</>
                ) : (
                  <><Wand2 size={16} style={{ marginRight: '8px' }} /> Apagar Fundo da Foto</>
                )}
              </button>
              <style dangerouslySetInnerHTML={{__html: `
                @keyframes spin { 100% { transform: rotate(360deg); } }
              `}} />
            </div>


            <div className="prop-group">
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '5px', color: 'var(--text-muted)' }}>Transparência (Opacidade)</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={(element.style?.opacity !== undefined ? element.style.opacity : 1) * 100} 
                  onChange={(e) => handleStyleChange('opacity', e.target.value / 100)} 
                  style={{ flex: 1 }} 
                />
                <span style={{ fontSize: '0.8rem', width: '40px' }}>{Math.round((element.style?.opacity !== undefined ? element.style.opacity : 1) * 100)}%</span>
              </div>
            </div>
          </>
        )}

        {element.type === 'shape' && (
          <>
            {renderBackgroundAndBorderControls('Preenchimento da Forma', '#6366f1')}

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

        {element.type === 'qrcode' && (
          <div className="prop-group">
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '5px', color: 'var(--text-muted)' }}>Link / Conteúdo do QR Code</label>
            <input 
              type="text" 
              value={element.content || ''}
              onChange={(e) => updateElement(element.id, { content: e.target.value })}
              style={{ width: '100%' }}
              placeholder="https://..."
            />
          </div>
        )}

        <div className="prop-group" style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '5px', color: 'var(--text-muted)' }}>Animação de Entrada</label>
          <select 
            value={element.style?.animation || ''}
            onChange={(e) => handleStyleChange('animation', e.target.value)}
            style={{ width: '100%', marginBottom: '10px' }}
          >
            <option value="">Nenhuma</option>
            <option value="fadeIn">Surgir Suave (Fade In)</option>
            <option value="slideInLeft">Deslizar da Esquerda</option>
            <option value="slideInRight">Deslizar da Direita</option>
            <option value="slideInUp">Subir (Slide Up)</option>
            <option value="zoomIn">Zoom In</option>
          </select>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '10px', color: 'var(--text-muted)' }}>Posição & Tamanho (Automático)</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
             <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>X: {Math.round(element.x)}</div>
             <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Y: {Math.round(element.y)}</div>
             <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>W: {typeof element.w === 'string' ? element.w : Math.round(element.w)}px</div>
             <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>H: {typeof element.h === 'string' ? element.h : Math.round(element.h)}px</div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '10px', color: 'var(--text-muted)' }}>Camadas</label>
          <div style={{ display: 'flex', gap: '5px', justifyContent: 'space-between' }}>
            <button className="button-secondary" style={{ padding: '8px', flex: 1, display: 'flex', justifyContent: 'center' }} onClick={() => reorderElement(element.id, 'front')} title="Trazer para Frente">
               <ArrowUpToLine size={16} />
            </button>
            <button className="button-secondary" style={{ padding: '8px', flex: 1, display: 'flex', justifyContent: 'center' }} onClick={() => reorderElement(element.id, 'up')} title="Avançar uma camada">
               <ArrowUp size={16} />
            </button>
            <button className="button-secondary" style={{ padding: '8px', flex: 1, display: 'flex', justifyContent: 'center' }} onClick={() => reorderElement(element.id, 'down')} title="Recuar uma camada">
               <ArrowDown size={16} />
            </button>
            <button className="button-secondary" style={{ padding: '8px', flex: 1, display: 'flex', justifyContent: 'center' }} onClick={() => reorderElement(element.id, 'back')} title="Enviar para Trás">
               <ArrowDownToLine size={16} />
            </button>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px', paddingBottom: '20px' }}>
          <button className="button-secondary" style={{ width: '100%', borderColor: '#ef4444', color: '#ef4444', display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={() => deleteElement(element.id)}>
            <Trash2 size={16} style={{ marginRight: '8px' }} /> Excluir Elemento
          </button>
        </div>
      </div>
    </aside>
  );
};

export default PropertyPanel;
