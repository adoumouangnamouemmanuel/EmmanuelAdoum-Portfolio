// scripts/seed-firestore.js
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); // Download from Firebase Project Settings > Service accounts

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function seedDatabase() {
  try {
    // Create admin user
    const adminUser = {
      name: "Admin User",
      email: "admin@example.com",
      role: "admin",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const adminUserRef = await db.collection("users").add(adminUser);
    console.log("Admin user created with ID:", adminUserRef.id);

    // Create categories
    const categories = [
      { name: "Next.js", slug: "nextjs" },
      { name: "React", slug: "react" },
      { name: "JavaScript", slug: "javascript" },
      { name: "TypeScript", slug: "typescript" },
      { name: "CSS", slug: "css" },
      { name: "UI/UX", slug: "ui-ux" },
    ];

    for (const category of categories) {
      const categoryData = {
        ...category,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      await db.collection("categories").doc(category.slug).set(categoryData);
      console.log("Category created:", category.name);
    }

    // Create sample post
    const post = {
      title: "Getting Started with Next.js",
      slug: "getting-started-with-nextjs",
      excerpt: "Learn how to build modern web applications with Next.js",
      content: `
        <h2 id="introduction">Introduction</h2>
        <p>Next.js is a React framework that enables server-side rendering and static site generation.</p>
        
        <h2 id="getting-started">Getting Started</h2>
        <p>To create a new Next.js app, run the following command:</p>
        <pre><code>npx create-next-app my-app</code></pre>
        
        <h2 id="features">Features</h2>
        <p>Next.js comes with several built-in features:</p>
        <ul>
          <li>Server-side rendering</li>
          <li>Static site generation</li>
          <li>API routes</li>
          <li>File-system based routing</li>
        </ul>
        
        <h2 id="conclusion">Conclusion</h2>
        <p>Next.js is a powerful framework for building React applications.</p>
      `,
      coverImage: "/placeholder.svg?height=600&width=1200",
      published: true,
      views: 0,
      authorId: adminUserRef.id,
      categories: ["nextjs", "react"],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const postRef = await db.collection("posts").add(post);
    console.log("Sample post created with ID:", postRef.id);

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seedDatabase();