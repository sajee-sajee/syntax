"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const judgeController_1 = require("../controllers/judgeController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.post('/submit/:problemId', auth_1.authenticateJWT, judgeController_1.submitCode);
exports.default = router;
