export type Product3DModel = {
  keywords: readonly string[];
  embedUrl: string;
  source: string;
  matchType: string;
};

const sketchfabEmbed = (modelId: string) =>
  `https://sketchfab.com/models/${modelId}/embed?autostart=1&preload=1&ui_infos=0&ui_watermark=0&ui_theme=dark&dnt=1`;

export const VERIFIED_PRODUCT_3D_MODELS = [
  {
    keywords: ["airpods pro 2", "airpods", "apple airpods"],
    embedUrl: sketchfabEmbed("b40a4072f9554fc5a63e62eb950777d9"),
    source: "Sketchfab Apple AirPods Pro 2 2024",
    matchType: "High-quality closest Apple AirPods Pro product model.",
  },
  {
    keywords: ["iphone 15 pro", "apple iphone 15 pro"],
    embedUrl: sketchfabEmbed("9e045e469d514fea9dda2ccd161f5fa3"),
    source: "Sketchfab iPhone 15 Pro",
    matchType: "Product-specific iPhone 15 Pro showroom model.",
  },
  {
    keywords: ["galaxy s24", "s24 ultra"],
    embedUrl: sketchfabEmbed("f642a96e26974e649da6dc64129beee7"),
    source: "Sketchfab Samsung S24 Ultra",
    matchType: "Exact/closest Samsung Galaxy S24 Ultra product model.",
  },
  {
    keywords: ["samsung galaxy s21", "galaxy s21"],
    embedUrl: sketchfabEmbed("0de7f4c80188460e8e01542795a8ac03"),
    source: "Sketchfab Samsung Galaxy S9",
    matchType: "Closest Samsung Galaxy real smartphone model.",
  },
  {
    keywords: ["pixel 8 pro", "google pixel"],
    embedUrl: sketchfabEmbed("ab567912dd944fd59ed73a3a012f3eba"),
    source: "Sketchfab Google Pixel 8 Pro",
    matchType: "Exact Google Pixel 8 Pro product model.",
  },
  {
    keywords: ["xperia 1 v", "sony xperia"],
    embedUrl: sketchfabEmbed("a337b89d1558473ba09050a023bcd17d"),
    source: "Sketchfab Sony Xperia 1 V",
    matchType: "Exact Sony Xperia 1 V product model.",
  },
  {
    keywords: ["macbook pro", "macbook air"],
    embedUrl: sketchfabEmbed("efab224280fd4c3993c808107f7c0b38"),
    source: "Sketchfab MacBook Pro 13 inch 2020",
    matchType: "Apple MacBook Pro real product model.",
  },
  {
    keywords: ["galaxy tab s9", "samsung tab"],
    embedUrl: sketchfabEmbed("fdc2b2848bff4fff999f7e7979f40163"),
    source: "Sketchfab Galaxy Tab S9",
    matchType: "Exact/closest Samsung Galaxy Tab S9 product model.",
  },
  {
    keywords: ["sony wh-1000xm5"],
    embedUrl: sketchfabEmbed("5d8aea0a780b49fa89c9c205912414e3"),
    source: "Sketchfab Sony WH-1000XM5",
    matchType: "Exact/closest Sony WH-1000XM5 headphones model.",
  },
  {
    keywords: ["bose quietcomfort earbuds", "pixel buds", "earbuds", "buds"],
    embedUrl: sketchfabEmbed("128ceed5e3134561b066ae392e3293b5"),
    source: "Sketchfab Bose QuietComfort Earbuds",
    matchType: "Closest premium earbuds product model.",
  },
  {
    keywords: ["lg oled", "oled c3", "tv"],
    embedUrl: sketchfabEmbed("4e8d7cfea21f49049cbf8d2e195572ec"),
    source: "Sketchfab LG OLED evo TV",
    matchType: "Closest premium OLED TV product model.",
  },
  {
    keywords: ["playstation 5", "ps5"],
    embedUrl: sketchfabEmbed("8e602d71ddc94bf09731db9151fc7cd3"),
    source: "Sketchfab PlayStation 5",
    matchType: "High-quality PlayStation 5 setup model.",
  },
  {
    keywords: ["nintendo switch", "switch oled"],
    embedUrl: sketchfabEmbed("36438fd911bb42138926cc82f7a2b522"),
    source: "Sketchfab Nintendo Switch",
    matchType: "Nintendo Switch OLED product model.",
  },
  {
    keywords: ["meta quest", "quest 3", "quest pro"],
    embedUrl: sketchfabEmbed("65a813833dc04eeeb7d33bdca58c184c"),
    source: "Sketchfab Meta Quest VR headset",
    matchType: "Meta Quest 3 VR headset product model.",
  },
  {
    keywords: ["mx master", "g pro x superlight", "mouse", "gaming mouse"],
    embedUrl: sketchfabEmbed("e3f9cfe03c0e4aa79570cfd2402e65fd"),
    source: "Sketchfab Logitech MX Master 3S",
    matchType: "Closest premium mouse product model.",
  },
] as const satisfies readonly Product3DModel[];

export function getRealProductModel(productName: string) {
  const lower = productName.toLowerCase();
  return VERIFIED_PRODUCT_3D_MODELS.find((model) => model.keywords.some((keyword) => lower.includes(keyword))) ?? null;
}

export function hasVerifiedProduct3DModel(productName: string) {
  return Boolean(getRealProductModel(productName));
}
