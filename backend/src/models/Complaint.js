import mongoose from "mongoose";

/**
 * Complaint / Feedback item
 * category: manual category selected by user
 * aiCategory: category predicted by Groq (urgent / feedback / suggestion)
 */
const complaintSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, enum: ["urgent", "feedback", "suggestion"], default: "feedback" },

    // AI outputs
    aiSummary: { type: String, default: "" },
    aiCategory: { type: String, enum: ["urgent", "feedback", "suggestion"], default: "feedback" },

    status: { type: String, enum: ["pending", "resolved"], default: "pending" },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Complaint", complaintSchema);
