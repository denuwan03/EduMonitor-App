const User = require("../models/User");
const Project = require("../models/Project");
const Task = require("../models/Task");
const Feedback = require("../models/Feedback");
const TopicApproval = require("../models/TopicApproval"); // ADDED THIS

exports.getReports = async (_req, res, next) => {
  try {
    const [users, projects, tasks, feedback, topics] = await Promise.all([
      User.find().lean(),
      Project.find().lean(),
      Task.find().lean(),
      Feedback.find().lean(),
      TopicApproval.find().lean(), // ADDED THIS
    ]);

    // 1. Task Completion Stats
    const taskCompletion = {
      completed: tasks.filter((t) => t.status === "Completed").length,
      submitted: tasks.filter((t) => t.status === "Submitted").length,
      inProgress: tasks.filter((t) => t.status === "In Progress").length,
      pending: tasks.filter((t) => t.status === "Pending").length,
    };

    // 2. Average Marks with extra safety
    let avgMarks = 0;
    if (feedback && feedback.length > 0) {
      const totalMarks = feedback.reduce((sum, item) => sum + (item.marks || 0), 0);
      avgMarks = Number((totalMarks / feedback.length).toFixed(2));
    }

    // 3. Role Counts
    const roleCounts = users.reduce(
      (acc, user) => ({ ...acc, [user.role]: (acc[user.role] || 0) + 1 }),
      { Student: 0, Supervisor: 0, Admin: 0 } // Initialize with defaults to avoid undefined
    );

    // 4. Final Response
    return res.json({
      systemSummary: {
        users: users.length,
        projects: projects.length,
        tasks: tasks.length || 1, // Avoid division by zero in frontend chart logic
        pendingTopics: topics.filter(t => t.status === "Pending").length
      },
      roleCounts,
      taskCompletion,
      avgMarks,
    });
  } catch (error) {
    console.error("Report Controller Error:", error);
    // Explicitly return a JSON error instead of letting the default error handler crash
    return res.status(500).json({ message: "Server error generating reports", error: error.message });
  }
};