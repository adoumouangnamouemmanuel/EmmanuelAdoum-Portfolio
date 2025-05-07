"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Save, X, Eye, ImageIcon, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Define the BlogPost type
type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  date: string;
  readTime: number;
  categories: string[];
  author: {
    name: string;
    avatar: string;
  };
  views: number;
};

export default function EditBlogPost() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [title, setTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState(
    "/placeholder.svg?height=600&width=1200"
  );
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [preview, setPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [postNotFound, setPostNotFound] = useState(false);
  const [originalPost, setOriginalPost] = useState<BlogPost | null>(null);

  // Load post data on component mount
  useEffect(() => {
    const loadPost = () => {
      try {
        // Try to get posts from localStorage
        const posts = JSON.parse(localStorage.getItem("blogPosts") || "[]");

        // Find the post with the matching slug
        const post = posts.find((p: BlogPost) => p.slug === slug);

        if (post) {
          setOriginalPost(post);
          setTitle(post.title);
          setNewSlug(post.slug);
          setExcerpt(post.excerpt);
          setContent(post.content);
          setCoverImage(post.coverImage);
          setCategories(post.categories);
        } else {
          // If post not found in localStorage, try to find it in the imported data
          import("@/data/blog")
            .then((module) => {
              const dataPost = module.blogPosts.find((p) => p.slug === slug);

              if (dataPost) {
                setOriginalPost(dataPost);
                setTitle(dataPost.title);
                setNewSlug(dataPost.slug);
                setExcerpt(dataPost.excerpt);
                setContent(dataPost.content);
                setCoverImage(dataPost.coverImage);
                setCategories(dataPost.categories);
              } else {
                setPostNotFound(true);
              }
            })
            .catch(() => {
              setPostNotFound(true);
            });
        }
      } catch (error) {
        console.error("Error loading blog post:", error);
        setPostNotFound(true);
      }
    };

    if (slug) {
      loadPost();
    }
  }, [slug]);

  // Calculate read time based on content length
  const calculateReadTime = (text: string): number => {
    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };

  // Add a category to the list
  const addCategory = () => {
    if (category && !categories.includes(category)) {
      setCategories([...categories, category]);
      setCategory("");
    }
  };

  // Remove a category from the list
  const removeCategory = (categoryToRemove: string) => {
    setCategories(categories.filter((cat) => cat !== categoryToRemove));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (!originalPost) {
        throw new Error("Original post not found");
      }

      // Create an updated blog post object
      const updatedPost: BlogPost = {
        ...originalPost,
        title,
        slug: newSlug,
        excerpt,
        content,
        coverImage,
        readTime: calculateReadTime(content),
        categories,
        // Keep the original date and views
      };

      // Get existing posts from localStorage
      const existingPosts = JSON.parse(
        localStorage.getItem("blogPosts") || "[]"
      );

      // Find if the post already exists in localStorage
      const postIndex = existingPosts.findIndex(
        (p: BlogPost) => p.id === originalPost.id
      );

      let updatedPosts;
      if (postIndex >= 0) {
        // Update existing post
        updatedPosts = [...existingPosts];
        updatedPosts[postIndex] = updatedPost;
      } else {
        // Add as a new post (for posts from the data file)
        updatedPosts = [updatedPost, ...existingPosts];
      }

      // Save to localStorage
      localStorage.setItem("blogPosts", JSON.stringify(updatedPosts));

      setSaveMessage("Blog post updated successfully!");

      // Redirect after a short delay
      setTimeout(() => {
        router.push(`/blog/${newSlug}`);
      }, 1500);
    } catch (error) {
      console.error("Error updating blog post:", error);
      setSaveMessage("Error updating blog post. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle post deletion
  const handleDelete = () => {
    try {
      if (!originalPost) {
        throw new Error("Original post not found");
      }

      // Get existing posts from localStorage
      const existingPosts = JSON.parse(
        localStorage.getItem("blogPosts") || "[]"
      );

      // Filter out the post to delete
      const updatedPosts = existingPosts.filter(
        (p: BlogPost) => p.id !== originalPost.id
      );

      // Save to localStorage
      localStorage.setItem("blogPosts", JSON.stringify(updatedPosts));

      // Redirect to blog list
      router.push("/blog");
    } catch (error) {
      console.error("Error deleting blog post:", error);
      setSaveMessage("Error deleting blog post. Please try again.");
    }
  };

  if (postNotFound) {
    return (
      <main className="min-h-screen py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
          <p className="mb-8">
            The blog post you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link href="/blog">Back to Blog</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              size="sm"
              className="shadow-md group"
              asChild
            >
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Back to Blog
              </Link>
            </Button>
          </motion.div>

          <div className="flex gap-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Button
                variant="outline"
                size="sm"
                className="shadow-md"
                onClick={() => setPreview(!preview)}
              >
                {preview ? "Edit" : "Preview"}
                <Eye className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="shadow-md">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the blog post.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold mb-6 text-center"
        >
          Edit <span className="gradient-text">Blog Post</span>
        </motion.h1>

        <Tabs defaultValue="editor" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="preview" onClick={() => setPreview(true)}>
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className={preview ? "hidden" : ""}>
            <form onSubmit={handleSubmit}>
              <Card>
                <CardHeader>
                  <CardTitle>Edit Blog Post</CardTitle>
                  <CardDescription>
                    Update the details of your blog post. All fields are
                    required.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter blog post title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      placeholder="url-friendly-title"
                      value={newSlug}
                      onChange={(e) => setNewSlug(e.target.value)}
                      required
                    />
                    <p className="text-sm text-muted-foreground">
                      This will be used in the URL: /blog/
                      {newSlug || "your-post-slug"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      placeholder="A brief summary of your blog post"
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      required
                      className="resize-none h-20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="coverImage">Cover Image URL</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="coverImage"
                        placeholder="https://example.com/image.jpg"
                        value={coverImage}
                        onChange={(e) => setCoverImage(e.target.value)}
                        required
                      />
                      <Button type="button" variant="outline" size="icon">
                        <ImageIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="categories">Categories</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="categories"
                        placeholder="Add a category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      />
                      <Button
                        type="button"
                        onClick={addCategory}
                        variant="outline"
                        size="icon"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {categories.map((cat) => (
                        <Badge
                          key={cat}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {cat}
                          <button
                            type="button"
                            onClick={() => removeCategory(cat)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Content (HTML)</Label>
                    <Textarea
                      id="content"
                      placeholder="Write your blog post content in HTML format"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      required
                      className="min-h-[300px] font-mono text-sm"
                    />
                    <p className="text-sm text-muted-foreground">
                      You can use HTML tags for formatting. Estimated read time:{" "}
                      {calculateReadTime(content)} min
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => router.push("/blog")}
                  >
                    Cancel
                  </Button>
                  <div className="flex items-center gap-4">
                    {saveMessage && (
                      <span
                        className={
                          saveMessage.includes("Error")
                            ? "text-destructive text-sm"
                            : "text-green-600 dark:text-green-400 text-sm"
                        }
                      >
                        {saveMessage}
                      </span>
                    )}
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? "Saving..." : "Update Post"}
                      <Save className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </form>
          </TabsContent>

          <TabsContent value="preview" className={!preview ? "hidden" : ""}>
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>
                  This is how your blog post will look when published.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert max-w-none">
                  <div className="relative rounded-xl overflow-hidden shadow-xl mb-8 aspect-video">
                    <img
                      src={
                        coverImage || "/placeholder.svg?height=600&width=1200"
                      }
                      alt={title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {categories.map((cat, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="shadow-sm"
                      >
                        {cat}
                      </Badge>
                    ))}
                  </div>

                  <h1 className="text-3xl font-bold mb-4">
                    {title || "Your Blog Post Title"}
                  </h1>

                  <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-8">
                    <div className="flex items-center">
                      <span>
                        {originalPost?.date ||
                          new Date().toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span>{calculateReadTime(content)} min read</span>
                    </div>
                  </div>

                  <div className="mb-8">
                    <p className="text-lg text-muted-foreground italic">
                      {excerpt || "Your blog post excerpt will appear here."}
                    </p>
                  </div>

                  <div
                    className="blog-content"
                    dangerouslySetInnerHTML={{
                      __html:
                        content ||
                        "<p>Your blog post content will appear here.</p>",
                    }}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setPreview(false)}
                  className="w-full"
                >
                  Back to Editor
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}