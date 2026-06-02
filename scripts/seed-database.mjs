import { PrismaClient } from "@prisma/client";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const productsPath = path.join(__dirname, "..", "public", "sunspot_products.json");

function text(value, maxLength) {
  if (value === null || value === undefined) return null;
  const normalized = typeof value === "string" ? value : JSON.stringify(value);
  return normalized.length > maxLength ? normalized.slice(0, maxLength) : normalized;
}

function imagePath(value) {
  const normalized = text(value, 200);
  if (!normalized || normalized.startsWith("data:image")) return "/file.svg";
  return normalized;
}

async function main() {
  const products = JSON.parse(await readFile(productsPath, "utf8"));

  for (const product of products) {
    await prisma.products.upsert({
      where: { id: product.id },
      update: {
        name: text(product.name, 50),
        manufacturer: text(product.manufacturer, 50),
        model: text(product.model, 50),
        year: product.year ?? null,
        price: Number(product.price),
        processor: text(product.processor, 50),
        ram_size: text(product.ram_size, 50),
        storage: text(product.storage, 50),
        display: text(product.display, 5000),
        os: text(product.os, 50),
        battery: text(product.battery, 50),
        weight: text(product.weight, 50),
        dimensions: text(product.dimensions, 5000),
        keyboard: text(product.keyboard, 50),
        ports: text(product.ports, 5000),
        connectivity: text(product.connectivity, 5000),
        camera: text(product.camera, 5000),
        additional_features: text(product.additional_features, 5000),
        image: imagePath(product.image),
        description: text(product.description, 65000),
      },
      create: {
        id: product.id,
        name: text(product.name, 50),
        manufacturer: text(product.manufacturer, 50),
        model: text(product.model, 50),
        year: product.year ?? null,
        price: Number(product.price),
        processor: text(product.processor, 50),
        ram_size: text(product.ram_size, 50),
        storage: text(product.storage, 50),
        display: text(product.display, 5000),
        os: text(product.os, 50),
        battery: text(product.battery, 50),
        weight: text(product.weight, 50),
        dimensions: text(product.dimensions, 5000),
        keyboard: text(product.keyboard, 50),
        ports: text(product.ports, 5000),
        connectivity: text(product.connectivity, 5000),
        camera: text(product.camera, 5000),
        additional_features: text(product.additional_features, 5000),
        image: imagePath(product.image),
        description: text(product.description, 65000),
      },
    });
  }

  console.log(`Seeded ${products.length} products into the Sunspot database.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
