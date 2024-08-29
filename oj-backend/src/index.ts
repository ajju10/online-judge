import { Elysia } from "elysia";
import { cookie } from "@elysiajs/cookie";
import { swagger } from "@elysiajs/swagger";
import cors from "@elysiajs/cors";
import { logger } from "@chneau/elysia-logger";
import { authController } from "@controllers/auth";
import { problemController } from "@controllers/problem";
import { userController } from "@controllers/user";

const apiRouter = new Elysia({ prefix: "/api/v1" })
  .use(swagger())
  .get("/", async () => ({
    name: "Online Judge",
    date: new Date().toString(),
    message: "Welcome to Online Judge API",
  }))
  .use(authController)
  .use(problemController)
  .use(userController);

const app = new Elysia()
  .use(cookie())
  .use(cors())
  .use(logger())
  .get("/", async ({ redirect }) => redirect("/api/v1"))
  .use(apiRouter)
  .listen(8000);

console.log(
  `🦊 Online Judge backend server is running at ${app.server?.hostname}:${app.server?.port}`
);
