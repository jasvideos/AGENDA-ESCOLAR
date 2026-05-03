import React, { useState } from 'react';
import { Plus, Trash2, Layout, Download, Upload, Settings, ChevronDown, Clock, Search, Sparkles } from 'lucide-react';
import { slideTemplates } from '../templates';
import SlideThumbnail from './SlideThumbnail';

const AdminSidebar = ({ 
  slides, activeSlideId, setActiveSlideId, addSlide, deleteSlide, setExternalState, updateSlide,
  currentView, setCurrentView 
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [settingsUnlocked, setSettingsUnlocked] = useState(false);
  const [settingsPinInput, setSettingsPinInput] = useState('');
  const [settingsPinError, setSettingsPinError] = useState('');
  const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '');
  const [bgRemoveKey, setBgRemoveKey] = useState(localStorage.getItem('bg_remove_api_key') || '');
  const [unsplashKey, setUnsplashKey] = useState(localStorage.getItem('unsplash_api_key') || '');
  const [pexelsKey, setPexelsKey] = useState(localStorage.getItem('pexels_api_key') || '');
  const [hfKey, setHfKey] = useState(localStorage.getItem('hf_api_key') || '');
  const [giphyKey, setGiphyKey] = useState(localStorage.getItem('giphy_api_key') || '');
  const [googleSearchKey, setGoogleSearchKey] = useState(localStorage.getItem('google_search_api_key') || '');
  const [googleSearchCx, setGoogleSearchCx] = useState(localStorage.getItem('google_search_cx') || '');
  const [geminiModel, setGeminiModel] = useState(localStorage.getItem('gemini_model') || 'gemini-1.5-flash');



  const handleOpenSettings = () => {
    const hasPin = !!localStorage.getItem('settings_pin');
    if (!hasPin || settingsUnlocked) {
      setShowSettings(!showSettings);
      if (showSettings) { setSettingsUnlocked(false); setSettingsPinInput(''); }
    } else {
      setShowSettings(true);
      setSettingsUnlocked(false);
      setSettingsPinInput('');
      setSettingsPinError('');
    }
  };

  const handlePinSubmit = () => {
    const stored = localStorage.getItem('settings_pin');
    if (!stored) {
      // Define a senha pela primeira vez
      if (settingsPinInput.length !== 8) { setSettingsPinError('A senha deve ter exatamente 8 caracteres.'); return; }
      localStorage.setItem('settings_pin', settingsPinInput);
      setSettingsUnlocked(true);
      setSettingsPinError('');
    } else {
      if (settingsPinInput === stored) {
        setSettingsUnlocked(true);
        setSettingsPinError('');
      } else {
        setSettingsPinError('Senha incorreta. Tente novamente.');
        setSettingsPinInput('');
      }
    }
  };

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

      {/* Navegação Principal */}
      <div style={{ padding: '10px', display: 'flex', gap: '5px', borderBottom: '1px solid var(--border)' }}>
        <button 
          className={currentView === 'editor' ? 'button-primary' : 'button-secondary'}
          onClick={() => setCurrentView('editor')}
          style={{ flex: 1, padding: '8px', fontSize: '0.8rem', justifyContent: 'center' }}
        >
          <Layout size={16} /> Editor
        </button>
        <button 
          className={currentView === 'ai-search' ? 'button-primary' : 'button-secondary'}
          onClick={() => setCurrentView('ai-search')}
          style={{ flex: 1, padding: '8px', fontSize: '0.8rem', justifyContent: 'center' }}
        >
          <Search size={16} /> Busca IA
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '15px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {slides.map((slide, index) => (
            <div 
              key={slide.id}
              onClick={() => { setActiveSlideId(slide.id); setCurrentView('editor'); }}
              style={{
                padding: '10px',
                borderRadius: '8px',
                background: activeSlideId === slide.id ? 'rgba(99, 102, 241, 0.2)' : 'var(--bg-card)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                transition: 'all 0.2s',
                border: activeSlideId === slide.id ? '1px solid var(--accent)' : '1px solid var(--border)',
                animation: 'fadeIn 0.3s ease-out',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, opacity: 0.9 }}>
                  {index + 1}. {slide.name}
                </span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSlide(slide.id);
                  }}
                  style={{ background: 'transparent', border: 'none', color: 'white', opacity: 0.4, cursor: 'pointer' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <SlideThumbnail slide={slide} width={210} height={118} />
              
              {/* Per-slide duration */}
              <div 
                style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: 0.85, background: 'rgba(0,0,0,0.3)', padding: '4px 8px', borderRadius: '4px', alignSelf: 'flex-start' }}
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
                    width: '35px',
                    background: 'transparent',
                    border: 'none',
                    padding: '0',
                    fontSize: '0.75rem',
                    textAlign: 'center',
                    color: 'inherit',
                    fontWeight: 'bold'
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
        
        <button className="button-secondary" style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '10px', opacity: 0.8 }} onClick={handleOpenSettings}>
          <Settings size={16} style={{ marginRight: '8px' }} /> Configurações (IA)
        </button>
      </div>

      {showSettings && (
        <div style={{ padding: '15px', borderTop: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)', maxHeight: '400px', overflowY: 'auto' }}>

          {/* ── TELA DE SENHA ── */}
          {!settingsUnlocked && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🔒</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '4px' }}>
                {localStorage.getItem('settings_pin') ? 'Digite sua senha' : 'Defina uma senha (8 caracteres)'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                {localStorage.getItem('settings_pin') ? 'Necessário para acessar as Configurações' : 'Crie uma senha para proteger suas chaves de API'}
              </div>
              <input
                type="password"
                maxLength={8}
                value={settingsPinInput}
                onChange={e => setSettingsPinInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handlePinSubmit()}
                placeholder="●●●●●●●●"
                style={{ width: '100%', textAlign: 'center', letterSpacing: '6px', fontSize: '1.2rem', marginBottom: '8px', padding: '8px' }}
                autoFocus
              />
              {settingsPinError && <div style={{ color: '#f87171', fontSize: '0.75rem', marginBottom: '8px' }}>{settingsPinError}</div>}
              <button className="button-primary" style={{ width: '100%' }} onClick={handlePinSubmit}>
                {localStorage.getItem('settings_pin') ? '🔓 Entrar' : '🔒 Definir Senha'}
              </button>
              {localStorage.getItem('settings_pin') && (
                <button style={{ marginTop: '6px', background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.7rem', cursor: 'pointer' }}
                  onClick={() => { if (window.confirm('Remover a senha?')) { localStorage.removeItem('settings_pin'); setSettingsUnlocked(true); } }}>
                  Remover senha
                </button>
              )}
            </div>
          )}

          {/* ── CONTEÚDO DAS CONFIGURAÇÕES (só quando desbloqueado) ── */}
          {settingsUnlocked && (
            <>
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
          <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '5px', color: 'var(--text-muted)' }}>Modelo Gemini</label>
          <select 
            value={geminiModel}
            onChange={(e) => {
              setGeminiModel(e.target.value);
              localStorage.setItem('gemini_model', e.target.value);
            }}
            style={{ width: '100%', marginBottom: '10px', fontSize: '0.8rem' }}
          >
            <option value="gemini-1.5-flash">Gemini 1.5 Flash (Rápido)</option>
            <option value="gemini-1.5-pro">Gemini 1.5 Pro (Mais Inteligente)</option>
            <option value="gemini-2.0-flash">Gemini 2.0 Flash (Experimental)</option>
          </select>

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
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '12px' }}>Grátis em <a href="https://www.pexels.com/api" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>pexels.com/api</a> (200 req/hora)</span>


          <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '5px', color: 'var(--text-muted)' }}>🤗 Hugging Face API Key (IA Gratuita)</label>
          <input 
            type="password" 
            value={hfKey}
            onChange={(e) => {
              setHfKey(e.target.value);
              localStorage.setItem('hf_api_key', e.target.value);
            }}
            placeholder="hf_..."
            style={{ width: '100%', marginBottom: '4px', fontSize: '0.8rem' }}
          />
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Grátis em <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>huggingface.co/settings/tokens</a> — Remover texto, limpar imagens</span>

          <label style={{ display: 'block', fontSize: '0.8rem', marginTop: '12px', marginBottom: '5px', color: 'var(--text-muted)' }}>🎬 Giphy API Key (Figurinhas)</label>
          <input 
            type="password" 
            value={giphyKey}
            onChange={(e) => {
              setGiphyKey(e.target.value);
              localStorage.setItem('giphy_api_key', e.target.value);
            }}
            placeholder="Cole sua Giphy API Key aqui..."
            style={{ width: '100%', marginBottom: '4px', fontSize: '0.8rem' }}
          />
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Grátis em <a href="https://developers.giphy.com/dashboard/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>developers.giphy.com</a></span>

          <label style={{ display: 'block', fontSize: '0.8rem', marginTop: '12px', marginBottom: '5px', color: 'var(--text-muted)' }}>🔍 Google Search API Key</label>
          <input 
            type="password" 
            value={googleSearchKey}
            onChange={(e) => {
              setGoogleSearchKey(e.target.value);
              localStorage.setItem('google_search_api_key', e.target.value);
            }}
            placeholder="Chave da API do Google..."
            style={{ width: '100%', marginBottom: '4px', fontSize: '0.8rem' }}
          />
          
          <label style={{ display: 'block', fontSize: '0.8rem', marginTop: '8px', marginBottom: '5px', color: 'var(--text-muted)' }}>🆔 Google Search Engine ID (CX)</label>
          <input 
            type="text" 
            value={googleSearchCx}
            onChange={(e) => {
              setGoogleSearchCx(e.target.value);
              localStorage.setItem('google_search_cx', e.target.value);
            }}
            placeholder="ID do mecanismo de busca (cx)..."
            style={{ width: '100%', marginBottom: '4px', fontSize: '0.8rem' }}
          />
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Configurar em <a href="https://programmablesearchengine.google.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>programmablesearchengine.google.com</a></span>


          <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
            <button style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.75rem', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', width: '100%' }}
              onClick={() => {
                const newPin = window.prompt('Digite a nova senha (8 caracteres):');
                if (!newPin) return;
                if (newPin.length !== 8) { alert('A senha deve ter exatamente 8 caracteres.'); return; }
                localStorage.setItem('settings_pin', newPin);
                alert('Senha alterada com sucesso!');
              }}>
              🔑 Alterar Senha das Configurações
            </button>
          </div>
            </>
          )}
        </div>
      )}
    </aside>
  );
};

export default AdminSidebar;
