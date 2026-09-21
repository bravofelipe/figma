"use client";

import { useMemo, useState } from "react";
import { toPng } from "html-to-image";
import { brands, getBrand } from "@/lib/brands";
import type { Carousel, Slide } from "@/lib/types";

const demo: Carousel = {
  title: "Ultraformer sem acompanhamento",
  caption: "O problema nem sempre é o procedimento. Muitas vezes é a falta de acompanhamento da clínica.",
  slides: [
    { id: "1", eyebrow: "EXPERIÊNCIA DO PACIENTE", title: "Seu paciente fez Ultraformer.\nE saiu achando que não funcionou." },
    { id: "2", title: "O resultado não termina quando o procedimento acaba.", body: "A percepção de valor continua nas semanas seguintes — e depende da forma como a clínica acompanha o paciente." },
    { id: "3", title: "Sem acompanhamento, ele não sabe o que observar.", body: "Melhora de firmeza, textura e qualidade da pele acontece de forma progressiva. Sem orientação, mudanças sutis passam despercebidas." },
    { id: "4", title: "E quando ele não percebe a evolução...", emphasis: "a conclusão mais fácil é: “não deu resultado”." },
    { id: "5", title: "Isso não é só um problema clínico.", body: "É um problema de comunicação, processo e experiência do paciente." },
    { id: "6", title: "Um bom pós-procedimento cria percepção de resultado.", body: "Contato programado, fotos comparativas, orientação sobre prazos e checkpoints ajudam o paciente a enxergar a evolução." },
    { id: "7", title: "Sua clínica acompanha o paciente ou apenas executa procedimentos?", cta: "Agende um diagnóstico da sua clínica. Link da BIO." }
  ]
};

export default function CarouselStudio() {
  const [brandId, setBrandId] = useState("felipe");
  const [carousel, setCarousel] = useState<Carousel>(demo);
  const [active, setActive] = useState(0);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const brand = useMemo(() => getBrand(brandId), [brandId]);
  const slide = carousel.slides[active];

  function updateSlide(field: keyof Slide, value: string) {
    setCarousel((current) => ({
      ...current,
      slides: current.slides.map((item, index) =>
        index === active ? { ...item, [field]: value } : item
      )
    }));
  }

  async function generate() {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, brandId })
      });
      if (!response.ok) throw new Error("Falha ao gerar carrossel");
      const data = await response.json();
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
    const dataUrl = await toPng(node, {
      width: 1080,
      height: 1350,
      pixelRatio: 1,
      cacheBust: true
    });
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

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div>
          <div className="brand-mark">CAROUSEL STUDIO</div>
          <h1>Carrosséis com identidade, não templates genéricos.</h1>
          <p className="muted">Crie, revise e exporte carrosséis mantendo as regras de cada marca.</p>
        </div>

        <div className="field">
          <label>Marca</label>
          <select value={brandId} onChange={(e) => setBrandId(e.target.value)}>
            {brands.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}
          </select>
        </div>

        <div className="field">
          <label>O que vamos criar?</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ex.: Crie um carrossel de 7 slides sobre um paciente que fez Ultraformer, não foi acompanhado e acha que o procedimento não deu resultado."
          />
          <button className="primary" onClick={generate} disabled={loading}>
            {loading ? "Gerando..." : "Gerar com IA"}
          </button>
        </div>

        <div className="rules">
          <strong>Regras da marca</strong>
          {brand.rules.map((rule) => <span key={rule}>• {rule}</span>)}
        </div>
      </aside>

      <section className="workspace">
        <header className="toolbar">
          <div>
            <strong>{carousel.title}</strong>
            <span>{carousel.slides.length} slides · 1080×1350</span>
          </div>
          <button onClick={exportAll}>Exportar todos</button>
        </header>

        <div className="stage">
          <div className="preview-wrap">
            <SlidePreview slide={slide} brandId={brandId} index={active} />
          </div>

          <div className="editor">
            <div className="field">
              <label>Sobretítulo</label>
              <input value={slide.eyebrow ?? ""} onChange={(e) => updateSlide("eyebrow", e.target.value)} />
            </div>
            <div className="field">
              <label>Título</label>
              <textarea value={slide.title} onChange={(e) => updateSlide("title", e.target.value)} />
            </div>
            <div className="field">
              <label>Texto</label>
              <textarea value={slide.body ?? ""} onChange={(e) => updateSlide("body", e.target.value)} />
            </div>
            <div className="field">
              <label>Destaque</label>
              <textarea value={slide.emphasis ?? ""} onChange={(e) => updateSlide("emphasis", e.target.value)} />
            </div>
            <div className="field">
              <label>CTA</label>
              <textarea value={slide.cta ?? ""} onChange={(e) => updateSlide("cta", e.target.value)} />
            </div>
            <button onClick={() => exportSlide(active)}>Exportar este slide</button>
          </div>
        </div>

        <div className="thumbs">
          {carousel.slides.map((item, index) => (
            <button
              key={item.id}
              className={index === active ? "thumb active" : "thumb"}
              onClick={() => setActive(index)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <b>{item.title}</b>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

function SlidePreview({ slide, brandId, index }: { slide: Slide; brandId: string; index: number }) {
  const brand = getBrand(brandId);

  return (
    <article
      id={`slide-${index}`}
      className="slide"
      style={{
        background: brand.colors.background,
        color: brand.colors.foreground,
        fontFamily: brand.typography.body
      }}
    >
      <div className="slide-topline" style={{ background: brand.colors.accent }} />
      <div className="slide-content">
        {slide.eyebrow && <div className="eyebrow" style={{ color: brand.colors.accent }}>{slide.eyebrow}</div>}
        <h2 style={{ fontFamily: brand.typography.heading }}>{slide.title}</h2>
        {slide.body && <p>{slide.body}</p>}
        {slide.emphasis && <div className="emphasis" style={{ borderColor: brand.colors.accent }}>{slide.emphasis}</div>}
        {slide.cta && <div className="cta" style={{ background: brand.colors.accent }}>{slide.cta}</div>}
      </div>
      <footer>
        <span>{brand.signature}</span>
        <span>{String(index + 1).padStart(2, "0")}</span>
      </footer>
    </article>
  );
}
