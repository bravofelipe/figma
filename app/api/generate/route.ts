import OpenAI from "openai";
import { NextResponse } from "next/server";
import { loadBrandPackage } from "@/lib/brand-loader";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "Configure OPENAI_API_KEY no arquivo .env.local" },
      { status: 500 }
    );
  }

  const { prompt, brandId, layoutId, photoCategoryId } = await request.json();
  const brand = await loadBrandPackage(brandId);
  const selectedLayout = brand.layouts.find((layout) => layout.id === layoutId);
  const selectedPhotoCategory = brand.photoCategories.find((item) => item.id === photoCategoryId);

  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-5.6-terra",
    input: [
      {
        role: "system",
        content:
          "Você é um estrategista de conteúdo e diretor criativo especializado em carrosséis para Instagram. " +
          "Crie narrativa clara, direta, específica e sem frases genéricas. " +
          "Cada slide deve ter pouco texto, boa progressão e uma única ideia principal. " +
          "Respeite rigorosamente as regras da marca. Retorne SOMENTE JSON válido."
      },
      {
        role: "user",
        content: `Crie um carrossel para a marca ${brand.name}.

Pedido:
${prompt}

Assinatura:
${brand.signature}

Regras da marca:
${brand.rulesMarkdown}

Instruções do agente:
${brand.agentInstructionsMarkdown}

Layout selecionado:
${selectedLayout ? selectedLayout.name + " — " + selectedLayout.useWhen : "nenhum"}

Regras do layout:
${selectedLayout ? selectedLayout.rules.join("\n") : "nenhuma"}

Categoria de foto:
${selectedPhotoCategory ? selectedPhotoCategory.id + " — " + selectedPhotoCategory.description : "nenhuma"}

Melhor uso da foto:
${selectedPhotoCategory ? selectedPhotoCategory.bestFor.join(", ") : "nenhum"}

Retorne exatamente este formato JSON:
{
  "title": "nome interno do carrossel",
  "caption": "legenda curta para Instagram",
  "slides": [
    {
      "id": "1",
      "eyebrow": "opcional",
      "title": "título curto",
      "body": "opcional",
      "emphasis": "opcional",
      "cta": "opcional"
    }
  ]
}

Use entre 6 e 9 slides.
O CTA deve aparecer apenas no último slide.`
      }
    ]
  });

  const raw = response.output_text.trim().replace(/^```json\s*/i, "").replace(/```$/i, "");
  try {
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json({ error: "A IA retornou um JSON inválido.", raw }, { status: 500 });
  }
}
