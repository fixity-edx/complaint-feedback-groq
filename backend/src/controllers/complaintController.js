import Complaint from "../models/Complaint.js";
import { summarizeAndClassify } from "../services/groqService.js";
import { sendEmail } from "../services/resendService.js";

export async function listComplaints(req, res, next){
  try{
    // Admin can view all
    // User can view only their own
    const filter = req.user.role === "admin" ? {} : { createdBy: req.user._id };

    const items = await Complaint.find(filter)
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    res.json(items);
  }catch(err){
    next(err);
  }
}

export async function createComplaint(req, res, next){
  try{
    const { title, description, category } = req.body;

    const item = await Complaint.create({
      title,
      description,
      category,
      createdBy: req.user._id,
    });

    // optional email (admin email can be configured)
    await sendEmail({
      to: process.env.ADMIN_EMAIL || "delivered@resend.dev",
      subject: "New Complaint Submitted",
      html: `<p><b>${title}</b></p><p>${description}</p>`
    }).catch(() => {});

    res.status(201).json(item);
  }catch(err){
    next(err);
  }
}

export async function updateStatus(req, res, next){
  try{
    const { id } = req.params;
    const { status } = req.body;

    const item = await Complaint.findById(id);
    if(!item){
      res.status(404);
      throw new Error("Complaint not found");
    }

    item.status = status;
    await item.save();

    res.json(item);
  }catch(err){
    next(err);
  }
}

export async function aiSummarize(req, res, next){
  try{
    const { id } = req.params;

    const item = await Complaint.findById(id);
    if(!item){
      res.status(404);
      throw new Error("Complaint not found");
    }

    const result = await summarizeAndClassify({
      title: item.title,
      description: item.description
    });

    item.aiSummary = result.summary;
    item.aiCategory = result.category;

    await item.save();

    res.json({ message: "AI summary generated", result });
  }catch(err){
    next(err);
  }
}
