import React from 'react';
import { Plus, Trash2, Layout, Save, FolderOpen, Sparkles, Files } from 'lucide-react';

const AdminSidebar = ({ 
  slides, activeSlideId, setActiveSlideId, 
  addSlide, deleteSlide, saveProject, openProject, openSettings
}) => {
  return (
    <aside className="glass" style={{ width: '280px', height: '100%', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', background: 'rgba(2, 6, 23, 0.6)' }}>
      <div style={{ padding: '25px 20px', borderBottom: '1px solid var(--border)' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px' }} className="accent-text">
          <Files size={24} /> Slides Anix
        </h2>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '15px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {slides.map((slide, index) => (
            <div 
              key={slide.id}
              onClick={() => setActiveSlideId(slide.id)}
              style={{
                padding: '12px 15px',
                borderRadius: '10px',
                background: activeSlideId === slide.id ? 'var(--accent-gradient)' : 'rgba(255,255,255,0.02)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s',
                border: activeSlideId === slide.id ? 'none' : '1px solid transparent',
                boxShadow: activeSlideId === slide.id ? '0 4px 15px rgba(139, 92, 246, 0.3)' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.85rem', opacity: 0.6, fontWeight: 'bold' }}>{index + 1}.</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{slide.name}</span>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); deleteSlide(slide.id); }}
                style={{ background: 'transparent', border: 'none', color: 'white', opacity: 0.4, cursor: 'pointer' }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '20px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '10px', background: 'rgba(0,0,0,0.2)' }}>
        <div style={{ position: 'relative' }}>
          <button className="button-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={addSlide}>
            <Plus size={18} /> Novo Slide
          </button>
        </div>
        
        <button className="button-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={saveProject}>
          <Save size={18} style={{ marginRight: '8px' }} /> Salvar (.anix)
        </button>
        
        <button className="button-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={openProject}>
          <FolderOpen size={18} style={{ marginRight: '8px' }} /> Abrir Projeto
        </button>
        
        <button className="button-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={openSettings}>
          <Sparkles size={18} style={{ marginRight: '8px' }} /> Configurações (IA)
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
