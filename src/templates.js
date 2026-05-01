const uuidv4 = () => `el-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

export const bgGallery = [
  // ── Gradientes Diversos / Premium ──
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1920", // Gradiente suave fluido
  "https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=1920", // Rosa/roxo suave
  "https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?q=80&w=1920", // Azul/rosa gradiente
  "https://images.unsplash.com/photo-1557683304-673a2704fc1c?q=80&w=1920", // Laranja/amarelo vibrante
  "https://images.unsplash.com/photo-1579546929662-711aa81148cf?q=80&w=1920", // Mesh colorido

  // ── Neutros Minimalistas / Texturas ──
  "https://images.unsplash.com/photo-1495195134817-a16f873c558a?q=80&w=1920", // Mármore claro
  "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=1920", // Papel dobrado minimalista
  "https://images.unsplash.com/photo-1600164318355-667cb7cd3b3d?q=80&w=1920", // Geometria branca
  "https://images.unsplash.com/photo-1507608158173-1dcec673a2e5?q=80&w=1920", // Seda branca suave
  
  // ── Arquitetura e Paisagem Clean ──
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1920", // Prédio moderno
  "https://images.unsplash.com/photo-1516550893923-42d28e5677af?q=80&w=1920", // Parede cinza limpa
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1920", // Montanhas com neblina
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
  // ── Geométricos / Shapes ──
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
      { name: 'Infinito', svg: `<svg viewBox="0 0 150 60"><path d="M75,30 C75,30 60,5 35,5 C15,5 5,18 5,30 C5,42 15,55 35,55 C60,55 75,30 75,30 C75,30 90,5 115,5 C135,5 145,18 145,30 C145,42 135,55 115,55 C90,55 75,30 75,30Z" fill="none" stroke="currentColor" stroke-width="8"/></svg>` },
      { name: 'Faixa Diagonal', svg: `<svg viewBox="0 0 100 100"><polygon points="0,0 30,0 100,70 100,100 70,100 0,30" fill="currentColor"/></svg>` },
    ]
  },
  // ── Floral Premium ──
  {
    category: 'Floral Premium',
    items: [
      { name: 'Ramo Elegante', svg: `<svg viewBox="0 0 100 100"><path d="M20,90 Q40,50 80,10" fill="none" stroke="currentColor" stroke-width="3"/><path d="M30,75 C20,65 20,55 35,55 C45,55 50,65 30,75 Z" fill="currentColor"/><path d="M45,55 C35,45 35,35 50,35 C60,35 65,45 45,55 Z" fill="currentColor"/><path d="M60,35 C50,25 50,15 65,15 C75,15 80,25 60,35 Z" fill="currentColor"/><path d="M45,80 C55,90 65,90 65,75 C65,65 55,60 45,80 Z" fill="currentColor"/><path d="M60,60 C70,70 80,70 80,55 C80,45 70,40 60,60 Z" fill="currentColor"/><path d="M75,40 C85,50 95,50 95,35 C95,25 85,20 75,40 Z" fill="currentColor"/></svg>` },
      { name: 'Lótus Abstrato', svg: `<svg viewBox="0 0 100 100"><path d="M50,85 C20,70 10,40 15,20 C30,30 45,45 50,60 C55,45 70,30 85,20 C90,40 80,70 50,85 Z" fill="currentColor"/><path d="M50,75 C30,60 25,35 30,15 C40,25 45,40 50,50 C55,40 60,25 70,15 C75,35 70,60 50,75 Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M50,85 C50,85 45,10 50,5 C55,10 50,85 50,85 Z" fill="currentColor"/></svg>` },
      { name: 'Flor Minimalista', svg: `<svg viewBox="0 0 100 100"><path d="M50,90 C45,60 40,30 50,10 C60,30 55,60 50,90 Z" fill="currentColor" opacity="0.4"/><path d="M50,90 C45,60 40,30 50,10" fill="none" stroke="currentColor" stroke-width="2"/><path d="M50,40 C30,30 10,40 10,60 C30,70 45,60 50,40 Z" fill="currentColor" opacity="0.4"/><path d="M50,40 C30,30 10,40 10,60 C30,70 45,60 50,40" fill="none" stroke="currentColor" stroke-width="2"/><path d="M50,40 C70,30 90,40 90,60 C70,70 55,60 50,40 Z" fill="currentColor" opacity="0.4"/><path d="M50,40 C70,30 90,40 90,60 C70,70 55,60 50,40" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="50" cy="40" r="5" fill="currentColor"/></svg>` },
    ]
  },
  // ── Brush & Pinceladas Premium ──
  {
    category: 'Brush Premium',
    items: [
      { name: 'Pincelada Textura', svg: `<svg viewBox="0 0 200 60"><path d="M10,30 Q50,10 100,25 T190,30 Q195,45 150,45 T20,45 Z" fill="currentColor"/><path d="M5,25 L15,35 L10,25 Z M195,25 L185,35 L190,25 Z M50,12 L60,8 L65,15 Z M140,43 L150,48 L155,42 Z" fill="currentColor"/><path d="M15,32 Q60,18 100,28 T180,32" fill="none" stroke="#fff" stroke-width="2" opacity="0.3"/><path d="M25,38 Q70,25 110,35 T170,38" fill="none" stroke="#fff" stroke-width="1.5" opacity="0.2"/></svg>` },
      { name: 'Aquarela / Wash', svg: `<svg viewBox="0 0 200 100"><path d="M20,50 Q50,20 100,30 T180,40 Q190,70 150,80 T30,70 Q10,60 20,50 Z" fill="currentColor" opacity="0.4"/><path d="M30,55 Q60,25 110,35 T170,45 Q180,65 140,75 T40,65 Q20,55 30,55 Z" fill="currentColor" opacity="0.6"/><path d="M40,60 Q70,30 120,40 T160,50 Q170,60 130,70 T50,60 Q30,50 40,60 Z" fill="currentColor" opacity="0.8"/></svg>` },
      { name: 'Splatter', svg: `<svg viewBox="0 0 100 100"><path d="M50,20 C70,10 85,30 80,50 C95,60 70,90 50,80 C30,90 5,60 20,50 C15,30 30,10 50,20 Z" fill="currentColor"/><circle cx="20" cy="20" r="5" fill="currentColor"/><circle cx="85" cy="25" r="3" fill="currentColor"/><circle cx="80" cy="80" r="6" fill="currentColor"/><circle cx="15" cy="75" r="4" fill="currentColor"/><circle cx="10" cy="40" r="2" fill="currentColor"/><circle cx="90" cy="60" r="2" fill="currentColor"/></svg>` },
      { name: 'Círculo Brush', svg: `<svg viewBox="0 0 100 100"><path d="M50,10 C75,10 90,25 90,50 C90,75 75,90 50,90 C25,90 10,75 10,50 C10,25 25,10 50,10" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="10 2 20 4 30 5 15 3 25"/><path d="M45,15 C65,12 85,25 85,45 C85,65 65,85 45,85 C25,85 15,65 15,45 C15,25 25,15 45,15" fill="none" stroke="currentColor" stroke-width="4" opacity="0.5"/></svg>` },
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
