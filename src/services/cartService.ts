import type { CartItem, Product, User } from "@/types";

const cartKey = (user: User | null) => `sunspot_cart_${user?.id ?? "guest"}`;

export function getCartItems(user: User | null): CartItem[] {
  const storedCart = window.localStorage.getItem(cartKey(user));
  return storedCart ? (JSON.parse(storedCart) as CartItem[]) : [];
}

export function saveCartItems(user: User | null, items: CartItem[]) {
  window.localStorage.setItem(cartKey(user), JSON.stringify(items));
}

export function addProductToCart(user: User | null, product: Product) {
  const items = getCartItems(user);
  const existingItem = items.find((item) => item.productId === product.id);

  const nextItems = existingItem
    ? items.map((item) =>
        item.productId === product.id
          ? {
              ...item,
              quantity: item.quantity + 1,
              subtotal: product.price * (item.quantity + 1),
            }
          : item,
      )
    : [
        ...items,
        {
          productId: product.id,
          name: product.name,
          image: product.image,
          price: product.price,
          quantity: 1,
          subtotal: product.price,
        },
      ];

  saveCartItems(user, nextItems);
  return nextItems;
}

export function removeOneFromCart(user: User | null, productId: number) {
  const items = getCartItems(user);
  const nextItems = items
    .map((item) =>
      item.productId === productId
        ? {
            ...item,
            quantity: item.quantity - 1,
            subtotal: item.price * (item.quantity - 1),
          }
        : item,
    )
    .filter((item) => item.quantity > 0);

  saveCartItems(user, nextItems);
  return nextItems;
}

export function removeProductFromCart(user: User | null, productId: number) {
  const nextItems = getCartItems(user).filter((item) => item.productId !== productId);
  saveCartItems(user, nextItems);
  return nextItems;
}

export function getCartSummary(items: CartItem[]) {
  const subtotal = items.reduce((total, item) => total + item.subtotal, 0);
  const tax = subtotal * 0.08;
  return {
    subtotal,
    tax,
    total: subtotal + tax,
  };
}
