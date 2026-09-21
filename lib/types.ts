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

export type BrandIdentity = {
  id: string;
  name: string;
  signature: string;
  niche?: string;
  positioning?: string;
  tone?: string[];
  typography: {
    title: string;
    body: string;
    titleWeights?: number[];
    bodyWeights?: number[];
  };
  colors: {
    dark: string;
    graphite: string;
    charcoal: string;
    offWhite: string;
    softGray: string;
    accentRed?: string;
    accentGold?: string;
  };
  formats: {
    feed: { width: number; height: number };
    story: { width: number; height: number };
  };
  fixedElements?: {
    signature?: string;
    topMicrocopy?: string;
    decorativeDetail?: string;
  };
};

export type LayoutOption = {
  id: string;
  name: string;
  useWhen: string;
  rules: string[];
};

export type PhotoCategory = {
  id: string;
  description: string;
  bestFor: string[];
};

export type BrandPackage = BrandIdentity & {
  layouts: LayoutOption[];
  photoCategories: PhotoCategory[];
  rulesMarkdown: string;
  agentInstructionsMarkdown: string;
};
