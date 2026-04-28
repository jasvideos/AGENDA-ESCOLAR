import React from 'react';
import { Plus, Trash2, Layout } from 'lucide-react';

const AdminSidebar = ({ slides, activeSlideId, setActiveSlideId, addSlide, deleteSlide }) => {
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
                padding: '12px',
                borderRadius: '8px',
                background: activeSlideId === slide.id ? 'var(--accent)' : 'var(--bg-card)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s',
                border: activeSlideId === slide.id ? 'none' : '1px solid var(--border)',
                animation: 'fadeIn 0.3s ease-out'
              }}
            >
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
          ))}
        </div>
      </div>

      <div style={{ padding: '20px', borderTop: '1px solid var(--border)' }}>
        <button className="button-primary" style={{ width: '100%' }} onClick={addSlide}>
          <Plus size={18} /> Novo Slide
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
