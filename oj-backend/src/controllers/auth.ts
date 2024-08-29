import { Elysia, t } from "elysia";
import { prisma } from "@libs/prisma";
import { comparePassword, hashPassword } from "@utils/bcrypt";
import { jwtMiddleware } from "@/middlewares/jwt";

export const authController = new Elysia({ prefix: "/auth" })
  .use(jwtMiddleware)
  .get("/", ({ route }) => ({
    route: route,
    task: "Controller for auth related tasks",
  }))
  .post(
    "/signup",
    async ({ body, set }) => {
      const { email, username, name, password } = body;
      // check duplicate email address
      const emailExists = await prisma.user.findUnique({
        where: {
          email,
        },
        select: {
          id: true,
        },
      });
      if (emailExists) {
        set.status = 400;
        return {
          success: false,
          data: null,
          message: "Email address already in use, please try another one.",
        };
      }

      // check duplicate username
      const usernameExists = await prisma.user.findUnique({
        where: {
          username,
        },
        select: {
          id: true,
        },
      });
      if (usernameExists) {
        set.status = 400;
        return {
          success: false,
          data: null,
          message: "Username already in use, please try another one.",
        };
      }

      const { passwordHash, salt } = await hashPassword(password);
      const newUser = await prisma.user.create({
        data: {
          email,
          username,
          name,
          passwordHash,
          salt,
        },
      });

      return {
        success: true,
        data: {
          user: newUser,
        },
        message: "User account created successfully.",
      };
    },
    {
      body: t.Object({
        email: t.String(),
        username: t.String(),
        name: t.String(),
        password: t.String(),
      }),
    }
  )
  .post(
    "/login",
    async ({ body, set, jwt, cookie: { auth } }) => {
      const { username, password } = body;
      // verify username
      const user = await prisma.user.findUnique({
        where: {
          username,
        },
        select: {
          id: true,
          passwordHash: true,
          salt: true,
        },
      });
      if (!user) {
        set.status = 400;
        return {
          success: false,
          data: null,
          message: "Invalid credentials.",
        };
      }

      // verify password
      const isPasswordMatched = await comparePassword(password, user.salt, user.passwordHash);
      if (!isPasswordMatched) {
        set.status = 401;
        return {
          success: false,
          data: null,
          message: "Password is incorrect, could not authenticate",
        };
      }

      // generate JWT token
      const jwtToken = await jwt.sign({
        username,
        userId: user.id,
      });

      // set cookie
      auth.set({
        value: jwtToken,
        httpOnly: true,
        maxAge: 7 * 86400,
      });

      set.status = 200;
      return {
        success: true,
        data: jwtToken,
        message: "Login successful, access token generated",
      };
    },
    {
      body: t.Object({
        username: t.String(),
        password: t.String(),
      }),
    }
  );
