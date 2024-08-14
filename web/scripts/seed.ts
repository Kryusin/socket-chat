import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { fakerJA as faker } from "@faker-js/faker";

// https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding

const prisma = new PrismaClient();

function getRandomDate(daysAgo: number) {
    const today = new Date();
    const pastDate = new Date(
        today.getTime() - Math.random() * daysAgo * 24 * 60 * 60 * 1000
    );
    return pastDate;
}

function fiftyFiftyChance(): boolean {
    return Math.random() < 0.5;
}

async function main() {
    await resetData();

    const hashedPassword = await bcrypt.hash("foobar", 10);
    try {
        const mainUser = await prisma.user.create({
            data: {
                name: "main-user",
                email: "main-user@example.com",
                image: "😆",
                password: hashedPassword,
            },
        });
        const subUser = await prisma.user.create({
            data: {
                name: "sub-user",
                email: "sub-user@example.com",
                image: "👓",
                password: hashedPassword,
            },
        });

        const [user1Id, user2Id] = [mainUser.id, subUser.id].sort();

        const thread = await prisma.thread.create({
            data: {
                user1Id,
                user2Id,
            },
        });

        for (let i = 1; i <= 100; i++) {
            const date = getRandomDate(10);
            const chance = fiftyFiftyChance();
            await prisma.message.create({
                data: {
                    content: faker.lorem.sentence(),
                    threadId: thread.id,
                    authorId: chance ? user1Id : user2Id,
                    createdAt: date,
                    updatedAt: date,
                },
            });
        }

        for (let i = 1; i <= 30; i++) {
            const email = faker.internet.email();
            const name = faker.person.fullName();
            const image = "🫥";
            await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    image,
                    name,
                },
            });
        }
    } catch (error) {
        console.error(error);
    } finally {
        await prisma.$disconnect;
    }
}

async function resetData() {
    await prisma.message.deleteMany();
    await prisma.thread.deleteMany();
    await prisma.user.deleteMany();
}

main();
