import { json } from "@remix-run/node";

export function validateTitle(title: unknown) {
  if (typeof title !== "string" || title.length === 0) {
    return json({ errors: { title: "Title is required" } }, { status: 400 });
  }
}

export function validateBody(body: unknown) {
  if (typeof body !== "string" || body.length === 0) {
    return json({ errors: { title: "Body is required" } }, { status: 400 });
  }
}

export function validateGameSystem(gameSystem: unknown) {
  if (typeof gameSystem !== "string" || gameSystem.length === 0) {
    return json(
      { errors: { body: "GameSystem is required" } },
      { status: 400 }
    );
  }
}

export function validateLocation(location: unknown) {
  if (typeof location !== "string" || location.length === 0) {
    return json({ errors: { body: "Location is required" } }, { status: 400 });
  }
}

export function validateDate(date: unknown) {
  if (typeof date !== "string" || date.length === 0) {
    return json({ errors: { body: "Date is required" } }, { status: 400 });
  }
}

export function validateTime(time: unknown) {
  if (typeof time !== "string" || time.length === 0) {
    return json({ errors: { body: "Time is required" } }, { status: 400 });
  }
}
