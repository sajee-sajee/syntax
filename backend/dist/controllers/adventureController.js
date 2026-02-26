"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLevelDetails = exports.getLevelsInRegion = exports.getRegions = void 0;
const index_1 = require("../index");
const getRegions = async (req, res) => {
    try {
        const regions = await index_1.prisma.region.findMany({
            orderBy: { order: 'asc' },
            include: {
                _count: {
                    select: { levels: true }
                }
            }
        });
        res.status(200).json({ success: true, data: regions });
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
exports.getRegions = getRegions;
const getLevelsInRegion = async (req, res) => {
    try {
        const regionId = req.params.regionId;
        const levels = await index_1.prisma.level.findMany({
            where: { regionId },
            orderBy: { order: 'asc' },
            include: {
                problem: {
                    select: { id: true, title: true, difficulty: true }
                }
            }
        });
        res.status(200).json({ success: true, data: levels });
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
exports.getLevelsInRegion = getLevelsInRegion;
const getLevelDetails = async (req, res) => {
    try {
        const levelId = req.params.levelId;
        const level = await index_1.prisma.level.findUnique({
            where: { id: levelId },
            include: {
                problem: {
                    include: {
                        testCases: {
                            where: { isHidden: false }
                        }
                    }
                }
            }
        });
        if (!level) {
            res.status(404).json({ success: false, error: 'Level not found' });
            return;
        }
        res.status(200).json({ success: true, data: level });
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
exports.getLevelDetails = getLevelDetails;
