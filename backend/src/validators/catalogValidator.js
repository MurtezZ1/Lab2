export function validateProduct(input) {
  const error = [];
  if (!input.name && !input.ProductName) error.push("Product name is required.");
  if (input.price == null || Number(input.price) < 0) error.push("Valid product price is required.");
  return error.length ? { error } : {};
}

export function validateNamedEntity(input) {
  const error = [];
  if (!input.name) error.push("Name is required.");
  return error.length ? { error } : {};
}
