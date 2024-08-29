import { Elysia } from "elysia";
import { isAuthenticated } from "@middlewares/auth";

export const userController = new Elysia({ prefix: "/user" })
  .use(isAuthenticated)
  .get("/me", async ({ user, set }) => {
    if (!user) {
      set.status = 401;
      return {
        success: false,
        data: null,
        message: "Unauthenticated user",
      };
    }
    return {
      success: true,
      data: user,
      message: "Fetched authenticated user details",
    };
  });
