import { app } from "@/lib/firebase"; // Ensure this points to your Firebase initialization file
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

// Extend the default session and JWT types to include role
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string;
    };
  }

  interface User {
    id: string;
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials");
          return null;
        }

        try {
          console.log("Attempting to authenticate:", credentials.email);

          const auth = getAuth(app);

          // Authenticate the user with Firebase
          const userCredential = await signInWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password
          );

          const user = userCredential.user;

          // Return user object to be stored in the session
          return {
            id: user.uid,
            name: user.displayName || "User",
            email: user.email,
            image: user.photoURL,
            role: "user", // Default role, you can customize this
          };
        } catch (error: any) {
          console.error("Auth error:", error);
          throw new Error("Invalid email or password.");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/auth/error",
  },
  callbacks: {
    async session({ session, token }) {
      console.log("Session callback:", { session, token });
      if (token) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) || "user";
        // Preserve the name from the token
        session.user.name = token.name as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      console.log("JWT callback:", { token, user });
      if (user) {
        token.id = user.id;
        token.role = user.role || "user";
        // Preserve the name from the user object
        token.name = user.name;
      }
      return token;
    },
  },
  debug: process.env.NODE_ENV === "development",
};
