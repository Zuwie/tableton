import { json } from "@remix-run/node";

/**
 * "If the type of the email parameter is a string, and the string is longer than 3 characters, and the string includes an
 * @ symbol, then the function will return true, otherwise it will return false."
 *
 * The above function is a type guard. It's a function that takes a parameter, and returns true or false depending on
 * whether the parameter is of a certain type
 * @param {unknown} email - unknown - this is the parameter that we're going to validate.
 * @returns A function that takes an email and returns a boolean
 */
export function validateEmail(email: unknown): email is string {
  return typeof email === "string" && email.length > 3 && email.includes("@");
}

/**
 * "If the password is not a string or is empty, return a 400 response with an error message. If the password is less than
 * 8 characters, return a 400 response with an error message."
 *
 * The function is a little more complicated than that, but that's the gist of it
 * @param {unknown} password - unknown
 * @returns A function that takes a password and returns a json object
 */
export function validatePassword(password: unknown) {
  if (typeof password !== "string" || password.length === 0) {
    return json(
      { errors: { password: "Password is required" } },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return json(
      { errors: { password: "Password is too short" } },
      { status: 400 }
    );
  }
}

/**
 * If the firstName is not a string or is an empty string, return a 400 status code with an error message
 * @param {unknown} firstName - The first name of the user.
 * @returns A function that returns a json object
 */
export function validateFirstName(firstName: unknown) {
  if (typeof firstName !== "string" || firstName.length === 0) {
    return json(
      { errors: { firstName: "Firstname is required" } },
      { status: 400 }
    );
  }
}

/**
 * If the lastName is not a string, return a 400 status code with an error message
 * @param {unknown} lastName - The value of the lastName field in the request body.
 * @returns A function that returns a json object
 */
export function validateLastName(lastName: unknown) {
  if (typeof lastName !== "string") {
    return json(
      { errors: { lastName: "Lastname should only contain letters" } },
      { status: 400 }
    );
  }
}