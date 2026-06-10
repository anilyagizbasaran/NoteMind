import { NextResponse } from "next/server";
import { getModel, generationConfig } from "@/lib/gemini";
import translations from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";

const MAX_CHARS = 8000;

export async function POST(req: Request) {
  try {
    const { notes, lang = "tr" } = await req.json();
    const t = translations[lang as Lang] ?? translations.tr;

    if (!notes || notes.trim() === "") {
      return NextResponse.json({ error: t.errorEmpty }, { status: 400 });
    }

    if (notes.length > MAX_CHARS) {
      return NextResponse.json({ error: t.errorTooLong(MAX_CHARS) }, { status: 400 });
    }

    const model = getModel(lang as Lang);
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: notes }] }],
      generationConfig,
    });

    const text = result.response.text();

    try {
      const data = JSON.parse(text);
      return NextResponse.json(data);
    } catch (parseError) {
      console.error("JSON Parsing Error:", parseError, "Raw output:", text);
      return NextResponse.json({ error: t.errorParse }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    const lang = "tr";
    const t = translations[lang];
    return NextResponse.json({ error: t.errorApi(error.message) }, { status: 500 });
  }
}
