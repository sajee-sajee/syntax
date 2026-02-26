"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.post('/register', authController_1.register);
router.post('/login', authController_1.login);
router.get('/me', auth_1.authenticateJWT, authController_1.getMe);
// OAuth stubs for frontend to integrate with later
router.get('/google', (req, res) => {
    res.json({ success: false, error: 'Google OAuth not implemented yet. Use local auth.' });
});
router.get('/github', (req, res) => {
    res.json({ success: false, error: 'GitHub OAuth not implemented yet. Use local auth.' });
});
exports.default = router;
