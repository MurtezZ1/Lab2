export function validateNewsletterSubscription(input) {
  input ??= {};
  const email = String(input.email ?? "").trim();
  const error = [];

  if (!email) error.push("Email is required.");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    error.push("A valid email address is required.");
  }

  return error.length ? { error } : {};
}
