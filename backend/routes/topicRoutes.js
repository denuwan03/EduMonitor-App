const express = require("express");
const {
  createTopicRequest,
  getTopicRequests,
  reviewTopic,
} = require("../controllers/topicController");
const { protect, allowRoles } = require("../middleware/authMiddleware");

const router = express.Router();

// 1. Create a topic (Students)
router.post("/", protect, allowRoles("Student"), createTopicRequest);

// 2. Get specific student's topics (New endpoint to fix 404)
router.get("/my-requests", protect, getTopicRequests);

// 3. Get all topics (Admin/Supervisor)
router.get("/", protect, getTopicRequests);

// 4. Review a topic
router.put("/:id/review", protect, allowRoles("Supervisor", "Admin"), reviewTopic);

module.exports = router;