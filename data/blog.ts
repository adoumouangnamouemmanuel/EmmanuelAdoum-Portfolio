"use client";

// Blog posts data for local development and testing
export const blogPosts = [
  {
    id: "post-1",
    title: "Getting Started with Next.js",
    slug: "getting-started-with-nextjs",
    excerpt:
      "Learn how to build modern web applications with Next.js, the React framework for production.",
    content: `
      <h2 id="introduction">Introduction</h2>
      <p>Next.js is a React framework that enables several extra features, including server-side rendering and generating static websites. React is a JavaScript library that is traditionally used to build web applications rendered in the client's browser with JavaScript.</p>
      
      <h2 id="why-nextjs">Why Next.js?</h2>
      <p>Here are some of the key features of Next.js:</p>
      <ul>
        <li>Server-side rendering</li>
        <li>Static site generation</li>
        <li>TypeScript support</li>
        <li>Route pre-fetching</li>
        <li>API routes</li>
        <li>Built-in CSS and Sass support</li>
      </ul>
      
      <h2 id="getting-started">Getting Started</h2>
      <p>To create a Next.js app, run the following command:</p>
      <pre><code>npx create-next-app@latest my-app</code></pre>
      
      <h3 id="project-structure">Project Structure</h3>
      <p>After creating a project, you'll have a structure like this:</p>
      <pre><code>my-app/
  ├── pages/
  │   ├── _app.js
  │   ├── index.js
  │   └── api/
  ├── public/
  ├── styles/
  ├── next.config.js
  └── package.json</code></pre>
      
      <h2 id="routing">Routing in Next.js</h2>
      <p>Next.js has a file-system based router built on the concept of pages. When a file is added to the pages directory, it's automatically available as a route.</p>
      
      <h3 id="basic-routing">Basic Routing</h3>
      <p>The router will serve each file in the pages directory under a pathname matching the filename:</p>
      <ul>
        <li><code>pages/index.js</code> → <code>/</code></li>
        <li><code>pages/about.js</code> → <code>/about</code></li>
      </ul>
      
      <h3 id="dynamic-routing">Dynamic Routing</h3>
      <p>To match dynamic segments, you can use bracket syntax:</p>
      <ul>
        <li><code>pages/blog/[slug].js</code> → <code>/blog/:slug</code> (<code>/blog/hello-world</code>)</li>
      </ul>
      
      <h2 id="conclusion">Conclusion</h2>
      <p>Next.js provides a great developer experience with all the features you need for production. It's a great choice for building modern web applications.</p>
    `,
    coverImage:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1600&h=900",
    published: true,
    views: 1250,
    readTime: 5,
    createdAt: "2023-03-15T12:00:00.000Z",
    updatedAt: "2023-03-15T12:00:00.000Z",
    authorId: "admin-user-id",
    categories: ["Next.js", "React", "Web Development"],
    author: {
      id: "admin-user-id",
      name: "Admin User",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
      bio: "Full-stack developer with a passion for React and Next.js",
      social: {
        github: "https://github.com",
        twitter: "https://twitter.com",
        linkedin: "https://linkedin.com",
      },
    },
    _count: {
      comments: 8,
      likes: 42,
    },
  },
  {
    id: "post-2",
    title: "Understanding TypeScript with React",
    slug: "understanding-typescript-with-react",
    excerpt:
      "TypeScript adds static type definitions to JavaScript, providing better tooling, error catching, and documentation.",
    content: `
      <h2 id="introduction">Introduction to TypeScript</h2>
      <p>TypeScript is a strongly typed programming language that builds on JavaScript. It was developed and is maintained by Microsoft. TypeScript adds optional static typing and class-based object-oriented programming to JavaScript.</p>
      
      <h2 id="why-typescript">Why Use TypeScript with React?</h2>
      <p>Using TypeScript with React offers several benefits:</p>
      <ul>
        <li>Type checking during development</li>
        <li>Better IDE support with autocompletion</li>
        <li>Easier refactoring</li>
        <li>Self-documenting code</li>
        <li>Fewer runtime errors</li>
      </ul>
      
      <h2 id="getting-started">Getting Started</h2>
      <p>To create a new React project with TypeScript, you can use Create React App:</p>
      <pre><code>npx create-react-app my-app --template typescript</code></pre>
      
      <h3 id="basic-types">Basic Types in TypeScript</h3>
      <p>Here are some of the basic types in TypeScript:</p>
      <pre><code>// Basic types
let isDone: boolean = false;
let decimal: number = 6;
let color: string = "blue";
let list: number[] = [1, 2, 3];
let tuple: [string, number] = ["hello", 10];

// Object type
interface User {
  name: string;
  id: number;
}

const user: User = {
  name: "John",
  id: 1,
};</code></pre>
      
      <h2 id="react-with-typescript">React with TypeScript</h2>
      <p>When using TypeScript with React, you can define the types of props and state:</p>
      <pre><code>import React, { useState } from 'react';

interface Props {
  title: string;
  description?: string; // Optional prop
}

const ExampleComponent: React.FC<Props> = ({ title, description }) => {
  const [count, setCount] = useState<number>(0);
  
  return (
    <div>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};</code></pre>
      
      <h2 id="conclusion">Conclusion</h2>
      <p>TypeScript is a powerful addition to your React projects. It helps catch errors early, improves developer experience, and makes your code more maintainable.</p>
    `,
    coverImage:
      "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=1600&h=900",
    published: true,
    views: 980,
    readTime: 7,
    createdAt: "2023-04-10T14:30:00.000Z",
    updatedAt: "2023-04-10T14:30:00.000Z",
    authorId: "regular-user-id",
    categories: ["TypeScript", "React", "JavaScript"],
    author: {
      id: "regular-user-id",
      name: "Regular User",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=user",
      bio: "Frontend developer specializing in TypeScript and React",
      social: {
        github: "https://github.com",
        twitter: "https://twitter.com",
      },
    },
    _count: {
      comments: 5,
      likes: 28,
    },
  },
];
