// This file provides fallback data when Firestore is not available
// Used for local development and testing

import type { Post, User, Comment, Category } from "./models";

// Mock users
export const users: User[] = [
  {
    id: "user1",
    name: "John Doe",
    email: "john@example.com",
    image: "/placeholder.svg?height=40&width=40",
    role: "user",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "admin1",
    name: "Admin User",
    email: "admin@example.com",
    image: "/placeholder.svg?height=40&width=40",
    role: "admin",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Mock categories
export const categories: Category[] = [
  {
    id: "cat1",
    name: "Next.js",
    slug: "nextjs",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "cat2",
    name: "React",
    slug: "react",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "cat3",
    name: "JavaScript",
    slug: "javascript",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "cat4",
    name: "TypeScript",
    slug: "typescript",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Mock posts
export const posts: Post[] = [
  {
    id: "post1",
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
    views: 120,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    authorId: "user1",
    categories: ["nextjs", "react"],
    _count: {
      comments: 2,
      likes: 5,
    },
  },
  {
    id: "post2",
    title: "Understanding TypeScript with React",
    slug: "understanding-typescript-with-react",
    excerpt:
      "A comprehensive guide to using TypeScript in your React applications",
    content: `
      <h2 id="why-typescript">Why TypeScript?</h2>
      <p>TypeScript adds static typing to JavaScript, which can help catch errors early and improve developer experience.</p>
      
      <h2 id="setup">Setting Up TypeScript with React</h2>
      <p>You can create a new React project with TypeScript using:</p>
      <pre><code>npx create-react-app my-app --template typescript</code></pre>
      
      <h2 id="components">Typing Components</h2>
      <p>Here's how to type your React components:</p>
      <pre><code>interface Props {
  name: string;
  age?: number;
}

const Person: React.FC<Props> = ({ name, age }) => {
  return (
    <div>
      <h1>{name}</h1>
      {age && <p>Age: {age}</p>}
    </div>
  );
};</code></pre>
    `,
    coverImage: "/placeholder.svg?height=600&width=1200",
    published: true,
    views: 85,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    authorId: "admin1",
    categories: ["react", "typescript"],
    _count: {
      comments: 1,
      likes: 3,
    },
  },
];

// Mock comments
export const comments: Comment[] = [
  {
    id: "comment1",
    content: "Great article! This helped me understand Next.js better.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    authorId: "user1",
    postId: "post1",
    author: users[0],
  },
  {
    id: "comment2",
    content: "I'd love to see more examples of API routes.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    authorId: "admin1",
    postId: "post1",
    author: users[1],
  },
  {
    id: "comment3",
    content: "TypeScript has been a game-changer for my development workflow.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    authorId: "user1",
    postId: "post2",
    author: users[0],
  },
];

// Add author information to posts
posts.forEach((post) => {
  const author = users.find((user) => user.id === post.authorId);
  if (author) {
    (post as any).author = {
      id: author.id,
      name: author.name,
      image: author.image,
    };
  }
});

// Add replies to comments
comments[0].replies = [
  {
    id: "reply1",
    content: "Thanks! I'm glad you found it helpful.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    authorId: "admin1",
    postId: "post1",
    parentId: "comment1",
    author: users[1],
  },
];
