import { Router } from "express";
import {
  addTicketMessageController,
  createTicketController,
  getTicketController,
  listTicketsController,
  updateTicketStatusController,
} from "../controllers/supportController.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { validateTicket } from "../validators/commerceValidator.js";

const router = Router();

router.use(authenticate);
router.get("/", listTicketsController);
router.post("/", validateRequest(validateTicket), createTicketController);
router.get("/:id", getTicketController);
router.post("/:id/messages", addTicketMessageController);
router.put("/:id/status", authorizeRoles("Admin", "Manager"), updateTicketStatusController);

export default router;
