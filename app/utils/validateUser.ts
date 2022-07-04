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
 * "If the password is not a string or is less than 8 characters, return true."
 *
 * The function is called validatePassword because it returns true if the password is invalid
 * @param {unknown} password - unknown
 * @returns A function that takes a password and returns a boolean.
 */
export function validatePassword(password: unknown): password is string {
  return typeof password === "string" && password.length >= 8;
}

/**
 * "If the userName argument is not a string or is less than 2 characters, return true."
 *
 * The function returns true if the userName argument is not a string or is less than 2 characters
 * @param {unknown} userName - unknown - This is the parameter that we're going to validate.
 * @returns A function that takes a userName and returns a boolean.
 */
export function validateUsername(userName: unknown): userName is string {
  return typeof userName === "string" && userName.length > 2;
}
