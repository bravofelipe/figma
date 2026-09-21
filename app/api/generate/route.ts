import OpenAI from "openai";
import { NextResponse } from "next/server";
import { getBrand } from "@/lib/brands";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "Configure OPENAI_API_KEY no arquivo .env.local" },
      { status: 500 }
    );
  }

  const { prompt, brandId = "felipe" } = await request.json();
  const brand = getBrand(brandId);

  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-5",
    input: [
      {
        role: "system",
        content:
          "Você é um estrategista de conteúdo e diretor criativo especializado em carrosséis para Instagram. " +
          "Crie narrativa clara, direta, específica e sem frases genéricas. " +
          "Cada slide deve ter pouco texto, boa progressão e uma única ideia principal. " +
          "Retorne SOMENTE JSON válido."
      },
      {
        role: "user",
        content: `Crie um carrossel para a marca ${brand.name}.

Pedido:
${prompt}

Regras da marca:
${brand.rules.join("\n")}

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

Use entre 6 e 9 slides. O CTA deve aparecer apenas no último slide.`
      }
    ]
  });

  const raw = response.output_text.trim().replace(/^\`\`\`json\s*/i, "").replace(/\`\`\`$/i, "");
  try {
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json({ error: "A IA retornou um JSON inválido.", raw }, { status: 500 });
  }
}
