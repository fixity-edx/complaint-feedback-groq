import { Router } from "express";
import { protect, requireRole } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { createComplaintRules, statusRules } from "../validators/complaintValidators.js";
import { listComplaints, createComplaint, updateStatus, aiSummarize } from "../controllers/complaintController.js";

const router = Router();

router.get("/", protect, listComplaints);
router.post("/", protect, createComplaintRules, validate, createComplaint);

// Admin only actions
router.put("/:id/status", protect, requireRole("admin"), statusRules, validate, updateStatus);
router.post("/:id/ai-summarize", protect, requireRole("admin"), aiSummarize);

export default router;
