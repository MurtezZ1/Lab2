export function validateRegister(body) {
  const errors = [];
  if (!body.email || !String(body.email).includes("@")) errors.push("Valid email is required.");
  if (!body.username) errors.push("Username is required.");
  if (!body.password || String(body.password).length < 8) {
    errors.push("Password must be at least 8 characters.");
  }
  return errors.length ? { error: errors } : {};
}

export function validateLogin(body) {
  const errors = [];
  if (!body.email) errors.push("Email is required.");
  if (!body.password) errors.push("Password is required.");
  return errors.length ? { error: errors } : {};
}
