import type { Brand } from "./types";

export const brands: Brand[] = [
  {
    id: "felipe",
    name: "Felipe Bravo",
    signature: "Felipe Bravo | Clínicas de estética",
    colors: { background: "#F7F7F5", foreground: "#0B0B0D", accent: "#B3261E", muted: "#C9C9C4" },
    typography: { heading: "Arial, Helvetica, sans-serif", body: "Arial, Helvetica, sans-serif" },
    rules: [
      "Visual editorial e humano.",
      "Poucos elementos decorativos.",
      "Hierarquia tipográfica forte.",
      "Nunca recriar, alterar ou substituir o logo.",
      "Formato principal 1080x1350."
    ]
  },
  {
    id: "lifeplans",
    name: "Lifeplans",
    signature: "Lifeplans Saúde",
    colors: { background: "#07141F", foreground: "#FFFFFF", accent: "#F28C28", muted: "#5FD7D7" },
    typography: { heading: "Arial, Helvetica, sans-serif", body: "Arial, Helvetica, sans-serif" },
    rules: [
      "Estética premium escura.",
      "Detalhes ciano/teal e laranja.",
      "CTA discreto e claro.",
      "Nunca recriar, alterar ou substituir o logo."
    ]
  }
];

export const getBrand = (id: string) => brands.find((brand) => brand.id === id) ?? brands[0];
