import { randomBytes, pbkdf2 } from "node:crypto";

export async function hashPassword(
  password: string
): Promise<{ passwordHash: string; salt: string }> {
  const salt = randomBytes(16).toString("hex");
  return new Promise((resolve, reject) => {
    pbkdf2(password, salt, 1000, 64, "sha512", (error, derivedKey) => {
      if (error) {
        return reject(error);
      }
      return resolve({ passwordHash: derivedKey.toString("hex"), salt: salt });
    });
  });
}

export async function comparePassword(
  password: string,
  salt: string,
  passwordHash: string
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    pbkdf2(password, salt, 1000, 64, "sha512", (error, derivedKey) => {
      if (error) {
        return reject(error);
      }
      return resolve(passwordHash === derivedKey.toString("hex"));
    });
  });
}
