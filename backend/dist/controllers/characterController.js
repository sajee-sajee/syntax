"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCharacter = exports.createCharacter = void 0;
const index_1 = require("../index");
const createCharacter = async (req, res) => {
    try {
        const { displayName, hair, glasses, dress, shoes, aura } = req.body;
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ success: false, error: 'Unauthorized' });
            return;
        }
        if (!displayName) {
            res.status(400).json({ success: false, error: 'Display name is required' });
            return;
        }
        const existingCharacter = await index_1.prisma.character.findUnique({ where: { displayName } });
        if (existingCharacter) {
            res.status(400).json({ success: false, error: 'Display name is already taken' });
            return;
        }
        // Create character and update user characterCreated = true
        const character = await index_1.prisma.character.create({
            data: {
                userId,
                displayName,
                hair: hair || 'default_hair',
                glasses: glasses || null,
                dress: dress || 'default_dress',
                shoes: shoes || 'default_shoes',
                aura: aura || 'default_aura'
            }
        });
        await index_1.prisma.user.update({
            where: { id: userId },
            data: { characterCreated: true }
        });
        res.status(201).json({ success: true, data: character });
    }
    catch (error) {
        console.error('Create character error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
exports.createCharacter = createCharacter;
const getCharacter = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ success: false, error: 'Unauthorized' });
            return;
        }
        const character = await index_1.prisma.character.findUnique({ where: { userId } });
        if (!character) {
            res.status(404).json({ success: false, error: 'Character not found' });
            return;
        }
        res.status(200).json({ success: true, data: character });
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
exports.getCharacter = getCharacter;
