const uuidv4 = () => `el-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

export const bgGallery = [
  // Gradientes abstratos
  "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1920",
  "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1920",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1920",
  "https://images.unsplash.com/photo-1553095066-5014bc7b7f2d?q=80&w=1920",
  // Natureza / Paisagens
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1920",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1920",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1920",
  "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?q=80&w=1920",
  // Tecnologia / Escuro
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1920",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1920",
  "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1920",
  // Urbano / Arquitetura
  "https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=1920",
  "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=1920",
  // Texturas
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1920",
  "https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=1920",
  "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1920",
];

// ── Decorative SVG elements for the repository ──────────────────────────────
export const decorativeElements = [
  // ── Estrelas / Stars ──
  {
    category: 'Estrelas',
    items: [
      { name: 'Estrela 5pts', svg: `<svg viewBox="0 0 100 100"><polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill="currentColor"/></svg>` },
      { name: 'Estrela 6pts', svg: `<svg viewBox="0 0 100 100"><polygon points="50,5 61,25 84,15 74,38 95,50 74,62 84,85 61,75 50,95 39,75 16,85 26,62 5,50 26,38 16,15 39,25" fill="currentColor"/></svg>` },
      { name: 'Estrela 4pts', svg: `<svg viewBox="0 0 100 100"><polygon points="50,5 58,42 95,50 58,58 50,95 42,58 5,50 42,42" fill="currentColor"/></svg>` },
      { name: 'Estrela Dupla', svg: `<svg viewBox="0 0 100 100"><polygon points="50,10 55,45 90,50 55,55 50,90 45,55 10,50 45,45" fill="currentColor" opacity="0.9"/><polygon points="50,25 53,47 75,50 53,53 50,75 47,53 25,50 47,47" fill="currentColor" opacity="0.5"/></svg>` },
    ]
  },
  // ── Círculos / Circles ──
  {
    category: 'Círculos',
    items: [
      { name: 'Círculo Sólido', svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="currentColor"/></svg>` },
      { name: 'Anel', svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="8"/></svg>` },
      { name: 'Círculos Concêntricos', svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="50" cy="50" r="33" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="50" cy="50" r="20" fill="currentColor"/></svg>` },
      { name: 'Meia Lua', svg: `<svg viewBox="0 0 100 100"><path d="M50,10 A40,40 0 1,1 50,90 A25,25 0 1,0 50,10Z" fill="currentColor"/></svg>` },
    ]
  },
  // ── Ondas / Waves ──
  {
    category: 'Ondas',
    items: [
      { name: 'Onda Suave', svg: `<svg viewBox="0 0 200 80"><path d="M0,40 C30,10 70,70 100,40 C130,10 170,70 200,40 L200,80 L0,80Z" fill="currentColor"/></svg>` },
      { name: 'Onda Tripla', svg: `<svg viewBox="0 0 200 80"><path d="M0,50 C25,20 50,80 75,50 C100,20 125,80 150,50 C175,20 190,80 200,50" fill="none" stroke="currentColor" stroke-width="5"/></svg>` },
      { name: 'Zig-Zag', svg: `<svg viewBox="0 0 200 60"><polyline points="0,30 25,5 50,30 75,5 100,30 125,5 150,30 175,5 200,30" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/></svg>` },
      { name: 'Espiral', svg: `<svg viewBox="0 0 100 100"><path d="M50,50 m0,-35 a35,35 0 1,1 -0.1,0 m0,10 a25,25 0 1,0 0.1,0 m0,-10 a15,15 0 1,1 -0.1,0" fill="none" stroke="currentColor" stroke-width="4"/></svg>` },
    ]
  },
  // ── Triângulos / Shapes ──
  {
    category: 'Geométricos',
    items: [
      { name: 'Triângulo', svg: `<svg viewBox="0 0 100 100"><polygon points="50,5 95,90 5,90" fill="currentColor"/></svg>` },
      { name: 'Triângulo Vazio', svg: `<svg viewBox="0 0 100 100"><polygon points="50,5 95,90 5,90" fill="none" stroke="currentColor" stroke-width="6"/></svg>` },
      { name: 'Losango', svg: `<svg viewBox="0 0 100 100"><polygon points="50,5 95,50 50,95 5,50" fill="currentColor"/></svg>` },
      { name: 'Hexágono', svg: `<svg viewBox="0 0 100 100"><polygon points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5" fill="currentColor"/></svg>` },
      { name: 'Cruz', svg: `<svg viewBox="0 0 100 100"><rect x="38" y="5" width="24" height="90" rx="4" fill="currentColor"/><rect x="5" y="38" width="90" height="24" rx="4" fill="currentColor"/></svg>` },
      { name: 'Seta', svg: `<svg viewBox="0 0 100 100"><polygon points="10,35 60,35 60,15 90,50 60,85 60,65 10,65" fill="currentColor"/></svg>` },
    ]
  },
  // ── Rabiscos / Doodles ──
  {
    category: 'Rabiscos',
    items: [
      { name: 'Coração', svg: `<svg viewBox="0 0 100 100"><path d="M50,85 C50,85 10,60 10,35 C10,20 20,10 35,10 C42,10 48,13 50,17 C52,13 58,10 65,10 C80,10 90,20 90,35 C90,60 50,85 50,85Z" fill="currentColor"/></svg>` },
      { name: 'Relâmpago', svg: `<svg viewBox="0 0 100 100"><polygon points="60,5 25,55 50,55 40,95 75,45 50,45" fill="currentColor"/></svg>` },
      { name: 'Nuvem', svg: `<svg viewBox="0 0 120 80"><path d="M25,65 C10,65 5,55 5,47 C5,38 12,31 22,30 C22,17 32,8 45,8 C55,8 63,14 66,23 C70,20 75,18 80,18 C95,18 108,30 108,45 C108,58 98,65 85,65Z" fill="currentColor"/></svg>` },
      { name: 'Flor', svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="12" fill="currentColor"/><ellipse cx="50" cy="20" rx="10" ry="18" fill="currentColor" opacity="0.7"/><ellipse cx="50" cy="80" rx="10" ry="18" fill="currentColor" opacity="0.7"/><ellipse cx="20" cy="50" rx="18" ry="10" fill="currentColor" opacity="0.7"/><ellipse cx="80" cy="50" rx="18" ry="10" fill="currentColor" opacity="0.7"/><ellipse cx="28" cy="28" rx="10" ry="18" fill="currentColor" opacity="0.5" transform="rotate(45,28,28)"/><ellipse cx="72" cy="28" rx="10" ry="18" fill="currentColor" opacity="0.5" transform="rotate(-45,72,28)"/><ellipse cx="28" cy="72" rx="10" ry="18" fill="currentColor" opacity="0.5" transform="rotate(-45,28,72)"/><ellipse cx="72" cy="72" rx="10" ry="18" fill="currentColor" opacity="0.5" transform="rotate(45,72,72)"/></svg>` },
      { name: 'Infinito', svg: `<svg viewBox="0 0 150 60"><path d="M75,30 C75,30 60,5 35,5 C15,5 5,18 5,30 C5,42 15,55 35,55 C60,55 75,30 75,30 C75,30 90,5 115,5 C135,5 145,18 145,30 C145,42 135,55 115,55 C90,55 75,30 75,30Z" fill="none" stroke="currentColor" stroke-width="8"/></svg>` },
      { name: 'Faixa Diagonal', svg: `<svg viewBox="0 0 100 100"><polygon points="0,0 30,0 100,70 100,100 70,100 0,30" fill="currentColor"/></svg>` },
    ]
  },
  // ── Linhas / Lines ──
  {
    category: 'Linhas',
    items: [
      { name: 'Linha Simples', svg: `<svg viewBox="0 0 200 20"><line x1="0" y1="10" x2="200" y2="10" stroke="currentColor" stroke-width="6" stroke-linecap="round"/></svg>` },
      { name: 'Linha Dupla', svg: `<svg viewBox="0 0 200 30"><line x1="0" y1="8" x2="200" y2="8" stroke="currentColor" stroke-width="4"/><line x1="0" y1="22" x2="200" y2="22" stroke="currentColor" stroke-width="4"/></svg>` },
      { name: 'Tracejado', svg: `<svg viewBox="0 0 200 20"><line x1="0" y1="10" x2="200" y2="10" stroke="currentColor" stroke-width="6" stroke-dasharray="20,10" stroke-linecap="round"/></svg>` },
      { name: 'Pontilhado', svg: `<svg viewBox="0 0 200 20"><line x1="0" y1="10" x2="200" y2="10" stroke="currentColor" stroke-width="8" stroke-dasharray="2,12" stroke-linecap="round"/></svg>` },
    ]
  },
  // ── Floral ──
  {
    category: 'Floral',
    items: [
      { name: 'Ramo Folhas', svg: `<svg viewBox="0 0 100 100"><path d="M50,90 Q45,50 15,10 Q35,20 50,50 Q65,20 85,10 Q55,50 50,90 Z" fill="currentColor"/><path d="M50,90 Q40,40 10,30 Q30,40 50,60 Q70,40 90,30 Q60,40 50,90 Z" fill="currentColor"/></svg>` },
      { name: 'Folha', svg: `<svg viewBox="0 0 100 100"><path d="M50,90 C50,90 10,60 10,20 C30,10 70,10 90,20 C90,60 50,90 50,90 Z" fill="currentColor"/><path d="M50,20 L50,90" fill="none" stroke="#000" stroke-width="2" opacity="0.2"/></svg>` },
      { name: 'Broto', svg: `<svg viewBox="0 0 100 100"><path d="M50,90 Q50,40 30,20 Q50,30 50,60 Q50,30 70,20 Q50,40 50,90 Z" fill="currentColor"/></svg>` },
    ]
  },
  // ── Pinceladas & Brush ──
  {
    category: 'Pinceladas & Brush',
    items: [
      { name: 'Pincelada Larga', svg: `<svg viewBox="0 0 200 60"><path d="M10,30 C30,10 70,20 100,25 C130,30 170,10 190,30 C195,35 190,45 180,45 C150,45 130,35 100,35 C70,35 40,45 20,40 C10,35 5,35 10,30 Z" fill="currentColor"/></svg>` },
      { name: 'Mancha Tinta', svg: `<svg viewBox="0 0 100 100"><path d="M50,10 C70,5 90,20 95,40 C100,60 85,85 65,95 C45,100 20,90 10,70 C0,50 15,25 35,15 C40,10 45,10 50,10 Z" fill="currentColor"/></svg>` },
      { name: 'Brush Curvo', svg: `<svg viewBox="0 0 200 80"><path d="M10,70 Q50,10 100,20 T190,50 Q180,60 160,50 T80,30 Q40,20 15,75 Z" fill="currentColor"/></svg>` },
    ]
  },
];

export const slideTemplates = [
  {
    name: "Aviso Importante",
    bgColor: "#ef4444",
    bgImage: null,
    elements: [
      { id: uuidv4(), type: 'text', content: 'AVISO IMPORTANTE', x: 0, y: 100, w: 1000, h: 100, style: { fontSize: '64px', fontWeight: 'bold', color: '#ffffff', textAlign: 'center', animation: 'slideInUp' } },
      { id: uuidv4(), type: 'text', content: 'Não haverá aula nesta sexta-feira devido ao feriado nacional.', x: 0, y: 300, w: 1000, h: 100, style: { fontSize: '40px', color: '#ffffff', textAlign: 'center', animation: 'fadeIn' } }
    ]
  },
  {
    name: "Apresentação Título",
    bgColor: "#111827",
    bgImage: bgGallery[0],
    bgOpacity: 0.8,
    elements: [
      { id: uuidv4(), type: 'text', content: 'TÍTULO DA APRESENTAÇÃO', x: 0, y: 250, w: 1000, h: 100, style: { fontSize: '72px', fontWeight: 'bold', color: '#ffffff', textAlign: 'center', animation: 'zoomIn' } },
      { id: uuidv4(), type: 'text', content: 'Subtítulo incrível aqui para chamar a atenção', x: 0, y: 360, w: 1000, h: 50, style: { fontSize: '30px', color: '#a78bfa', textAlign: 'center', animation: 'fadeIn' } }
    ]
  },
  {
    name: "Frase do Dia",
    bgColor: "#000000",
    bgImage: bgGallery[4],
    bgOpacity: 0.5,
    elements: [
      { id: uuidv4(), type: 'text', content: '"A educação é a arma mais poderosa que você pode usar para mudar o mundo."', x: 100, y: 200, w: 800, h: 200, style: { fontSize: '48px', fontFamily: 'Playfair Display', color: '#ffffff', textAlign: 'center', animation: 'fadeIn' } },
      { id: uuidv4(), type: 'text', content: '- Nelson Mandela', x: 100, y: 450, w: 800, h: 50, style: { fontSize: '24px', color: '#9ca3af', textAlign: 'center', animation: 'slideInUp' } }
    ]
  }
];
