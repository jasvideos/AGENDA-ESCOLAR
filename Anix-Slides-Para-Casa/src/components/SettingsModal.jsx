import React, { useState, useEffect } from 'react';
import { X, Key, Check } from 'lucide-react';

const SettingsModal = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Carregar a chave salva ou definir a padrão do usuário se estiver vazio
    const storedKey = localStorage.getItem('anix_removebg_key');
    if (storedKey) {
      setApiKey(storedKey);
    } else {
      // Chave padrão fornecida pelo usuário
      const defaultKey = 'w5oUe8ovULeQvCzuyeox2Lwu';
      setApiKey(defaultKey);
      localStorage.setItem('anix_removebg_key', defaultKey);
    }
  }, [isOpen]);

  const handleSave = () => {
    localStorage.setItem('anix_removebg_key', apiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(5px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999
    }}>
      <div className="premium-card animate-fade-in" style={{
        width: '450px', padding: '30px', position: 'relative'
      }}>
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={24} />
        </button>

        <h2 style={{ fontSize: '1.4rem', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Key className="text-accent" /> Configurações de IA
        </h2>

        <div className="prop-group">
          <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-muted)' }}>Chave de API (remove.bg)</label>
          <input 
            type="text" 
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Cole sua API Key aqui..."
            style={{ width: '100%', marginBottom: '20px' }}
          />
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '25px', lineHeight: '1.5' }}>
            Essa chave é usada para remover o fundo das imagens magicamente. O AnixSlide já possui uma chave padrão configurada, mas você pode substituí-la pela sua própria caso atinja o limite.
          </p>
        </div>

        <button 
          className="button-primary" 
          style={{ width: '100%', justifyContent: 'center' }}
          onClick={handleSave}
        >
          {saved ? <><Check size={18} /> Salvo com Sucesso</> : 'Salvar Configurações'}
        </button>
      </div>
    </div>
  );
};

export default SettingsModal;
