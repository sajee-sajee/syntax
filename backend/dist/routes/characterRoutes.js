"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const characterController_1 = require("../controllers/characterController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.post('/', auth_1.authenticateJWT, characterController_1.createCharacter);
router.get('/', auth_1.authenticateJWT, characterController_1.getCharacter);
exports.default = router;
