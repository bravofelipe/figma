export type Brand = {
  id: string;
  name: string;
  signature: string;
  colors: { background: string; foreground: string; accent: string; muted: string };
  typography: { heading: string; body: string };
  rules: string[];
};

export type Slide = {
  id: string;
  eyebrow?: string;
  title: string;
  body?: string;
  emphasis?: string;
  cta?: string;
};

export type Carousel = {
  title: string;
  caption: string;
  slides: Slide[];
};
