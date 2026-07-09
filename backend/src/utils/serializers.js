const toNumber = (value) => (value == null ? 0 : Number(value));

export function serializeProduct(product) {
  if (!product) return null;
  return {
    id: product.legacy_id ?? product.id,
    uuid: product.id,
    legacy_id: product.legacy_id,
    categoryId: product.category_id,
    brandId: product.brand_id,
    name: product.name,
    manufacturer: product.manufacturer ?? product.brand?.name ?? "",
    model: product.model ?? "",
    type: product.type ?? product.category?.slug ?? product.category?.name ?? "product",
    year: product.year,
    price: toNumber(product.price),
    processor: product.processor,
    ram_size: product.ram_size,
    storage: product.storage,
    display: product.display,
    os: product.os,
    battery: product.battery,
    weight: product.weight,
    dimensions: product.dimensions,
    keyboard: product.keyboard,
    ports: product.ports,
    connectivity: product.connectivity,
    camera: product.camera,
    additional_features: product.additional_features,
    image: product.image ?? product.images?.find((image) => image.is_primary)?.url ?? "/file.svg",
    description: product.description,
    discount_percentage: toNumber(product.discount_percentage),
    rating_average: toNumber(product.rating_average),
    stock_quantity: product.inventory?.stock_quantity ?? 0,
    is_active: product.is_active,
    category: product.category ? { id: product.category.id, name: product.category.name, slug: product.category.slug } : null,
    brand: product.brand ? { id: product.brand.id, name: product.brand.name, slug: product.brand.slug } : null,
    images: product.images ?? [],
    inventory: product.inventory ?? null,
  };
}

export function serializeCartItem(item) {
  const product = serializeProduct(item.product);
  const price = toNumber(item.unit_price);
  return {
    id: item.id,
    productId: product?.id ?? item.product_id,
    productUuid: item.product_id,
    name: product?.name ?? "",
    image: product?.image ?? "/file.svg",
    price,
    quantity: item.quantity,
    subtotal: price * item.quantity,
    product,
  };
}

export function serializeOrder(order) {
  return {
    id: order.id,
    orderNumber: order.order_number,
    status: order.status,
    total: toNumber(order.total),
    subtotal: toNumber(order.subtotal),
    taxTotal: toNumber(order.tax_total),
    shippingTotal: toNumber(order.shipping_total),
    discountTotal: toNumber(order.discount_total),
    createdAt: order.created_at,
    updatedAt: order.updated_at,
    items: order.items?.map(serializeCartItemFromOrderItem) ?? [],
    payments: order.payments ?? [],
    shipments: order.shipments ?? [],
    returns: order.returns ?? [],
  };
}

function serializeCartItemFromOrderItem(item) {
  const product = serializeProduct(item.product);
  const price = toNumber(item.unit_price);
  return {
    id: item.id,
    productId: product?.id ?? item.product_id,
    productUuid: item.product_id,
    name: product?.name ?? "",
    image: product?.image ?? "/file.svg",
    price,
    quantity: item.quantity,
    subtotal: toNumber(item.total_price) || price * item.quantity,
    product,
  };
}
