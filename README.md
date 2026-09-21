# Carousel Studio

Gerador de carrosséis 1080×1350 com Brand Kits, edição slide a slide, IA e exportação PNG.

## O que já existe na V1

- Painel de criação
- Brand Kit por marca
- Preview 4:5
- Edição manual de cada slide
- Geração de narrativa com OpenAI
- Exportação de um slide ou de todos em PNG
- Marca Felipe Bravo pré-configurada
- Marca Lifeplans pré-configurada
- Regra explícita para nunca recriar/substituir logos

## Rodando localmente

1. Instale Node.js 20+
2. Rode:

```bash
npm install
cp .env.example .env.local
npm run dev
```

3. Coloque sua chave OpenAI em `.env.local`
4. Acesse http://localhost:3000

## Próximos passos recomendados

- Upload e posicionamento de logos/fotos reais
- Mais layouts por slide
- Regenerar somente um slide
- Biblioteca de referências visuais
- Brand Kits: Facedoctor, AIOS, Spazio e demais clientes
- Exportação ZIP
- Formato Story 1080×1920
- Persistência de projetos
- Deploy na Vercel

## Estrutura

```
app/
  api/generate/route.ts
  globals.css
  layout.tsx
  page.tsx
components/
  CarouselStudio.tsx
lib/
  brands.ts
  types.ts
```

A arquitetura foi mantida simples para facilitar a evolução do gerador sem acoplar identidade visual à lógica da IA.
