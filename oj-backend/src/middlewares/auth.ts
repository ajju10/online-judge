import { Elysia } from "elysia";
import { jwtMiddleware } from "@/middlewares/jwt";

export const isAuthenticated = (app: Elysia) => {
  return app.use(jwtMiddleware).derive(async ({ headers, jwt }) => {
    const authToken = headers.authorization;
    const tokenValue = authToken && authToken.startsWith("Bearer ") ? authToken.slice(7) : null;
    if (!tokenValue) return { user: null };
    const jwtUser = await jwt.verify(tokenValue);
    if (!jwtUser) return { user: null };
    return { user: jwtUser };
  });
};
