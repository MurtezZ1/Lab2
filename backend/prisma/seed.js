import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const sampleProducts = [
  {
    id: 1,
    name: "Lenovo L15 I7",
    manufacturer: "Lenovo",
    model: "L15 I7",
    type: "laptop",
    year: 2019,
    price: 349.99,
    processor: "Intel Core i7-8650U",
    ram_size: "16GB DDR4",
    storage: "512GB SSD + 1TB HDD",
    display: "15.6-inch Full HD IPS",
    os: "Windows 11 Pro",
    battery: "Up to 10 hours",
    weight: "1.9 kg",
    dimensions: "36.3 x 25.5 x 2.0 cm",
    keyboard: "Backlit keyboard",
    ports: "USB-C, 2x USB-A, HDMI, Ethernet, 3.5mm audio",
    connectivity: "Wi-Fi 5, Bluetooth 5.0",
    camera: "720p HD webcam",
    additional_features: "Fingerprint reader, TPM security, business-grade chassis",
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=900&q=80",
    description: "Powerful Lenovo laptop with Intel Core i7 processor, 16GB RAM, and hybrid storage.",
  },
  {
    id: 2,
    name: "HP Spectre XT Ultrabook",
    manufacturer: "HP",
    model: "Spectre XT Ultrabook",
    type: "laptop",
    year: 2019,
    price: 349.99,
    processor: "Intel Core i7-8550U",
    ram_size: "16GB DDR4",
    storage: "512GB SSD + 1TB HDD",
    display: "13.3-inch Full HD IPS",
    os: "Windows 11 Home",
    battery: "Up to 9 hours",
    weight: "1.39 kg",
    dimensions: "31.6 x 22.4 x 1.5 cm",
    keyboard: "Backlit keyboard",
    ports: "USB-C, 2x USB-A, HDMI, 3.5mm audio",
    connectivity: "Wi-Fi 5, Bluetooth 4.2",
    camera: "720p HD webcam",
    additional_features: "Aluminum body, fast SSD storage, premium ultrabook design",
    image: "https://images.unsplash.com/photo-1484788984921-03950022c9ef?auto=format&fit=crop&w=900&q=80",
    description: "Stylish HP ultrabook with backlit keyboard, strong storage, and portable design.",
  },
  {
    id: 3,
    name: "Dell Inspiron 14",
    manufacturer: "Dell",
    model: "Inspiron 14",
    type: "laptop",
    year: 2020,
    price: 899.99,
    processor: "Intel Core i5-10210U",
    ram_size: "8GB DDR4",
    storage: "256GB SSD",
    display: "14-inch Full HD LED",
    os: "Windows 11 Home",
    battery: "Up to 8 hours",
    weight: "1.6 kg",
    dimensions: "32.8 x 23.9 x 1.9 cm",
    keyboard: "Standard chiclet keyboard",
    ports: "USB-C, 2x USB-A, HDMI, SD card reader",
    connectivity: "Wi-Fi 5, Bluetooth 5.0",
    camera: "720p HD webcam",
    additional_features: "Compact chassis, fast boot SSD, everyday productivity performance",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",
    description: "Compact Dell laptop with reliable everyday performance.",
  },
  {
    id: 4,
    name: "Acer Aspire 5",
    manufacturer: "Acer",
    model: "Aspire 5",
    type: "laptop",
    year: 2021,
    price: 599.99,
    processor: "AMD Ryzen 5 4500U",
    ram_size: "12GB DDR4",
    storage: "512GB SSD",
    display: "15.6-inch Full HD IPS",
    os: "Windows 11 Home",
    battery: "Up to 10 hours",
    weight: "1.8 kg",
    dimensions: "36.3 x 25.0 x 1.8 cm",
    keyboard: "Backlit keyboard",
    ports: "USB-C, 2x USB-A, HDMI, Ethernet, audio jack",
    connectivity: "Wi-Fi 6, Bluetooth 5.1",
    camera: "720p HD webcam",
    additional_features: "AMD Radeon graphics, slim bezels, upgradeable memory",
    image: "https://hnsgsfp.imgix.net/9/images/detailed/78/Acer_Aspire_5_15.6-inch_Laptop_-_Silver_(IMG_1).jpg",
    description: "Acer laptop with Ryzen processor, Radeon graphics, and large SSD.",
  },
  {
    id: 5,
    name: "Samsung Galaxy S21",
    manufacturer: "Samsung",
    model: "Galaxy S21",
    type: "smartphone",
    year: 2021,
    price: 799.99,
    processor: "Exynos 2100 / Snapdragon 888",
    ram_size: "8GB RAM",
    storage: "128GB / 256GB",
    display: "6.2-inch Dynamic AMOLED 2X 120Hz",
    os: "Android 14 compatible",
    battery: "4000mAh",
    weight: "169 g",
    dimensions: "151.7 x 71.2 x 7.9 mm",
    keyboard: "On-screen keyboard",
    ports: "USB-C",
    connectivity: "5G, Wi-Fi 6, Bluetooth 5.0, NFC",
    camera: "12MP wide + 64MP telephoto + 12MP ultrawide",
    additional_features: "IP68 water resistance, wireless charging, ultrasonic fingerprint sensor",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80",
    description: "Samsung smartphone with 5G connectivity and triple rear camera system.",
  },
  {
    id: 6,
    name: "Apple iPad Pro (2022)",
    manufacturer: "Apple",
    model: "iPad Pro (2022)",
    type: "tablet",
    year: 2022,
    price: 1099.99,
    processor: "Apple M2",
    ram_size: "8GB RAM",
    storage: "256GB / 512GB / 1TB / 2TB",
    display: "12.9-inch Liquid Retina XDR 120Hz",
    os: "iPadOS 17 compatible",
    battery: "Up to 10 hours",
    weight: "682 g",
    dimensions: "280.6 x 214.9 x 6.4 mm",
    keyboard: "Magic Keyboard compatible",
    ports: "USB-C Thunderbolt",
    connectivity: "Wi-Fi 6E, Bluetooth 5.3, optional 5G",
    camera: "12MP wide + 10MP ultrawide, LiDAR scanner",
    additional_features: "Apple Pencil hover, Face ID, ProMotion display",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=900&q=80",
    description: "Apple tablet with M2 chip, ProMotion display, and USB-C connectivity.",
  },
  {
    id: 7,
    name: "Sony Alpha A7III",
    manufacturer: "Sony",
    model: "Alpha A7III",
    type: "camera",
    year: 2018,
    price: 1999.99,
    processor: "BIONZ X image processor",
    ram_size: "High-speed image buffer",
    storage: "Dual SD card slots",
    display: "3.0-inch tilting touchscreen LCD",
    os: "Sony camera firmware",
    battery: "NP-FZ100, approx. 610 shots",
    weight: "650 g",
    dimensions: "126.9 x 95.6 x 73.7 mm",
    keyboard: "Physical control dials and touchscreen",
    ports: "USB-C, Micro HDMI, microphone, headphone",
    connectivity: "Wi-Fi, NFC, Bluetooth",
    camera: "24.2MP full-frame Exmor R CMOS sensor",
    additional_features: "693 phase-detection AF points, 5-axis stabilization, 4K video",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80",
    description: "High-performance full-frame Sony camera with fast hybrid autofocus.",
  },
  {
    id: 8,
    name: "Fitbit Charge 5",
    manufacturer: "Fitbit",
    model: "Charge 5",
    type: "fitness tracker",
    year: 2022,
    price: 149.99,
    processor: "Fitbit health tracking chipset",
    ram_size: "Low-power wearable memory",
    storage: "7 days of detailed motion data",
    display: "1.04-inch AMOLED color touchscreen",
    os: "Fitbit OS",
    battery: "Up to 7 days",
    weight: "29 g",
    dimensions: "36.7 x 22.7 x 11.2 mm",
    keyboard: "Touchscreen controls",
    ports: "Magnetic charging connector",
    connectivity: "Bluetooth LE, GPS, NFC",
    camera: "No built-in camera",
    additional_features: "ECG app, SpO2 tracking, stress management, sleep score",
    image: "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?auto=format&fit=crop&w=900&q=80",
    description: "Fitness tracker with GPS, stress tracking, SpO2 sensor, and long battery life.",
  },
  {
    id: 9,
    name: "Apple MacBook Air M2",
    manufacturer: "Apple",
    model: "MacBook Air M2",
    type: "laptop",
    year: 2022,
    price: 1199.99,
    processor: "Apple M2",
    ram_size: "8GB Unified Memory",
    storage: "256GB SSD",
    display: "13.6-inch Liquid Retina",
    os: "macOS Sonoma compatible",
    battery: "Up to 18 hours",
    weight: "1.24 kg",
    dimensions: "30.41 x 21.5 x 1.13 cm",
    keyboard: "Backlit Magic Keyboard with Touch ID",
    ports: "MagSafe 3, 2x Thunderbolt / USB 4, 3.5mm audio",
    connectivity: "Wi-Fi 6, Bluetooth 5.3",
    camera: "1080p FaceTime HD camera",
    additional_features: "Fanless design, four-speaker sound system, Touch ID",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80",
    description: "Lightweight Apple laptop with M2 performance, Retina display, and all-day battery life.",
  },
  {
    id: 10,
    name: "Sony WH-1000XM5",
    manufacturer: "Sony",
    model: "WH-1000XM5",
    type: "headphones",
    year: 2022,
    price: 399.99,
    processor: "Sony Integrated Processor V1",
    ram_size: "Audio DSP memory",
    storage: "Bluetooth multipoint profiles",
    display: "No display",
    os: "Sony Headphones Connect firmware",
    battery: "Up to 30 hours",
    weight: "250 g",
    dimensions: "Soft-fit over-ear design",
    keyboard: "Touch controls and physical power button",
    ports: "USB-C charging, 3.5mm audio",
    connectivity: "Bluetooth 5.2, NFC, multipoint pairing",
    camera: "No built-in camera",
    additional_features: "Adaptive noise cancellation, LDAC support, speak-to-chat",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    description: "Premium wireless noise cancelling headphones with rich sound and long battery life.",
  },
  {
    id: 11,
    name: "Samsung Odyssey G7",
    manufacturer: "Samsung",
    model: "Odyssey G7",
    type: "monitor",
    year: 2021,
    price: 549.99,
    processor: "Samsung gaming monitor controller",
    ram_size: "Display processing memory",
    storage: "Custom display presets",
    display: "32-inch QHD 240Hz",
    os: "Monitor firmware",
    battery: "AC power",
    weight: "7.2 kg with stand",
    dimensions: "71.0 x 59.4 x 30.6 cm",
    keyboard: "On-screen display joystick controls",
    ports: "2x DisplayPort 1.4, HDMI 2.0, USB hub, headphone",
    connectivity: "Wired display connectivity",
    camera: "No built-in camera",
    additional_features: "1000R curvature, 1ms response time, G-Sync compatible, FreeSync Premium Pro",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80",
    description: "Curved gaming monitor with high refresh rate, QHD resolution, and immersive visuals.",
  },
  {
    id: 12,
    name: "Canon EOS R50",
    manufacturer: "Canon",
    model: "EOS R50",
    type: "camera",
    year: 2023,
    price: 679.99,
    processor: "DIGIC X image processor",
    ram_size: "High-speed image buffer",
    storage: "SD / SDHC / SDXC card slot",
    display: "3.0-inch vari-angle touchscreen LCD",
    os: "Canon camera firmware",
    battery: "LP-E17, approx. 440 shots",
    weight: "375 g",
    dimensions: "116.3 x 85.5 x 68.8 mm",
    keyboard: "Physical mode dial and touchscreen controls",
    ports: "USB-C, Micro HDMI, microphone input",
    connectivity: "Wi-Fi, Bluetooth",
    camera: "24.2MP APS-C CMOS sensor",
    additional_features: "Dual Pixel CMOS AF II, 4K video, subject tracking",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=900&q=80",
    description: "Compact mirrorless camera for creators, travel photography, and high-quality video.",
  },
  {
    id: 13,
    name: "Nintendo Switch OLED",
    manufacturer: "Nintendo",
    model: "Switch OLED",
    type: "gaming console",
    year: 2021,
    price: 349.99,
    processor: "NVIDIA custom Tegra processor",
    ram_size: "4GB RAM",
    storage: "64GB",
    display: "7-inch OLED 720p touchscreen",
    os: "Nintendo Switch system software",
    battery: "4310mAh, approx. 4.5-9 hours",
    weight: "420 g with Joy-Con",
    dimensions: "24.2 x 10.2 x 1.39 cm",
    keyboard: "Joy-Con controllers and touchscreen keyboard",
    ports: "USB-C, HDMI through dock, game card slot",
    connectivity: "Wi-Fi, Bluetooth 4.1, wired LAN via dock",
    camera: "IR motion camera in right Joy-Con",
    additional_features: "TV dock, tabletop mode, handheld mode, detachable Joy-Con controllers",
    image: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&w=900&q=80",
    description: "Portable gaming console with vivid OLED display, TV dock, and flexible play modes.",
  },
  {
    id: 14,
    name: "LG OLED C3 55",
    manufacturer: "LG",
    model: "OLED C3 55",
    type: "tv",
    year: 2023,
    price: 1399.99,
    processor: "LG α9 AI Processor Gen6",
    ram_size: "Smart TV system memory",
    storage: "Built-in app storage",
    display: "55-inch 4K OLED",
    os: "webOS 23",
    battery: "AC power",
    weight: "16.0 kg with stand",
    dimensions: "122.2 x 75.7 x 23.0 cm",
    keyboard: "Magic Remote and on-screen keyboard",
    ports: "4x HDMI 2.1, 3x USB, Ethernet, optical audio",
    connectivity: "Wi-Fi 6, Bluetooth 5.0, AirPlay 2",
    camera: "No built-in camera",
    additional_features: "Dolby Vision, Dolby Atmos, 120Hz panel, G-Sync and FreeSync support",
    image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=900&q=80",
    description: "Premium OLED smart TV with deep contrast, 4K resolution, and cinema-grade picture quality.",
  },
  {
    id: 15,
    name: "Bose SoundLink Flex",
    manufacturer: "Bose",
    model: "SoundLink Flex",
    type: "speaker",
    year: 2021,
    price: 149.99,
    processor: "Bose digital signal processor",
    ram_size: "Audio DSP memory",
    storage: "Bluetooth pairing memory",
    display: "No display",
    os: "Bose portable speaker firmware",
    battery: "Up to 12 hours",
    weight: "580 g",
    dimensions: "20.1 x 9.0 x 5.2 cm",
    keyboard: "Physical buttons",
    ports: "USB-C charging",
    connectivity: "Bluetooth 4.2",
    camera: "No built-in camera",
    additional_features: "IP67 waterproof design, PositionIQ audio, built-in microphone",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=80",
    description: "Portable Bluetooth speaker with durable design, clear sound, and waterproof protection.",
  },
  {
    id: 16,
    name: "Microsoft Surface Pro 9",
    manufacturer: "Microsoft",
    model: "Surface Pro 9",
    type: "tablet",
    year: 2022,
    price: 999.99,
    processor: "Intel Core i5",
    ram_size: "8GB RAM",
    storage: "256GB SSD",
    display: "13-inch PixelSense Flow 120Hz touchscreen",
    os: "Windows 11 Home",
    battery: "Up to 15.5 hours",
    weight: "879 g",
    dimensions: "28.7 x 20.9 x 0.93 cm",
    keyboard: "Surface Pro Signature Keyboard compatible",
    ports: "2x USB-C Thunderbolt 4, Surface Connect",
    connectivity: "Wi-Fi 6E, Bluetooth 5.1",
    camera: "10MP rear camera, 1080p front camera",
    additional_features: "Kickstand, Slim Pen 2 support, Windows Hello face authentication",
    image: "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?auto=format&fit=crop&w=900&q=80",
    description: "Versatile 2-in-1 tablet and laptop experience with touchscreen productivity features.",
  },
];

const roles = [
  { name: "Admin", description: "Full platform administrator." },
  { name: "Manager", description: "Product and order manager." },
  { name: "Customer", description: "Default customer role." },
];

const permissions = [
  "Create Product",
  "Update Product",
  "Delete Product",
  "Manage Orders",
  "Manage Users",
  "View Reports",
].map((name) => ({ name, description: `${name} permission.` }));

const rolePermissions = {
  Admin: permissions.map((permission) => permission.name),
  Manager: ["Create Product", "Update Product", "Manage Orders", "View Reports"],
  Customer: [],
};

const slugify = (value) =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const stringify = (value) => {
  if (value === undefined || value === null) return null;
  return typeof value === "string" ? value : JSON.stringify(value);
};

async function seedRolesAndPermissions() {
  for (const role of roles) {
    await prisma.role.upsert({ where: { name: role.name }, update: role, create: role });
  }

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { name: permission.name },
      update: permission,
      create: permission,
    });
  }

  for (const [roleName, permissionNames] of Object.entries(rolePermissions)) {
    const role = await prisma.role.findUniqueOrThrow({ where: { name: roleName } });
    for (const permissionName of permissionNames) {
      const permission = await prisma.permission.findUniqueOrThrow({
        where: { name: permissionName },
      });
      await prisma.rolePermission.upsert({
        where: { role_id_permission_id: { role_id: role.id, permission_id: permission.id } },
        update: {},
        create: { role_id: role.id, permission_id: permission.id },
      });
    }
  }
}

async function seedAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@sunspot.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "AdminPassword123!";
  const adminRole = await prisma.role.findUniqueOrThrow({ where: { name: "Admin" } });

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      status: "ACTIVE",
      active: 1,
      role: "Admin",
      email_verified_at: new Date(),
    },
    create: {
      email: adminEmail,
      username: "admin",
      password_hash: await bcrypt.hash(adminPassword, 12),
      role: "Admin",
      active: 1,
      status: "ACTIVE",
      email_verified_at: new Date(),
      cart: { create: {} },
    },
  });

  await prisma.userRole.upsert({
    where: { user_id_role_id: { user_id: admin.id, role_id: adminRole.id } },
    update: {},
    create: { user_id: admin.id, role_id: adminRole.id, created_by: admin.id },
  });

  return admin;
}

async function seedCatalog(admin) {
  const rawProducts = sampleProducts;

  for (const rawProduct of rawProducts) {
    const categoryName = rawProduct.type ?? "laptop";
    const brandName = rawProduct.manufacturer ?? "Unknown";

    const category = await prisma.category.upsert({
      where: { slug: slugify(categoryName) },
      update: { name: categoryName },
      create: {
        name: categoryName,
        slug: slugify(categoryName),
        description: `${categoryName} products.`,
        created_by: admin.id,
        updated_by: admin.id,
      },
    });

    const brand = await prisma.brand.upsert({
      where: { slug: slugify(brandName) },
      update: { name: brandName },
      create: {
        name: brandName,
        slug: slugify(brandName),
        created_by: admin.id,
        updated_by: admin.id,
      },
    });

    const product = await prisma.product.upsert({
      where: { legacy_id: Number(rawProduct.id) },
      update: {
        category_id: category.id,
        brand_id: brand.id,
        name: rawProduct.name,
        manufacturer: brandName,
        model: rawProduct.model,
        type: categoryName,
        year: rawProduct.year ?? null,
        slug: `${slugify(rawProduct.name)}-${rawProduct.id}`,
        sku: `SUN-${rawProduct.id}`,
        description: rawProduct.description ?? null,
        price: String(rawProduct.price),
        processor: rawProduct.processor ?? null,
        ram_size: rawProduct.ram_size ?? null,
        storage: rawProduct.storage ?? null,
        display: stringify(rawProduct.display),
        os: rawProduct.os ?? null,
        battery: rawProduct.battery ?? null,
        weight: rawProduct.weight ?? null,
        dimensions: stringify(rawProduct.dimensions),
        keyboard: rawProduct.keyboard ?? null,
        ports: stringify(rawProduct.ports),
        connectivity: stringify(rawProduct.connectivity),
        camera: stringify(rawProduct.camera),
        additional_features: stringify(rawProduct.additional_features),
        image: rawProduct.image?.startsWith("data:image") ? "/file.svg" : rawProduct.image,
        updated_by: admin.id,
      },
      create: {
        legacy_id: Number(rawProduct.id),
        category_id: category.id,
        brand_id: brand.id,
        name: rawProduct.name,
        manufacturer: brandName,
        model: rawProduct.model,
        type: categoryName,
        year: rawProduct.year ?? null,
        slug: `${slugify(rawProduct.name)}-${rawProduct.id}`,
        sku: `SUN-${rawProduct.id}`,
        description: rawProduct.description ?? null,
        price: String(rawProduct.price),
        processor: rawProduct.processor ?? null,
        ram_size: rawProduct.ram_size ?? null,
        storage: rawProduct.storage ?? null,
        display: stringify(rawProduct.display),
        os: rawProduct.os ?? null,
        battery: rawProduct.battery ?? null,
        weight: rawProduct.weight ?? null,
        dimensions: stringify(rawProduct.dimensions),
        keyboard: rawProduct.keyboard ?? null,
        ports: stringify(rawProduct.ports),
        connectivity: stringify(rawProduct.connectivity),
        camera: stringify(rawProduct.camera),
        additional_features: stringify(rawProduct.additional_features),
        image: rawProduct.image?.startsWith("data:image") ? "/file.svg" : rawProduct.image,
        created_by: admin.id,
        updated_by: admin.id,
      },
    });

    await prisma.inventory.upsert({
      where: { product_id: product.id },
      update: { stock_quantity: 25, updated_by: admin.id },
      create: {
        product_id: product.id,
        stock_quantity: 25,
        reorder_level: 5,
        created_by: admin.id,
        updated_by: admin.id,
      },
    });

    if (product.image) {
      await prisma.productImage.upsert({
        where: { id: `${product.id}-primary` },
        update: { url: product.image, alt_text: product.name, updated_by: admin.id },
        create: {
          id: `${product.id}-primary`,
          product_id: product.id,
          url: product.image,
          alt_text: product.name,
          is_primary: true,
          created_by: admin.id,
          updated_by: admin.id,
        },
      });
    }
  }
}

async function seedSettings(admin) {
  await prisma.setting.upsert({
    where: { key: "store_name" },
    update: { value: "Sunspot Electronic Online Shop", updated_by: admin.id },
    create: {
      key: "store_name",
      value: "Sunspot Electronic Online Shop",
      created_by: admin.id,
      updated_by: admin.id,
    },
  });
}

async function main() {
  await seedRolesAndPermissions();
  const admin = await seedAdmin();
  await seedCatalog(admin);
  await seedSettings(admin);
  console.log("Seed completed: roles, permissions, admin user, brands, categories, products.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
