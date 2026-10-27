/* ==========================================================
   Catálogo — edite aqui produtos, preços, cores e fotos.
   variants: [nome da cor, cor da bolinha, arquivo em /fotos (sem .webp)]
   tags: "novo" | "best" | "destaque"
   ⚠ PREÇOS PROVISÓRIOS — confirmar com a loja
   ========================================================== */
const ADULT = ["P", "M", "G", "GG"];
const KIDS = ["2", "4", "6", "8", "10", "12", "14"];
const ALL = [...KIDS, ...ADULT];
const ONE = ["Único"];

const PRODUCTS = [
  {
    id: 1, name: "Kit Ballet Preto & Rosa", cat: "Kits", line: "Kit completo", price: 189.9, sizes: KIDS, tags: ["best", "destaque"],
    variants: [["Preto e rosa", "#1d1f2e", "kit-ballet-preto-rosa"]],
    desc: "Collant manga curta preto, saia envelope rosa, meia-calça, sapatilha meia ponta, faixa, scrunchie e redinha de coque. Tudo pronto para a primeira aula.",
  },
  {
    id: 2, name: "Kit Ballet Preto", cat: "Kits", line: "Kit completo", price: 189.9, sizes: KIDS, tags: ["destaque"],
    variants: [["Preto", "#2e3048", "kit-ballet-preto"]],
    desc: "Collant manga curta e saia envelope pretos, com meia-calça rosa, sapatilha, faixa, scrunchie e redinha de coque.",
  },
  {
    id: 3, name: "Kit Jazz", cat: "Kits", line: "Kit completo", price: 99.9, sizes: KIDS, tags: ["novo"],
    variants: [["Preto", "#1f1a1c", "kit-jazz"]],
    desc: "Collant regata, short de jazz e scrunchie na mesma cor. O combo certo para as aulas de jazz.",
  },
  {
    id: 4, name: "Collant Regata", cat: "Ballet", line: "Básicos", price: 49.9, sizes: ALL, tags: ["best"],
    variants: [["Preto", "#1f1a1c", "collant-regata-preto"], ["Rosa", "#f4a7c0", "collant-regata-rosa"]],
    desc: "Alça larga, decote redondo e tecido com elasticidade que acompanha cada movimento. O básico de toda bailarina.",
  },
  {
    id: 5, name: "Casaquinho Transpassado", cat: "Ballet", line: "Ballet e jazz", price: 79.9, sizes: ALL, tags: ["novo", "destaque"],
    variants: [["Rosa", "#f2b6c6", "casaquinho-rosa"], ["Preto", "#2a2426", "casaquinho-preto"]],
    desc: "Casaquinho de amarrar para aquecimento. Mantém o corpo quentinho sem atrapalhar os movimentos.",
  },
  {
    id: 6, name: "Saia Tutu de Tule", cat: "Ballet", line: "Ballet infantil", price: 89.9, sizes: KIDS, tags: ["novo"],
    variants: [["Rosa", "#f6c3d6", "saia-tutu-rosa"]],
    desc: "Tutu em camadas de tule com cós em malha macia. Para aulas, apresentações e muitas fotos.",
  },
  {
    id: 7, name: "Short de Jazz", cat: "Jazz", line: "Básicos", price: 39.9, sizes: ALL, tags: [],
    variants: [["Grafite", "#3d3f45", "short-jazz-grafite"]],
    desc: "Short de cintura alta com cós largo, que não enrola nem marca. Perfeito por cima do collant.",
  },
  {
    id: 8, name: "Touca de Natação em Lycra", cat: "Natação", line: "Natação", price: 24.9, sizes: ONE, tags: ["best"],
    variants: [["Marinho", "#2d3a6b", "touca-marinho"], ["Preto", "#1f1a1c", "touca-preto"], ["Vinho", "#8e1d3d", "touca-vinho"]],
    desc: "Touca em lycra confortável, que não puxa o cabelo. Ideal para aulas de natação e hidroginástica.",
  },
  {
    id: 9, name: "Maiô Natação", cat: "Natação", line: "Natação", price: 119.9, sizes: ADULT, tags: [],
    variants: [["Preto com vermelho", "#c8102e", "maio-natacao"]],
    desc: "Maiô de natação com vivos contrastantes, costas nadador e tecido resistente ao cloro.",
  },
  {
    id: 10, name: "Colete com Zíper", cat: "Saídas", line: "Saída de aula", price: 129.9, sizes: ADULT, tags: ["novo", "destaque"],
    variants: [["Verde", "#3f6b45", "colete-verde"], ["Preto", "#1f1a1c", "colete-preto"], ["Azul", "#1f5fd1", "colete-azul"]],
    desc: "Colete longo em tactel com zíper e cordão na cintura. Saída prática por cima do collant ou do maiô.",
  },
  {
    id: 11, name: "Parka com Capuz", cat: "Saídas", line: "Saída de aula", price: 159.9, sizes: ADULT, tags: [],
    variants: [["Verde", "#3f6b45", "parka-verde"]],
    desc: "Parka longa com capuz forrado e punho dobrável. Leve, corta-vento e perfeita para o pós-aula.",
  },
];
