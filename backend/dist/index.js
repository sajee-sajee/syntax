"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
dotenv_1.default.config();
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const characterRoutes_1 = __importDefault(require("./routes/characterRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
const adventureRoutes_1 = __importDefault(require("./routes/adventureRoutes"));
const judgeRoutes_1 = __importDefault(require("./routes/judgeRoutes"));
exports.prisma = new client_1.PrismaClient();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/auth', authRoutes_1.default);
app.use('/character', characterRoutes_1.default);
app.use('/dashboard', dashboardRoutes_1.default);
app.use('/adventure', adventureRoutes_1.default);
app.use('/execute', judgeRoutes_1.default);
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});
const roomHandler_1 = require("./sockets/roomHandler");
(0, roomHandler_1.setupSockets)(io);
const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
    console.log(`🚀 Code Reality Backend running on port ${PORT}`);
});
