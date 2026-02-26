import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

import authRoutes from './routes/authRoutes';
import characterRoutes from './routes/characterRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import adventureRoutes from './routes/adventureRoutes';
import judgeRoutes from './routes/judgeRoutes';

export const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/character', characterRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/adventure', adventureRoutes);
app.use('/execute', judgeRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

import { setupSockets } from './sockets/roomHandler';

setupSockets(io);

const PORT = process.env.PORT || 4000;

httpServer.listen(PORT, () => {
    console.log(`🚀 Code Reality Backend running on port ${PORT}`);
});
