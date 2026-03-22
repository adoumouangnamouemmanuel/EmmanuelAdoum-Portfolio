import { authOptions } from "@/lib/auth";
import { enforceRateLimit } from "@/lib/security/rate-limit";
import NextAuth from "next-auth";

// Export the NextAuth handler
const handler = NextAuth(authOptions);

// Export the handler as GET and POST
export { handler as GET };

export async function POST(req: Request) {
  const limited = enforceRateLimit(req, {
    key: "auth-nextauth-post",
    windowMs: 10 * 60 * 1000,
    maxRequests: 40,
    message: "Too many authentication requests. Please try again later.",
  });
  if (limited) return limited;

  return handler(req);
}
