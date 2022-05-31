import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "rs.frontend@gmail.com";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("123456", 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  await prisma.note.create({
    data: {
      title: "My first note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  await prisma.note.create({
    data: {
      title: "My second note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  await prisma.note.create({
    data: {
      title: "My third note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  // BOARD
  await prisma.boardEntry.create({
    data: {
      title: "My first boardEntry",
      body: "Hello, world!",
      date: new Date(),
      userId: user.id,
    },
  });

  await prisma.boardEntry.create({
    data: {
      title: "My second boardEntry",
      body: "Hello, world!",
      date: new Date(),
      userId: user.id,
    },
  });

  await prisma.boardEntry.create({
    data: {
      title: "My third boardEntry",
      body: "Hello, world!",
      date: new Date(),
      userId: user.id,
    },
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
