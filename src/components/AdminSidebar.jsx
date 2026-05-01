import React, { useState } from 'react';
import { Plus, Trash2, Layout, Download, Upload, Settings, ChevronDown, Clock } from 'lucide-react';
import { slideTemplates } from '../templates';

const AdminSidebar = ({ slides, activeSlideId, setActiveSlideId, addSlide, deleteSlide, setExternalState, updateSlide }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '');
  const [bgRemoveKey, setBgRemoveKey] = useState(localStorage.getItem('bg_remove_api_key') || '');
  const [unsplashKey, setUnsplashKey] = useState(localStorage.getItem('unsplash_api_key') || '');
  const [pexelsKey, setPexelsKey] = useState(localStorage.getItem('pexels_api_key') || '');
  const exportProject = () => {
    const data = JSON.stringify(slides);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meu_projeto.anix`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importProject = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setExternalState(parsed);
          setActiveSlideId(parsed[0].id);
        }
      } catch (err) {
        alert("Arquivo inválido ou corrompido.");
      }
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  return (
    <aside className="glass" style={{ width: '260px', height: '100%', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px', borderBottom: '1px solid var(--border)' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Layout className="text-accent" /> Anix Slides
        </h2>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '15px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {slides.map((slide, index) => (
            <div 
              key={slide.id}
              onClick={() => setActiveSlideId(slide.id)}
              style={{
                padding: '10px 12px',
                borderRadius: '8px',
                background: activeSlideId === slide.id ? 'var(--accent)' : 'var(--bg-card)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                transition: 'all 0.2s',
                border: activeSlideId === slide.id ? 'none' : '1px solid var(--border)',
                animation: 'fadeIn 0.3s ease-out'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                  {index + 1}. {slide.name}
                </span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSlide(slide.id);
                  }}
                  style={{ background: 'transparent', border: 'none', color: 'white', opacity: 0.6, cursor: 'pointer' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              {/* Per-slide duration */}
              <div 
                style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: 0.85 }}
                onClick={(e) => e.stopPropagation()}
              >
                <Clock size={12} style={{ flexShrink: 0, opacity: 0.7 }} />
                <input
                  type="number"
                  min="1"
                  max="300"
                  value={slide.duration ?? 5}
                  onChange={(e) => updateSlide(slide.id, { duration: Math.max(1, Number(e.target.value)) })}
                  style={{
                    width: '45px',
                    background: 'rgba(255,255,255,0.12)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '4px',
                    padding: '2px 4px',
                    fontSize: '0.75rem',
                    textAlign: 'center',
                    color: 'inherit'
                  }}
                  title="Duração deste slide (segundos)"
                />
                <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>s</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '20px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ position: 'relative' }}>
          <button className="button-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center' }} onClick={() => setShowTemplates(!showTemplates)}>
            <Plus size={18} style={{ marginRight: '8px' }} /> Novo Slide <ChevronDown size={14} style={{ marginLeft: '5px' }} />
          </button>
          
          {showTemplates && (
            <div className="glass animate-fade-in" style={{ position: 'absolute', bottom: '45px', left: 0, width: '100%', padding: '10px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '5px', zIndex: 50 }}>
              <button className="button-secondary" style={{ textAlign: 'left', fontSize: '0.8rem' }} onClick={() => { addSlide(); setShowTemplates(false); }}>
                Em Branco
              </button>
              {slideTemplates.map((tpl, i) => (
                <button key={i} className="button-secondary" style={{ textAlign: 'left', fontSize: '0.8rem' }} onClick={() => { addSlide(tpl); setShowTemplates(false); }}>
                  {tpl.name}
                </button>
              ))}
            </div>
          )}
        </div>
        <button className="button-secondary" style={{ width: '100%', display: 'flex', justifyContent: 'center' }} onClick={exportProject}>
          <Download size={16} style={{ marginRight: '8px' }} /> Salvar (.anix)
        </button>
        <button className="button-secondary" style={{ width: '100%', display: 'flex', justifyContent: 'center' }} onClick={() => document.getElementById('import-project').click()}>
          <Upload size={16} style={{ marginRight: '8px' }} /> Abrir Projeto
        </button>
        <input type="file" id="import-project" style={{ display: 'none' }} accept=".anix,.json" onChange={importProject} />
        
        <button className="button-secondary" style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '10px', opacity: 0.8 }} onClick={() => setShowSettings(!showSettings)}>
          <Settings size={16} style={{ marginRight: '8px' }} /> Configurações (IA)
        </button>
      </div>

      {showSettings && (
        <div style={{ padding: '15px', borderTop: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '5px', color: 'var(--text-muted)' }}>Google Gemini API Key</label>
          <input 
            type="password" 
            value={apiKey}
            onChange={(e) => {
              setApiKey(e.target.value);
              localStorage.setItem('gemini_api_key', e.target.value);
            }}
            placeholder="Cole sua Gemini API Key aqui..."
            style={{ width: '100%', marginBottom: '10px', fontSize: '0.8rem' }}
          />
          <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '5px', color: 'var(--text-muted)' }}>Remove.bg API Key (Remover Fundo)</label>
          <input 
            type="password" 
            value={bgRemoveKey}
            onChange={(e) => {
              setBgRemoveKey(e.target.value);
              localStorage.setItem('bg_remove_api_key', e.target.value);
            }}
            placeholder="Cole sua Remove.bg API Key aqui..."
            style={{ width: '100%', marginBottom: '4px', fontSize: '0.8rem' }}
          />
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '12px' }}>Grátis em <a href="https://www.remove.bg/api" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>remove.bg/api</a> (50/mês)</span>

          <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '5px', color: 'var(--text-muted)' }}>Unsplash API Key (Busca de Fotos)</label>
          <input 
            type="password" 
            value={unsplashKey}
            onChange={(e) => {
              setUnsplashKey(e.target.value);
              localStorage.setItem('unsplash_api_key', e.target.value);
            }}
            placeholder="Cole sua Unsplash Access Key aqui..."
            style={{ width: '100%', marginBottom: '4px', fontSize: '0.8rem' }}
          />
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '12px' }}>Grátis em <a href="https://unsplash.com/developers" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>unsplash.com/developers</a> (50 req/hora)</span>

          <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '5px', color: 'var(--text-muted)' }}>Pexels API Key (Fotos e Vídeos)</label>
          <input 
            type="password" 
            value={pexelsKey}
            onChange={(e) => {
              setPexelsKey(e.target.value);
              localStorage.setItem('pexels_api_key', e.target.value);
            }}
            placeholder="Cole sua Pexels API Key aqui..."
            style={{ width: '100%', marginBottom: '4px', fontSize: '0.8rem' }}
          />
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Grátis em <a href="https://www.pexels.com/api" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>pexels.com/api</a> (200 req/hora)</span>
        </div>
      )}
    </aside>
  );
};

export default AdminSidebar;
