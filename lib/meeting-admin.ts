import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const cookieName = "meeting-admin";
const sessionSeconds = 8 * 60 * 60;

function getPassword() {
  const password = process.env.MEETINGS_ADMIN_PASSWORD;
  return password && password.length >= 24 ? password : undefined;
}

function matches(left: string, right: string) {
  const digest = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(digest(left), digest(right));
}

function signature(password: string, expiry: string) {
  return createHmac("sha256", password).update("meeting-admin:" + expiry).digest("hex");
}

export async function hasMeetingAdmin() {
  const password = getPassword();
  const token = (await cookies()).get(cookieName)?.value;
  if (!password || !token) return false;

  const [expiry, signed] = token.split(".");
  return Boolean(
    expiry && signed && /^\d+$/.test(expiry) &&
    Number(expiry) > Date.now() &&
    matches(signed, signature(password, expiry)),
  );
}

export async function requireMeetingAdmin() {
  if (!(await hasMeetingAdmin())) redirect("/meetings/admin");
}

export async function startMeetingAdminSession(input: FormDataEntryValue | null) {
  const password = getPassword();
  if (!password) return "Meeting administration is unavailable. Contact the site administrator.";
  if (typeof input !== "string" || !matches(input, password)) {
    return "The administration passphrase is incorrect.";
  }

  const expiry = String(Date.now() + sessionSeconds * 1000);
  (await cookies()).set(cookieName, expiry + "." + signature(password, expiry), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: sessionSeconds,
  });
  return null;
}

export async function endMeetingAdminSession() {
  (await cookies()).delete(cookieName);
}
