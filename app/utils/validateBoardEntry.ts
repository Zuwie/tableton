/**
 * "If the type of the title parameter is a string and the length of the string is greater than or equal to 8, then return
 * true, otherwise return false."
 *
 * The above function is a type guard. It's a function that takes a parameter and returns a boolean. If the boolean is
 * true, then the type of the parameter is narrowed to a more specific type
 * @param {unknown} title - unknown
 * @returns A function that takes a title and returns a boolean.
 */
export function validateTitle(title: unknown): title is string {
  return typeof title === "string" && title.length >= 8;
}

/**
 * "If the body is a string and it's at least 10 characters long, return true, otherwise return false."
 *
 * The above function is a type guard. It's a function that takes an unknown value and returns a boolean. If the boolean is
 * true, the unknown value is of the type specified in the function's return type
 * @param {unknown} body - unknown - The body of the request.
 * @returns A function that takes a parameter of type unknown and returns a boolean.
 */
export function validateBody(body: unknown): body is string {
  return typeof body === "string" && body.length >= 10;
}

/**
 * "If the gameSystem is a string and has a length greater than 0, then it's a valid gameSystem."
 *
 * The above function is a type guard. It's a function that takes an unknown value and returns a boolean. If the boolean is
 * true, then the unknown value is of the type that the function is guarding
 * @param {unknown} gameSystem - The game system to validate.
 * @returns A function that takes a gameSystem and returns a boolean.
 */
export function validateGameSystem(gameSystem: unknown): gameSystem is string {
  return typeof gameSystem === "string" && gameSystem.length > 0;
}

/**
 * "If the location is a string and it's not empty, then return true, otherwise return false."
 *
 * The above function is a type guard. It's a function that takes an unknown value and returns a boolean. If the boolean is
 * true, then the unknown value is of the type that the type guard is guarding
 * @param {unknown} location - unknown - This is the parameter that we're validating.
 * @returns A function that takes a location and returns a boolean.
 */
export function validateLocation(location: unknown): location is string {
  return typeof location === "string" && location.length > 0;
}

/**
 * "If the date is a string and it's not empty, then it's a valid date."
 *
 * The above function is a type guard. It's a function that takes an unknown value and returns a boolean. If the boolean is
 * true, then the unknown value is of a certain type
 * @param {unknown} date - unknown - The date to validate.
 * @returns A function that takes a date and returns a boolean.
 */
export function validateDate(date: unknown): date is string {
  return typeof date === "string" && date.length > 0;
}

/**
 * "If the time is a string and it's not empty, then it's valid."
 *
 * The above function is a type guard. It's a function that takes an unknown value and returns a boolean. If the boolean is
 * true, then the unknown value is of the type that the function is guarding
 * @param {unknown} time - unknown - The time to validate.
 * @returns A function that takes a parameter of type unknown and returns a boolean.
 */
export function validateTime(time: unknown): time is string {
  return typeof time === "string" && time.length > 0;
}
