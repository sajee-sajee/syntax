"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSockets = void 0;
const index_1 = require("../index");
const activeRooms = new Map();
const setupSockets = (io) => {
    io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.id}`);
        socket.on('create_room', async (data) => {
            const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
            const roomState = {
                id: roomCode,
                hostId: data.userId,
                participants: [{ userId: data.userId, characterName: data.characterName, score: 0, testsPassed: 0 }],
                status: 'waiting'
            };
            activeRooms.set(roomCode, roomState);
            socket.join(roomCode);
            io.to(roomCode).emit('room_updated', roomState);
        });
        socket.on('join_room', (data) => {
            const room = activeRooms.get(data.roomCode);
            if (!room) {
                socket.emit('error', { message: 'Room not found' });
                return;
            }
            if (room.status !== 'waiting') {
                socket.emit('error', { message: 'Game already in progress' });
                return;
            }
            if (!room.participants.find(p => p.userId === data.userId)) {
                room.participants.push({ userId: data.userId, characterName: data.characterName, score: 0, testsPassed: 0 });
            }
            socket.join(data.roomCode);
            io.to(data.roomCode).emit('room_updated', room);
        });
        socket.on('start_game', async (data) => {
            const room = activeRooms.get(data.roomCode);
            if (room) {
                // Fetch a random problem
                const problems = await index_1.prisma.problem.findMany({ take: 10 });
                const randomProblem = problems[Math.floor(Math.random() * problems.length)];
                room.status = 'in_progress';
                room.problemId = randomProblem?.id;
                io.to(data.roomCode).emit('game_started', { problem: randomProblem });
                io.to(data.roomCode).emit('room_updated', room);
            }
        });
        socket.on('submit_progress', (data) => {
            const room = activeRooms.get(data.roomCode);
            if (room) {
                const participant = room.participants.find(p => p.userId === data.userId);
                if (participant) {
                    participant.testsPassed = data.testsPassed;
                    participant.score = data.score;
                    // Sort leaderboard
                    room.participants.sort((a, b) => b.score - a.score || b.testsPassed - a.testsPassed);
                    io.to(data.roomCode).emit('leaderboard_updated', room.participants);
                }
            }
        });
        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${socket.id}`);
            // Advanced: handle participant leaving room
        });
    });
};
exports.setupSockets = setupSockets;
