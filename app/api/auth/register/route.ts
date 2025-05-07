import { app } from "@/lib/firebase"; // Ensure this points to your Firebase initialization file
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const auth = getAuth(app);
    const db = getFirestore(app);

    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    // Save user details in Firestore
    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(
      { message: "User registered successfully", userId: user.uid },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error registering user:", error);

    // Handle Firebase-specific errors
    let errorMessage = "Failed to register user";
    if (error.code === "auth/email-already-in-use") {
      errorMessage =
        "This email is already in use. Please use a different email.";
    } else if (error.code === "auth/weak-password") {
      errorMessage =
        "The password is too weak. Please use a stronger password.";
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
