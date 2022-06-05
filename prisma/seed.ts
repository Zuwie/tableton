import type { User } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import faker from "@faker-js/faker";
import { GAME_SYSTEM } from "~/constants";

const prisma = new PrismaClient();

async function seed() {
  const email = "rs.frontend@gmail.com";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("123456", 10);

  const userArray: User[] = [];

  const user1 = await prisma.user.create({
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

  function getFakeUser() {
    return {
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
    };
  }

  function getFakeBoardEntryData(user: User) {
    const gameSystems = Object.keys(GAME_SYSTEM);
    return {
      data: {
        title: faker.commerce.productName(),
        body: faker.commerce.productDescription(),
        date: faker.date.future(),
        gameSystem: gameSystems[Math.floor(Math.random() * gameSystems.length)],
        userId: user.id,
      },
    };
  }

  for (let i = 0; i < 15; i++) {
    const fakeUser = prisma.user.create(getFakeUser());
    await fakeUser;
    userArray.push(await fakeUser);
  }

  for (let i = 0; i < 30; i++) {
    const randomUser = userArray[Math.floor(Math.random() * userArray.length)];
    await prisma.boardEntry.create(getFakeBoardEntryData(randomUser));
  }

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
