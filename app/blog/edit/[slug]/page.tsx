"use client";

import type React from "react";

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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, ImageIcon, Plus, Save, Trash2, X } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
  published: boolean;
  author: {
    id: string;
    name: string;
    image: string;
  };
};

export default function EditBlogPost() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const slug = (params?.slug as string) || "";
  const [title, setTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState(
    "/placeholder.svg?height=600&width=1200"
  );
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [preview, setPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [originalPost, setOriginalPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login?callbackUrl=/blog/edit/" + slug);
    }
  }, [status, router, slug]);

  // Load post data on component mount
  useEffect(() => {
    const fetchPost = async () => {
      if (status !== "authenticated") return;

      try {
        setLoading(true);
        setError(null);

        // Fetch post from API
        const response = await fetch(`/api/posts/${slug}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError("Post not found");
            setLoading(false);
            return;
          }
          throw new Error(`Error fetching post: ${response.statusText}`);
        }

        const post = await response.json();

        // Check if user is authorized to edit this post
        if (
          post.author.id !== session?.user.id &&
          session?.user.role !== "admin"
        ) {
          setError("You are not authorized to edit this post");
          setLoading(false);
          return;
        }

        setOriginalPost(post);
        setTitle(post.title);
        setNewSlug(post.slug);
        setExcerpt(post.excerpt || "");
        setContent(post.content);
        setCoverImage(
          post.coverImage || "/images/posts/blog.avif"
        );
        setCategories(
          post.categories.map((cat: any) =>
            typeof cat === "string" ? cat : cat.name
          )
        );
      } catch (error) {
        console.error("Error loading blog post:", error);
        setError("Failed to load blog post");

        // Fallback to local data in development
        if (process.env.NODE_ENV === "development") {
          try {
            const module = await import("@/data/blog1");
            const foundPost = module.blogPosts.find((p) => p.slug === slug);

            if (foundPost) {
              setOriginalPost(foundPost as unknown as BlogPost);
              setTitle(foundPost.title);
              setNewSlug(foundPost.slug);
              setExcerpt(foundPost.excerpt || "");
              setContent(foundPost.content);
              setCoverImage(
                foundPost.coverImage || "/images/posts/blog.avif"
              );
              setCategories(foundPost.categories);
              setError(null);
            }
          } catch (fallbackError) {
            console.error("Fallback data error:", fallbackError);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    // Fetch available categories
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (response.ok) {
          const data = await response.json();
          setAvailableCategories(data.categories.map((cat: any) => cat.name));
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Fallback categories
        setAvailableCategories([
          "Next.js",
          "React",
          "JavaScript",
          "TypeScript",
          "CSS",
          "UI/UX",
          "Web Development",
          "Backend",
          "Frontend",
        ]);
      }
    };

    if (slug && status === "authenticated") {
      fetchPost();
      fetchCategories();
    }
  }, [slug, status, session, router]);

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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Validate required fields
      if (!title || !newSlug || !content) {
        toast({
          title: "Missing required fields",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        setIsSaving(false);
        return;
      }

      // Create updated post data
      const postData = {
        title,
        newSlug: newSlug !== slug ? newSlug : undefined,
        excerpt,
        content,
        coverImage,
        categories: categories.length > 0 ? categories : ["Uncategorized"],
      };

      // Send to API
      const response = await fetch(`/api/posts/${slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Success!",
          description: "Your post has been updated",
        });

        // Redirect after a short delay
        setTimeout(() => {
          router.push(`/blog/${data.slug}`);
        }, 1000);
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to update post");
      }
    } catch (error: any) {
      console.error("Error updating blog post:", error);
      toast({
        title: "Error",
        description:
          error.message || "Error updating blog post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle post deletion
  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      const response = await fetch(`/api/posts/${slug}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Your post has been deleted",
        });

        // Redirect after a short delay
        setTimeout(() => {
          router.push("/blog");
        }, 1000);
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete post");
      }
    } catch (error: any) {
      console.error("Error deleting blog post:", error);
      toast({
        title: "Error",
        description:
          error.message || "Error deleting blog post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Update slug automatically when title changes
  useEffect(() => {
    if (title) {
      setNewSlug(
        title
          .toLowerCase()
          .replace(/[^\w\s]/gi, "")
          .replace(/\s+/g, "-")
      );
    }
  }, [title]);

  // Show loading state while checking authentication or loading post
  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show error message
  if (error) {
    return (
      <main className="min-h-screen py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Error</h1>
          <p className="mb-8 text-muted-foreground">{error}</p>
          <Button asChild>
            <Link href="/blog">Back to Blog</Link>
          </Button>
        </div>
      </main>
    );
  }

  // Don't render the form if not authenticated
  if (status === "unauthenticated") {
    return null;
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
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
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
                        placeholder="/images/posts/blog.avif"
                        value={coverImage} //coverImage
                        onChange={(e) => setCoverImage(e.target.value)}
                        required
                      />
                      <Button type="button" variant="outline" size="icon" disabled>
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
                        list="category-options"
                      />
                      <datalist id="category-options">
                        {availableCategories.map((cat) => (
                          <option key={cat} value={cat} />
                        ))}
                      </datalist>
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
                    onClick={() => router.push(`/blog/${slug}`)}
                  >
                    Cancel
                  </Button>
                  <div className="flex items-center gap-4">
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
                        "/images/posts/blog.avif" //coverImage ||
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
