import { Elysia } from "elysia";
import { prisma } from "~libs/prisma";

export const isAuthenticated = (app: Elysia) => {
  return app.derive(async ({ headers, cookie, jwt, set }) => {
    const authToken = headers.authorization;
    if (!authToken || !authToken.startsWith("Bearer")) {
      set.status = 401;
      return {
        success: false,
        message: "Unauthorized",
        data: null,
      };
    }

    const tokenValue = authToken.split(" ")[1];
    const jwtUser = await jwt.verify(tokenValue);
    if (!jwtUser) {
      set.status = 401;
      return {
        success: false,
        message: "Unauthorized",
        data: null,
      };
    }

    const user = await prisma.user.findUnique({
      where: {
        id: jwtUser.userId,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
      },
    });

    if (!user) {
      set.status = 401;
      return {
        success: false,
        message: "Unauthorized",
        data: null,
      };
    }

    return {
      user,
    };
  });
};
