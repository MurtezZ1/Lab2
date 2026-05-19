import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/users";

export type CartLine = {
  productId: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
  subtotal: number;
};

export async function getCurrentCart() {
  const user = await getCurrentUser();

  if (!user) {
    return {
      user: null,
      items: [] as CartLine[],
      subtotal: 0,
      tax: 0,
      total: 0,
    };
  }

  const cart = await prisma.shopping_cart.upsert({
    where: { user_id: user.id },
    update: {},
    create: { user_id: user.id },
  });

  const cartItems = await prisma.cart_items.findMany({
    where: {
      cart_id: cart.cart_id,
      ordered: 0,
    },
    orderBy: { item_id: "asc" },
  });

  const groupedItems = cartItems.reduce<Map<number, CartLine>>((items, item) => {
    const existingItem = items.get(item.product_id);
    const price = Number(item.price);

    if (existingItem) {
      existingItem.quantity += 1;
      existingItem.subtotal += price;
      return items;
    }

    items.set(item.product_id, {
      productId: item.product_id,
      name: item.name,
      image: item.image,
      price,
      quantity: 1,
      subtotal: price,
    });

    return items;
  }, new Map<number, CartLine>());

  const items = Array.from(groupedItems.values());
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const tax = subtotal * 0.08;

  return {
    user,
    items,
    subtotal,
    tax,
    total: subtotal + tax,
  };
}
