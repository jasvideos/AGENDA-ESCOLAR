import React, { useState, useEffect } from 'react';
import { Search, Mic, Plus, Grid, Layout, MessageSquare, Image as ImageIcon, Video, Newspaper, MoreHorizontal, Sparkles, Loader2, Send, Download, Layers } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const AISearchPage = ({ addSlide }) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState(null);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [error, setError] = useState('');

  const suggestions = [
    { text: 'Crie um panfleto para uma excursão escolar para o museu', icon: <Sparkles size={16} /> },
    { text: 'Gere uma imagem de uma sala de aula futurista e tecnológica', icon: <ImageIcon size={16} /> },
    { text: 'Explique a importância da reciclagem para crianças de 10 anos', icon: <MessageSquare size={16} /> },
  ];

  const getGeminiKey = () => localStorage.getItem('gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || '';
  const getHFKey = () => localStorage.getItem('hf_api_key') || import.meta.env.VITE_HF_API_KEY || '';

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    const apiKey = getGeminiKey();
    setIsSearching(true);
    setError('');
    setResult(null);

    try {
      let responseText = '';

      if (apiKey) {
        const genAI = new GoogleGenerativeAI(apiKey);
        const selectedModel = localStorage.getItem('gemini_model') || 'gemini-1.5-flash';
        const modelsToTry = [selectedModel, 'gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-pro', 'gemini-pro'];
        
        let result;
        for (const modelName of modelsToTry) {
          try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const promptText = `Você é um assistente escolar chamado Anix IA. Usuário perguntou: "${query}". Responda com um JSON se for criar template { "type": "template", "title": "...", "bgColor": "...", "elements": [...] } ou apenas texto educativo. Não use blocos de código.`;
            result = await model.generateContent(promptText);
            if (result) {
              responseText = result.response.text().trim();
              break;
            }
          } catch (err) {
            console.error(`Gemini ${modelName} failed, trying next...`);
          }
        }
      }

      // Fallback para Hugging Face se Gemini falhar ou não tiver chave
      if (!responseText) {
        const hfKey = getHFKey();
        if (!hfKey) throw new Error('Configure a chave do Gemini ou da Hugging Face nas configurações.');

        const hfResponse = await fetch(
          "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
          {
            headers: { Authorization: `Bearer ${hfKey}`, "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify({ 
              inputs: `<s>[INST] Você é um assistente escolar chamado Anix IA. O usuário perguntou: "${query}". Responda de forma amigável. Se ele pedir para criar um panfleto/aviso, retorne APENAS um JSON: {"type":"template","title":"...","bgColor":"#ffffff","elements":[{"type":"text","content":"...","x":100,"y":100,"w":400,"h":100,"style":{"fontSize":"30px"}}]} [/INST]`,
              parameters: { max_new_tokens: 500, return_full_text: false }
            }),
          }
        );

        if (hfResponse.ok) {
          const hfData = await hfResponse.json();
          responseText = (Array.isArray(hfData) ? hfData[0].generated_text : hfData.generated_text) || '';
        } else {
          throw new Error('Falha tanto no Gemini quanto na Hugging Face.');
        }
      }

      try {
        const parsed = JSON.parse(responseText.substring(responseText.indexOf('{'), responseText.lastIndexOf('}') + 1));
        if (parsed.type === 'template') {
          setResult({ type: 'template', data: parsed });
        } else {
          setResult({ type: 'text', content: responseText });
        }
      } catch {
        setResult({ type: 'text', content: responseText });
      }

    } catch (err) {
      console.error('Search error:', err);
      setError('Erro ao processar busca: ' + err.message);
    } finally {
      setIsSearching(false);
    }
  };

  const generateImage = async () => {
    if (!query.trim()) return;
    const hfKey = getHFKey();
    if (!hfKey) {
      setError('Por favor, configure sua Hugging Face API Key para gerar imagens (⚙️).');
      return;
    }

    setIsGeneratingImage(true);
    setError('');

    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
        {
          headers: { 
            Authorization: `Bearer ${hfKey}`,
            "Content-Type": "application/json"
          },
          method: "POST",
          body: JSON.stringify({ inputs: query }),
        }
      );

      if (!response.ok) throw new Error("Erro na geração da imagem. Verifique sua chave HF.");

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setGeneratedImages([imageUrl, ...generatedImages]);
    } catch (err) {
      setError('Erro ao gerar imagem: ' + err.message);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const createSlideFromTemplate = (data) => {
    addSlide({
      name: data.title,
      bgColor: data.bgColor,
      elements: data.elements
    });
    alert('✅ Novo slide criado com base na sua solicitação!');
  };

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
        <div style={{ color: '#5f6368', cursor: 'pointer' }} title="Ferramentas"><Grid size={24} /></div>
        <div style={{ color: '#5f6368', cursor: 'pointer' }} title="Layouts"><Layout size={24} /></div>
        <div style={{ color: '#5f6368', cursor: 'pointer' }} title="Chat IA"><MessageSquare size={24} /></div>
      </aside>

      {/* Conteúdo Principal */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        
        {/* Header */}
        <header style={{ 
          height: '60px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '0 20px',
          flexShrink: 0
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
            <div style={{ cursor: 'pointer' }}>Tudo</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}><ImageIcon size={16} /> Imagens</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}><Video size={16} /> Vídeos</div>
          </div>
        </header>

        {/* Área de Busca */}
        <div style={{ 
          padding: '40px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          
          <div style={{ fontSize: '48px', fontWeight: '500', marginBottom: '30px', display: 'flex' }}>
            <span style={{ color: '#4285F4' }}>A</span>
            <span style={{ color: '#EA4335' }}>n</span>
            <span style={{ color: '#FBBC05' }}>i</span>
            <span style={{ color: '#4285F4' }}>x</span>
            <span style={{ color: '#34A853' }}> </span>
            <span style={{ color: '#EA4335' }}>I</span>
            <span style={{ color: '#4285F4' }}>A</span>
          </div>

          <form onSubmit={handleSearch} style={{ width: '100%', maxWidth: '780px', marginBottom: '30px' }}>
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
                placeholder="Peça para criar um panfleto, gere uma imagem ou tire dúvidas..."
                style={{ 
                  flex: 1, 
                  border: 'none', 
                  backgroundColor: 'transparent', 
                  fontSize: '16px', 
                  color: '#202124',
                  outline: 'none'
                }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button type="button" onClick={generateImage} disabled={isGeneratingImage || !query} style={{ background: 'none', border: 'none', color: '#1a73e8', cursor: 'pointer' }}>
                  {isGeneratingImage ? <Loader2 className="animate-spin" size={22} /> : <ImageIcon size={22} title="Gerar Imagem" />}
                </button>
                <button type="submit" disabled={isSearching || !query} style={{ background: 'none', border: 'none', color: '#1a73e8', cursor: 'pointer' }}>
                  {isSearching ? <Loader2 className="animate-spin" size={22} /> : <Send size={22} title="Buscar" />}
                </button>
              </div>
            </div>
          </form>

          {/* Sugestões */}
          {!result && generatedImages.length === 0 && (
            <div style={{ width: '100%', maxWidth: '780px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {suggestions.map((s, i) => (
                <div key={i} onClick={() => { setQuery(s.text); }} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '15px', 
                  color: '#5f6368', 
                  fontSize: '15px',
                  cursor: 'pointer',
                  padding: '12px 15px',
                  borderRadius: '12px',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #e8eaed'
                }}>
                  <div style={{ color: '#1a73e8' }}>{s.icon}</div>
                  {s.text}
                </div>
              ))}
            </div>
          )}

          {/* Resultados */}
          {error && <div style={{ color: '#d93025', padding: '15px', borderRadius: '8px', backgroundColor: '#fce8e6', maxWidth: '780px', width: '100%', marginBottom: '20px' }}>{error}</div>}

          <div style={{ width: '100%', maxWidth: '780px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {result && (
              <div style={{ padding: '20px', borderRadius: '12px', backgroundColor: '#f8f9fa', border: '1px solid #dadce0' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1a73e8', marginBottom: '15px' }}>
                  <Sparkles size={18} /> Resposta da IA
                </h3>
                {result.type === 'text' ? (
                  <p style={{ lineHeight: '1.6', color: '#3c4043', whiteSpace: 'pre-wrap' }}>{result.content}</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <p style={{ color: '#3c4043' }}>Gerei um template de slide para: <strong>{result.data.title}</strong></p>
                    <button 
                      onClick={() => createSlideFromTemplate(result.data)}
                      style={{ 
                        padding: '10px 20px', 
                        backgroundColor: '#1a73e8', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '8px', 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        alignSelf: 'flex-start',
                        fontWeight: '500'
                      }}
                    >
                      <Layers size={18} /> Criar Slide no Editor
                    </button>
                  </div>
                )}
              </div>
            )}

            {generatedImages.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                {generatedImages.map((img, idx) => (
                  <div key={idx} style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    <img src={img} alt="Gerada por IA" style={{ width: '100%', display: 'block' }} />
                    <a href={img} download={`anix_ia_${idx}.png`} style={{ position: 'absolute', bottom: '10px', right: '10px', backgroundColor: 'rgba(255,255,255,0.9)', padding: '5px', borderRadius: '50%', color: '#1a73e8' }}>
                      <Download size={16} />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </main>
    </div>
  );
};

export default AISearchPage;
