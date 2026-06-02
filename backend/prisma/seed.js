import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const productsPath = path.resolve(__dirname, "..", "..", "public", "sunspot_products.json");

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
  const rawProducts = JSON.parse(await readFile(productsPath, "utf8"));

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
