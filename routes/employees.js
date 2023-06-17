const express = require("express");
const router = express.Router();

const { auth } = require("../middleware/auth");
const { add, all } = require("../controllers/employees");

// /api/employees
router.get("/", auth, all);
// /api/employees/:id
router.get("/:id", auth, () => console.log("get single employees"));
// /api/employees/add
router.post("/add", auth, add);
// /api/employees/edit/:id
router.put("/edit/:id", auth, () => console.log("edit employee"));
// /api/employees/remove/:id
router.delete("/remove:id", auth, () => console.log("remove employee"));

module.exports = router;
