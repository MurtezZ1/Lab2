export function getAuditRequestContext(req) {
  const forwardedFor = req.headers["x-forwarded-for"];
  const forwardedIp = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor;
  const ipAddress = String(forwardedIp ?? "")
    .split(",")[0]
    .trim() || req.ip || req.socket?.remoteAddress || null;

  return {
    ipAddress,
    userAgent: req.get("user-agent") ?? null,
  };
}
