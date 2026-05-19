"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/users";

export type CartActionResult = {
  ok: boolean;
  message?: string;
  needsLogin?: boolean;
};

const getCurrentShoppingCart = async () => {
  const user = await getCurrentUser();

  if (!user) return null;

  return prisma.shopping_cart.upsert({
    where: { user_id: user.id },
    update: {},
    create: { user_id: user.id },
  });
};

export async function addToCart(productId: number): Promise<CartActionResult> {
  const cart = await getCurrentShoppingCart();

  if (!cart) {
    return {
      ok: false,
      needsLogin: true,
      message: "Please sign in before adding items to your cart.",
    };
  }

  const product = await prisma.products.findUnique({
    where: { id: productId },
  });

  if (!product) {
    return {
      ok: false,
      message: "Product was not found.",
    };
  }

  await prisma.cart_items.create({
    data: {
      cart_id: cart.cart_id,
      product_id: product.id,
      image: product.image,
      name: product.name,
      price: product.price,
    },
  });

  revalidatePath("/cart");
  revalidatePath(`/products/${productId}`);

  return {
    ok: true,
    message: "Added to cart.",
  };
}

export async function addToCartFromForm(productId: number): Promise<void> {
  await addToCart(productId);
}

export async function removeOneFromCart(productId: number): Promise<CartActionResult> {
  const cart = await getCurrentShoppingCart();

  if (!cart) {
    return {
      ok: false,
      needsLogin: true,
      message: "Please sign in to update your cart.",
    };
  }

  const item = await prisma.cart_items.findFirst({
    where: {
      cart_id: cart.cart_id,
      product_id: productId,
      ordered: 0,
    },
    orderBy: { item_id: "desc" },
  });

  if (!item) {
    return {
      ok: false,
      message: "Item is no longer in your cart.",
    };
  }

  await prisma.cart_items.delete({
    where: { item_id: item.item_id },
  });

  revalidatePath("/cart");

  return {
    ok: true,
  };
}

export async function removeOneFromCartFromForm(productId: number): Promise<void> {
  await removeOneFromCart(productId);
}

export async function removeProductFromCart(productId: number): Promise<CartActionResult> {
  const cart = await getCurrentShoppingCart();

  if (!cart) {
    return {
      ok: false,
      needsLogin: true,
      message: "Please sign in to update your cart.",
    };
  }

  await prisma.cart_items.deleteMany({
    where: {
      cart_id: cart.cart_id,
      product_id: productId,
      ordered: 0,
    },
  });

  revalidatePath("/cart");

  return {
    ok: true,
  };
}

export async function removeProductFromCartFromForm(productId: number): Promise<void> {
  await removeProductFromCart(productId);
}
