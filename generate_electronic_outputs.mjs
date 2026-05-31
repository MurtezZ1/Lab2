import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROW_COUNT = 2400;
const OUTPUT_DIR = "electronic_online_shop_output";

const catalog = {
  Laptop: {
    names: ["Ultrabook", "Gaming Laptop", "Business Notebook", "2-in-1 Laptop", "Creator Laptop"],
    brands: ["Dell", "HP", "Lenovo", "Asus", "Acer", "Apple", "MSI"],
    priceRange: [450, 3200],
    warranty: [12, 24, 36],
  },
  Smartphone: {
    names: ["Smartphone", "Pro Smartphone", "Foldable Phone", "Budget Phone", "5G Phone"],
    brands: ["Samsung", "Apple", "Xiaomi", "OnePlus", "Google", "Motorola"],
    priceRange: [180, 1600],
    warranty: [12, 24],
  },
  Tablet: {
    names: ["Tablet", "Drawing Tablet", "Kids Tablet", "Pro Tablet", "Mini Tablet"],
    brands: ["Apple", "Samsung", "Lenovo", "Huawei", "Microsoft"],
    priceRange: [120, 1300],
    warranty: [12, 24],
  },
  Headphones: {
    names: ["Wireless Headphones", "Noise Cancelling Headphones", "Gaming Headset", "Earbuds", "Studio Headphones"],
    brands: ["Sony", "Bose", "JBL", "Sennheiser", "Logitech", "Apple"],
    priceRange: [25, 450],
    warranty: [6, 12, 24],
  },
  Smartwatch: {
    names: ["Smartwatch", "Fitness Watch", "GPS Watch", "Hybrid Watch", "Sports Watch"],
    brands: ["Apple", "Samsung", "Garmin", "Fitbit", "Huawei", "Amazfit"],
    priceRange: [45, 900],
    warranty: [12, 24],
  },
  Camera: {
    names: ["Mirrorless Camera", "DSLR Camera", "Action Camera", "Vlogging Camera", "Instant Camera"],
    brands: ["Canon", "Nikon", "Sony", "GoPro", "Fujifilm", "Panasonic"],
    priceRange: [150, 2800],
    warranty: [12, 24, 36],
  },
  TV: {
    names: ["4K TV", "OLED TV", "QLED TV", "Smart TV", "Mini LED TV"],
    brands: ["Samsung", "LG", "Sony", "TCL", "Hisense", "Philips"],
    priceRange: [250, 3500],
    warranty: [12, 24, 36],
  },
  "Gaming Console": {
    names: ["Gaming Console", "Handheld Console", "VR Bundle", "Console Bundle", "Retro Console"],
    brands: ["Sony", "Microsoft", "Nintendo", "Meta", "Valve"],
    priceRange: [180, 950],
    warranty: [12, 24],
  },
  Monitor: {
    names: ["Gaming Monitor", "4K Monitor", "Curved Monitor", "Office Monitor", "Ultrawide Monitor"],
    brands: ["Dell", "LG", "Samsung", "Asus", "AOC", "BenQ"],
    priceRange: [90, 1500],
    warranty: [12, 24, 36],
  },
  Accessory: {
    names: ["Wireless Mouse", "Mechanical Keyboard", "USB-C Hub", "Power Bank", "Webcam"],
    brands: ["Logitech", "Anker", "Razer", "Belkin", "Corsair", "Microsoft"],
    priceRange: [10, 250],
    warranty: [6, 12, 24],
  },
};

let state = 42;
function random() {
  state = (1664525 * state + 1013904223) >>> 0;
  return state / 2 ** 32;
}
function pick(items) {
  return items[Math.floor(random() * items.length)];
}
function normal(mean = 0, sd = 1) {
  const u1 = Math.max(random(), 1e-12);
  const u2 = Math.max(random(), 1e-12);
  return mean + sd * Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}
function gammaLike() {
  return -Math.log(Math.max(random(), 1e-12)) * 80 + -Math.log(Math.max(random(), 1e-12)) * 80;
}
function clip(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
function weightedPick(items, probabilities) {
  const value = random();
  let total = 0;
  for (let i = 0; i < items.length; i += 1) {
    total += probabilities[i];
    if (value <= total) return items[i];
  }
  return items.at(-1);
}
function median(values) {
  const sorted = values.filter((v) => v !== "" && v !== null && !Number.isNaN(Number(v))).map(Number).sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}
function mode(values) {
  const counts = new Map();
  for (const value of values.filter((v) => v !== "" && v !== null && v !== undefined)) {
    counts.set(value, (counts.get(value) || 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
}
function quantile(values, q) {
  const sorted = values.map(Number).sort((a, b) => a - b);
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  return sorted[base + 1] === undefined ? sorted[base] : sorted[base] + rest * (sorted[base + 1] - sorted[base]);
}
function csvEscape(value) {
  if (value === null || value === undefined) return "";
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}
function writeCsv(filePath, rows) {
  const columns = Object.keys(rows[0]);
  const lines = [columns.join(","), ...rows.map((row) => columns.map((col) => csvEscape(row[col])).join(","))];
  fs.writeFileSync(filePath, lines.join("\n"));
}
function duplicateCount(rows) {
  const seen = new Set();
  let count = 0;
  for (const row of rows) {
    const key = JSON.stringify(row);
    if (seen.has(key)) count += 1;
    seen.add(key);
  }
  return count;
}

function createDataset() {
  const categories = Object.keys(catalog);
  const categoryProbabilities = [0.13, 0.16, 0.09, 0.12, 0.09, 0.07, 0.1, 0.06, 0.09, 0.09];
  const rows = [];

  for (let i = 1; i <= ROW_COUNT; i += 1) {
    const category = weightedPick(categories, categoryProbabilities);
    const details = catalog[category];
    const brand = pick(details.brands);
    const [minPrice, maxPrice] = details.priceRange;
    const descriptor = pick(details.names);
    const code = `${pick("ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""))}${Math.floor(100 + random() * 899)}`;

    const price = Number(clip(Math.exp(normal(Math.log((minPrice + maxPrice) / 3), 0.45)), minPrice, maxPrice).toFixed(2));
    const rating = Number(clip(normal(4.0, 0.55), 1, 5).toFixed(1));
    const numberOfReviews = Math.round(clip(gammaLike(), 0, 5000));
    const stockQuantity = Math.round(clip(normal(130, 70), 0, 600));
    const discountPercentage = Math.round(clip(normal(15, 12), 0, 70));
    const warrantyMonths = pick(details.warranty);
    const affordabilityScore = 1 - (price - minPrice) / (maxPrice - minPrice);
    const qualityScore = rating / 5;
    const promotionScore = discountPercentage / 70;
    const reviewScore = Math.log1p(numberOfReviews) / Math.log1p(5000);
    const baseDemand = 0.3 * affordabilityScore + 0.28 * qualityScore + 0.2 * reviewScore + 0.14 * promotionScore + normal(0, 0.08);
    const soldUnits = Math.round(clip(baseDemand * normal(850, 140), 0, 2000));
    const demandLevel = soldUnits >= 520 ? "High" : soldUnits >= 260 ? "Medium" : "Low";

    rows.push({
      ProductID: `EOS-${String(i).padStart(5, "0")}`,
      ProductName: `${brand} ${descriptor} ${code}`,
      Category: category,
      Brand: brand,
      Price: price,
      Rating: rating,
      NumberOfReviews: numberOfReviews,
      StockQuantity: stockQuantity,
      DiscountPercentage: discountPercentage,
      WarrantyMonths: warrantyMonths,
      SoldUnits: soldUnits,
      DemandLevel: demandLevel,
    });
  }
  return rows;
}

function injectIssues(rows) {
  const dirty = rows.map((row) => ({ ...row }));
  for (const col of ["Price", "Rating", "NumberOfReviews", "StockQuantity", "DiscountPercentage", "WarrantyMonths", "Brand"]) {
    const missingCount = Math.max(1, Math.floor(dirty.length * (0.01 + random() * 0.025)));
    for (let i = 0; i < missingCount; i += 1) dirty[Math.floor(random() * dirty.length)][col] = "";
  }
  for (let i = 0; i < 35; i += 1) dirty.push({ ...dirty[Math.floor(random() * dirty.length)] });
  for (let i = 0; i < 10; i += 1) dirty[Math.floor(random() * dirty.length)].Price *= 4 + random() * 3;
  for (let i = 0; i < 10; i += 1) dirty[Math.floor(random() * dirty.length)].NumberOfReviews *= 8 + Math.floor(random() * 7);
  for (let i = 0; i < 10; i += 1) dirty[Math.floor(random() * dirty.length)].SoldUnits *= 4 + Math.floor(random() * 5);
  return dirty;
}

function cleanDataset(rows) {
  const unique = [...new Map(rows.map((row) => [JSON.stringify(row), row])).values()].map((row) => ({ ...row }));
  const numericCols = ["Price", "Rating", "NumberOfReviews", "StockQuantity", "DiscountPercentage", "WarrantyMonths", "SoldUnits"];
  const categoricalCols = ["ProductName", "Category", "Brand", "DemandLevel"];
  for (const col of numericCols) {
    const fill = median(unique.map((row) => row[col]));
    for (const row of unique) row[col] = row[col] === "" || Number.isNaN(Number(row[col])) ? fill : Number(row[col]);
  }
  for (const col of categoricalCols) {
    const fill = mode(unique.map((row) => row[col]));
    for (const row of unique) row[col] = row[col] || fill;
  }
  const outlierSummary = {};
  for (const col of numericCols) {
    const values = unique.map((row) => Number(row[col]));
    const q1 = quantile(values, 0.25);
    const q3 = quantile(values, 0.75);
    const iqr = q3 - q1;
    const lower = q1 - 1.5 * iqr;
    const upper = q3 + 1.5 * iqr;
    let capped = 0;
    for (const row of unique) {
      const old = Number(row[col]);
      const next = clip(old, lower, upper);
      if (old !== next) capped += 1;
      row[col] = next;
    }
    outlierSummary[col] = { lower: Number(lower.toFixed(2)), upper: Number(upper.toFixed(2)), capped };
  }
  for (const row of unique) {
    row.Price = Number(row.Price.toFixed(2));
    row.Rating = Number(clip(row.Rating, 1, 5).toFixed(1));
    for (const col of ["NumberOfReviews", "StockQuantity", "DiscountPercentage", "WarrantyMonths", "SoldUnits"]) {
      row[col] = Math.round(row[col]);
    }
  }
  return { cleaned: unique, outlierSummary };
}

function countBy(rows, col) {
  const counts = new Map();
  for (const row of rows) counts.set(row[col], (counts.get(row[col]) || 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}
function missingPercent(rows) {
  const cols = Object.keys(rows[0]);
  return cols.map((col) => [col, (rows.filter((row) => row[col] === "" || row[col] === null || row[col] === undefined).length / rows.length) * 100]).sort((a, b) => b[1] - a[1]);
}
function svgShell(width, height, title, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="#ffffff"/>
  <text x="${width / 2}" y="34" text-anchor="middle" font-family="Arial" font-size="22" font-weight="700" fill="#20232a">${title}</text>
  ${body}
</svg>`;
}
function barChart(title, data, fileName, width = 1000, height = 620) {
  const max = Math.max(...data.map((item) => item[1]), 1);
  const left = 230;
  const top = 70;
  const rowH = Math.min(38, (height - 110) / data.length);
  const bars = data.map(([label, value], i) => {
    const y = top + i * rowH;
    const w = ((width - left - 110) * value) / max;
    return `<text x="${left - 12}" y="${y + rowH * 0.65}" text-anchor="end" font-family="Arial" font-size="14" fill="#333">${label}</text>
    <rect x="${left}" y="${y + 6}" width="${w}" height="${rowH - 12}" rx="3" fill="#2a9d8f"/>
    <text x="${left + w + 8}" y="${y + rowH * 0.65}" font-family="Arial" font-size="13" fill="#333">${value.toFixed(value < 10 ? 1 : 0)}</text>`;
  }).join("\n");
  return writeImage(fileName, svgShell(width, height, title, bars));
}
function boxChart(title, rows, cols, fileName) {
  const width = 1200;
  const height = 720;
  const plotW = 135;
  const plotH = 450;
  const gap = 30;
  const top = 90;
  const left = 50;
  const body = cols.map((col, i) => {
    const x = left + i * (plotW + gap);
    const values = rows.map((row) => Number(row[col])).filter(Number.isFinite).sort((a, b) => a - b);
    const min = values[0];
    const max = values.at(-1);
    const q1 = quantile(values, 0.25);
    const med = quantile(values, 0.5);
    const q3 = quantile(values, 0.75);
    const y = (v) => top + plotH - ((v - min) / Math.max(max - min, 1)) * plotH;
    return `<line x1="${x + plotW / 2}" y1="${y(min)}" x2="${x + plotW / 2}" y2="${y(max)}" stroke="#555"/>
    <rect x="${x + 30}" y="${y(q3)}" width="${plotW - 60}" height="${Math.max(2, y(q1) - y(q3))}" fill="#8ecae6" stroke="#2563eb"/>
    <line x1="${x + 30}" y1="${y(med)}" x2="${x + plotW - 30}" y2="${y(med)}" stroke="#111" stroke-width="2"/>
    <line x1="${x + 42}" y1="${y(min)}" x2="${x + plotW - 42}" y2="${y(min)}" stroke="#555"/>
    <line x1="${x + 42}" y1="${y(max)}" x2="${x + plotW - 42}" y2="${y(max)}" stroke="#555"/>
    <text x="${x + plotW / 2}" y="${top + plotH + 30}" text-anchor="middle" font-family="Arial" font-size="13" fill="#333">${col}</text>`;
  }).join("\n");
  return writeImage(fileName, svgShell(width, height, title, body));
}
function heatmap(title, rows, cols, fileName) {
  const width = 900;
  const height = 820;
  const cell = 82;
  const left = 230;
  const top = 95;
  const corr = (a, b) => {
    const av = rows.map((row) => Number(row[a]));
    const bv = rows.map((row) => Number(row[b]));
    const ma = av.reduce((s, v) => s + v, 0) / av.length;
    const mb = bv.reduce((s, v) => s + v, 0) / bv.length;
    let num = 0, da = 0, db = 0;
    for (let i = 0; i < av.length; i += 1) {
      num += (av[i] - ma) * (bv[i] - mb);
      da += (av[i] - ma) ** 2;
      db += (bv[i] - mb) ** 2;
    }
    return num / Math.sqrt(da * db);
  };
  const body = cols.map((c1, i) => cols.map((c2, j) => {
    const value = corr(c1, c2);
    const red = value > 0 ? Math.round(255 - 80 * value) : 255;
    const blue = value < 0 ? Math.round(255 + 80 * value) : 255;
    const fill = `rgb(${red},${Math.round(245 - Math.abs(value) * 70)},${blue})`;
    return `<rect x="${left + j * cell}" y="${top + i * cell}" width="${cell}" height="${cell}" fill="${fill}" stroke="#fff"/>
      <text x="${left + j * cell + cell / 2}" y="${top + i * cell + cell / 2 + 5}" text-anchor="middle" font-family="Arial" font-size="14" fill="#222">${value.toFixed(2)}</text>`;
  }).join("\n")).join("\n") + cols.map((col, i) =>
    `<text x="${left - 10}" y="${top + i * cell + cell / 2 + 5}" text-anchor="end" font-family="Arial" font-size="13">${col}</text>
     <text x="${left + i * cell + cell / 2}" y="${top - 12}" text-anchor="middle" font-family="Arial" font-size="12" transform="rotate(-38 ${left + i * cell + cell / 2} ${top - 12})">${col}</text>`
  ).join("\n");
  return writeImage(fileName, svgShell(width, height, title, body));
}
async function writeImage(fileName, svg) {
  const svgPath = path.join(OUTPUT_DIR, fileName.replace(".png", ".svg"));
  const pngPath = path.join(OUTPUT_DIR, fileName);
  fs.writeFileSync(svgPath, svg);
  await sharp(Buffer.from(svg)).png().toFile(pngPath);
}

fs.mkdirSync(OUTPUT_DIR, { recursive: true });
const raw = injectIssues(createDataset());
const { cleaned, outlierSummary } = cleanDataset(raw);
writeCsv(path.join(OUTPUT_DIR, "electronic_online_shop_raw.csv"), raw);
writeCsv(path.join(OUTPUT_DIR, "electronic_online_shop_cleaned.csv"), cleaned);
fs.writeFileSync(path.join(OUTPUT_DIR, "cleaning_report.json"), JSON.stringify({
  rawShape: [raw.length, Object.keys(raw[0]).length],
  cleanedShape: [cleaned.length, Object.keys(cleaned[0]).length],
  rawDuplicates: duplicateCount(raw),
  cleanedDuplicates: duplicateCount(cleaned),
  rawMissing: Object.fromEntries(missingPercent(raw)),
  cleanedMissing: Object.fromEntries(missingPercent(cleaned)),
  outlierSummary,
  demandDistribution: Object.fromEntries(countBy(cleaned, "DemandLevel")),
}, null, 2));

await barChart("Missing Values Before Cleaning (%)", missingPercent(raw), "01_missing_values_before_cleaning.png");
await barChart("Duplicate Rows Before vs After Cleaning", [["Before Cleaning", duplicateCount(raw)], ["After Cleaning", duplicateCount(cleaned)]], "02_duplicate_rows.png", 820, 420);
await boxChart("Outliers Before Cleaning", raw, ["Price", "Rating", "NumberOfReviews", "StockQuantity", "DiscountPercentage", "WarrantyMonths", "SoldUnits"], "03_outliers_before_cleaning.png");
await boxChart("Outliers After Cleaning", cleaned, ["Price", "Rating", "NumberOfReviews", "StockQuantity", "DiscountPercentage", "WarrantyMonths", "SoldUnits"], "04_outliers_after_cleaning.png");
await barChart("Target Class Distribution", countBy(cleaned, "DemandLevel"), "05_demand_level_distribution.png", 820, 460);
await heatmap("Numeric Feature Correlation After Cleaning", cleaned, ["Price", "Rating", "NumberOfReviews", "StockQuantity", "DiscountPercentage", "WarrantyMonths", "SoldUnits"], "06_numeric_correlation_heatmap.png");

const demandByCategory = [];
for (const category of Object.keys(catalog)) {
  for (const level of ["Low", "Medium", "High"]) {
    demandByCategory.push([`${category} - ${level}`, cleaned.filter((row) => row.Category === category && row.DemandLevel === level).length]);
  }
}
await barChart("Demand Level by Product Category", demandByCategory, "07_demand_by_category.png", 1100, 1080);

console.log(JSON.stringify({
  rawRows: raw.length,
  cleanedRows: cleaned.length,
  outputDir: path.resolve(OUTPUT_DIR),
  rawDuplicates: duplicateCount(raw),
  cleanedDuplicates: duplicateCount(cleaned),
}, null, 2));
