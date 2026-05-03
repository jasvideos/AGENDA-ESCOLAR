import React, { useState } from 'react';
import { Search, Mic, Plus, MoreVertical, Grid, User, Layout, MessageSquare, Image as ImageIcon, Video, Newspaper, MoreHorizontal, Sparkles } from 'lucide-react';

const AISearchPage = () => {
  const [query, setQuery] = useState('');

  const suggestions = [
    { text: 'Parques públicos perto de mim para um piquenique tranquilo', icon: <Search size={16} /> },
    { text: 'Percursos de corrida com um circuito de 5 km', icon: <Search size={16} /> },
    { text: 'Faça uma tabela comparando diferentes métodos de preparo de café', icon: <Search size={16} /> },
  ];

  return (
    <div style={{ 
      display: 'flex', 
      width: '100%', 
      height: '100%', 
      backgroundColor: '#ffffff', 
      color: '#202124',
      fontFamily: 'Roboto, arial, sans-serif'
    }}>
      {/* Mini Sidebar Lateral */}
      <aside style={{ 
        width: '60px', 
        borderRight: '1px solid #e8eaed', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        paddingTop: '20px',
        gap: '20px'
      }}>
        <div style={{ color: '#5f6368', cursor: 'pointer' }}><Grid size={24} /></div>
        <div style={{ color: '#5f6368', cursor: 'pointer' }}><Layout size={24} /></div>
        <div style={{ color: '#5f6368', cursor: 'pointer' }}><MessageSquare size={24} /></div>
      </aside>

      {/* Conteúdo Principal */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Header */}
        <header style={{ 
          height: '60px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '0 20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '14px', color: '#5f6368' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              color: '#1a73e8', 
              fontWeight: '500', 
              borderBottom: '3px solid #1a73e8', 
              height: '57px',
              marginTop: '3px'
            }}>
              Modo IA
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>Tudo</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}><ImageIcon size={16} /> Imagens</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}><Video size={16} /> Vídeos</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}><Newspaper size={16} /> Notícias</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>Mais <MoreHorizontal size={14} /></div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button style={{ background: 'transparent', border: 'none', color: '#5f6368', cursor: 'pointer' }}><Grid size={20} /></button>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '50%', 
              backgroundColor: '#1a73e8', 
              color: 'white', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: '500'
            }}>J</div>
          </div>
        </header>

        {/* Centro da Página */}
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          paddingTop: '80px' 
        }}>
          
          {/* Logo Estilo Google */}
          <div style={{ fontSize: '92px', fontWeight: '500', marginBottom: '30px', display: 'flex' }}>
            <span style={{ color: '#4285F4' }}>G</span>
            <span style={{ color: '#EA4335' }}>o</span>
            <span style={{ color: '#FBBC05' }}>o</span>
            <span style={{ color: '#4285F4' }}>g</span>
            <span style={{ color: '#34A853' }}>l</span>
            <span style={{ color: '#EA4335' }}>e</span>
          </div>

          <h1 style={{ 
            fontSize: '36px', 
            fontWeight: '400', 
            marginBottom: '40px', 
            color: '#202124',
            textAlign: 'center'
          }}>
            Olá, JOSE AUGUSTO! No que você está pensando?
          </h1>

          {/* Barra de Pesquisa */}
          <div style={{ 
            width: '100%', 
            maxWidth: '780px', 
            position: 'relative',
            marginBottom: '40px'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              backgroundColor: '#f1f3f4', 
              borderRadius: '24px', 
              padding: '12px 20px',
              boxShadow: '0 1px 6px rgba(32,33,36,.28)',
              border: '1px solid transparent'
            }}>
              <Search size={20} style={{ color: '#9aa0a6', marginRight: '15px' }} />
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Pergunte o que quiser"
                style={{ 
                  flex: 1, 
                  border: 'none', 
                  backgroundColor: 'transparent', 
                  fontSize: '16px', 
                  color: '#202124',
                  outline: 'none',
                  padding: '4px 0'
                }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: '#4285f4' }}>
                <Plus size={22} style={{ cursor: 'pointer' }} />
                <Mic size={22} style={{ cursor: 'pointer' }} />
              </div>
            </div>
          </div>

          {/* Sugestões */}
          <div style={{ 
            width: '100%', 
            maxWidth: '780px', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '15px' 
          }}>
            {suggestions.map((s, i) => (
              <div key={i} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '15px', 
                color: '#5f6368', 
                fontSize: '16px',
                cursor: 'pointer',
                padding: '8px 10px',
                borderRadius: '8px',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div style={{ color: '#9aa0a6' }}>{s.icon}</div>
                {s.text}
              </div>
            ))}
          </div>

        </div>

      </main>
    </div>
  );
};

export default AISearchPage;
