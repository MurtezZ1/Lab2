import bcrypt from "bcrypt";
import { prisma } from "../config/prisma.js";
import { env } from "../config/env.js";

const demoUsers = [
  { email: "demo.customer@sunspot.com", username: "demo_customer", role: "Customer" },
  { email: "demo.manager@sunspot.com", username: "demo_manager", role: "Manager" },
];

export async function seedDemoData(adminUserId) {
  const passwordHash = await bcrypt.hash("DemoPassword123!", Number(env.bcryptSaltRounds ?? 12));
  const users = [];

  for (const user of demoUsers) {
    users.push(
      await prisma.user.upsert({
        where: { email: user.email },
        update: { active: 1, status: "ACTIVE", role: user.role, updated_by: adminUserId },
        create: {
          email: user.email,
          username: user.username,
          password_hash: passwordHash,
          role: user.role,
          active: 1,
          status: "ACTIVE",
          email_verified_at: new Date(),
          created_by: adminUserId,
          updated_by: adminUserId,
        },
      }),
    );
  }

  const customer = users.find((user) => user.role === "Customer") ?? users[0];
  const products = await prisma.product.findMany({
    where: { is_active: true, inventory: { stock_quantity: { gt: 0 } } },
    take: 3,
    orderBy: { rating_average: "desc" },
  });

  let order = null;
  let invoice = null;

  if (products.length) {
    const subtotal = products.reduce((sum, product) => sum + Number(product.price), 0);
    const taxTotal = Number((subtotal * 0.08).toFixed(2));
    const total = Number((subtotal + taxTotal).toFixed(2));

    order = await prisma.order.create({
      data: {
        user_id: customer.id,
        order_number: `DEMO-${Date.now()}`,
        status: "PAID",
        subtotal,
        tax_total: taxTotal,
        shipping_total: 0,
        discount_total: 0,
        total,
        created_by: adminUserId,
        updated_by: adminUserId,
        items: {
          create: products.map((product) => ({
            product_id: product.id,
            quantity: 1,
            unit_price: Number(product.price),
            total_price: Number(product.price),
            created_by: adminUserId,
            updated_by: adminUserId,
          })),
        },
        payments: {
          create: {
            provider: "Demo",
            transaction_id: `demo_${Date.now()}`,
            amount: total,
            status: "COMPLETED",
            paid_at: new Date(),
            created_by: adminUserId,
            updated_by: adminUserId,
            logs: {
              create: {
                event: "DEMO_PAYMENT_COMPLETED",
                payload: { source: "admin_demo_seed" },
                created_by: adminUserId,
                updated_by: adminUserId,
              },
            },
          },
        },
      },
      include: { items: true, payments: true },
    });

    invoice = await prisma.invoice.upsert({
      where: { order_id: order.id },
      update: { generated_at: new Date(), updated_by: adminUserId },
      create: {
        invoice_number: `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
        order_id: order.id,
        user_id: customer.id,
        pdf_url: null,
        created_by: adminUserId,
        updated_by: adminUserId,
      },
    });
  }

  return {
    users: users.map((user) => ({ id: user.id, email: user.email, role: user.role })),
    order: order ? { id: order.id, orderNumber: order.order_number, total: Number(order.total) } : null,
    invoice: invoice ? { id: invoice.id, invoiceNumber: invoice.invoice_number } : null,
    password: "DemoPassword123!",
  };
}
