"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = require("../index");
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';
const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ success: false, error: 'Email and password are required' });
            return;
        }
        const existingUser = await index_1.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ success: false, error: 'Email already exists' });
            return;
        }
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        const user = await index_1.prisma.user.create({
            data: {
                email,
                provider: 'local',
                passwordHash,
                characterCreated: false,
            }
        });
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ success: true, data: { token, user: { id: user.id, email: user.email, characterCreated: user.characterCreated } } });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ success: false, error: 'Email and password are required' });
            return;
        }
        const user = await index_1.prisma.user.findUnique({ where: { email } });
        if (!user || user.provider !== 'local' || !user.passwordHash) {
            res.status(400).json({ success: false, error: 'Invalid email or password' });
            return;
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            res.status(400).json({ success: false, error: 'Invalid email or password' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
        res.status(200).json({ success: true, data: { token, user: { id: user.id, email: user.email, characterCreated: user.characterCreated } } });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
exports.login = login;
const getMe = async (req, res) => {
    try {
        const user = await index_1.prisma.user.findUnique({
            where: { id: req.userId },
            select: { id: true, email: true, characterCreated: true, provider: true, character: true }
        });
        if (!user) {
            res.status(404).json({ success: false, error: 'User not found' });
            return;
        }
        res.status(200).json({ success: true, data: user });
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
exports.getMe = getMe;
