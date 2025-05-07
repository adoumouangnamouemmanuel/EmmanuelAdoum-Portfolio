import { PrismaClient } from "@prisma/client"
import { hash } from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await hash("admin123", 10)
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin User",
      role: "admin",
      // In production, you would use a proper password hashing mechanism
      // This is just for demonstration
      // password: adminPassword,
    },
  })

  // Create categories
  const categories = [
    { name: "Next.js", slug: "nextjs" },
    { name: "React", slug: "react" },
    { name: "JavaScript", slug: "javascript" },
    { name: "TypeScript", slug: "typescript" },
    { name: "CSS", slug: "css" },
    { name: "UI/UX", slug: "ui-ux" },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })
  }

  // Create sample post
  const post = await prisma.post.upsert({
    where: { slug: "getting-started-with-nextjs" },
    update: {},
    create: {
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
      authorId: admin.id,
      categories: {
        connect: [{ slug: "nextjs" }, { slug: "react" }],
      },
    },
  })

  console.log({ admin, categories, post })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
