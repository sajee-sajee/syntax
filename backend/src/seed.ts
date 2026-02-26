import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding initial data...');

    // Delete existing
    await prisma.region.deleteMany();

    const region1 = await prisma.region.create({
        data: {
            name: "Village of Primitives",
            slug: "village-of-primitives",
            order: 1,
            description: "A peaceful village where fundamental realities are shaped by variables, strings, and integers.",
            lore: "Long ago, the Grand Architect established the Village as the proving ground for newborn Code Fixers. Anomaly rates here are low, but the Chaos Compiler has been creeping in.",
            levels: {
                create: [
                    {
                        order: 1,
                        title: "The String Weaver's Dilemma",
                        storyIntro: "The local weaver's loom is jammed because of mixed-up threads. Help them reverse the string of yarn to get the loom running again.",
                        learningMd: "# Strings in Programming\n\nStrings are sequences of characters...",
                        isBoss: false,
                        problem: {
                            create: {
                                title: "Reverse String",
                                description: "Write a function that reverses a string. The input string is given as an array of characters `s`.",
                                difficulty: "easy",
                                topicTags: ["strings", "two-pointers"],
                                starterCode: {
                                    "python": "def reverseString(s):\n    pass\n",
                                    "javascript": "function reverseString(s) {\n\n}\n"
                                },
                                timeLimitMs: 2000,
                                memoryLimitMb: 256,
                                testCases: {
                                    create: [
                                        { input: "[\"h\",\"e\",\"l\",\"l\",\"o\"]", expectedOutput: "[\"o\",\"l\",\"l\",\"e\",\"h\"]" },
                                        { input: "[\"H\",\"a\",\"n\",\"n\",\"a\",\"h\"]", expectedOutput: "[\"h\",\"a\",\"n\",\"n\",\"a\",\"H\"]" }
                                    ]
                                }
                            }
                        }
                    }
                ]
            }
        }
    });

    console.log('Seeded Region:', region1.name);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
