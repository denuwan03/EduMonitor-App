const TopicApproval = require("../models/TopicApproval");
const Project = require("../models/Project");
const Task = require("../models/Task");

// --- TOPIC ACTIONS ---

exports.createTopicRequest = async (req, res, next) => {
  try {
    const topic = await TopicApproval.create({
      projectTitle: req.body.projectTitle,
      description: req.body.description,
      studentId: req.user._id,
      status: "Pending",
    });
    return res.status(201).json(topic);
  } catch (error) {
    return next(error);
  }
};

// This handles both Admin (all topics) and Students (only their topics)
exports.getTopicRequests = async (req, res, next) => {
  try {
    let query = {};
    
    // Logic to filter if the user is a student
    if (req.user && req.user.role === "Student") {
      query = { studentId: req.user._id };
    }

    const topics = await TopicApproval.find(query)
      .populate("studentId", "name email")
      .populate("supervisorId", "name email")
      .sort({ createdAt: -1 });

    return res.json(topics);
  } catch (error) {
    return next(error);
  }
};

exports.reviewTopic = async (req, res, next) => {
  try {
    const { status } = req.body;
    const topic = await TopicApproval.findById(req.params.id);
    if (!topic) return res.status(404).json({ message: "Topic not found" });

    topic.status = status;
    topic.supervisorId = req.user._id;
    await topic.save();

    if (status === "Approved") {
      await Project.create({
        title: topic.projectTitle,
        description: topic.description || "Project created from approved topic",
        teamMembers: [topic.studentId],
        supervisor: req.user._id,
      });
    }
    return res.json(topic);
  } catch (error) {
    return next(error);
  }
};

// --- PROJECT ACTIONS ---

exports.createProject = async (req, res, next) => {
  try {
    const project = await Project.create({ ...req.body, supervisor: req.user._id });
    return res.status(201).json(project);
  } catch (error) {
    return next(error);
  }
};

exports.getProjects = async (_req, res, next) => {
  try {
    const projects = await Project.find()
      .populate("teamMembers", "name email role")
      .populate("supervisor", "name email");
    return res.json(projects);
  } catch (error) {
    return next(error);
  }
};

exports.updateProject = async (req, res, next) => {
  try {
    const allowedPayload = {};
    if (typeof req.body.title !== "undefined") allowedPayload.title = req.body.title;
    if (typeof req.body.description !== "undefined") allowedPayload.description = req.body.description;
    if (typeof req.body.teamMembers !== "undefined") allowedPayload.teamMembers = req.body.teamMembers;
    if (typeof req.body.status !== "undefined") allowedPayload.status = req.body.status;

    const project = await Project.findByIdAndUpdate(req.params.id, allowedPayload, { new: true })
      .populate("teamMembers", "name email role")
      .populate("supervisor", "name email");

    if (!project) return res.status(404).json({ message: "Project not found" });
    return res.json(project);
  } catch (error) {
    return next(error);
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    await Task.deleteMany({ projectId: project._id });
    await project.deleteOne();

    return res.json({ message: "Project and related tasks deleted successfully" });
  } catch (error) {
    return next(error);
  }
};