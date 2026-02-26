"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'supersecretjwtkey', (err, user) => {
            if (err) {
                res.status(403).json({ success: false, error: 'Forbidden' });
                return;
            }
            req.userId = user.userId;
            next();
        });
    }
    else {
        res.status(401).json({ success: false, error: 'Unauthorized' });
    }
};
exports.authenticateJWT = authenticateJWT;
