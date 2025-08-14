import Subject from "../models/subjectModel.js";

export async function createSubject(req, res) {
  const { name } = req.body;
  const userId = req.user._id;
  const subject = await Subject.create({
    name,
    user: userId,
  });
  return res.status(201).json({
    success: "true",
    message: "Subject created successfully",
    data: subject,
  });
}

export async function getAllSubjects(req, res) {
  const allSubjects = await Subject.find({
    user: req.user._id,
  });
  return res.json({
    success: "true",
    data: allSubjects,
  });
}
