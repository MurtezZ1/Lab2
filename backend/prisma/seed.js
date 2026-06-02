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
    image: "https://www.westcoast.co.uk/Images/Product/Default/large/ecc050e8ccd192d4cd723e6fbe652951.jpg",
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
    image: "https://support.hp.com/doc-images/813/c03406488.jpg",
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
    image: "https://www.gollo.com/media/catalog/product/1/0/1002010024-nuev-_2__0sxfcyq14j5niokb.jpg",
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
    image: "https://i.ebayimg.com/images/g/Jh8AAOSwk9pie--O/s-l500.jpg",
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
    image: "https://ducttape.co.nz/media/cache/45/f4/45f44df6b27fe71a78846791a20fe1ff.jpg",
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
    image: "/file.svg",
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
    image: "/file.svg",
    description: "Fitness tracker with GPS, stress tracking, SpO2 sensor, and long battery life.",
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
