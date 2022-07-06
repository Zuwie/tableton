import type { Contact, ExtendedProfile, Password, User } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";

export type { User } from "@prisma/client";

/**
 * It returns a user with the given id
 * @param id - User["id"]
 * @returns User
 */
export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByDiscordId(discordId: User["discordId"]) {
  // @ts-ignore
  return prisma.user.findUnique({ where: { discordId } });
}

/**
 * It returns a user with a given email
 * @param email - User["email"]
 * @returns A User object
 */
export async function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({ where: { email } });
}

/**
 * Get all users, but only return their id, userName, and avatar.
 * @returns An array of objects with the id, userName, and avatar properties.
 */
export async function getUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      userName: true,
      avatar: true,
    },
  });
}

/**
 * It creates a new user in the database
 * @param email - User["email"]
 * @param {string} password - string
 * @param userName - User["userName"]
 * @param avatar - User["avatar"]
 * @param discordId
 * @param discordRefreshToken
 * @returns A promise that resolves to a User object.
 */
export async function createUser({
  email,
  password,
  userName,
  avatar,
  discordId,
  discordRefreshToken,
}: Pick<User, "email" | "userName"> & {
  password: string;
  avatar?: string;
  discordId?: string;
  discordRefreshToken?: string;
}) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      email,
      userName,
      avatar,
      discordId,
      discordRefreshToken,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });
}

/**
 * It updates a user's information, including their password
 * @param  - Partial<User> & { userId: User["id"]; password: string }
 * @returns The updated user
 */
export async function updateUser({
  email,
  userName,
  avatar,
  password,
  userId,
}: Partial<User> & {
  userId: User["id"];
  password: string;
}) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.update({
    where: { id: userId },
    data: {
      email: email || undefined,
      userName: userName || undefined,
      avatar: avatar || undefined,
      password: {
        update: {
          hash: hashedPassword,
        },
      },
    },
  });
}

/**
 * It creates an extended profile for a user
 * @param  - Pick<ExtendedProfile, "faction" | "biography"> & {
 * @returns A promise that resolves to the created extended profile.
 */
export async function createExtendedProfile({
  faction,
  biography,
  userId,
}: Pick<ExtendedProfile, "faction" | "biography"> & {
  userId: User["id"];
}) {
  return prisma.extendedProfile.create({
    data: {
      faction,
      biography,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

/**
 * "Get the extended profile for a user."
 *
 * The function takes a single argument, an object with a single property, userId. The userId property is of type
 * User["id"]
 * @param  - {
 * @returns ExtendedProfile
 */
export async function getExtendedProfileForUser({
  userId,
}: {
  userId: User["id"];
}) {
  return prisma.extendedProfile.findFirst({
    where: { userId },
  });
}

/**
 * It creates a new contact information record in the database
 * @param  - Pick<Contact, "phone" | "discord" | "email" | "twitter">
 * @returns A promise that resolves to a Contact object
 */
export async function createContactInformation({
  phone,
  discord,
  email,
  twitter,
  userId,
}: Pick<Contact, "phone" | "discord" | "email" | "twitter"> & {
  userId: User["id"];
}) {
  return prisma.contact.create({
    data: {
      phone,
      discord,
      email,
      twitter,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

/**
 * "Get the contact information for a user."
 *
 * The function takes a single argument, an object with a single property, userId. The userId property is of type
 * User["id"]
 * @param  - {
 * @returns Contact
 */
export async function getContactInformationForUser({
  userId,
}: {
  userId: User["id"];
}) {
  return prisma.contact.findFirst({
    where: { userId },
  });
}

/**
 * It deletes a user from the database by their email
 * @param email - User["email"]
 * @returns A promise that resolves to the number of rows deleted.
 */
export async function deleteUserByEmail(email: User["email"]) {
  return prisma.user.delete({ where: { email } });
}

/**
 * It takes an email and password, finds the user with that email, and then compares the password to the hash stored in the
 * database. If the password is valid, it returns the user without the password
 * @param email - User["email"]
 * @param password - Password["hash"]
 * @returns The user without the password
 */
export async function verifyLogin(
  email: User["email"],
  password: Password["hash"]
) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash
  );

  if (!isValid) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}
