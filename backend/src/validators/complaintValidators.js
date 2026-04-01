import { body } from "express-validator";

export const createComplaintRules = [
  body("title").trim().isLength({ min: 3 }).withMessage("Title required"),
  body("description").trim().isLength({ min: 10 }).withMessage("Description min 10 chars"),
  body("category").optional().isIn(["urgent","feedback","suggestion"]).withMessage("Invalid category"),
];

export const statusRules = [
  body("status").isIn(["pending","resolved"]).withMessage("Invalid status"),
];
