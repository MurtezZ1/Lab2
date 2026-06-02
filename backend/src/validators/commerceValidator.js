export function validateCartItem(input) {
  input ??= {};
  const error = [];
  if (!input.productId) error.push("Product ID is required.");
  if (input.quantity != null && Number(input.quantity) < 1) error.push("Quantity must be at least 1.");
  return error.length ? { error } : {};
}

export function validateOrder(input) {
  input ??= {};
  if (input.items && !Array.isArray(input.items)) return { error: ["Items must be an array."] };
  return {};
}

export function validateReview(input) {
  input ??= {};
  const error = [];
  const rating = Number(input.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) error.push("Rating must be between 1 and 5.");
  return error.length ? { error } : {};
}

export function validateTicket(input) {
  input ??= {};
  const error = [];
  if (!input.subject) error.push("Subject is required.");
  return error.length ? { error } : {};
}
