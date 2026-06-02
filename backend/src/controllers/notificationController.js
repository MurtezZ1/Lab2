import { prisma } from "../config/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listNotificationsController = asyncHandler(async (req, res) => {
  const items = await prisma.notification.findMany({
    where: { user_id: req.user.id },
    orderBy: { created_at: "desc" },
    take: 50,
  });
  res.json({
    success: true,
    data: items.map((item) => ({
      id: item.id,
      title: item.title,
      message: item.message,
      unread: !item.is_read,
      createdAt: item.created_at,
    })),
  });
});

export const markNotificationsReadController = asyncHandler(async (req, res) => {
  await prisma.notification.updateMany({ where: { user_id: req.user.id, is_read: false }, data: { is_read: true } });
  res.json({ success: true, data: [] });
});

export const createNotificationController = asyncHandler(async (req, res) => {
  const item = await prisma.notification.create({
    data: {
      user_id: req.params.userId ?? req.user.id,
      title: req.body.title,
      message: req.body.message,
      type: req.body.type ?? "INFO",
      created_by: req.user.id,
      updated_by: req.user.id,
    },
  });
  res.status(201).json({ success: true, data: item });
});
