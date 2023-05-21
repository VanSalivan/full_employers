const express = require("express");
const router = express.Router();
const { login, register, current } = require("../controllers/users");

// POST api/user/login
router.post("/login", login);  
// POST api/user/register
router.post("/register", register);
// GET api/user/current
router.get("/current", current);

module.exports = router;
