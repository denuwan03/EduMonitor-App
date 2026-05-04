const Feedback = require("../models/Feedback");

exports.upsertFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findOneAndUpdate(
      { taskId: req.body.taskId },
      {
        taskId: req.body.taskId,
        supervisorId: req.user._id,
        marks: req.body.marks,
        comments: req.body.comments,
      },
      { new: true, upsert: true }
    );
    return res.json(feedback);
  } catch (error) {
    return next(error);
  }
};

exports.getFeedback = async (req, res, next) => {
  try {
    const query = req.user.role === "Student" ? {} : {};
    const feedback = await Feedback.find(query)
      .populate("taskId", "title assignedTo")
      .populate("supervisorId", "name");
    return res.json(feedback);
  } catch (error) {
    return next(error);
  }
};
