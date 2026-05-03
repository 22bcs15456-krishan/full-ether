const router = require("express").Router();
const auth = require("../middleware/server/auth");
const {
  createProject,
  getProjects
} = require("../controllers/projectcontroller");

router.post("/", auth, createProject);
router.get("/", auth, getProjects);

module.exports = router;