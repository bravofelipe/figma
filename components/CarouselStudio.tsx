"use client";

import { useMemo, useState } from "react";
import { toPng } from "html-to-image";
import type { BrandPackage, Carousel, Slide } from "@/lib/types";

type Props = { brands: BrandPackage[] };

const demo: Carousel = {
  title: "Ultraformer sem acompanhamento",
  caption: "O problema nem sempre é o procedimento. Muitas vezes é a falta de acompanhamento da clínica.",
  slides: [
    { id: "1", eyebrow: "EXPERIÊNCIA DO PACIENTE", title: "Seu paciente fez Ultraformer.\nE saiu achando que não funcionou." },
    { id: "2", title: "O resultado não termina quando o procedimento acaba.", body: "A percepção de valor continua nas semanas seguintes — e depende da forma como a clínica acompanha o paciente." },
    { id: "3", title: "Sem acompanhamento, ele não sabe o que observar.", body: "Mudanças progressivas podem passar despercebidas sem orientação e comparação." },
    { id: "4", title: "E quando ele não percebe a evolução...", emphasis: "a conclusão mais fácil é: “não deu resultado”." },
    { id: "5", title: "Isso também é comunicação.", body: "A experiência do paciente continua depois do procedimento." },
    { id: "6", title: "Um bom pós-procedimento cria percepção de resultado.", body: "Contato programado, fotos comparativas, orientação sobre prazos e checkpoints." },
    { id: "7", title: "Sua clínica acompanha o paciente ou apenas executa procedimentos?", cta: "Agende um diagnóstico da sua clínica. Link da BIO." }
  ]
};

export default function CarouselStudio({ brands }: Props) {
  const [brandId, setBrandId] = useState(brands[0]?.id ?? "");
  const [carousel, setCarousel] = useState<Carousel>(demo);
  const [active, setActive] = useState(0);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const brand = useMemo(
    () => brands.find((item) => item.id === brandId) ?? brands[0],
    [brands, brandId]
  );

  const [layoutId, setLayoutId] = useState(brand?.layouts[0]?.id ?? "");
  const [photoCategoryId, setPhotoCategoryId] = useState(brand?.photoCategories[0]?.id ?? "");

  const slide = carousel.slides[active];
  const selectedLayout = brand?.layouts.find((item) => item.id === layoutId);

  function changeBrand(nextId: string) {
    setBrandId(nextId);
    const next = brands.find((item) => item.id === nextId);
    setLayoutId(next?.layouts[0]?.id ?? "");
    setPhotoCategoryId(next?.photoCategories[0]?.id ?? "");
  }

  function updateSlide(field: keyof Slide, value: string) {
    setCarousel((current) => ({
      ...current,
      slides: current.slides.map((item, index) =>
        index === active ? { ...item, [field]: value } : item
      )
    }));
  }

  async function generate() {
    if (!prompt.trim() || !brand) return;
    setLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, brandId: brand.id, layoutId, photoCategoryId })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Falha ao gerar carrossel");
      setCarousel(data);
      setActive(0);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erro ao gerar carrossel");
    } finally {
      setLoading(false);
    }
  }

  async function exportSlide(index: number) {
    const node = document.getElementById(`slide-${index}`);
    if (!node) return;
    const dataUrl = await toPng(node, { width: 1080, height: 1350, pixelRatio: 1, cacheBust: true });
    const link = document.createElement("a");
    link.download = `slide-${String(index + 1).padStart(2, "0")}.png`;
    link.href = dataUrl;
    link.click();
  }

  async function exportAll() {
    for (let i = 0; i < carousel.slides.length; i++) {
      await exportSlide(i);
      await new Promise((resolve) => setTimeout(resolve, 180));
    }
  }

  if (!brand || !slide) return <main className="app-shell">Nenhuma marca encontrada.</main>;

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div>
          <div className="brand-mark">CAROUSEL STUDIO</div>
          <h1>Carrosséis com identidade, não templates genéricos.</h1>
          <p className="muted">O sistema agora lê o Brand Kit diretamente da pasta /brands.</p>
        </div>

        <div className="field">
          <label>Marca</label>
          <select value={brandId} onChange={(e) => changeBrand(e.target.value)}>
            {brands.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}
          </select>
        </div>

        <div className="field">
          <label>Layout</label>
          <select value={layoutId} onChange={(e) => setLayoutId(e.target.value)}>
            {brand.layouts.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}
          </select>
          {selectedLayout && <span className="muted">{selectedLayout.useWhen}</span>}
        </div>

        <div className="field">
          <label>Categoria de foto</label>
          <select value={photoCategoryId} onChange={(e) => setPhotoCategoryId(e.target.value)}>
            {brand.photoCategories.map((item) => <option value={item.id} key={item.id}>{item.id}</option>)}
          </select>
        </div>

        <div className="field">
          <label>O que vamos criar?</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ex.: Crie um carrossel sobre clínicas que aumentam tráfego sem corrigir o processo comercial."
          />
          <button className="primary" onClick={generate} disabled={loading}>
            {loading ? "Gerando..." : "Gerar com IA"}
          </button>
        </div>

        <div className="rules">
          <strong>Assinatura</strong>
          <span>{brand.signature}</span>
          <strong>Brand Kit ativo</strong>
          <span>{brand.positioning}</span>
        </div>
      </aside>

      <section className="workspace">
        <header className="toolbar">
          <div>
            <strong>{carousel.title}</strong>
            <span>{carousel.slides.length} slides · {brand.formats.feed.width}×{brand.formats.feed.height}</span>
          </div>
          <button onClick={exportAll}>Exportar todos</button>
        </header>

        <div className="stage">
          <div className="preview-wrap">
            <SlidePreview slide={slide} brand={brand} index={active} layoutId={layoutId} />
          </div>

          <div className="editor">
            <div className="field"><label>Sobretítulo</label><input value={slide.eyebrow ?? ""} onChange={(e) => updateSlide("eyebrow", e.target.value)} /></div>
            <div className="field"><label>Título</label><textarea value={slide.title} onChange={(e) => updateSlide("title", e.target.value)} /></div>
            <div className="field"><label>Texto</label><textarea value={slide.body ?? ""} onChange={(e) => updateSlide("body", e.target.value)} /></div>
            <div className="field"><label>Destaque</label><textarea value={slide.emphasis ?? ""} onChange={(e) => updateSlide("emphasis", e.target.value)} /></div>
            <div className="field"><label>CTA</label><textarea value={slide.cta ?? ""} onChange={(e) => updateSlide("cta", e.target.value)} /></div>
            <button onClick={() => exportSlide(active)}>Exportar este slide</button>
          </div>
        </div>

        <div className="thumbs">
          {carousel.slides.map((item, index) => (
            <button key={item.id} className={index === active ? "thumb active" : "thumb"} onClick={() => setActive(index)}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <b>{item.title}</b>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

function SlidePreview({ slide, brand, index, layoutId }: { slide: Slide; brand: BrandPackage; index: number; layoutId: string }) {
  const dark = ["content-dark", "cta-final", "cover-minimal"].includes(layoutId);
  const background = dark ? brand.colors.dark : brand.colors.offWhite;
  const foreground = dark ? "#FFFFFF" : brand.colors.dark;
  const accent = brand.colors.accentGold ?? brand.colors.accentRed ?? brand.colors.dark;

  return (
    <article id={`slide-${index}`} className="slide" style={{ background, color: foreground, fontFamily: brand.typography.body }}>
      <div className="slide-topline" style={{ background: accent }} />
      <div className="slide-content">
        {brand.fixedElements?.topMicrocopy && <div className="eyebrow" style={{ color: accent }}>{brand.fixedElements.topMicrocopy}</div>}
        {slide.eyebrow && <div className="eyebrow" style={{ color: accent }}>{slide.eyebrow}</div>}
        <h2 style={{ fontFamily: brand.typography.title }}>{slide.title}</h2>
        {slide.body && <p>{slide.body}</p>}
        {slide.emphasis && <div className="emphasis" style={{ borderColor: accent }}>{slide.emphasis}</div>}
        {slide.cta && <div className="cta" style={{ background: accent, color: brand.colors.dark }}>{slide.cta}</div>}
      </div>
      <footer><span>{brand.signature}</span><span>{String(index + 1).padStart(2, "0")}</span></footer>
    </article>
  );
}
