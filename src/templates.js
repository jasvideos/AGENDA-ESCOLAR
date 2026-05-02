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
  // ── Memphis Style ──
  {
    category: 'Memphis & Moderno',
    items: [
      { name: 'Blob Orgânico', svg: `<svg viewBox="0 0 200 200"><path d="M44.7,-76.4C58.3,-69.2,69.8,-57.3,77.5,-43.3C85.2,-29.3,89.1,-13.2,88.4,2.5C87.7,18.2,82.4,33.5,73.5,46.5C64.6,59.5,52.1,70.2,38.1,76.5C24.1,82.8,8.6,84.7,-6.7,83.1C-22,81.5,-37.1,76.4,-50,68.1C-62.9,59.8,-73.6,48.3,-79.6,34.8C-85.6,21.3,-86.9,5.8,-84.4,-9C-81.9,-23.8,-75.6,-37.9,-65.8,-49.6C-56,-61.3,-42.7,-70.6,-28.9,-77.1C-15.1,-83.6,-0.8,-87.3,14.2,-85.2C29.2,-83.1,44.7,-76.4,44.7,-76.4Z" transform="translate(100 100)" fill="currentColor"/></svg>` },
      { name: 'Grid de Pontos', svg: `<svg viewBox="0 0 100 100"><circle cx="10" cy="10" r="2" fill="currentColor"/><circle cx="30" cy="10" r="2" fill="currentColor"/><circle cx="50" cy="10" r="2" fill="currentColor"/><circle cx="70" cy="10" r="2" fill="currentColor"/><circle cx="90" cy="10" r="2" fill="currentColor"/><circle cx="10" cy="30" r="2" fill="currentColor"/><circle cx="30" cy="30" r="2" fill="currentColor"/><circle cx="50" cy="30" r="2" fill="currentColor"/><circle cx="70" cy="30" r="2" fill="currentColor"/><circle cx="90" cy="30" r="2" fill="currentColor"/><circle cx="10" cy="50" r="2" fill="currentColor"/><circle cx="30" cy="50" r="2" fill="currentColor"/><circle cx="50" cy="50" r="2" fill="currentColor"/><circle cx="70" cy="50" r="2" fill="currentColor"/><circle cx="90" cy="50" r="2" fill="currentColor"/><circle cx="10" cy="70" r="2" fill="currentColor"/><circle cx="30" cy="70" r="2" fill="currentColor"/><circle cx="50" cy="70" r="2" fill="currentColor"/><circle cx="70" cy="70" r="2" fill="currentColor"/><circle cx="90" cy="70" r="2" fill="currentColor"/><circle cx="10" cy="90" r="2" fill="currentColor"/><circle cx="30" cy="90" r="2" fill="currentColor"/><circle cx="50" cy="90" r="2" fill="currentColor"/><circle cx="70" cy="90" r="2" fill="currentColor"/><circle cx="90" cy="90" r="2" fill="currentColor"/></svg>` },
      { name: 'ZigZag Largo', svg: `<svg viewBox="0 0 100 40"><path d="M0,20 L10,10 L20,20 L30,10 L40,20 L50,10 L60,20 L70,10 L80,20 L90,10 L100,20" fill="none" stroke="currentColor" stroke-width="4"/></svg>` },
      { name: 'Círculos Wireframe', svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-width="1" opacity="0.3"/><circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" stroke-width="1" opacity="0.5"/><circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" stroke-width="1" opacity="0.8"/><circle cx="50" cy="50" r="10" fill="currentColor"/></svg>` },
      { name: 'Semicírculo', svg: `<svg viewBox="0 0 100 50"><path d="M100,50 A50,50 0 1,0 0,50 Z" fill="currentColor"/></svg>` },
      { name: 'Triângulo Vazado', svg: `<svg viewBox="0 0 100 100"><path d="M50,10 L90,90 L10,90 Z" fill="none" stroke="currentColor" stroke-width="4"/></svg>` },
      { name: 'Anel', svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-width="8"/><circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" stroke-width="2" opacity="0.5"/></svg>` },
      { name: 'Pílula', svg: `<svg viewBox="0 0 100 40"><rect x="10" y="5" width="80" height="30" rx="15" fill="currentColor"/></svg>` },
      { name: 'Onda Senoidal', svg: `<svg viewBox="0 0 100 40"><path d="M0,20 C20,0 30,40 50,20 C70,0 80,40 100,20" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg>` },
      { name: 'Estrela Memphis', svg: `<svg viewBox="0 0 100 100"><path d="M50,0 L60,40 L100,50 L60,60 L50,100 L40,60 L0,50 L40,40 Z" fill="currentColor"/></svg>` },
      { name: 'Cruzes Pattern', svg: `<svg viewBox="0 0 60 60"><path d="M10,5 L10,15 M5,10 L15,10 M40,5 L40,15 M35,10 L45,10 M10,35 L10,45 M5,40 L15,40 M40,35 L40,45 M35,40 L45,40" fill="none" stroke="currentColor" stroke-width="2"/></svg>` },
      { name: 'Meio Anel', svg: `<svg viewBox="0 0 100 100"><path d="M90,50 A40,40 0 0,1 10,50" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round"/></svg>` },
      { name: 'Donut Duplo', svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-width="10"/><circle cx="50" cy="50" r="15" fill="currentColor"/></svg>` },
      { name: 'Linhas Diagonais', svg: `<svg viewBox="0 0 60 60"><line x1="0" y1="10" x2="10" y2="0" stroke="currentColor" stroke-width="2"/><line x1="0" y1="30" x2="30" y2="0" stroke="currentColor" stroke-width="2"/><line x1="0" y1="50" x2="50" y2="0" stroke="currentColor" stroke-width="2"/><line x1="20" y1="60" x2="60" y2="20" stroke="currentColor" stroke-width="2"/><line x1="40" y1="60" x2="60" y2="40" stroke="currentColor" stroke-width="2"/></svg>` },
      { name: 'Explosão Line', svg: `<svg viewBox="0 0 100 100"><line x1="50" y1="10" x2="50" y2="30" stroke="currentColor" stroke-width="4"/><line x1="50" y1="70" x2="50" y2="90" stroke="currentColor" stroke-width="4"/><line x1="10" y1="50" x2="30" y2="50" stroke="currentColor" stroke-width="4"/><line x1="70" y1="50" x2="90" y2="50" stroke="currentColor" stroke-width="4"/><line x1="22" y1="22" x2="35" y2="35" stroke="currentColor" stroke-width="4"/><line x1="65" y1="65" x2="78" y2="78" stroke="currentColor" stroke-width="4"/><line x1="22" y1="78" x2="35" y2="65" stroke="currentColor" stroke-width="4"/><line x1="65" y1="35" x2="78" y2="22" stroke="currentColor" stroke-width="4"/></svg>` },
      { name: 'Cubo Isométrico', svg: `<svg viewBox="0 0 100 100"><path d="M50,20 L80,35 L80,65 L50,80 L20,65 L20,35 Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M20,35 L50,50 L80,35 M50,50 L50,80" fill="none" stroke="currentColor" stroke-width="2"/></svg>` },
      { name: 'Arco Moderno', svg: `<svg viewBox="0 0 100 100"><path d="M10,90 Q50,10 90,90" fill="none" stroke="currentColor" stroke-width="12" stroke-linecap="round"/><path d="M25,90 Q50,40 75,90" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" opacity="0.5"/></svg>` },
      { name: 'Retângulo 3D', svg: `<svg viewBox="0 0 100 100"><rect x="10" y="20" width="60" height="40" fill="none" stroke="currentColor" stroke-width="4"/><rect x="30" y="40" width="60" height="40" fill="currentColor" opacity="0.3"/><line x1="10" y1="20" x2="30" y2="40" stroke="currentColor" stroke-width="2"/><line x1="70" y1="20" x2="90" y2="40" stroke="currentColor" stroke-width="2"/><line x1="10" y1="60" x2="30" y2="80" stroke="currentColor" stroke-width="2"/><line x1="70" y1="60" x2="90" y2="80" stroke="currentColor" stroke-width="2"/></svg>` },
      { name: 'Espiral', svg: `<svg viewBox="0 0 100 100"><path d="M50,50 C60,40 60,30 50,20 C30,10 10,30 10,50 C10,80 40,90 60,90 C90,90 95,60 90,40 C85,20 60,5 40,10" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>` },
      { name: 'Checkered', svg: `<svg viewBox="0 0 60 60"><rect x="0" y="0" width="20" height="20" fill="currentColor"/><rect x="40" y="0" width="20" height="20" fill="currentColor"/><rect x="20" y="20" width="20" height="20" fill="currentColor"/><rect x="0" y="40" width="20" height="20" fill="currentColor"/><rect x="40" y="40" width="20" height="20" fill="currentColor"/></svg>` },
      { name: 'Blob Liquid 1', svg: `<svg viewBox="0 0 200 200"><path d="M43,-62.1C55.7,-57.1,65.9,-44.7,72.9,-30.5C79.8,-16.3,83.5,-0.4,81,14.6C78.4,29.7,69.5,43.9,57.7,53.8C45.9,63.7,31.2,69.3,16.5,71.2C1.7,73.1,-13.2,71.3,-27.2,66.1C-41.2,60.9,-54.3,52.3,-63,40.4C-71.7,28.5,-76,13.2,-74.6,-1.5C-73.3,-16.2,-66.2,-30.3,-56,-41.1C-45.7,-51.9,-32.2,-59.3,-18.8,-63.9C-5.5,-68.5,7.7,-70.2,21.5,-68.1C35.3,-66,43,-62.1,43,-62.1Z" transform="translate(100 100)" fill="currentColor"/></svg>` },
      { name: 'Blob Liquid 2', svg: `<svg viewBox="0 0 200 200"><path d="M38.1,-52.3C49.1,-43.7,57.5,-32.2,63.8,-18.8C70.1,-5.5,74.3,9.7,70.5,23.1C66.8,36.5,55.1,48.1,41.4,56.1C27.7,64.1,12.1,68.6,-2.8,72.4C-17.7,76.3,-32,79.5,-44.6,74.4C-57.2,69.4,-68.2,56,-73.4,41C-78.6,26,-78.1,9.4,-75,-6.4C-71.9,-22.2,-66.3,-37.2,-55.3,-45.8C-44.4,-54.5,-28.1,-56.9,-13.4,-58.5C1.3,-60.1,16,-61,38.1,-52.3Z" transform="translate(100 100)" fill="currentColor"/></svg>` },
      { name: 'Grid Isométrico', svg: `<svg viewBox="0 0 100 100"><path d="M0,20 L100,70 M0,40 L100,90 M0,60 L100,110 M20,0 L20,100 M40,0 L40,100 M60,0 L60,100 M80,0 L80,100" fill="none" stroke="currentColor" stroke-width="0.5" opacity="0.3"/></svg>` },
      { name: 'Círculos Concent.', svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" stroke-width="2"/></svg>` },
      { name: 'Triângulos Agrup.', svg: `<svg viewBox="0 0 100 100"><path d="M10,90 L30,50 L50,90 Z" fill="currentColor"/><path d="M40,90 L60,50 L80,90 Z" fill="currentColor" opacity="0.6"/><path d="M70,90 L90,50 L110,90 Z" fill="currentColor" opacity="0.3"/></svg>` },
      { name: 'Linhas Onduladas', svg: `<svg viewBox="0 0 100 60"><path d="M0,10 Q25,30 50,10 T100,10" fill="none" stroke="currentColor" stroke-width="2"/><path d="M0,25 Q25,45 50,25 T100,25" fill="none" stroke="currentColor" stroke-width="2"/><path d="M0,40 Q25,60 50,40 T100,40" fill="none" stroke="currentColor" stroke-width="2"/></svg>` },
      { name: 'Meia Lua', svg: `<svg viewBox="0 0 100 100"><path d="M50,10 A40,40 0 1,0 50,90 A30,30 0 1,1 50,10 Z" fill="currentColor"/></svg>` },
      { name: 'X Moderno', svg: `<svg viewBox="0 0 100 100"><path d="M20,20 L80,80 M80,20 L20,80" fill="none" stroke="currentColor" stroke-width="12" stroke-linecap="round"/></svg>` },
      { name: 'Anéis Entrelaç.', svg: `<svg viewBox="0 0 100 100"><circle cx="40" cy="50" r="30" fill="none" stroke="currentColor" stroke-width="5"/><circle cx="60" cy="50" r="30" fill="none" stroke="currentColor" stroke-width="5" opacity="0.5"/></svg>` },
      { name: 'L raio', svg: `<svg viewBox="0 0 100 100"><path d="M20,10 L20,80 L80,80" fill="none" stroke="currentColor" stroke-width="10" stroke-linecap="round"/></svg>` },
    ]
  },
  // ── Brush Premium ──
  {
    category: 'Brush & Pinceladas',
    items: [
      { name: 'Pincelada Rústica', svg: `<svg viewBox="0 0 200 50"><path d="M5,25 Q40,5 80,20 T150,25 T195,20" fill="none" stroke="currentColor" stroke-width="12" stroke-linecap="round"/><path d="M10,28 Q45,8 85,23 T155,28 T190,23" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" opacity="0.5"/><path d="M15,22 Q50,2 90,17 T160,22 T185,17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.3"/></svg>` },
      { name: 'Pincelada Larga Plana', svg: `<svg viewBox="0 0 200 40"><rect x="0" y="10" width="200" height="20" rx="2" fill="currentColor"/><path d="M0,15 L200,15" fill="none" stroke="white" stroke-width="1" opacity="0.2"/><path d="M0,25 L200,25" fill="none" stroke="black" stroke-width="1" opacity="0.1"/></svg>` },
      { name: 'Brush Vertical', svg: `<svg viewBox="0 0 40 100"><path d="M20,5 Q35,40 20,70 T20,95" fill="none" stroke="currentColor" stroke-width="15" stroke-linecap="round"/><path d="M15,10 Q25,40 15,70 T15,90" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" opacity="0.4"/></svg>` },
      { name: 'Mancha Splash', svg: `<svg viewBox="0 0 100 100"><path d="M50,10 Q60,30 80,40 T90,70 T60,90 T20,70 T10,40 T50,10" fill="currentColor"/><circle cx="30" cy="20" r="5" fill="currentColor" opacity="0.6"/><circle cx="70" cy="80" r="3" fill="currentColor" opacity="0.8"/></svg>` },
      { name: 'Pincel Suave', svg: `<svg viewBox="0 0 100 30"><path d="M0,15 C30,5 70,25 100,15" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round" opacity="0.8"/></svg>` },
      { name: 'Brush Duplo', svg: `<svg viewBox="0 0 100 40"><path d="M5,15 Q50,5 95,15" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round"/><path d="M5,25 Q50,35 95,25" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" opacity="0.5"/></svg>` },
    ]
  },
  // ── Ícones de Interface ──
  {
    category: 'Ícones & UI',
    items: [
      { name: 'Pasta Arquivo', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>` },
      { name: 'Impressora', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>` },
      { name: 'Lupa Pesquisa', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>` },
      { name: 'Documento Texto', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>` },
      { name: 'Configurações', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1V15a2 2 0 0 1-2-2 2 2 0 0 1 2-2v-.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1V11a2 2 0 0 1 2 2 2 2 0 0 1-2 2v.09a1.65 1.65 0 0 0-1.51 1z"/></svg>` },
      { name: 'Câmera', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>` },
      { name: 'Mensagem', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>` },
      { name: 'Estrela UI', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>` },
    ]
  },
  // ── Floral Premium ──
  {
    category: 'Floral & Natureza',
    items: [
      { name: 'Ramo Elegante', svg: `<svg viewBox="0 0 100 100"><path d="M20,90 Q40,50 80,10" fill="none" stroke="currentColor" stroke-width="3"/><path d="M30,75 C20,65 20,55 35,55 C45,55 50,65 30,75 Z" fill="currentColor"/><path d="M45,55 C35,45 35,35 50,35 C60,35 65,45 45,55 Z" fill="currentColor"/><path d="M60,35 C50,25 50,15 65,15 C75,15 80,25 60,35 Z" fill="currentColor"/><path d="M45,80 C55,90 65,90 65,75 C65,65 55,60 45,80 Z" fill="currentColor"/><path d="M60,60 C70,70 80,70 80,55 C80,45 70,40 60,60 Z" fill="currentColor"/><path d="M75,40 C85,50 95,50 95,35 C95,25 85,20 75,40 Z" fill="currentColor"/></svg>` },
      { name: 'Lótus Abstrato', svg: `<svg viewBox="0 0 100 100"><path d="M50,85 C20,70 10,40 15,20 C30,30 45,45 50,60 C55,45 70,30 85,20 C90,40 80,70 50,85 Z" fill="currentColor"/><path d="M50,75 C30,60 25,35 30,15 C40,25 45,40 50,50 C55,40 60,25 70,15 C75,35 70,60 50,75 Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M50,85 C50,85 45,10 50,5 C55,10 50,85 50,85 Z" fill="currentColor"/></svg>` },
      { name: 'Flor Minimalista', svg: `<svg viewBox="0 0 100 100"><path d="M50,90 C45,60 40,30 50,10 C60,30 55,60 50,90 Z" fill="currentColor" opacity="0.4"/><path d="M50,90 C45,60 40,30 50,10" fill="none" stroke="currentColor" stroke-width="2"/><path d="M50,40 C30,30 10,40 10,60 C30,70 45,60 50,40 Z" fill="currentColor" opacity="0.4"/><path d="M50,40 C30,30 10,40 10,60 C30,70 45,60 50,40" fill="none" stroke="currentColor" stroke-width="2"/><path d="M50,40 C70,30 90,40 90,60 C70,70 55,60 50,40 Z" fill="currentColor" opacity="0.4"/><path d="M50,40 C70,30 90,40 90,60 C70,70 55,60 50,40" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="50" cy="40" r="5" fill="currentColor"/></svg>` },
      { name: 'Folha de Palmeira', svg: `<svg viewBox="0 0 100 100"><path d="M50,100 L50,10 Q20,30 10,60 Q20,50 50,40 Q80,50 90,60 Q80,30 50,10" fill="currentColor"/><path d="M50,100 L50,10" fill="none" stroke="white" stroke-width="1" opacity="0.3"/></svg>` },
      { name: 'Montanha', svg: `<svg viewBox="0 0 100 60"><path d="M10,60 L50,10 L90,60 Z" fill="currentColor"/><path d="M50,10 L70,35 L55,45 L65,60 L35,60 L45,45 L30,35 Z" fill="white" opacity="0.3"/></svg>` },
      { name: 'Sol / Brilho', svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="20" fill="currentColor"/><path d="M50,5 L50,25 M50,75 L50,95 M5,50 L25,50 M75,50 L95,50 M18,18 L32,32 M68,68 L82,82 M18,82 L32,68 M68,32 L82,18" fill="none" stroke="currentColor" stroke-width="4"/></svg>` },
    ]
  },
];

export const slideTemplates = [
      {
        name: "Aviso Importante",
        bgColor: "#ef4444",
        bgImage: null,
        elements: [
          { id: uuidv4(), type: 'text', content: 'AVISO IMPORTANTE', x: 30, y: 80, w: 900, h: 120, style: { fontSize: '72px', fontWeight: 'bold', color: '#ffffff', textAlign: 'center', animation: 'slideInUp' } },
          { id: uuidv4(), type: 'text', content: 'Não haverá aula nesta sexta-feira devido ao feriado nacional.', x: 80, y: 280, w: 800, h: 150, style: { fontSize: '40px', color: '#ffffff', textAlign: 'center', animation: 'fadeIn' } }
        ]
      },
      {
        name: "Apresentação Título",
        bgColor: "#111827",
        bgImage: bgGallery[0],
        bgOpacity: 0.8,
        elements: [
          { id: uuidv4(), type: 'text', content: 'TÍTULO DA APRESENTAÇÃO', x: 80, y: 200, w: 800, h: 120, style: { fontSize: '72px', fontWeight: 'bold', color: '#ffffff', textAlign: 'center', animation: 'zoomIn' } },
          { id: uuidv4(), type: 'text', content: 'Subtítulo incrível aqui para chamar a atenção', x: 80, y: 340, w: 800, h: 60, style: { fontSize: '30px', color: '#a78bfa', textAlign: 'center', animation: 'fadeIn' } }
        ]
      },
      {
        name: "Frase do Dia",
        bgColor: "#000000",
        bgImage: bgGallery[4],
        bgOpacity: 0.5,
        elements: [
          { id: uuidv4(), type: 'text', content: '"A educação é a arma mais poderosa que você pode usar para mudar o mundo."', x: 80, y: 150, w: 800, h: 200, style: { fontSize: '48px', fontFamily: 'Playfair Display', color: '#ffffff', textAlign: 'center', animation: 'fadeIn' } },
          { id: uuidv4(), type: 'text', content: '- Nelson Mandela', x: 80, y: 400, w: 800, h: 60, style: { fontSize: '24px', color: '#9ca3af', textAlign: 'center', animation: 'slideInUp' } }
        ]
      }
];
