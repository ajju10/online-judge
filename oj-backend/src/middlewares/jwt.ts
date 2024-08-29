import jwt from "@elysiajs/jwt";
import Elysia from "elysia";

export const jwtMiddleware = new Elysia({ name: "jwt" }).use(
  jwt({
    name: "jwt",
    secret: Bun.env.JWT_SECRET!,
    exp: "7d",
  })
);
