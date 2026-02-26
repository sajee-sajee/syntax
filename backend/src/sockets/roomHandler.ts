import { Server, Socket } from 'socket.io';
import { prisma } from '../index';

interface RoomState {
    id: string;
    hostId: string;
    participants: { userId: string, characterName: string, score: number, testsPassed: number }[];
    status: 'waiting' | 'in_progress' | 'finished';
    problemId?: string;
}

const activeRooms = new Map<string, RoomState>();

export const setupSockets = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        console.log(`Socket connected: ${socket.id}`);

        socket.on('create_room', async (data: { userId: string, characterName: string, difficulty: string }) => {
            const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();

            const roomState: RoomState = {
                id: roomCode,
                hostId: data.userId,
                participants: [{ userId: data.userId, characterName: data.characterName, score: 0, testsPassed: 0 }],
                status: 'waiting'
            };

            activeRooms.set(roomCode, roomState);
            socket.join(roomCode);

            io.to(roomCode).emit('room_updated', roomState);
        });

        socket.on('join_room', (data: { roomCode: string, userId: string, characterName: string }) => {
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

        socket.on('start_game', async (data: { roomCode: string }) => {
            const room = activeRooms.get(data.roomCode);
            if (room) {
                // Fetch a random problem
                const problems = await prisma.problem.findMany({ take: 10 });
                const randomProblem = problems[Math.floor(Math.random() * problems.length)];

                room.status = 'in_progress';
                room.problemId = randomProblem?.id;
                io.to(data.roomCode).emit('game_started', { problem: randomProblem });
                io.to(data.roomCode).emit('room_updated', room);
            }
        });

        socket.on('submit_progress', (data: { roomCode: string, userId: string, testsPassed: number, score: number }) => {
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
