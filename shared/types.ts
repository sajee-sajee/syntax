// Shared TypeScript types used across frontend and backend

export type Provider = 'local' | 'google' | 'github';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type AttemptStatus = 'accepted' | 'wrong_answer' | 'tle' | 'mle' | 'error' | 'pending';
export type RoomStatus = 'waiting' | 'in_progress' | 'finished';
export type ProgressStatus = 'locked' | 'unlocked' | 'completed';
export type QuestType = 'debug' | 'predict' | 'optimize' | 'edge_case';
export type RankTier = 'Recruit' | 'Coder' | 'Hacker' | 'Architect' | 'Legend';

export interface User {
    id: string;
    email: string;
    provider: Provider;
    characterCreated: boolean;
    createdAt: string;
}

export interface Character {
    id: string;
    userId: string;
    displayName: string;
    hair: string;
    glasses: string | null;
    dress: string;
    shoes: string;
    aura: string;
    xp: number;
    evolutionStage: number;
}

export interface Region {
    id: string;
    name: string;
    slug: string;
    order: number;
    description: string;
    lore: string;
}

export interface Level {
    id: string;
    regionId: string;
    order: number;
    title: string;
    storyIntro: string;
    learningMd: string;
    isBoss: boolean;
    problem?: Problem;
}

export interface Problem {
    id: string;
    levelId: string | null;
    title: string;
    description: string;
    difficulty: Difficulty;
    topicTags: string[];
    starterCode: Record<string, string>;
    timeLimitMs: number;
    memoryLimitMb: number;
}

export interface TestCase {
    input: string;
    expectedOutput: string;
}

export interface Attempt {
    id: string;
    userId: string;
    problemId: string;
    language: string;
    code: string;
    status: AttemptStatus;
    testsPassed: number;
    testsTotal: number;
    execTimeMs: number | null;
    memoryMb: number | null;
    submittedAt: string;
    attemptNumber: number;
}

export interface Ranking {
    userId: string;
    skillScore: number;
    consistencyScore: number;
    codeQualityScore: number;
    totalScore: number;
    tier: RankTier;
    updatedAt: string;
}

export interface Streak {
    userId: string;
    currentStreak: number;
    longestStreak: number;
    lastActiveDate: string;
}

export interface Room {
    id: string;
    hostUserId: string;
    code: string;
    difficulty: Difficulty;
    topic: string;
    timeLimitSec: number;
    questionCount: number;
    status: RoomStatus;
    createdAt: string;
}

export interface RoomParticipant {
    roomId: string;
    userId: string;
    characterName: string;
    score: number;
    rank: number;
}

export interface DailyQuest {
    id: string;
    date: string;
    questType: QuestType;
    problem: Problem;
}

// API Response wrappers
export interface ApiOk<T> {
    success: true;
    data: T;
}
export interface ApiError {
    success: false;
    error: string;
}
export type ApiResponse<T> = ApiOk<T> | ApiError;

// Dashboard
export interface DashboardData {
    streak: Streak;
    totalSolved: number;
    ranking: Ranking;
    currentRegion: Region | null;
}

// Judge
export interface JudgeRequest {
    language: string;
    code: string;
    testCases: TestCase[];
    timeLimitMs: number;
    memoryLimitMb: number;
}

export interface JudgeResult {
    status: AttemptStatus;
    testsPassed: number;
    testsTotal: number;
    execTimeMs: number;
    memoryMb: number;
    errorMessage?: string;
}

// Socket events
export interface LeaderboardUpdate {
    roomId: string;
    participants: RoomParticipant[];
}

export interface SubmitEvent {
    userId: string;
    score: number;
    testsPassed: number;
    execTimeMs: number;
}
