import fs from "node:fs/promises";
import path from "node:path";
import type { BrandIdentity, BrandPackage, LayoutOption, PhotoCategory } from "./types";

const BRANDS_DIR = path.join(process.cwd(), "brands");

async function readJsonFile<T>(filePath: string): Promise<T> {
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

export async function listBrandIds(): Promise<string[]> {
  const entries = await fs.readdir(BRANDS_DIR, { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
}

export async function loadBrandPackage(id: string): Promise<BrandPackage> {
  const brandDir = path.join(BRANDS_DIR, id);
  const brand = await readJsonFile<BrandIdentity>(path.join(brandDir, "brand.json"));
  const layoutsFile = await readJsonFile<{ layouts: LayoutOption[] }>(path.join(brandDir, "layouts.json"));
  const photoLibraryFile = await readJsonFile<{ categories: PhotoCategory[] }>(path.join(brandDir, "photo-library.json"));
  const rulesMarkdown = await fs.readFile(path.join(brandDir, "rules.md"), "utf-8");
  const agentInstructionsMarkdown = await fs.readFile(path.join(brandDir, "agent-instructions.md"), "utf-8");

  return {
    ...brand,
    layouts: layoutsFile.layouts ?? [],
    photoCategories: photoLibraryFile.categories ?? [],
    rulesMarkdown,
    agentInstructionsMarkdown
  };
}

export async function loadAllBrands(): Promise<BrandPackage[]> {
  const ids = await listBrandIds();
  const brands = await Promise.all(ids.map((id) => loadBrandPackage(id)));
  return brands.sort((a, b) => a.name.localeCompare(b.name));
}
