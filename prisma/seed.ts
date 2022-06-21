import type { User } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import faker from "@faker-js/faker";
import { FACTIONS, GAME_SYSTEM } from "~/constants";
import { getRandomEntry } from "~/utils";

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

  /**
   * It returns a fake user object with a fake email, password, first name, last name, and avatar
   * @returns An object with a data property that contains an object with the following properties: email, password,
   * firstName, lastName, and avatar.
   */
  function getFakeUser() {
    const faction1 = getRandomEntry(Object.keys(FACTIONS));
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
        faction: getRandomEntry(Object.keys(FACTIONS)),
      },
    };
  }

  /**
   * It returns an object with a data property that contains a fake board entry
   * @param {User} user - User - This is the user that we're going to use to create the board entry.
   * @returns An object with a data property that contains the data for a board entry.
   */
  function getFakeBoardEntryData(user: User) {
    const gameSystems = Object.keys(GAME_SYSTEM);
    return {
      data: {
        title: faker.commerce.productName(),
        body: faker.commerce.productDescription(),
        gameSystem: getRandomEntry(gameSystems),
        location: faker.address.city(),
        date: faker.date.future(),
        userId: user.id,
      },
    };
  }

  /* It's creating 15 fake users and pushing them into an array. */
  for (let i = 0; i < 15; i++) {
    const fakeUser = prisma.user.create(getFakeUser());
    await fakeUser;
    userArray.push(await fakeUser);
  }

  /* It's creating 30 board entries and assigning them to random users. */
  for (let i = 0; i < 30; i++) {
    const randomUser = getRandomEntry(userArray);
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
