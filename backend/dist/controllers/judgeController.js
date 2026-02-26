"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitCode = void 0;
const index_1 = require("../index");
const axios_1 = __importDefault(require("axios"));
const JUDGE_URL = process.env.JUDGE_SERVICE_URL || 'http://localhost:8001';
const submitCode = async (req, res) => {
    try {
        const userId = req.userId;
        const problemId = req.params.problemId;
        const { language, code } = req.body;
        if (!userId) {
            res.status(401).json({ success: false, error: 'Unauthorized' });
            return;
        }
        const problem = await index_1.prisma.problem.findUnique({
            where: { id: problemId },
            include: { testCases: true }
        });
        if (!problem) {
            res.status(404).json({ success: false, error: 'Problem not found' });
            return;
        }
        // Send to judge service
        let judgeResult;
        try {
            const judgeResponse = await axios_1.default.post(`${JUDGE_URL}/judge`, {
                language,
                code,
                testCases: problem.testCases,
                timeLimitMs: problem.timeLimitMs,
                memoryLimitMb: problem.memoryLimitMb
            });
            judgeResult = judgeResponse.data;
        }
        catch (error) {
            console.error('Judge service error:', error);
            res.status(500).json({ success: false, error: 'Execution engine unavailable' });
            return;
        }
        // Get attempt number
        const prevAttempts = await index_1.prisma.attempt.count({ where: { userId, problemId } });
        // Save Attempt
        const attempt = await index_1.prisma.attempt.create({
            data: {
                userId,
                problemId,
                language,
                code,
                status: judgeResult.status,
                testsPassed: judgeResult.testsPassed,
                testsTotal: judgeResult.testsTotal,
                execTimeMs: judgeResult.execTimeMs,
                memoryMb: judgeResult.memoryMb,
                attemptNumber: prevAttempts + 1
            }
        });
        // Update Ranking if Accepted
        if (judgeResult.status === 'accepted') {
            const ranking = await index_1.prisma.ranking.findUnique({ where: { userId } });
            if (ranking) {
                // Determine new tier based on total solved or points. 
                // E.g., +100 points for AC
                const bonus = Math.max(0, 100 - (prevAttempts * 5)); // Reward first-time solves more
                const newTotal = ranking.totalScore + bonus;
                let tier = ranking.tier;
                if (newTotal > 1000)
                    tier = 'Legend';
                else if (newTotal > 500)
                    tier = 'Architect';
                else if (newTotal > 200)
                    tier = 'Hacker';
                else if (newTotal > 100)
                    tier = 'Coder';
                await index_1.prisma.ranking.update({
                    where: { userId },
                    data: {
                        totalScore: newTotal,
                        skillScore: ranking.skillScore + bonus,
                        tier
                    }
                });
            }
        }
        res.status(200).json({ success: true, data: attempt });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
exports.submitCode = submitCode;
