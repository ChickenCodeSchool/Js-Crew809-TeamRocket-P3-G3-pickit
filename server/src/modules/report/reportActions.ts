import type { RequestHandler } from "express";
import reportRepository from "./reportRepository";

const report: RequestHandler = async (req, res, next) => {
  try {
    if (req.body.reporter_id === req.body.reported_user_id) {
      return res.status(403).json({ message: "You cannot report yourself." });
    }
    const newReport = {
      reporter_id: req.body.reporter_id,
      description: req.body.description,
      creation_date: Date.now(),
      status: "PENDING",
      reported_user_id: req.body.reported_user_id || null,
      reported_message_id: req.body.reported_message_id || null,
      reported_announce_id: req.body.reported_announce_id || null,
      cause: req.body.cause || "Non spécifiée",
    };
    await reportRepository.create(newReport);
    res.status(201).json({ message: "Your report has been received." });
  } catch (err) {
    next(err);
  }
};

export default { report };
