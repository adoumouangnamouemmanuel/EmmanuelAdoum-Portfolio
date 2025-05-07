"use client";

export const blogPosts = [
  {
    id: "1",
    title: "Getting Started with Next.js 14: App Router and Server Components",
    slug: "getting-started-with-nextjs-14",
    excerpt:
      "Learn how to build modern web applications with Next.js 14, focusing on the new App Router and Server Components for better performance and developer experience.",
    content: `
      <h2 id="introduction">Introduction</h2>
      <p>Next.js 14 introduces several game-changing features that make building React applications faster and more efficient. In this article, we'll explore the new App Router and Server Components.</p>
      
      <h2 id="main-content">Understanding the App Router</h2>
      <p>The App Router is a new routing system that provides a more intuitive way to create routes in your Next.js application. It uses a file-system based router built on top of Server Components.</p>
      
      <h3 id="subsection">Key Benefits of App Router</h3>
      <ul>
        <li>Simplified routing with nested layouts</li>
        <li>Built-in support for loading states</li>
        <li>More intuitive data fetching patterns</li>
        <li>Better error handling with error boundaries</li>
      </ul>
      
      <p>Here's a simple example of how to create a route with the App Router:</p>
      
      <pre><code>// app/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard!</p>
    </div>
  );
}</code></pre>

      <h2 id="server-components">Server Components</h2>
      <p>Server Components allow you to render components on the server, reducing the JavaScript sent to the client and improving performance.</p>
      
      <p>Benefits of Server Components include:</p>
      <ul>
        <li>Reduced client-side JavaScript</li>
        <li>Improved initial page load</li>
        <li>Direct access to backend resources</li>
        <li>Better security for sensitive operations</li>
      </ul>
      
      <h2 id="conclusion">Conclusion</h2>
      <p>Next.js 14 with its App Router and Server Components represents a significant step forward in React development. By embracing these new features, you can build faster, more efficient, and more user-friendly web applications.</p>
    `,
    coverImage: "/placeholder.svg?height=600&width=1200",
    date: "November 15, 2023",
    readTime: 8,
    categories: ["Next.js", "React", "Web Development"],
    author: {
      name: "Emmanuel Adoum",
      avatar: "/emma.png",
      bio: "Web developer with over 5 years of experience specializing in frontend technologies.",
      social: {
        github: "https://github.com",
        twitter: "https://twitter.com",
        linkedin: "https://linkedin.com",
      },
    },
    views: 1245,
  },
  {
    id: "2",
    title: "Building Responsive UIs with Tailwind CSS and Framer Motion",
    slug: "responsive-uis-tailwind-framer-motion",
    excerpt:
      "Discover how to combine Tailwind CSS and Framer Motion to create beautiful, responsive, and animated user interfaces that work across all devices.",
    content: `
      <h2 id="introduction">Introduction</h2>
      <p>Creating responsive and animated UIs has never been easier thanks to the combination of Tailwind CSS and Framer Motion. In this guide, we'll explore how to leverage these powerful tools together.</p>
      
      <h2 id="main-content">Tailwind CSS for Responsive Design</h2>
      <p>Tailwind CSS provides a utility-first approach to styling that makes responsive design straightforward and consistent.</p>
      
      <h3 id="subsection">Responsive Breakpoints</h3>
      <p>Tailwind's responsive design system is based on breakpoints that you can use to apply different styles at different screen sizes:</p>
      
      <pre><code>&lt;div class="w-full md:w-1/2 lg:w-1/3"&gt;
  This div will be full width on mobile, half width on medium screens, 
  and one-third width on large screens.
&lt;/div&gt;</code></pre>

      <h2 id="framer-motion">Animation with Framer Motion</h2>
      <p>Framer Motion is a production-ready motion library for React that makes it easy to create fluid animations and interactive UIs.</p>
      
      <p>Here's a simple example of a fade-in animation:</p>
      
      <pre><code>import { motion } from 'framer-motion';

function FadeIn() {
  return (
    &lt;motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    &gt;
      This content will fade in!
    &lt;/motion.div&gt;
  );
}</code></pre>

      <h2 id="combining-both">Combining Tailwind and Framer Motion</h2>
      <p>When you combine Tailwind CSS with Framer Motion, you get the best of both worlds: responsive layouts with beautiful animations.</p>
      
      <pre><code>import { motion } from 'framer-motion';

function ResponsiveCard() {
  return (
    &lt;motion.div
      className="w-full md:w-1/2 lg:w-1/3 p-4 bg-white rounded-lg shadow-lg"
      whileHover={{ y: -10, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
      transition={{ type: 'spring', stiffness: 300 }}
    &gt;
      &lt;h2 className="text-xl font-bold mb-2"&gt;Card Title&lt;/h2&gt;
      &lt;p className="text-gray-700"&gt;Card content goes here...&lt;/p&gt;
    &lt;/motion.div&gt;
  );
}</code></pre>
      
      <h2 id="conclusion">Conclusion</h2>
      <p>By leveraging Tailwind CSS for responsive layouts and Framer Motion for animations, you can create modern, responsive, and engaging user interfaces with minimal effort.</p>
    `,
    coverImage: "/placeholder.svg?height=600&width=1200",
    date: "October 28, 2023",
    readTime: 10,
    categories: ["CSS", "Animation", "UI/UX"],
    author: {
      name: "Emmanuel Adoum",
      avatar: "/emma.png",
      bio: "Frontend developer passionate about UI/UX and creating engaging web experiences.",
      social: {
        github: "https://github.com",
        twitter: "https://twitter.com",
        linkedin: "https://linkedin.com",
      },
    },
    views: 982,
  },
  {
    id: "3",
    title: "Implementing Authentication in Next.js Applications",
    slug: "authentication-in-nextjs",
    excerpt:
      "Learn how to implement secure authentication in your Next.js applications using NextAuth.js, including social logins and role-based access control.",
    content: `
      <h2 id="introduction">Introduction</h2>
      <p>Authentication is a critical aspect of most web applications. In this guide, we'll explore how to implement secure authentication in Next.js using NextAuth.js.</p>
      
      <h2 id="main-content">Getting Started with NextAuth.js</h2>
      <p>NextAuth.js is a complete authentication solution for Next.js applications. It's designed to be flexible, secure, and easy to use.</p>
      
      <h3 id="subsection">Installation and Setup</h3>
      <p>First, install NextAuth.js:</p>
      
      <pre><code>npm install next-auth</code></pre>
      
      <p>Then, create an API route for NextAuth.js:</p>
      
      <pre><code>// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

export default NextAuth({
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    // Add more providers as needed
  ],
  // Additional configuration options
});</code></pre>

      <h2 id="using-authentication">Using Authentication in Your App</h2>
      <p>Once NextAuth.js is set up, you can use the useSession hook to access the session data in your components:</p>
      
      <pre><code>import { useSession, signIn, signOut } from 'next-auth/react';

function Header() {
  const { data: session } = useSession();
  
  if (session) {
    return (
      &lt;div&gt;
        &lt;p&gt;Signed in as {session.user.email}&lt;/p&gt;
        &lt;button onClick={() => signOut()}&gt;Sign out&lt;/button&gt;
      &lt;/div&gt;
    );
  }
  
  return (
    &lt;div&gt;
      &lt;p&gt;Not signed in&lt;/p&gt;
      &lt;button onClick={() => signIn()}&gt;Sign in&lt;/button&gt;
    &lt;/div&gt;
  );
}</code></pre>

      <h2 id="role-based-access">Implementing Role-Based Access Control</h2>
      <p>For more advanced authentication needs, you might want to implement role-based access control:</p>
      
      <pre><code>// components/ProtectedRoute.js
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export function ProtectedRoute({ children, allowedRoles }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    if (status === 'loading') return; // Wait for session
    
    if (!session) {
      router.push('/auth/signin');
    } else if (allowedRoles && !allowedRoles.includes(session.user.role)) {
      router.push('/unauthorized');
    }
  }, [session, status, router, allowedRoles]);
  
  if (status === 'loading') {
    return &lt;div&gt;Loading...&lt;/div&gt;;
  }
  
  if (!session || (allowedRoles && !allowedRoles.includes(session.user.role))) {
    return null;
  }
  
  return children;
}</code></pre>
      
      <h2 id="conclusion">Conclusion</h2>
      <p>Implementing authentication in Next.js applications is straightforward with NextAuth.js. By following the steps outlined in this guide, you can add secure authentication to your application with minimal effort.</p>
    `,
    coverImage: "/placeholder.svg?height=600&width=1200",
    date: "September 15, 2023",
    readTime: 12,
    categories: ["Next.js", "Security", "Authentication"],
    author: {
      name: "Emmanuel Adoum",
      avatar: "/emma.png",
      bio: "Full-stack developer with a focus on secure and scalable web applications.",
      social: {
        github: "https://github.com",
        twitter: "https://twitter.com",
        linkedin: "https://linkedin.com",
      },
    },
    views: 1567,
  },
  {
    id: "4",
    title: "State Management in React: Context API vs. Redux vs. Zustand",
    slug: "react-state-management-comparison",
    excerpt:
      "Compare different state management solutions for React applications and learn when to use Context API, Redux, or Zustand based on your project requirements.",
    content: `
      <h2 id="introduction">Introduction</h2>
      <p>State management is a crucial aspect of React applications. In this article, we'll compare three popular state management solutions: Context API, Redux, and Zustand.</p>
      
      <h2 id="main-content">React Context API</h2>
      <p>The Context API is built into React and provides a way to share values between components without having to explicitly pass props through every level of the component tree.</p>
      
      <h3 id="subsection">When to Use Context API</h3>
      <ul>
        <li>For small to medium-sized applications</li>
        <li>When you need to avoid prop drilling</li>
        <li>For theme or authentication state that doesn't change frequently</li>
      </ul>
      
      <p>Example of Context API:</p>
      
      <pre><code>// Create a context
const ThemeContext = React.createContext('light');

// Provider component
function App() {
  const [theme, setTheme] = useState('light');
  
  return (
    &lt;ThemeContext.Provider value={{ theme, setTheme }}&gt;
      &lt;MainComponent /&gt;
    &lt;/ThemeContext.Provider&gt;
  );
}

// Consumer component
function ThemedButton() {
  const { theme, setTheme } = useContext(ThemeContext);
  
  return (
    &lt;button
      style={{ background: theme === 'light' ? '#fff' : '#000' }}
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    &gt;
      Toggle Theme
    &lt;/button&gt;
  );
}</code></pre>

      <h2 id="redux">Redux</h2>
      <p>Redux is a predictable state container for JavaScript apps. It helps you write applications that behave consistently and are easy to test.</p>
      
      <h3 id="when-to-use-redux">When to Use Redux</h3>
      <ul>
        <li>For large applications with complex state logic</li>
        <li>When you need a predictable state container</li>
        <li>When you need to implement time-travel debugging</li>
        <li>When you need middleware for async operations</li>
      </ul>
      
      <h2 id="zustand">Zustand</h2>
      <p>Zustand is a small, fast, and scalable state management solution. It has a simple API based on hooks and doesn't require providers.</p>
      
      <h3 id="when-to-use-zustand">When to Use Zustand</h3>
      <ul>
        <li>When you want a simpler alternative to Redux</li>
        <li>When you prefer a hooks-based API</li>
        <li>When you want to avoid boilerplate code</li>
        <li>For medium to large applications</li>
      </ul>
      
      <p>Example of Zustand:</p>
      
      <pre><code>import create from 'zustand';

// Create a store
const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));

// Use the store in a component
function Counter() {
  const { count, increment, decrement } = useStore();
  
  return (
    &lt;div&gt;
      &lt;p&gt;Count: {count}&lt;/p&gt;
      &lt;button onClick={increment}&gt;Increment&lt;/button&gt;
      &lt;button onClick={decrement}&gt;Decrement&lt;/button&gt;
    &lt;/div&gt;
  );
}</code></pre>
      
      <h2 id="conclusion">Conclusion</h2>
      <p>Choosing the right state management solution depends on your project's requirements. Context API is great for simpler applications, Redux provides a robust solution for complex applications, and Zustand offers a middle ground with a simpler API than Redux but more features than Context API.</p>
    `,
    coverImage: "/placeholder.svg?height=600&width=1200",
    date: "August 22, 2023",
    readTime: 15,
    categories: ["React", "State Management", "JavaScript"],
    author: {
      name: "Emmanuel Adoum",
      avatar: "/emma.png",
      bio: "Software engineer specializing in React and state management solutions.",
      social: {
        github: "https://github.com",
        twitter: "https://twitter.com",
        linkedin: "https://linkedin.com",
      },
    },
    views: 2103,
  },
  {
    id: "5",
    title: "Building a Headless CMS with Next.js and Strapi",
    slug: "headless-cms-nextjs-strapi",
    excerpt:
      "Learn how to build a modern headless CMS-powered website using Next.js for the frontend and Strapi for content management.",
    content: `
      <h2 id="introduction">Introduction</h2>
      <p>A headless CMS separates the content management from the frontend presentation, giving developers more flexibility. In this tutorial, we'll build a blog using Next.js and Strapi.</p>
      
      <h2 id="main-content">Setting Up Strapi</h2>
      <p>Strapi is an open-source headless CMS that allows you to easily build customizable APIs.</p>
      
      <h3 id="subsection">Installation and Configuration</h3>
      <p>First, let's create a new Strapi project:</p>
      
      <pre><code>npx create-strapi-app my-project --quickstart</code></pre>
      
      <p>This will create a new Strapi project and start the admin interface. You can access it at http://localhost:1337/admin.</p>
      
      <p>Next, create a "Blog" content type with fields like title, content, image, and author.</p>
      
      <h2 id="nextjs-setup">Setting Up Next.js</h2>
      <p>Now, let's set up our Next.js frontend:</p>
      
      <pre><code>npx create-next-app my-blog
cd my-blog
npm install axios</code></pre>
      
      <p>Create an API service to fetch data from Strapi:</p>
      
      <pre><code>// lib/api.js
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';

export async function fetchAPI(path) {
  const response = await axios.get(\`\${API_URL}\${path}\`);
  return response.data;
}

export async function getAllPosts() {
  const data = await fetchAPI('/api/posts?populate=*');
  return data.data;
}

export async function getPostBySlug(slug) {
  const data = await fetchAPI(\`/api/posts?filters[slug][$eq]=\${slug}&populate=*\`);
  return data.data[0];
}</code></pre>

      <h2 id="building-pages">Building Pages</h2>
      <p>Now, let's create our blog pages:</p>
      
      <pre><code>// pages/index.js
import { getAllPosts } from '../lib/api';
import Link from 'next/link';

export default function Home({ posts }) {
  return (
    &lt;div&gt;
      &lt;h1&gt;My Blog&lt;/h1&gt;
      &lt;div&gt;
        {posts.map((post) => (
          &lt;div key={post.id}&gt;
            &lt;h2&gt;
              &lt;Link href={\`/posts/\${post.attributes.slug}\`}&gt;
                {post.attributes.title}
              &lt;/Link&gt;
            &lt;/h2&gt;
            &lt;p&gt;{post.attributes.excerpt}&lt;/p&gt;
          &lt;/div&gt;
        ))}
      &lt;/div&gt;
    &lt;/div&gt;
  );
}

export async function getStaticProps() {
  const posts = await getAllPosts();
  return {
    props: { posts },
    revalidate: 60, // Revalidate every 60 seconds
  };
}</code></pre>

      <p>And the individual post page:</p>
      
      <pre><code>// pages/posts/[slug].js
import { getAllPosts, getPostBySlug } from '../../lib/api';
import ReactMarkdown from 'react-markdown';

export default function Post({ post }) {
  if (!post) return &lt;div&gt;Loading...&lt;/div&gt;;
  
  return (
    &lt;div&gt;
      &lt;h1&gt;{post.attributes.title}&lt;/h1&gt;
      &lt;ReactMarkdown&gt;{post.attributes.content}&lt;/ReactMarkdown&gt;
    &lt;/div&gt;
  );
}

export async function getStaticPaths() {
  const posts = await getAllPosts();
  const paths = posts.map((post) => ({
    params: { slug: post.attributes.slug },
  }));
  
  return {
    paths,
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  const post = await getPostBySlug(slug);
  
  if (!post) {
    return {
      notFound: true,
    };
  }
  
  return {
    props: { post },
    revalidate: 60,
  };
}</code></pre>
      
      <h2 id="conclusion">Conclusion</h2>
      <p>By combining Next.js and Strapi, you can create a powerful and flexible content-managed website. This approach gives you the benefits of a traditional CMS while maintaining the performance and developer experience of a modern JavaScript framework.</p>
    `,
    coverImage: "/placeholder.svg?height=600&width=1200",
    date: "July 10, 2023",
    readTime: 18,
    categories: ["CMS", "Next.js", "Strapi"],
    author: {
      name: "Emmanuel Adoum",
      avatar: "/emma.png",
      bio: "Web developer specializing in building headless CMS solutions with Next.js and Strapi.",
      social: {
        github: "https://github.com",
        twitter: "https://twitter.com",
        linkedin: "https://linkedin.com",
      },
    },
    views: 1876,
  },
  {
    id: "6",
    title: "Optimizing Performance in React Applications",
    slug: "optimizing-react-performance",
    excerpt:
      "Discover practical techniques to improve the performance of your React applications, from code splitting to memoization and virtualization.",
    content: `
      <h2 id="introduction">Introduction</h2>
      <p>Performance optimization is crucial for providing a good user experience. In this article, we'll explore various techniques to optimize React applications.</p>
      
      <h2 id="main-content">Code Splitting</h2>
      <p>Code splitting is a technique that allows you to split your code into smaller chunks, which can be loaded on demand.</p>
      
      <h3 id="subsection">Using React.lazy and Suspense</h3>
      <p>React.lazy and Suspense make it easy to implement code splitting:</p>
      
      <pre><code>import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const Home = lazy(() => import('./routes/Home'));
const About = lazy(() => import('./routes/About'));

function App() {
  return (
    &lt;Router&gt;
      &lt;Suspense fallback={&lt;div&gt;Loading...&lt;/div&gt;}&gt;
        &lt;Switch&gt;
          &lt;Route exact path="/" component={Home} /&gt;
          &lt;Route path="/about" component={About} /&gt;
        &lt;/Switch&gt;
      &lt;/Suspense&gt;
    &lt;/Router&gt;
  );
}</code></pre>

      <h2 id="memoization">Memoization</h2>
      <p>Memoization is a technique to prevent unnecessary re-renders by caching the results of expensive function calls.</p>
      
      <h3 id="react-memo">React.memo</h3>
      <p>Use React.memo to memoize functional components:</p>
      
      <pre><code>import React from 'react';

const MyComponent = React.memo(function MyComponent(props) {
  // Component logic
  return &lt;div&gt;{props.name}&lt;/div&gt;;
});</code></pre>

      <h3 id="usememo-usecallback">useMemo and useCallback</h3>
      <p>Use useMemo to memoize expensive calculations and useCallback to memoize functions:</p>
      
      <pre><code>import React, { useState, useMemo, useCallback } from 'react';

function MyComponent({ data }) {
  // Memoize expensive calculation
  const processedData = useMemo(() => {
    return data.map(item => expensiveOperation(item));
  }, [data]);
  
  // Memoize callback function
  const handleClick = useCallback(() => {
    console.log('Button clicked!');
  }, []);
  
  return (
    &lt;div&gt;
      {processedData.map(item => (
        &lt;div key={item.id}&gt;{item.name}&lt;/div&gt;
      ))}
      &lt;button onClick={handleClick}&gt;Click me&lt;/button&gt;
    &lt;/div&gt;
  );
}</code></pre>

      <h2 id="virtualization">Virtualization</h2>
      <p>Virtualization is a technique to render only the items that are currently visible in the viewport, which is useful for long lists.</p>
      
      <h3 id="react-window">Using react-window</h3>
      <p>react-window is a library that helps with virtualizing large lists:</p>
      
      <pre><code>import React from 'react';
import { FixedSizeList } from 'react-window';

function MyList({ items }) {
  const Row = ({ index, style }) => (
    &lt;div style={style}&gt;
      {items[index].name}
    &lt;/div&gt;
  );
  
  return (
    &lt;FixedSizeList
      height={400}
      width={300}
      itemCount={items.length}
      itemSize={35}
    &gt;
      {Row}
    &lt;/FixedSizeList&gt;
  );
}</code></pre>

      <h2 id="web-vitals">Monitoring Performance with Web Vitals</h2>
      <p>Web Vitals are a set of metrics that help measure user experience on the web. Next.js provides built-in support for measuring Web Vitals:</p>
      
      <pre><code>// pages/_app.js
export function reportWebVitals(metric) {
  console.log(metric);
  
  // You can send the metric to your analytics service
  // Example: sendToAnalytics(metric);
}</code></pre>
      
      <h2 id="conclusion">Conclusion</h2>
      <p>By implementing these performance optimization techniques, you can significantly improve the user experience of your React applications. Remember to measure performance before and after optimization to ensure your changes are having the desired effect.</p>
    `,
    coverImage: "/placeholder.svg?height=600&width=1200",
    date: "June 5, 2023",
    readTime: 14,
    categories: ["React", "Performance", "JavaScript"],
    author: {
      name: "Emmanuel Adoum",
      avatar: "/emma.png",
      bio: "Software Engineer passionate about optimizing React application performance.",
      social: {
        github: "https://github.com",
        twitter: "https://twitter.com",
        linkedin: "https://linkedin.com",
      },
    },
    views: 2450,
  },
  {
    id: "7",
    title: "Introduction to TypeScript for React Developers",
    slug: "typescript-for-react-developers",
    excerpt:
      "Learn how to use TypeScript with React to create more robust and maintainable applications with static type checking and improved developer experience.",
    content: `
      <h2 id="introduction">Introduction</h2>
      <p>TypeScript adds static typing to JavaScript, which can help catch errors early and improve the developer experience. In this guide, we'll explore how to use TypeScript with React.</p>
      
      <h2 id="main-content">Getting Started with TypeScript in React</h2>
      <p>You can create a new React project with TypeScript using Create React App:</p>
      
      <pre><code>npx create-react-app my-app --template typescript</code></pre>
      
      <p>Or add TypeScript to an existing Next.js project:</p>
      
      <pre><code>npm install --save-dev typescript @types/react @types/node</code></pre>
      
      <h3 id="subsection">Basic Types in TypeScript</h3>
      <p>TypeScript provides several basic types that you can use to annotate your variables:</p>
      
      <pre><code>// Basic types
const name: string = 'John';
const age: number = 30;
const isActive: boolean = true;
const hobbies: string[] = ['reading', 'coding'];
const user: { id: number; name: string } = { id: 1, name: 'John' };</code></pre>

      <h2 id="typing-react-components">Typing React Components</h2>
      <p>When working with React, you'll need to type your components and their props:</p>
      
      <h3 id="functional-components">Functional Components</h3>
      <pre><code>import React from 'react';

// Define the props interface
interface UserProps {
  name: string;
  age: number;
  isActive?: boolean; // Optional prop
}

// Use the interface to type the component props
const User: React.FC&lt;UserProps&gt; = ({ name, age, isActive = false }) => {
  return (
    &lt;div&gt;
      &lt;h2&gt;{name}&lt;/h2&gt;
      &lt;p&gt;Age: {age}&lt;/p&gt;
      &lt;p&gt;Status: {isActive ? 'Active' : 'Inactive'}&lt;/p&gt;
    &lt;/div&gt;
  );
};</code></pre>

      <h3 id="typing-hooks">Typing Hooks</h3>
      <p>TypeScript can also help with typing React hooks:</p>
      
      <pre><code>import React, { useState, useEffect } from 'react';

// Define the user interface
interface User {
  id: number;
  name: string;
  email: string;
}

function UserList() {
  // Type the state
  const [users, setUsers] = useState&lt;User[]&gt;([]);
  const [loading, setLoading] = useState&lt;boolean&gt;(true);
  
  useEffect(() => {
    // Fetch users from an API
    fetch('https://api.example.com/users')
      .then(response => response.json())
      .then((data: User[]) => {
        setUsers(data);
        setLoading(false);
      });
  }, []);
  
  if (loading) {
    return &lt;div&gt;Loading...&lt;/div&gt;;
  }
  
  return (
    &lt;ul&gt;
      {users.map(user => (
        &lt;li key={user.id}&gt;
          {user.name} ({user.email})
        &lt;/li&gt;
      ))}
    &lt;/ul&gt;
  );
}</code></pre>

      <h2 id="advanced-types">Advanced TypeScript Features</h2>
      <p>TypeScript offers several advanced features that can be useful in React applications:</p>
      
      <h3 id="union-types">Union Types</h3>
      <p>Union types allow a value to be one of several types:</p>
      
      <pre><code>// A variable that can be either a string or a number
let id: string | number;

id = "abc123"; // Valid
id = 123; // Also valid
// id = true; // Error: Type 'boolean' is not assignable to type 'string | number'</code></pre>

      <h3 id="generics">Generics</h3>
      <p>Generics allow you to create reusable components that can work with different types:</p>
      
      <pre><code>// A generic function that works with any type
function getFirstItem&lt;T&gt;(items: T[]): T | undefined {
  return items.length > 0 ? items[0] : undefined;
}

const numbers = [1, 2, 3];
const firstNumber = getFirstItem(numbers); // Type: number | undefined

const names = ["Alice", "Bob", "Charlie"];
const firstName = getFirstItem(names); // Type: string | undefined</code></pre>

      <h3 id="type-assertions">Type Assertions</h3>
      <p>Type assertions allow you to tell TypeScript that you know better about the type of a value:</p>
      
      <pre><code>// Using type assertion to specify the type of an event target
function handleChange(event: React.ChangeEvent&lt;HTMLInputElement&gt;) {
  const value = event.target.value;
  // Do something with the value
}

// Using type assertion with the 'as' keyword
const myCanvas = document.getElementById('main_canvas') as HTMLCanvasElement;</code></pre>
      
      <h2 id="conclusion">Conclusion</h2>
      <p>TypeScript provides many benefits for React development, including better tooling, improved code quality, and enhanced developer experience. By adding static types to your React applications, you can catch errors earlier in the development process and make your code more maintainable.</p>
      
      <p>Remember that TypeScript is designed to be gradually adopted, so you can start adding types to your existing JavaScript code incrementally. As you become more comfortable with TypeScript, you can take advantage of its more advanced features to further improve your React applications.</p>
    `,
    coverImage: "/placeholder.svg?height=600&width=1200",
    date: "May 18, 2023",
    readTime: 11,
    categories: ["TypeScript", "React", "JavaScript"],
    author: {
      name: "Emmanuel Adoum",
      avatar: "/emma.png",
      bio: "Software Engineer passionate about TypeScript and building scalable React applications.",
      social: {
        github: "https://github.com",
        twitter: "https://twitter.com",
        linkedin: "https://linkedin.com",
      },
    },
    views: 1832,
  },
  {
    id: "8",
    title: "Creating Accessible Web Applications with React",
    slug: "accessible-web-applications-react",
    excerpt:
      "Learn how to build accessible web applications with React that can be used by everyone, including people with disabilities.",
    content: `
      <h2 id="introduction">Introduction</h2>
      <p>Web accessibility ensures that websites and applications can be used by everyone, including people with disabilities. In this guide, we'll explore how to create accessible React applications.</p>
      
      <h2 id="main-content">Understanding Web Accessibility</h2>
      <p>Web accessibility, often abbreviated as a11y, refers to the practice of making websites usable by as many people as possible, including those with disabilities such as:</p>
      
      <ul>
        <li>Visual impairments</li>
        <li>Hearing impairments</li>
        <li>Motor impairments</li>
        <li>Cognitive impairments</li>
      </ul>
      
      <h3 id="subsection">WCAG Guidelines</h3>
      <p>The Web Content Accessibility Guidelines (WCAG) provide a set of recommendations for making web content more accessible. These guidelines are organized around four principles:</p>
      
      <ul>
        <li><strong>Perceivable</strong>: Information must be presentable to users in ways they can perceive.</li>
        <li><strong>Operable</strong>: User interface components must be operable.</li>
        <li><strong>Understandable</strong>: Information and operation must be understandable.</li>
        <li><strong>Robust</strong>: Content must be robust enough to be interpreted by a wide variety of user agents.</li>
      </ul>

      <h2 id="semantic-html">Using Semantic HTML</h2>
      <p>One of the most important aspects of accessibility is using semantic HTML elements that convey meaning about the content:</p>
      
      <pre><code>// Bad example
&lt;div onClick={handleClick}&gt;Click me&lt;/div&gt;

// Good example
&lt;button onClick={handleClick}&gt;Click me&lt;/button&gt;</code></pre>

      <p>Semantic HTML elements like &lt;nav&gt;, &lt;main&gt;, &lt;section&gt;, &lt;article&gt;, and &lt;button&gt; provide important context to assistive technologies.</p>

      <h2 id="keyboard-navigation">Keyboard Navigation</h2>
      <p>Many users navigate websites using only a keyboard. Ensure that all interactive elements are keyboard accessible:</p>
      
      <pre><code>// Make sure custom components can be focused and activated with keyboard
function CustomButton({ onClick, children }) {
  return (
    &lt;div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
    &gt;
      {children}
    &lt;/div&gt;
  );
}</code></pre>

      <h2 id="aria">ARIA Attributes</h2>
      <p>Accessible Rich Internet Applications (ARIA) attributes can enhance accessibility when HTML semantics are not sufficient:</p>
      
      <pre><code>// Using ARIA for a custom dropdown
function Dropdown({ label, options, selectedOption, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    &lt;div&gt;
      &lt;button
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      &gt;
        {selectedOption || label}
      &lt;/button&gt;
      
      {isOpen && (
        &lt;ul role="listbox" aria-label={label}&gt;
          {options.map((option) => (
            &lt;li
              key={option.value}
              role="option"
              aria-selected={option.value === selectedOption}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            &gt;
              {option.label}
            &lt;/li&gt;
          ))}
        &lt;/ul&gt;
      )}
    &lt;/div&gt;
  );
}</code></pre>

      <h2 id="focus-management">Focus Management</h2>
      <p>Proper focus management is crucial for keyboard users, especially in single-page applications:</p>
      
      <pre><code>import { useRef, useEffect } from 'react';

function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef(null);
  
  // Focus the modal when it opens
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    &lt;div className="modal-overlay"&gt;
      &lt;div
        ref={modalRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
      &gt;
        &lt;button onClick={onClose} aria-label="Close modal"&gt;
          &times;
        &lt;/button&gt;
        {children}
      &lt;/div&gt;
    &lt;/div&gt;
  );
}</code></pre>

      <h2 id="color-contrast">Color Contrast</h2>
      <p>Ensure sufficient color contrast between text and background to make content readable for users with visual impairments:</p>
      
      <pre><code>// Example of a component with good contrast
function Button({ children, isPrimary }) {
  return (
    &lt;button
      className={isPrimary ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-800'}
    &gt;
      {children}
    &lt;/button&gt;
  );
}</code></pre>

      <h2 id="testing">Testing Accessibility</h2>
      <p>Use tools to test the accessibility of your React applications:</p>
      
      <ul>
        <li><strong>eslint-plugin-jsx-a11y</strong>: Linting for accessibility issues</li>
        <li><strong>react-axe</strong>: Runtime accessibility testing</li>
        <li><strong>@testing-library/jest-dom</strong>: Custom Jest matchers for accessibility testing</li>
      </ul>
      
      <pre><code>// Example of using react-axe
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

if (process.env.NODE_ENV !== 'production') {
  const axe = require('@axe-core/react');
  axe(React, ReactDOM, 1000);
}

ReactDOM.render(&lt;App /&gt;, document.getElementById('root'));</code></pre>
      
      <h2 id="conclusion">Conclusion</h2>
      <p>Creating accessible web applications is not just a legal requirement in many countries but also a moral obligation to ensure that everyone can use your application. By following the principles and techniques outlined in this guide, you can make your React applications more accessible to all users.</p>
      
      <p>Remember that accessibility is not a one-time task but an ongoing process. Regularly test your application with different assistive technologies and get feedback from users with disabilities to continuously improve the accessibility of your React applications.</p>
    `,
    coverImage: "/placeholder.svg?height=600&width=1200",
    date: "April 7, 2023",
    readTime: 13,
    categories: ["Accessibility", "React", "UI/UX"],
    author: {
      name: "Emmanuel Adoum",
      avatar: "/emma.png",
      bio: "Frontend developer passionate about web accessibility and inclusive design.",
      social: {
        github: "https://github.com",
        twitter: "https://twitter.com",
        linkedin: "https://linkedin.com",
      },
    },
    views: 1543,
  },
];
