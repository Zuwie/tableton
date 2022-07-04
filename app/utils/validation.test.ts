import {
  validateEmail,
  validateFirstName,
  validateLastName,
} from "./validateUser";
import {
  validateBody,
  validateDate,
  validateGameSystem,
  validateLocation,
  validateTime,
  validateTitle,
} from "./validateBoardEntry";

test("validateEmail returns false for non-emails", () => {
  expect(validateEmail(undefined)).toBe(false);
  expect(validateEmail(null)).toBe(false);
  expect(validateEmail("")).toBe(false);
  expect(validateEmail("not-an-email")).toBe(false);
  expect(validateEmail("n@")).toBe(false);
});
test("validateEmail returns true for emails", () => {
  expect(validateEmail("kody@example.com")).toBe(true);
});

test("validateFirstname returns false for non-names", () => {
  expect(validateFirstName(undefined)).toBe(false);
  expect(validateFirstName(null)).toBe(false);
  expect(validateFirstName("")).toBe(false);
});
test("validateFirstname returns true for names", () => {
  expect(validateFirstName("Rafael")).toBe(true);
});

test("validateLastname returns false for non-names", () => {
  expect(validateLastName(undefined)).toBe(false);
  expect(validateLastName(null)).toBe(false);
});
test("validateLastname returns true for names", () => {
  expect(validateLastName("Rafael")).toBe(true);
});

test("validateTitle returns false for non-titles", () => {
  expect(validateTitle(undefined)).toBe(false);
  expect(validateTitle(null)).toBe(false);
  expect(validateTitle("")).toBe(false);
});
test("validateTitle returns true for titles", () => {
  expect(validateTitle("LF casual game")).toBe(true);
});

test("validateBody returns false for non-bodies", () => {
  expect(validateBody(undefined)).toBe(false);
  expect(validateBody(null)).toBe(false);
  expect(validateBody("")).toBe(false);
});
test("validateBody returns true for bodies", () => {
  expect(
    validateBody(
      "Nulla tempor sed orci ac varius. Sed ut dignissim felis. " +
        "Etiam a diam vitae ante fermentum aliquet."
    )
  ).toBe(true);
});

test("validateGameSystem returns false for non-gameSystems", () => {
  expect(validateGameSystem(undefined)).toBe(false);
  expect(validateGameSystem(null)).toBe(false);
  expect(validateGameSystem("")).toBe(false);
});
test("validateGameSystem returns true for titles", () => {
  expect(validateGameSystem("Warhammer 40k")).toBe(true);
});

test("validateLocation returns false for non-locations", () => {
  expect(validateLocation(undefined)).toBe(false);
  expect(validateLocation(null)).toBe(false);
  expect(validateLocation("")).toBe(false);
});
test("validateLocation returns true for locations", () => {
  expect(validateLocation("Vienna")).toBe(true);
});

test("validateDate returns false for non-dates", () => {
  expect(validateDate(undefined)).toBe(false);
  expect(validateDate(null)).toBe(false);
  expect(validateDate("")).toBe(false);
});
test("validateDate returns true for dates", () => {
  expect(validateDate("26/02/1993")).toBe(true);
});

test("validateTime returns false for non-times", () => {
  expect(validateTime(undefined)).toBe(false);
  expect(validateTime(null)).toBe(false);
  expect(validateTime("")).toBe(false);
});
test("validateTime returns true for times", () => {
  expect(validateTime("20:15")).toBe(true);
});
