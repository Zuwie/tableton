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

/**
 * It returns a user with a given email
 * @param email - User["email"]
 * @returns A User object
 */
export async function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({ where: { email } });
}

/**
 * It returns all users from the database, but only the id, firstName, lastName, and avatar fields
 * @returns An array of objects with the following properties: id, firstName, lastName, avatar
 */
export async function getUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      avatar: true,
    },
  });
}

/**
 * It creates a new user in the database
 * @param email - User["email"] - This is the email of the user.
 * @param {string} password - string - The password that the user will use to log in.
 * @param firstName - User["firstName"]
 * @param lastName - User["lastName"]
 * @param avatar - User["avatar"]
 * @returns A promise that resolves to a User object.
 */
export async function createUser(
  email: User["email"],
  password: string,
  firstName: User["firstName"],
  lastName: User["lastName"],
  avatar: User["avatar"]
) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      email,
      firstName,
      lastName,
      avatar,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });
}

/**
 * It takes in a user's email, first name, last name, avatar, and user ID, and then updates the user's information in the
 * database
 * @param  - Pick<User, "email" | "firstName" | "lastName" | "avatar"> & {
 * @returns The updated user
 */
export async function updateUser({
  email,
  firstName,
  lastName,
  avatar,
  userId,
}: Pick<User, "email" | "firstName" | "lastName" | "avatar"> & {
  userId: User["id"];
}) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      email: email || undefined,
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      avatar: avatar || undefined,
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

export async function getExtendedProfileForUser({
  userId,
}: {
  userId: User["id"];
}) {
  return prisma.extendedProfile.findFirst({
    where: { userId },
  });
}

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
      twitter: TWITTER,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

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
