import { app } from "@/lib/firebase"; // Ensure this points to your Firebase initialization file
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
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
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
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
          const db = getFirestore(app);

          // Authenticate the user with Firebase
          const userCredential = await signInWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password
          );

          const user = userCredential.user;

          // Fetch user data from Firestore
          const userRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userRef);
          const userData = userDoc.data();

          console.log("Firestore user data:", userData);

          // If user document doesn't exist or is missing required fields, create/update it
          if (!userData || !userData.name || !userData.role) {
            const userUpdate = {
              name: userData?.name || user.displayName || user.email?.split('@')[0] || "User",
              email: user.email,
              image: userData?.image || user.photoURL,
              role: userData?.role || "user",
              updatedAt: new Date().toISOString(),
              ...(userData ? {} : { createdAt: new Date().toISOString() })
            };

            await setDoc(userRef, userUpdate, { merge: true });
            console.log("Updated user document in Firestore");
          }

          // Return user object to be stored in the session
          return {
            id: user.uid,
            name: userData?.name || user.displayName || user.email?.split('@')[0] || "User",
            email: user.email,
            image: userData?.image || user.photoURL,
            role: userData?.role || "user",
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
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          const db = getFirestore(app);
          const userDoc = await getDoc(doc(db, "users", user.id));
          const userData = userDoc.data();
          
          if (userData) {
            user.name = userData.name;
            user.image = userData.image;
            user.role = userData.role;
          }
        } catch (error) {
          console.error("Error fetching user data during Google sign in:", error);
        }
      }
      return true;
    },
    async session({ session, token }) {
      console.log("Session callback:", { session, token });
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.image;
        session.user.role = token.role || "user";
      }
      return session;
    },
    async jwt({ token, user, account }) {
      console.log("JWT callback:", { token, user, account });
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
        token.role = user.role || "user";
      }
      return token;
    },
  },
  debug: process.env.NODE_ENV === "development",
};
