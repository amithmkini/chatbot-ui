import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware(
  {
    publicRoutes: ["/", "/_next/", "/api/models"]
  }
);

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/"],
};