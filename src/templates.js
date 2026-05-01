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
  // ── Memphis Style (Novo) ──
  {
    category: 'Memphis & Moderno',
    items: [
      { name: 'Blob Orgânico', svg: `<svg viewBox="0 0 200 200"><path d="M44.7,-76.4C58.3,-69.2,69.8,-57.3,77.5,-43.3C85.2,-29.3,89.1,-13.2,88.4,2.5C87.7,18.2,82.4,33.5,73.5,46.5C64.6,59.5,52.1,70.2,38.1,76.5C24.1,82.8,8.6,84.7,-6.7,83.1C-22,81.5,-37.1,76.4,-50,68.1C-62.9,59.8,-73.6,48.3,-79.6,34.8C-85.6,21.3,-86.9,5.8,-84.4,-9C-81.9,-23.8,-75.6,-37.9,-65.8,-49.6C-56,-61.3,-42.7,-70.6,-28.9,-77.1C-15.1,-83.6,-0.8,-87.3,14.2,-85.2C29.2,-83.1,44.7,-76.4,44.7,-76.4Z" transform="translate(100 100)" fill="currentColor"/></svg>` },
      { name: 'Grid de Pontos', svg: `<svg viewBox="0 0 100 100"><circle cx="10" cy="10" r="2" fill="currentColor"/><circle cx="30" cy="10" r="2" fill="currentColor"/><circle cx="50" cy="10" r="2" fill="currentColor"/><circle cx="70" cy="10" r="2" fill="currentColor"/><circle cx="90" cy="10" r="2" fill="currentColor"/><circle cx="10" cy="30" r="2" fill="currentColor"/><circle cx="30" cy="30" r="2" fill="currentColor"/><circle cx="50" cy="30" r="2" fill="currentColor"/><circle cx="70" cy="30" r="2" fill="currentColor"/><circle cx="90" cy="30" r="2" fill="currentColor"/><circle cx="10" cy="50" r="2" fill="currentColor"/><circle cx="30" cy="50" r="2" fill="currentColor"/><circle cx="50" cy="50" r="2" fill="currentColor"/><circle cx="70" cy="50" r="2" fill="currentColor"/><circle cx="90" cy="50" r="2" fill="currentColor"/><circle cx="10" cy="70" r="2" fill="currentColor"/><circle cx="30" cy="70" r="2" fill="currentColor"/><circle cx="50" cy="70" r="2" fill="currentColor"/><circle cx="70" cy="70" r="2" fill="currentColor"/><circle cx="90" cy="70" r="2" fill="currentColor"/><circle cx="10" cy="90" r="2" fill="currentColor"/><circle cx="30" cy="90" r="2" fill="currentColor"/><circle cx="50" cy="90" r="2" fill="currentColor"/><circle cx="70" cy="90" r="2" fill="currentColor"/><circle cx="90" cy="90" r="2" fill="currentColor"/></svg>` },
      { name: 'ZigZag Largo', svg: `<svg viewBox="0 0 100 40"><path d="M0,20 L10,10 L20,20 L30,10 L40,20 L50,10 L60,20 L70,10 L80,20 L90,10 L100,20" fill="none" stroke="currentColor" stroke-width="4"/></svg>` },
      { name: 'Círculos Wireframe', svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-width="1" opacity="0.3"/><circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" stroke-width="1" opacity="0.5"/><circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" stroke-width="1" opacity="0.8"/><circle cx="50" cy="50" r="10" fill="currentColor"/></svg>` },
    ]
  },
  // ── Brush Premium (Melhorado) ──
  {
    category: 'Brush & Pinceladas',
    items: [
      { name: 'Pincelada Rústica', svg: `<svg viewBox="0 0 200 50"><path d="M5,25 Q40,5 80,20 T150,25 T195,20" fill="none" stroke="currentColor" stroke-width="12" stroke-linecap="round"/><path d="M10,28 Q45,8 85,23 T155,28 T190,23" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" opacity="0.5"/><path d="M15,22 Q50,2 90,17 T160,22 T185,17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.3"/></svg>` },
      { name: 'Pincelada Larga Plana', svg: `<svg viewBox="0 0 200 40"><rect x="0" y="10" width="200" height="20" rx="2" fill="currentColor"/><path d="M0,15 L200,15" fill="none" stroke="white" stroke-width="1" opacity="0.2"/><path d="M0,25 L200,25" fill="none" stroke="black" stroke-width="1" opacity="0.1"/></svg>` },
      { name: 'Brush Vertical', svg: `<svg viewBox="0 0 40 100"><path d="M20,5 Q35,40 20,70 T20,95" fill="none" stroke="currentColor" stroke-width="15" stroke-linecap="round"/><path d="M15,10 Q25,40 15,70 T15,90" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" opacity="0.4"/></svg>` },
    ]
  },
  // ── Ícones de Interface (Novo) ──
  {
    category: 'Ícones & UI',
    items: [
      { name: 'Pasta Arquivo', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>` },
      { name: 'Impressora', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>` },
      { name: 'Lupa Pesquisa', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>` },
      { name: 'Documento Texto', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>` },
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
