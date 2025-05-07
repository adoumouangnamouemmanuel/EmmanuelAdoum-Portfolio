import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Export the NextAuth handler
const handler = NextAuth(authOptions);

// Export the handler as GET and POST
export { handler as GET, handler as POST };
