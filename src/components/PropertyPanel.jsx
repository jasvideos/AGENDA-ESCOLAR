import React, { useState } from 'react';
import { Settings, Trash2, Type, Image as ImageIcon, Palette, ArrowUp, ArrowDown, ArrowUpToLine, ArrowDownToLine, Wand2, Loader2, Sparkles, RotateCw } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { bgGallery } from '../templates';

const PropertyPanel = ({ element, updateElement, deleteElement, reorderElement, activeSlide, updateSlide }) => {
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  const [isClipdropProcessing, setIsClipdropProcessing] = useState(false);

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
              <input type="color" value={activeSlide?.bgColor || '#111827'} onChange={(e) => updateSlide({ bgColor: e.target.value })} style={{ width: '30px', height: '30px', padding: 0, border: 'none' }} />
              <span style={{ fontSize: '0.8rem' }}>Cor Base</span>
            </div>
          </div>

          {activeSlide?.bgImage ? (
            <div className="prop-group">
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '5px', color: 'var(--text-muted)' }}>Transparência da Imagem BG</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input type="range" min="0" max="100" value={(activeSlide.bgOpacity !== undefined ? activeSlide.bgOpacity : 1) * 100} onChange={(e) => updateSlide({ bgOpacity: e.target.value / 100 })} style={{ flex: 1 }} />
                <span style={{ fontSize: '0.8rem', width: '40px' }}>{Math.round((activeSlide.bgOpacity !== undefined ? activeSlide.bgOpacity : 1) * 100)}%</span>
              </div>
              <button className="button-secondary" style={{ width: '100%', marginTop: '15px', color: '#ef4444', borderColor: '#ef4444', display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={() => updateSlide({ bgImage: null })}>
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
                <div key={idx} onClick={() => updateSlide({ bgImage: bg, bgOpacity: 0.5 })} style={{ height: '60px', borderRadius: '6px', backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center', cursor: 'pointer', border: '1px solid var(--border)', transition: 'transform 0.2s' }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'} />
              ))}
            </div>
          </div>
        </div>
      </aside>
    );
  }

  const handleRemoveBackground = async () => {
    if (!element.src) return;
    
    const apiKey = localStorage.getItem('bg_remove_api_key');
    if (!apiKey) {
      alert('Configure sua Remove.bg API Key nas Configurações do painel esquerdo (botão ⚙️ Configurações).');
      return;
    }

    setIsRemovingBg(true);
    try {
      // Converte a imagem para Blob se for dataURL
      let imageBlob;
      if (element.src.startsWith('data:')) {
        const res = await fetch(element.src);
        imageBlob = await res.blob();
      } else {
        // URL remota: faz o fetch via proxy (CORS)
        const res = await fetch(element.src);
        imageBlob = await res.blob();
      }

      const formData = new FormData();
      formData.append('image_file', imageBlob, 'image.png');
      formData.append('size', 'auto');

      const response = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: { 'X-Api-Key': apiKey },
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.errors?.[0]?.title || `Erro ${response.status}: Chave inválida ou limite atingido.`);
      }

      const resultBlob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => updateElement(element.id, { src: reader.result });
      reader.readAsDataURL(resultBlob);

    } catch (err) {
      console.error('Erro ao remover fundo:', err);
      alert(`Falha na remoção de fundo: ${err.message}`);
    } finally {
      setIsRemovingBg(false);
    }
  };

  const handleClipdropTool = async (tool) => {
    if (!element.src) return;
    const apiKey = localStorage.getItem('clipdrop_api_key');
    if (!apiKey) {
      alert('Configure sua Clipdrop API Key nas Configurações do painel esquerdo (⚙️).');
      return;
    }
    setIsClipdropProcessing(true);
    try {
      let imageBlob;
      if (element.src.startsWith('data:')) {
        const res = await fetch(element.src);
        imageBlob = await res.blob();
      } else {
        const res = await fetch(element.src);
        imageBlob = await res.blob();
      }

      const formData = new FormData();
      formData.append('image_file', imageBlob, 'image.png');

      const endpoints = {
        'remove-text': 'https://clipdrop-api.co/remove-text/v1',
        'upscale':     'https://clipdrop-api.co/image-upscaling/v1/upscale',
      };

      const response = await fetch(endpoints[tool], {
        method: 'POST',
        headers: { 'x-api-key': apiKey },
        body: formData,
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Erro ${response.status}: ${errText || 'Chave inválida ou limite atingido.'}`);
      }

      const resultBlob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => updateElement(element.id, { src: reader.result });
      reader.readAsDataURL(resultBlob);
    } catch (err) {
      console.error('Clipdrop error:', err);
      alert(`Falha na operação Clipdrop: ${err.message}`);
    } finally {
      setIsClipdropProcessing(false);
    }
  };

  const generateAIText = async (promptType) => {
    if (!element.content) return;
    const apiKey = localStorage.getItem('gemini_api_key');
    if (!apiKey) { alert('Configure sua Gemini API Key nas Configurações (painel esquerdo).'); return; }
    setIsGeneratingText(true);
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompts = {
        fix: `Corrija a ortografia e gramática do seguinte texto, mantendo o idioma original. Responda APENAS com o texto corrigido:\n\n${element.content}`,
        improve: `Melhore o seguinte texto para um slide de apresentação profissional. Responda APENAS com o texto melhorado:\n\n${element.content}`,
        summarize: `Resuma o seguinte texto para caber em um slide (curto e impactante). Responda APENAS com o resumo:\n\n${element.content}`,
      };
      const result = await model.generateContent(prompts[promptType]);
      const text = result.response.text().trim();
      if (text) updateElement(element.id, { content: text });
    } catch (error) {
      alert('Erro na IA. Verifique se sua API Key é válida.');
    } finally {
      setIsGeneratingText(false);
    }
  };

  const handleStyleChange = (key, value) => updateElement(element.id, { style: { ...element.style, [key]: value } });

  const hasTarja = !!element.style?.backgroundColor && element.style?.backgroundColor !== 'transparent';
  const rotation = element.rotation || 0;

  // ── Rotation Control (shared by all types) ──
  const renderRotationControl = () => (
    <div className="prop-group" style={{ borderTop: '1px solid var(--border)', paddingTop: '15px' }}>
      <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <RotateCw size={13} /> Rotação: {rotation}°
      </label>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input
          type="range" min="-180" max="180"
          value={rotation}
          onChange={(e) => updateElement(element.id, { rotation: Number(e.target.value) })}
          style={{ flex: 1 }}
        />
        <button
          className="button-secondary"
          style={{ padding: '4px 8px', fontSize: '0.75rem' }}
          onClick={() => updateElement(element.id, { rotation: 0 })}
          title="Resetar rotação"
        >0°</button>
      </div>
      <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
        {[-90, -45, 45, 90].map(deg => (
          <button key={deg} className="button-secondary" style={{ flex: 1, padding: '4px', fontSize: '0.72rem' }} onClick={() => updateElement(element.id, { rotation: (rotation + deg + 360) % 360 - 180 })}>
            {deg > 0 ? `+${deg}°` : `${deg}°`}
          </button>
        ))}
      </div>
    </div>
  );

  const renderBorderControls = () => (
    <div className="prop-group">
      <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '5px', color: 'var(--text-muted)' }}>Contorno (Borda)</label>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
        <input type="range" min="0" max="20" value={parseInt(element.style?.borderWidth) || 0} onChange={(e) => handleStyleChange('borderWidth', `${e.target.value}px`)} style={{ flex: 1 }} />
        <span style={{ fontSize: '0.8rem', width: '30px' }}>{parseInt(element.style?.borderWidth) || 0}px</span>
      </div>
      {parseInt(element.style?.borderWidth) > 0 && (
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input type="color" value={element.style?.borderColor || '#ffffff'} onChange={(e) => handleStyleChange('borderColor', e.target.value)} style={{ width: '30px', height: '30px', padding: 0, border: 'none' }} />
          <span style={{ fontSize: '0.8rem' }}>Cor do Contorno</span>
        </div>
      )}
    </div>
  );

  const renderOpacityControl = (label = 'Transparência (Opacidade)') => (
    <div className="prop-group">
      <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '5px', color: 'var(--text-muted)' }}>{label}</label>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input type="range" min="0" max="100" value={(element.style?.opacity !== undefined ? element.style.opacity : 1) * 100} onChange={(e) => handleStyleChange('opacity', e.target.value / 100)} style={{ flex: 1 }} />
        <span style={{ fontSize: '0.8rem', width: '40px' }}>{Math.round((element.style?.opacity !== undefined ? element.style.opacity : 1) * 100)}%</span>
      </div>
    </div>
  );

  const renderColorAndGradient = (label, defaultBg = '#000000') => (
    <div className="prop-group">
      <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '5px', color: 'var(--text-muted)' }}>{label}</label>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
        <input type="color" value={element.style?.backgroundColor && element.style.backgroundColor !== 'transparent' ? element.style.backgroundColor : defaultBg} onChange={(e) => handleStyleChange('backgroundColor', e.target.value)} style={{ width: '30px', height: '30px', padding: 0, border: 'none' }} />
        <span style={{ fontSize: '0.8rem' }}>Cor Principal</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '10px' }}>
        <input type="checkbox" checked={!!element.style?.useGradient} onChange={(e) => handleStyleChange('useGradient', e.target.checked)} />
        <span style={{ fontSize: '0.8rem' }}>Usar Gradiente</span>
      </div>
      {element.style?.useGradient && (
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
          <input type="color" value={element.style?.gradientColor || '#ffffff'} onChange={(e) => handleStyleChange('gradientColor', e.target.value)} style={{ width: '30px', height: '30px', padding: 0, border: 'none' }} />
          <span style={{ fontSize: '0.8rem' }}>Cor 2 (Gradiente)</span>
        </div>
      )}
    </div>
  );

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

        {/* ── TEXT ── */}
        {element.type === 'text' && (
          <>
            <div className="prop-group">
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '5px', color: 'var(--text-muted)' }}>Conteúdo do Texto</label>
              <textarea value={element.content} onChange={(e) => updateElement(element.id, { content: e.target.value })} style={{ width: '100%', height: '80px', resize: 'none', marginBottom: '10px' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <button className="button-secondary" onClick={() => generateAIText('fix')} disabled={isGeneratingText} style={{ fontSize: '0.75rem', padding: '6px', background: 'linear-gradient(45deg, #10b981, #059669)', color: 'white', border: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Sparkles size={12} style={{ marginRight: '5px' }} /> Corrigir Ortografia
                </button>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <button className="button-secondary" onClick={() => generateAIText('improve')} disabled={isGeneratingText} style={{ flex: 1, fontSize: '0.75rem', padding: '6px', background: 'linear-gradient(45deg, #3b82f6, #2563eb)', color: 'white', border: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Wand2 size={12} style={{ marginRight: '5px' }} /> Melhorar
                  </button>
                  <button className="button-secondary" onClick={() => generateAIText('summarize')} disabled={isGeneratingText} style={{ flex: 1, fontSize: '0.75rem', padding: '6px', background: 'linear-gradient(45deg, #f59e0b, #d97706)', color: 'white', border: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    Resumir
                  </button>
                </div>
              </div>
            </div>

            <div className="prop-group">
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '5px', color: 'var(--text-muted)' }}>Fonte</label>
              <select value={element.style?.fontFamily || 'Inter'} onChange={(e) => handleStyleChange('fontFamily', e.target.value)} style={{ width: '100%', marginBottom: '10px' }}>
                <option value="Inter">Inter (Padrão)</option>
                <option value="Roboto">Roboto</option>
                <option value="Montserrat">Montserrat</option>
                <option value="Oswald">Oswald</option>
                <option value="Playfair Display">Playfair Display (Serifa)</option>
              </select>
            </div>

            <div className="prop-group">
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '5px', color: 'var(--text-muted)' }}>Tamanho da Fonte</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input 
                  type="range" 
                  min="8" 
                  max="200" 
                  value={parseInt(element.style?.fontSize) || 20}
                  onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`)}
                  style={{ flex: 1 }}
                />
                <input 
                  type="number" 
                  min="8"
                  max="500"
                  value={parseInt(element.style?.fontSize) || 20}
                  onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`)}
                  style={{ width: '60px', padding: '2px 4px', fontSize: '0.8rem' }}
                />
              </div>
            </div>

            <div className="prop-group">
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '5px', color: 'var(--text-muted)' }}>Cor do Texto</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input type="color" value={element.style?.color || '#ffffff'} onChange={(e) => handleStyleChange('color', e.target.value)} style={{ width: '40px', height: '40px', padding: 0, border: 'none' }} />
                <input type="text" value={element.style?.color} onChange={(e) => handleStyleChange('color', e.target.value)} style={{ flex: 1 }} />
              </div>
            </div>

            {/* ── FIX 1: Tarja com bgOpacity separado do texto ── */}
            <div className="prop-group" style={{ borderTop: '1px solid var(--border)', paddingTop: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '10px' }}>
                <input type="checkbox" checked={hasTarja} onChange={(e) => handleStyleChange('backgroundColor', e.target.checked ? '#000000' : 'transparent')} />
                <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Ativar Tarja (Fundo)</span>
              </div>
              {hasTarja && (
                <>
                  {renderColorAndGradient('Cores da Tarja', '#000000')}
                  <div className="prop-group">
                    <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '5px', color: 'var(--text-muted)' }}>Transparência da Tarja</label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <input type="range" min="0" max="100"
                        value={Math.round((element.style?.bgOpacity !== undefined ? element.style.bgOpacity : 1) * 100)}
                        onChange={(e) => handleStyleChange('bgOpacity', e.target.value / 100)}
                        style={{ flex: 1 }}
                      />
                      <span style={{ fontSize: '0.8rem', width: '40px' }}>{Math.round((element.style?.bgOpacity !== undefined ? element.style.bgOpacity : 1) * 100)}%</span>
                    </div>
                  </div>
                  {renderBorderControls()}
                </>
              )}
            </div>

            {renderRotationControl()}
          </>
        )}

        {/* ── IMAGE ── */}
        {element.type === 'image' && (
          <>
            <div className="prop-group">
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '5px', color: 'var(--text-muted)' }}>URL da Imagem</label>
              <input type="text" value={element.src} onChange={(e) => updateElement(element.id, { src: e.target.value })} style={{ width: '100%' }} placeholder="https://exemplo.com/foto.jpg" />
            </div>
            <div className="prop-group">
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '5px', color: 'var(--text-muted)' }}>Upload Local</label>
              <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files[0]; if (file) { const r = new FileReader(); r.onloadend = () => updateElement(element.id, { src: r.result }); r.readAsDataURL(file); } }} style={{ width: '100%', fontSize: '0.8rem' }} />
            </div>
            <div className="prop-group">
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '5px', color: 'var(--text-muted)' }}>Ferramentas Mágicas (IA)</label>
              <button className="button-secondary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(45deg, #6366f1, #8b5cf6)', color: 'white', border: 'none', opacity: isRemovingBg ? 0.7 : 1, cursor: isRemovingBg ? 'not-allowed' : 'pointer', marginBottom: '6px' }} onClick={handleRemoveBackground} disabled={isRemovingBg}>
                {isRemovingBg ? (<><Loader2 size={16} style={{ marginRight: '8px', animation: 'spin 1s linear infinite' }} /> Processando...</>) : (<><Wand2 size={16} style={{ marginRight: '8px' }} /> Apagar Fundo da Foto</>)}
              </button>
              <button className="button-secondary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(45deg, #0ea5e9, #0284c7)', color: 'white', border: 'none', opacity: isClipdropProcessing ? 0.7 : 1, cursor: isClipdropProcessing ? 'not-allowed' : 'pointer', marginBottom: '6px' }} onClick={() => handleClipdropTool('remove-text')} disabled={isClipdropProcessing}>
                {isClipdropProcessing ? (<><Loader2 size={16} style={{ marginRight: '8px', animation: 'spin 1s linear infinite' }} /> Processando Clipdrop...</>) : (<><Sparkles size={16} style={{ marginRight: '8px' }} /> Remover Texto da Imagem</>)}
              </button>
              <button className="button-secondary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(45deg, #f59e0b, #d97706)', color: 'white', border: 'none', opacity: isClipdropProcessing ? 0.7 : 1, cursor: isClipdropProcessing ? 'not-allowed' : 'pointer' }} onClick={() => handleClipdropTool('upscale')} disabled={isClipdropProcessing}>
                {isClipdropProcessing ? (<><Loader2 size={16} style={{ marginRight: '8px', animation: 'spin 1s linear infinite' }} /> Processando...</>) : (<><Sparkles size={16} style={{ marginRight: '8px' }} /> Melhorar Qualidade (Upscale)</>)}
              </button>
              <style dangerouslySetInnerHTML={{ __html: `@keyframes spin { 100% { transform: rotate(360deg); } }` }} />
            </div>
            {renderOpacityControl()}
            {renderRotationControl()}
          </>
        )}

        {/* ── SHAPE ── */}
        {element.type === 'shape' && (
          <>
            {renderColorAndGradient('Preenchimento da Forma', '#6366f1')}
            {renderOpacityControl()}
            {renderBorderControls()}
            <div className="prop-group">
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '5px', color: 'var(--text-muted)' }}>Arredondamento: {element.style?.borderRadius || '0px'}</label>
              <input type="range" min="0" max="100" value={parseInt(element.style?.borderRadius) || 0} onChange={(e) => handleStyleChange('borderRadius', `${e.target.value}px`)} style={{ width: '100%' }} />
            </div>
            {renderRotationControl()}
          </>
        )}

        {/* ── SVG (ELEMENTOS GRÁFICOS) ── */}
        {element.type === 'svg' && (
          <>
            <div className="prop-group">
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '5px', color: 'var(--text-muted)' }}>Cor do Elemento</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input type="color" value={element.style?.color || '#ffffff'} onChange={(e) => handleStyleChange('color', e.target.value)} style={{ width: '40px', height: '40px', padding: 0, border: 'none' }} />
                <input type="text" value={element.style?.color} onChange={(e) => handleStyleChange('color', e.target.value)} style={{ flex: 1 }} />
              </div>
            </div>
            {renderOpacityControl()}
            {renderRotationControl()}
          </>
        )}

        {/* ── QR CODE ── */}
        {element.type === 'qrcode' && (
          <div className="prop-group">
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '5px', color: 'var(--text-muted)' }}>Link / Conteúdo do QR Code</label>
            <input type="text" value={element.content || ''} onChange={(e) => updateElement(element.id, { content: e.target.value })} style={{ width: '100%' }} placeholder="https://..." />
          </div>
        )}

        {/* ── Shared: Animation ── */}
        <div className="prop-group" style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '5px', color: 'var(--text-muted)' }}>Animação de Entrada</label>
          <select value={element.style?.animation || ''} onChange={(e) => handleStyleChange('animation', e.target.value)} style={{ width: '100%', marginBottom: '10px' }}>
            <option value="">Nenhuma</option>
            <option value="fadeIn">Surgir Suave (Fade In)</option>
            <option value="slideInLeft">Deslizar da Esquerda</option>
            <option value="slideInRight">Deslizar da Direita</option>
            <option value="slideInUp">Subir (Slide Up)</option>
            <option value="zoomIn">Zoom In</option>
          </select>
        </div>

        {/* ── Shared: Position info ── */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '10px', color: 'var(--text-muted)' }}>Posição & Tamanho</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>X: {Math.round(element.x)}</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Y: {Math.round(element.y)}</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>W: {typeof element.w === 'string' ? element.w : Math.round(element.w)}px</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>H: {typeof element.h === 'string' ? element.h : Math.round(element.h)}px</div>
          </div>
        </div>

        {/* ── Shared: Layer order ── */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '10px', color: 'var(--text-muted)' }}>Camadas</label>
          <div style={{ display: 'flex', gap: '5px', justifyContent: 'space-between' }}>
            <button className="button-secondary" style={{ padding: '8px', flex: 1, display: 'flex', justifyContent: 'center' }} onClick={() => reorderElement(element.id, 'front')} title="Trazer para Frente"><ArrowUpToLine size={16} /></button>
            <button className="button-secondary" style={{ padding: '8px', flex: 1, display: 'flex', justifyContent: 'center' }} onClick={() => reorderElement(element.id, 'up')} title="Avançar uma camada"><ArrowUp size={16} /></button>
            <button className="button-secondary" style={{ padding: '8px', flex: 1, display: 'flex', justifyContent: 'center' }} onClick={() => reorderElement(element.id, 'down')} title="Recuar uma camada"><ArrowDown size={16} /></button>
            <button className="button-secondary" style={{ padding: '8px', flex: 1, display: 'flex', justifyContent: 'center' }} onClick={() => reorderElement(element.id, 'back')} title="Enviar para Trás"><ArrowDownToLine size={16} /></button>
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
