const uuidv4 = () => `el-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

export const bgGallery = [
  "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1920", // Gradiente roxo
  "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1920", // Gradiente colorido
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1920", // Montanhas estrelas
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1920", // Abstrato líquido
  "https://images.unsplash.com/photo-1553095066-5014bc7b7f2d?q=80&w=1920"  // Parede escura texturizada
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
