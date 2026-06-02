import { prisma } from "../config/prisma.js";

const cartInclude = {
  items: {
    include: {
      product: {
        include: { category: true, brand: true, images: true, inventory: true },
      },
    },
    orderBy: { created_at: "asc" },
  },
};

export async function getOrCreateCart(userId) {
  return prisma.cart.upsert({
    where: { user_id: userId },
    update: {},
    create: { user_id: userId, created_by: userId, updated_by: userId },
    include: cartInclude,
  });
}

export async function getCart(userId) {
  return prisma.cart.findUnique({ where: { user_id: userId }, include: cartInclude });
}

export async function upsertCartItem({ cartId, productId, quantity, unitPrice, userId }) {
  return prisma.cartItem.upsert({
    where: { cart_id_product_id: { cart_id: cartId, product_id: productId } },
    update: { quantity: { increment: quantity }, unit_price: unitPrice, updated_by: userId },
    create: {
      cart_id: cartId,
      product_id: productId,
      quantity,
      unit_price: unitPrice,
      created_by: userId,
      updated_by: userId,
    },
  });
}

export async function setCartItemQuantity({ cartId, productId, quantity, userId }) {
  if (quantity <= 0) {
    return prisma.cartItem.deleteMany({ where: { cart_id: cartId, product_id: productId } });
  }
  return prisma.cartItem.update({
    where: { cart_id_product_id: { cart_id: cartId, product_id: productId } },
    data: { quantity, updated_by: userId },
  });
}

export async function removeCartItem(cartId, productId) {
  return prisma.cartItem.deleteMany({ where: { cart_id: cartId, product_id: productId } });
}

export async function clearCart(cartId) {
  return prisma.cartItem.deleteMany({ where: { cart_id: cartId } });
}
