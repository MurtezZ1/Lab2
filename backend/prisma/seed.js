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

const technologyProductTemplates = [
  {
    manufacturer: "Apple",
    products: [
      ["iPhone 15 Pro", "smartphone", 2023, 999.99, "A17 Pro", "8GB RAM", "128GB / 256GB / 512GB / 1TB", "6.1-inch Super Retina XDR OLED 120Hz", "iOS 17 compatible", "3274mAh", "187 g", "146.6 x 70.6 x 8.25 mm", "On-screen keyboard", "USB-C", "5G, Wi-Fi 6E, Bluetooth 5.3, NFC", "48MP main + 12MP ultrawide + 12MP telephoto", "Titanium frame, Action Button, Face ID, MagSafe", 17, "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=900&q=80"],
      ["MacBook Pro 14 M3", "laptop", 2023, 1999.99, "Apple M3", "8GB Unified Memory", "512GB SSD", "14.2-inch Liquid Retina XDR 120Hz", "macOS Sonoma compatible", "Up to 22 hours", "1.55 kg", "31.26 x 22.12 x 1.55 cm", "Backlit Magic Keyboard with Touch ID", "MagSafe 3, 3x Thunderbolt 4, HDMI, SDXC, 3.5mm audio", "Wi-Fi 6E, Bluetooth 5.3", "1080p FaceTime HD camera", "Mini-LED display, six-speaker audio, hardware ray tracing", 18, "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80"],
      ["Apple Watch Series 9", "smartwatch", 2023, 399.99, "Apple S9 SiP", "Wearable system memory", "64GB", "Always-On Retina LTPO OLED", "watchOS 10 compatible", "Up to 18 hours", "31.9 g", "45 x 38 x 10.7 mm", "Touchscreen and Digital Crown", "Magnetic fast charger", "Wi-Fi, Bluetooth 5.3, NFC, optional LTE", "No built-in camera", "ECG, blood oxygen app, Double Tap gesture, crash detection", 19, "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=900&q=80"],
      ["AirPods Pro 2", "earbuds", 2022, 249.99, "Apple H2 chip", "Audio DSP memory", "Adaptive audio profiles", "No display", "AirPods firmware", "Up to 6 hours, 30 hours with case", "5.3 g each", "30.9 x 21.8 x 24.0 mm each", "Touch controls", "USB-C MagSafe charging case", "Bluetooth 5.3", "No built-in camera", "Active Noise Cancellation, Transparency Mode, Spatial Audio", 20, "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=900&q=80"],
    ],
  },
  {
    manufacturer: "Samsung",
    products: [
      ["Galaxy S24 Ultra", "smartphone", 2024, 1199.99, "Snapdragon 8 Gen 3 for Galaxy", "12GB RAM", "256GB / 512GB / 1TB", "6.8-inch Dynamic AMOLED 2X 120Hz", "Android 14 / One UI 6", "5000mAh", "232 g", "162.3 x 79.0 x 8.6 mm", "On-screen keyboard + S Pen", "USB-C", "5G, Wi-Fi 7, Bluetooth 5.3, NFC", "200MP wide + 50MP periscope + 10MP telephoto + 12MP ultrawide", "Titanium frame, S Pen, IP68, Galaxy AI", 21, "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=900&q=80"],
      ["Galaxy Tab S9", "tablet", 2023, 799.99, "Snapdragon 8 Gen 2 for Galaxy", "8GB RAM", "128GB / 256GB", "11-inch Dynamic AMOLED 2X 120Hz", "Android 14 compatible", "8400mAh", "498 g", "254.3 x 165.8 x 5.9 mm", "Book Cover Keyboard compatible", "USB-C", "Wi-Fi 6E, Bluetooth 5.3, optional 5G", "13MP rear, 12MP ultrawide front", "S Pen included, IP68, DeX mode", 22, "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=900&q=80"],
      ["Galaxy Watch 6 Classic", "smartwatch", 2023, 399.99, "Exynos W930", "2GB RAM", "16GB", "1.5-inch Super AMOLED", "Wear OS / One UI Watch", "425mAh", "59 g", "46.5 x 46.5 x 10.9 mm", "Touchscreen and rotating bezel", "Magnetic wireless charger", "Wi-Fi, Bluetooth 5.3, NFC, optional LTE", "No built-in camera", "ECG, body composition, sleep tracking, sapphire crystal", 23, "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80"],
      ["Samsung T7 Shield 2TB", "portable storage", 2022, 169.99, "USB 3.2 Gen 2 controller", "Storage controller cache", "2TB SSD", "No display", "Portable SSD firmware", "USB powered", "98 g", "88 x 59 x 13 mm", "No keyboard", "USB-C", "USB-C 10Gbps", "No built-in camera", "IP65 dust/water resistance, hardware encryption, rugged shell", 24, "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=900&q=80"],
    ],
  },
  {
    manufacturer: "Dell",
    products: [
      ["Dell XPS 13 Plus", "laptop", 2023, 1399.99, "Intel Core i7-1360P", "16GB LPDDR5", "512GB SSD", "13.4-inch 3.5K OLED touch", "Windows 11 Home", "Up to 12 hours", "1.26 kg", "29.5 x 19.9 x 1.53 cm", "Backlit edge-to-edge keyboard", "2x Thunderbolt 4", "Wi-Fi 6E, Bluetooth 5.3", "720p HD webcam", "Haptic touchpad, CNC aluminum, fingerprint reader", 25, "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80"],
      ["Dell Alienware m16 R2", "gaming laptop", 2024, 1899.99, "Intel Core Ultra 7 155H", "16GB DDR5", "1TB SSD", "16-inch QHD+ 240Hz", "Windows 11 Home", "90Wh battery", "2.61 kg", "36.4 x 24.9 x 2.4 cm", "AlienFX RGB keyboard", "Thunderbolt 4, USB-A, HDMI 2.1, Ethernet, audio", "Wi-Fi 7, Bluetooth 5.4", "1080p IR webcam", "NVIDIA RTX 4070, advanced cooling, Dolby Atmos", 26, "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=900&q=80"],
      ["Dell UltraSharp U2723QE", "monitor", 2022, 579.99, "Dell display controller", "Display processing memory", "Monitor presets", "27-inch 4K IPS Black", "Monitor firmware", "AC power", "6.6 kg with stand", "61.2 x 53.5 x 18.5 cm", "OSD joystick", "USB-C 90W, HDMI, DisplayPort, USB hub, Ethernet", "Wired display connectivity", "No built-in camera", "IPS Black panel, KVM switch, factory calibration", 27, "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80"],
    ],
  },
  {
    manufacturer: "Lenovo",
    products: [
      ["Lenovo ThinkPad X1 Carbon Gen 11", "laptop", 2023, 1599.99, "Intel Core i7-1365U", "16GB LPDDR5", "512GB SSD", "14-inch 2.8K OLED", "Windows 11 Pro", "Up to 15 hours", "1.12 kg", "31.5 x 22.2 x 1.5 cm", "Backlit ThinkPad keyboard", "2x Thunderbolt 4, 2x USB-A, HDMI, audio", "Wi-Fi 6E, Bluetooth 5.1", "1080p IR webcam", "MIL-STD durability, TrackPoint, fingerprint reader", 28, "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=900&q=80"],
      ["Lenovo Legion Pro 5", "gaming laptop", 2023, 1499.99, "AMD Ryzen 7 7745HX", "16GB DDR5", "1TB SSD", "16-inch WQXGA 165Hz", "Windows 11 Home", "80Wh battery", "2.5 kg", "36.3 x 26.0 x 2.6 cm", "4-zone RGB keyboard", "USB-C, USB-A, HDMI 2.1, Ethernet, audio", "Wi-Fi 6E, Bluetooth 5.1", "1080p webcam", "NVIDIA RTX 4070, Legion ColdFront cooling, AI Engine+", 29, "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=900&q=80"],
      ["Lenovo Tab P12", "tablet", 2023, 349.99, "MediaTek Dimensity 7050", "8GB RAM", "128GB storage", "12.7-inch 3K LTPS", "Android 13", "10200mAh", "615 g", "293.4 x 190.8 x 6.9 mm", "Keyboard Pack compatible", "USB-C", "Wi-Fi 6, Bluetooth 5.1", "13MP ultrawide front, 8MP rear", "Quad JBL speakers, Lenovo Tab Pen Plus support", 30, "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?auto=format&fit=crop&w=900&q=80"],
    ],
  },
  {
    manufacturer: "HP",
    products: [
      ["HP Spectre x360 14", "laptop", 2024, 1449.99, "Intel Core Ultra 7 155H", "16GB LPDDR5x", "1TB SSD", "14-inch 2.8K OLED 120Hz touch", "Windows 11 Home", "Up to 13 hours", "1.44 kg", "31.3 x 22.0 x 1.7 cm", "Backlit keyboard", "Thunderbolt 4, USB-A, audio", "Wi-Fi 7, Bluetooth 5.4", "9MP IR webcam", "360-degree hinge, stylus support, AI noise reduction", 31, "https://images.unsplash.com/photo-1484788984921-03950022c9ef?auto=format&fit=crop&w=900&q=80"],
      ["HP Omen 16", "gaming laptop", 2023, 1299.99, "Intel Core i7-13700HX", "16GB DDR5", "1TB SSD", "16.1-inch QHD 165Hz", "Windows 11 Home", "83Wh battery", "2.4 kg", "36.9 x 25.9 x 2.35 cm", "RGB backlit keyboard", "USB-C, USB-A, HDMI 2.1, Ethernet, audio", "Wi-Fi 6E, Bluetooth 5.3", "1080p webcam", "NVIDIA RTX 4060, Omen Tempest Cooling, DTS:X Ultra", 32, "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=900&q=80"],
      ["HP Envy Inspire 7955e", "printer", 2022, 219.99, "HP thermal inkjet controller", "Printer memory", "Cloud print profiles", "2.7-inch color touchscreen", "HP printer firmware", "AC power", "8.1 kg", "46.0 x 38.3 x 19.1 cm", "Touchscreen controls", "USB, power", "Wi-Fi, Bluetooth LE, HP Smart app", "Scanner camera module", "Print, scan, copy, photo printing, automatic document feeder", 33, "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=900&q=80"],
    ],
  },
  {
    manufacturer: "Sony",
    products: [
      ["Sony Xperia 1 V", "smartphone", 2023, 1199.99, "Snapdragon 8 Gen 2", "12GB RAM", "256GB storage", "6.5-inch 4K OLED 120Hz", "Android 14 compatible", "5000mAh", "187 g", "165 x 71 x 8.3 mm", "On-screen keyboard", "USB-C, 3.5mm audio", "5G, Wi-Fi 6E, Bluetooth 5.3, NFC", "48MP Exmor T main + 12MP ultrawide + 12MP telephoto", "IP65/IP68, microSD, creator video tools", 34, "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80"],
      ["Sony PlayStation 5 Slim", "gaming console", 2023, 499.99, "AMD Zen 2 8-core CPU", "16GB GDDR6", "1TB custom SSD", "4K HDR output", "PlayStation system software", "AC power", "3.2 kg", "35.8 x 9.6 x 21.6 cm", "DualSense controller", "USB-C, USB-A, HDMI 2.1, Ethernet", "Wi-Fi 6, Bluetooth 5.1", "No built-in camera", "Ray tracing, 3D audio, removable disc drive", 35, "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=900&q=80"],
      ["Sony ZV-E10", "camera", 2021, 699.99, "BIONZ X image processor", "High-speed image buffer", "SD card storage", "3.0-inch vari-angle touchscreen", "Sony camera firmware", "NP-FW50 battery, approx. 440 shots", "343 g", "115.2 x 64.2 x 44.8 mm", "Physical controls and touchscreen", "USB-C, Micro HDMI, microphone", "Wi-Fi, Bluetooth", "24.2MP APS-C CMOS sensor", "Real-time Eye AF, product showcase mode, 4K video", 36, "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=900&q=80"],
    ],
  },
  {
    manufacturer: "Logitech",
    products: [
      ["Logitech MX Master 3S", "mouse", 2022, 99.99, "Logitech precision sensor", "Onboard profiles", "Device memory", "No display", "Logi Options+ firmware", "Up to 70 days", "141 g", "124.9 x 84.3 x 51 mm", "7 buttons and MagSpeed wheel", "USB-C charging", "Bluetooth LE, Logi Bolt receiver", "No built-in camera", "8000 DPI sensor, quiet clicks, multi-device switching", 37, "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=80"],
      ["Logitech G Pro X Superlight 2", "gaming mouse", 2023, 159.99, "HERO 2 sensor", "Onboard gaming profiles", "Profile memory", "No display", "Logitech G firmware", "Up to 95 hours", "60 g", "125 x 63.5 x 40 mm", "5 programmable buttons", "USB-C charging", "LIGHTSPEED wireless", "No built-in camera", "32000 DPI, 4000Hz polling, PTFE feet", 38, "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=900&q=80"],
      ["Logitech MX Keys S", "keyboard", 2023, 109.99, "Logitech keyboard controller", "Profile memory", "Smart actions profiles", "No display", "Logi Options+ firmware", "Up to 10 days with backlight", "810 g", "430.2 x 131.6 x 20.5 mm", "Low-profile backlit keys", "USB-C charging", "Bluetooth LE, Logi Bolt receiver", "No built-in camera", "Smart illumination, multi-device typing, quiet keys", 39, "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80"],
    ],
  },
  {
    manufacturer: "ASUS",
    products: [
      ["ASUS ROG Zephyrus G14", "gaming laptop", 2024, 1699.99, "AMD Ryzen 9 8945HS", "32GB LPDDR5X", "1TB SSD", "14-inch 3K OLED 120Hz", "Windows 11 Home", "73Wh battery", "1.5 kg", "31.1 x 22.0 x 1.63 cm", "RGB backlit keyboard", "USB-C, USB-A, HDMI 2.1, audio", "Wi-Fi 6E, Bluetooth 5.3", "1080p IR webcam", "NVIDIA RTX 4070, AniMe Matrix, vapor chamber cooling", 40, "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=900&q=80"],
      ["ASUS Zenbook 14 OLED", "laptop", 2024, 999.99, "Intel Core Ultra 5 125H", "16GB LPDDR5X", "512GB SSD", "14-inch 3K OLED 120Hz", "Windows 11 Home", "Up to 15 hours", "1.2 kg", "31.2 x 22.0 x 1.49 cm", "Backlit keyboard", "Thunderbolt 4, USB-A, HDMI, audio", "Wi-Fi 6E, Bluetooth 5.3", "FHD IR webcam", "OLED HDR display, NumberPad touchpad, military-grade durability", 41, "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80"],
      ["ASUS TUF Gaming VG27AQ", "monitor", 2020, 299.99, "ASUS display controller", "Display processing memory", "GameVisual presets", "27-inch QHD IPS 165Hz", "Monitor firmware", "AC power", "5.8 kg", "62.0 x 50.7 x 21.1 cm", "OSD joystick controls", "DisplayPort, 2x HDMI, headphone", "Wired display connectivity", "No built-in camera", "ELMB Sync, G-Sync compatible, HDR10", 42, "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80"],
    ],
  },
  {
    manufacturer: "Microsoft",
    products: [
      ["Surface Laptop 5", "laptop", 2022, 999.99, "Intel Core i5-1235U", "8GB LPDDR5x", "256GB SSD", "13.5-inch PixelSense touchscreen", "Windows 11 Home", "Up to 18 hours", "1.29 kg", "30.8 x 22.3 x 1.45 cm", "Backlit keyboard", "Thunderbolt 4, USB-A, Surface Connect, audio", "Wi-Fi 6, Bluetooth 5.1", "720p HD webcam", "Alcantara or metal finish, Windows Hello, Omnisonic speakers", 43, "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?auto=format&fit=crop&w=900&q=80"],
      ["Xbox Series X", "gaming console", 2020, 499.99, "AMD Zen 2 8-core CPU", "16GB GDDR6", "1TB NVMe SSD", "4K 120Hz output", "Xbox system software", "AC power", "4.45 kg", "15.1 x 15.1 x 30.1 cm", "Xbox Wireless Controller", "HDMI 2.1, USB-A, Ethernet, storage expansion", "Wi-Fi 5, Bluetooth LE controller", "No built-in camera", "12 TFLOPS GPU, Quick Resume, ray tracing", 44, "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?auto=format&fit=crop&w=900&q=80"],
      ["Surface Headphones 2", "headphones", 2020, 249.99, "Microsoft audio processor", "Audio DSP memory", "Bluetooth pairing profiles", "No display", "Surface audio firmware", "Up to 20 hours", "290 g", "Over-ear fold-flat design", "Touch and dial controls", "USB-C charging, 3.5mm audio", "Bluetooth 5.0", "No built-in camera", "Adjustable noise cancellation, multipoint pairing, beamforming microphones", 45, "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80"],
    ],
  },
  {
    manufacturer: "Google",
    products: [
      ["Google Pixel 8 Pro", "smartphone", 2023, 999.99, "Google Tensor G3", "12GB RAM", "128GB / 256GB / 512GB / 1TB", "6.7-inch LTPO OLED 120Hz", "Android 14", "5050mAh", "213 g", "162.6 x 76.5 x 8.8 mm", "On-screen keyboard", "USB-C", "5G, Wi-Fi 7, Bluetooth 5.3, NFC", "50MP wide + 48MP ultrawide + 48MP telephoto", "Magic Editor, temperature sensor, IP68, seven years updates", 46, "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80"],
      ["Google Pixel Buds Pro", "earbuds", 2022, 199.99, "Google audio processor", "Audio DSP memory", "Audio profiles", "No display", "Pixel Buds firmware", "Up to 11 hours, 31 hours with case", "6.2 g each", "22.3 x 22.0 x 23.7 mm each", "Touch controls", "USB-C / Qi charging case", "Bluetooth 5.0", "No built-in camera", "Active Noise Cancellation, Transparency Mode, multipoint", 47, "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=900&q=80"],
      ["Google Nest Hub 2nd Gen", "smart display", 2021, 99.99, "Quad-core 64-bit ARM CPU", "1GB RAM", "Local assistant data", "7-inch touchscreen", "Google Nest software", "AC power", "558 g", "177.4 x 120.4 x 69.5 mm", "Touchscreen and voice controls", "Power connector", "Wi-Fi, Bluetooth, Thread", "No built-in camera", "Sleep Sensing, Google Assistant, smart home control", 48, "https://images.unsplash.com/photo-1558089687-f282ffcbc126?auto=format&fit=crop&w=900&q=80"],
    ],
  },
  {
    manufacturer: "DJI",
    products: [
      ["DJI Mini 4 Pro", "drone", 2023, 759.99, "DJI flight controller", "Flight processing memory", "microSD storage", "Controller display compatible", "DJI Fly firmware", "Up to 34 minutes", "249 g", "148 x 94 x 64 mm folded", "RC controller controls", "USB-C, microSD", "OcuSync 4.0, Wi-Fi, Bluetooth", "48MP 1/1.3-inch CMOS camera", "4K/60 HDR video, omnidirectional obstacle sensing, ActiveTrack 360", 49, "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?auto=format&fit=crop&w=900&q=80"],
      ["DJI Osmo Action 4", "action camera", 2023, 399.99, "DJI image processor", "Camera buffer memory", "microSD storage", "Dual touchscreen displays", "DJI camera firmware", "1770mAh", "145 g", "70.5 x 44.2 x 32.8 mm", "Touchscreen and physical buttons", "USB-C", "Wi-Fi, Bluetooth", "1/1.3-inch CMOS sensor", "4K/120 video, RockSteady stabilization, waterproof body", 50, "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=900&q=80"],
      ["DJI RS 3 Mini", "camera stabilizer", 2023, 369.99, "DJI stabilization controller", "Motion control memory", "Camera profiles", "1.4-inch full-color touchscreen", "DJI gimbal firmware", "Up to 10 hours", "795 g", "323 x 195 x 98 mm", "Touchscreen, trigger, joystick", "USB-C, NATO port", "Bluetooth shutter control", "No built-in camera", "3-axis stabilization, vertical shooting, 2kg payload", 51, "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80"],
    ],
  },
  {
    manufacturer: "Canon",
    products: [
      ["Canon EOS R8", "camera", 2023, 1499.99, "DIGIC X image processor", "High-speed image buffer", "SD UHS-II card slot", "3-inch vari-angle touchscreen", "Canon camera firmware", "LP-E17 battery", "461 g", "132.5 x 86.1 x 70.0 mm", "Physical dials and touchscreen", "USB-C, Micro HDMI, microphone, headphone", "Wi-Fi, Bluetooth", "24.2MP full-frame CMOS sensor", "Dual Pixel CMOS AF II, 4K 60p, subject detection", 52, "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=900&q=80"],
      ["Canon RF 50mm F1.8 STM", "camera lens", 2020, 199.99, "STM focus motor", "Lens control electronics", "No storage", "No display", "Lens firmware", "Camera powered", "160 g", "69.2 x 40.5 mm", "Manual focus/control ring", "Canon RF mount", "Camera body communication", "No built-in camera", "50mm prime lens, f/1.8 aperture, compact design", 53, "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?auto=format&fit=crop&w=900&q=80"],
      ["Canon PIXMA G3270", "printer", 2023, 229.99, "Canon inkjet controller", "Printer memory", "Print profiles", "1.35-inch LCD", "Canon printer firmware", "AC power", "6.0 kg", "41.6 x 33.7 x 17.7 cm", "Physical control buttons", "USB", "Wi-Fi", "Flatbed scanner", "MegaTank refillable ink, scan, copy, borderless photo printing", 54, "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=900&q=80"],
    ],
  },
  {
    manufacturer: "Bose",
    products: [
      ["Bose QuietComfort Ultra Headphones", "headphones", 2023, 429.99, "Bose audio DSP", "Audio processing memory", "Bluetooth profiles", "No display", "Bose firmware", "Up to 24 hours", "250 g", "Over-ear foldable design", "Physical and touch controls", "USB-C, 2.5mm audio", "Bluetooth 5.3", "No built-in camera", "Immersive Audio, world-class noise cancellation, multipoint", 55, "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80"],
      ["Bose QuietComfort Earbuds II", "earbuds", 2022, 279.99, "Bose CustomTune audio processor", "Audio DSP memory", "Audio calibration profiles", "No display", "Bose earbud firmware", "Up to 6 hours, 24 hours with case", "6.2 g each", "30 x 17 x 22 mm each", "Touch controls", "USB-C charging case", "Bluetooth 5.3", "No built-in camera", "Personalized ANC, aware mode, sweat resistant", 56, "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=900&q=80"],
      ["Bose Smart Soundbar 600", "soundbar", 2022, 499.99, "Bose audio processor", "Audio DSP memory", "Streaming profiles", "No display", "Bose smart speaker firmware", "AC power", "3.1 kg", "69.5 x 10.4 x 5.6 cm", "Remote and app controls", "HDMI eARC, optical, USB service", "Wi-Fi, Bluetooth, AirPlay 2, Chromecast", "No built-in camera", "Dolby Atmos, voice control, TrueSpace processing", 57, "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=900&q=80"],
    ],
  },
  {
    manufacturer: "LG",
    products: [
      ["LG UltraGear 27GR95QE", "monitor", 2023, 899.99, "LG OLED display controller", "Display processing memory", "Game presets", "27-inch QHD OLED 240Hz", "Monitor firmware", "AC power", "7.3 kg with stand", "60.4 x 57.4 x 25.8 cm", "Remote and joystick controls", "DisplayPort, 2x HDMI 2.1, USB hub, headphone", "Wired display connectivity", "No built-in camera", "0.03ms response, HDR10, G-Sync compatible, FreeSync Premium", 58, "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80"],
      ["LG Gram 17", "laptop", 2023, 1499.99, "Intel Core i7-1360P", "16GB LPDDR5", "1TB SSD", "17-inch WQXGA IPS", "Windows 11 Home", "Up to 20 hours", "1.35 kg", "37.9 x 25.9 x 1.78 cm", "Backlit keyboard with numpad", "Thunderbolt 4, USB-A, HDMI, microSD, audio", "Wi-Fi 6E, Bluetooth 5.1", "FHD IR webcam", "Ultra-light 17-inch chassis, MIL-STD durability", 59, "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80"],
      ["LG CineBeam HU70LA", "projector", 2019, 1299.99, "LG 4K projection processor", "Smart TV memory", "App storage", "4K UHD projection", "webOS", "AC power", "3.2 kg", "31.4 x 21.0 x 9.5 cm", "Remote and on-screen controls", "HDMI, USB, optical audio, Ethernet", "Wi-Fi, Bluetooth", "No built-in camera", "4K LED projector, HDR10, screen share, smart apps", 60, "https://images.unsplash.com/photo-1580508174046-170816f65662?auto=format&fit=crop&w=900&q=80"],
    ],
  },
  {
    manufacturer: "Acer",
    products: [
      ["Acer Predator Helios Neo 16", "gaming laptop", 2023, 1199.99, "Intel Core i7-13700HX", "16GB DDR5", "1TB SSD", "16-inch WQXGA 165Hz", "Windows 11 Home", "90Wh battery", "2.6 kg", "36.0 x 27.9 x 2.8 cm", "4-zone RGB keyboard", "USB-C, USB-A, HDMI 2.1, Ethernet, audio", "Wi-Fi 6E, Bluetooth 5.2", "1080p webcam", "NVIDIA RTX 4060, PredatorSense, advanced cooling", 61, "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=900&q=80"],
      ["Acer Swift Go 14 OLED", "laptop", 2023, 899.99, "Intel Core i7-13700H", "16GB LPDDR5", "512GB SSD", "14-inch 2.8K OLED 90Hz", "Windows 11 Home", "Up to 12 hours", "1.25 kg", "31.2 x 21.7 x 1.49 cm", "Backlit keyboard", "Thunderbolt 4, USB-A, HDMI, microSD", "Wi-Fi 6E, Bluetooth 5.2", "1440p QHD webcam", "OLED display, TwinAir cooling, fingerprint reader", 62, "https://hnsgsfp.imgix.net/9/images/detailed/78/Acer_Aspire_5_15.6-inch_Laptop_-_Silver_(IMG_1).jpg"],
      ["Acer Nitro XV272U", "monitor", 2022, 299.99, "Acer display controller", "Display processing memory", "Gaming presets", "27-inch QHD IPS 170Hz", "Monitor firmware", "AC power", "5.7 kg", "61.4 x 52.0 x 23.4 cm", "OSD joystick", "DisplayPort, 2x HDMI, audio", "Wired display connectivity", "No built-in camera", "FreeSync Premium, HDR400, 1ms VRB", 63, "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80"],
    ],
  },
  {
    manufacturer: "Razer",
    products: [
      ["Razer Blade 15", "gaming laptop", 2023, 2499.99, "Intel Core i7-13800H", "16GB DDR5", "1TB SSD", "15.6-inch QHD 240Hz", "Windows 11 Home", "80Wh battery", "2.01 kg", "35.5 x 23.5 x 1.7 cm", "Per-key RGB keyboard", "Thunderbolt 4, USB-C, USB-A, HDMI 2.1, audio", "Wi-Fi 6E, Bluetooth 5.3", "1080p webcam", "NVIDIA RTX 4070, vapor chamber cooling, CNC aluminum", 64, "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=900&q=80"],
      ["Razer BlackWidow V4 Pro", "gaming keyboard", 2023, 229.99, "Razer keyboard controller", "Onboard macro memory", "5 onboard profiles", "OLED command dial display", "Razer Synapse firmware", "USB powered", "1.13 kg", "466 x 152 x 44 mm", "Mechanical RGB keys", "USB-C cable, USB passthrough", "Wired USB", "No built-in camera", "Command dial, macro keys, Chroma RGB, magnetic wrist rest", 65, "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80"],
      ["Razer Kraken V3", "gaming headset", 2021, 99.99, "Razer audio controller", "Audio processing memory", "THX profiles", "No display", "Razer headset firmware", "USB powered", "325 g", "Over-ear headset design", "Volume and mute controls", "USB-A", "Wired USB", "No built-in camera", "THX Spatial Audio, HyperSense haptics, RGB lighting", 66, "https://images.unsplash.com/photo-1599669454699-248893623440?auto=format&fit=crop&w=900&q=80"],
    ],
  },
  {
    manufacturer: "Meta",
    products: [
      ["Meta Quest 3", "vr headset", 2023, 499.99, "Snapdragon XR2 Gen 2", "8GB RAM", "128GB / 512GB", "Dual LCD 2064 x 2208 per eye 120Hz", "Meta Quest OS", "Up to 2.2 hours", "515 g", "184 x 160 x 98 mm", "Touch Plus controllers", "USB-C, 3.5mm audio", "Wi-Fi 6E, Bluetooth 5.2", "Mixed reality passthrough cameras", "Pancake lenses, hand tracking, full-color passthrough", 67, "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&w=900&q=80"],
      ["Meta Quest Pro", "vr headset", 2022, 999.99, "Snapdragon XR2+ Gen 1", "12GB RAM", "256GB", "Dual LCD pancake optics 90Hz", "Meta Quest OS", "Up to 2 hours", "722 g", "265 x 127 x 196 mm", "Touch Pro controllers", "USB-C", "Wi-Fi 6E, Bluetooth 5.2", "Eye/face tracking and passthrough cameras", "Mixed reality, eye tracking, self-tracking controllers", 68, "https://images.unsplash.com/photo-1617802690992-15d93263d3a9?auto=format&fit=crop&w=900&q=80"],
    ],
  },
  {
    manufacturer: "TP-Link",
    products: [
      ["TP-Link Archer AXE75", "router", 2022, 199.99, "1.7GHz quad-core CPU", "Router system memory", "Firmware settings storage", "LED status indicators", "TP-Link router firmware", "AC power", "610 g", "272.5 x 147.2 x 49.2 mm", "Web/app controls", "Gigabit WAN, 4x Gigabit LAN, USB 3.0", "Tri-band Wi-Fi 6E, OneMesh", "No built-in camera", "5400Mbps Wi-Fi, WPA3, VPN server, OFDMA", 69, "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?auto=format&fit=crop&w=900&q=80"],
      ["TP-Link Deco XE75", "mesh router", 2022, 299.99, "Quad-core network processor", "Mesh system memory", "Network settings storage", "LED status indicator", "Deco firmware", "AC power", "450 g per unit", "105 x 105 x 169 mm", "App controls", "3x Gigabit Ethernet per unit", "Tri-band Wi-Fi 6E mesh", "No built-in camera", "AI-driven mesh, WPA3, 6GHz backhaul", 70, "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?auto=format&fit=crop&w=900&q=80"],
    ],
  },
  {
    manufacturer: "Anker",
    products: [
      ["Anker 737 Power Bank", "power bank", 2022, 149.99, "Anker PowerIQ 4.0 controller", "Power management memory", "Power usage data", "Smart digital display", "Anker charging firmware", "24000mAh", "630 g", "155.7 x 54.6 x 49.5 mm", "Physical button", "2x USB-C, USB-A", "Wired charging", "No built-in camera", "140W output, bidirectional USB-C, temperature monitoring", 71, "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=900&q=80"],
      ["Anker 735 Charger", "charger", 2022, 59.99, "GaNPrime power controller", "Power management memory", "Charging profiles", "No display", "Charger firmware", "AC power", "132 g", "66 x 38 x 29 mm", "No keyboard", "2x USB-C, USB-A", "Wired charging", "No built-in camera", "65W output, GaN technology, ActiveShield safety", 72, "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=900&q=80"],
    ],
  },
  {
    manufacturer: "Garmin",
    products: [
      ["Garmin Forerunner 965", "smartwatch", 2023, 599.99, "Garmin wearable processor", "Wearable memory", "32GB music/maps storage", "1.4-inch AMOLED touchscreen", "Garmin OS", "Up to 23 days smartwatch mode", "53 g", "47.2 x 47.2 x 13.2 mm", "Touchscreen and physical buttons", "Garmin charging port", "GPS, Wi-Fi, Bluetooth, ANT+", "No built-in camera", "Training readiness, maps, multi-band GPS, HRV status", 73, "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80"],
      ["Garmin Venu 3", "smartwatch", 2023, 449.99, "Garmin wearable processor", "Wearable memory", "8GB music storage", "1.4-inch AMOLED touchscreen", "Garmin OS", "Up to 14 days smartwatch mode", "47 g", "45 x 45 x 12 mm", "Touchscreen and buttons", "Garmin charging port", "GPS, Wi-Fi, Bluetooth, ANT+", "No built-in camera", "Sleep coach, ECG app, speaker/mic, body battery", 74, "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=900&q=80"],
    ],
  },
  {
    manufacturer: "JBL",
    products: [
      ["JBL Charge 5", "speaker", 2021, 179.99, "JBL audio DSP", "Audio processing memory", "Bluetooth profiles", "No display", "JBL speaker firmware", "Up to 20 hours", "960 g", "223 x 96.5 x 94 mm", "Physical buttons", "USB-C charging, USB-A powerbank output", "Bluetooth 5.1", "No built-in camera", "IP67 waterproof, PartyBoost, built-in powerbank", 75, "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=80"],
      ["JBL Tour One M2", "headphones", 2023, 299.99, "JBL audio DSP", "Audio processing memory", "Adaptive ANC profiles", "No display", "JBL headphones firmware", "Up to 50 hours", "268 g", "Over-ear foldable design", "Touch and button controls", "USB-C charging, 3.5mm audio", "Bluetooth 5.3", "No built-in camera", "Adaptive noise cancellation, Smart Talk, spatial sound", 76, "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80"],
    ],
  },
];

const extraTechnologyProducts = technologyProductTemplates.flatMap((group) =>
  group.products.map((product) => {
    const [
      name,
      type,
      year,
      price,
      processor,
      ram_size,
      storage,
      display,
      os,
      battery,
      weight,
      dimensions,
      keyboard,
      ports,
      connectivity,
      camera,
      additional_features,
      id,
      image,
    ] = product;

    return {
      id,
      name,
      manufacturer: group.manufacturer,
      model: String(name).replace(group.manufacturer, "").trim(),
      type,
      year,
      price,
      processor,
      ram_size,
      storage,
      display,
      os,
      battery,
      weight,
      dimensions,
      keyboard,
      ports,
      connectivity,
      camera,
      additional_features,
      image,
      description: `${group.manufacturer} ${name} with real-world technology specifications, current-generation features, and realistic retail pricing.`,
    };
  }),
);

sampleProducts.push(...extraTechnologyProducts);

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
