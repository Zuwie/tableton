import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import faker from "@faker-js/faker";

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
      firstName: "Rafael",
      lastName: "Seifert",
      avatar: faker.internet.avatar(),
    },
  });
  const user2 = await prisma.user.create({
    data: {
      email: faker.internet.email(),
      password: {
        create: {
          hash: faker.internet.password(),
        },
      },
      firstName: faker.internet.userName(),
      lastName: faker.internet.userName(),
      avatar: faker.internet.avatar(),
    },
  });

  await prisma.user.create({
    data: {
      email: faker.internet.email(),
      password: {
        create: {
          hash: faker.internet.password(),
        },
      },
      firstName: faker.internet.userName("firstName"),
      lastName: faker.internet.userName("lastName"),
      avatar: faker.internet.avatar(),
    },
  });
  await prisma.user.create({
    data: {
      email: faker.internet.email(),
      password: {
        create: {
          hash: faker.internet.password(),
        },
      },
      firstName: faker.internet.userName("firstName"),
      lastName: faker.internet.userName("lastName"),
      avatar: faker.internet.avatar(),
    },
  });

  // BOARD
  await prisma.boardEntry.create({
    data: {
      title: faker.commerce.productName(),
      body: faker.commerce.productDescription(),
      date: new Date(),
      userId: user.id,
    },
  });
  await prisma.boardEntry.create({
    data: {
      title: faker.commerce.productName(),
      body: faker.commerce.productDescription(),
      date: new Date(),
      userId: user.id,
    },
  });
  await prisma.boardEntry.create({
    data: {
      title: faker.commerce.productName(),
      body: faker.commerce.productDescription(),
      date: new Date(),
      userId: user.id,
    },
  });
  await prisma.boardEntry.create({
    data: {
      title: faker.commerce.productName(),
      body: faker.commerce.productDescription(),
      date: new Date(),
      userId: user.id,
    },
  });
  await prisma.boardEntry.create({
    data: {
      title: faker.commerce.productName(),
      body: faker.commerce.productDescription(),
      date: new Date(),
      userId: user.id,
    },
  });
  await prisma.boardEntry.create({
    data: {
      title: faker.commerce.productName(),
      body: faker.commerce.productDescription(),
      date: new Date(),
      userId: user.id,
    },
  });

  await prisma.boardEntry.create({
    data: {
      title: faker.commerce.productName(),
      body: faker.commerce.productDescription(),
      date: new Date(),
      userId: user2.id,
    },
  });
  await prisma.boardEntry.create({
    data: {
      title: faker.commerce.productName(),
      body: faker.commerce.productDescription(),
      date: new Date(),
      userId: user2.id,
    },
  });
  await prisma.boardEntry.create({
    data: {
      title: faker.commerce.productName(),
      body: faker.commerce.productDescription(),
      date: new Date(),
      userId: user2.id,
    },
  });
  await prisma.boardEntry.create({
    data: {
      title: faker.commerce.productName(),
      body: faker.commerce.productDescription(),
      date: new Date(),
      userId: user2.id,
    },
  });
  await prisma.boardEntry.create({
    data: {
      title: faker.commerce.productName(),
      body: faker.commerce.productDescription(),
      date: new Date(),
      userId: user2.id,
    },
  });
  await prisma.boardEntry.create({
    data: {
      title: faker.commerce.productName(),
      body: faker.commerce.productDescription(),
      date: new Date(),
      userId: user2.id,
    },
  });
  await prisma.boardEntry.create({
    data: {
      title: faker.commerce.productName(),
      body: faker.commerce.productDescription(),
      date: new Date(),
      userId: user2.id,
    },
  });
  await prisma.boardEntry.create({
    data: {
      title: faker.commerce.productName(),
      body: faker.commerce.productDescription(),
      date: new Date(),
      userId: user2.id,
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
