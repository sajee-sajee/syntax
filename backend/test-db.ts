import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    try {
        await prisma.user.create({
            data: {
                email: 'test4@example.com',
                provider: 'local',
                passwordHash: 'dummy',
                characterCreated: false,
            }
        });
        console.log("Success");
    } catch (e) {
        console.error("Prisma Error:", e);
    }
}
main();
