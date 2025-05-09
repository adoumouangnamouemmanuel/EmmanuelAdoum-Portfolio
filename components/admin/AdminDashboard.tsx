"use client"

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
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"
import { AnimatePresence, motion } from "framer-motion"
import {
  ArrowUp,
  BarChart3,
  CheckCircle,
  Edit,
  Eye,
  FileText,
  MessageSquare,
  RefreshCw,
  Search,
  Trash2,
  UserX,
  Users,
} from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

type Post = {
  id: string
  title: string
  slug: string
  published: boolean
  views: number
  createdAt: string
  author: {
    id: string
    name: string
    image: string
  }
  _count: {
    comments: number
    likes: number
  }
}

type User = {
  id: string
  name: string
  email: string
  image: string
  role: string
  blocked?: boolean // Added optional blocked property
  createdAt: string
  _count: {
    posts: number
    comments: number
  }
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState(() => typeof window !== "undefined" ? localStorage.getItem("adminSearch") || "" : "")
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [tab, setTab] = useState(() => typeof window !== "undefined" ? localStorage.getItem("adminTab") || "posts" : "posts")
  const inactivityTimeout = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()
  const [lastUpdated, setLastUpdated] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("adminLastUpdated") || new Date().toISOString();
    }
    return new Date().toISOString();
  });

  useEffect(() => {
    localStorage.setItem("adminTab", tab)
  }, [tab])

  useEffect(() => {
    localStorage.setItem("adminSearch", searchQuery)
  }, [searchQuery])

  useEffect(() => {
    // Check if user is authenticated and is an admin
    if (status === "unauthenticated") {
      router.push("/auth/login?callbackUrl=/admin")
      return
    }

    if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/")
      return
    }

    // Fetch posts and users
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [postsRes, usersRes] = await Promise.all([fetch("/api/admin/posts"), fetch("/api/admin/users")])

        if (postsRes.ok && usersRes.ok) {
          const postsData = await postsRes.json()
          const usersData = await usersRes.json()
          setPosts(postsData.posts)
          setUsers(usersData.users)
        }
      } catch (error) {
        console.error("Error fetching admin data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (status === "authenticated" && session?.user?.role === "admin") {
      fetchData()
    }
  }, [status, session?.user?.role, router])

  // Show welcome back toast if returning after 10+ minutes
  useEffect(() => {
    if (typeof window !== "undefined") {
      const lastVisit = localStorage.getItem("adminLastVisit");
      const now = Date.now();
      if (lastVisit && now - parseInt(lastVisit, 10) > 10 * 60 * 1000) {
        toast && toast({ title: "Welcome back!", description: "Dashboard data has been refreshed." });
      }
      localStorage.setItem("adminLastVisit", now.toString());
    }
  }, []);

  // Update last updated time on refresh
  const refreshData = async () => {
    setRefreshing(true)
    try {
      const [postsRes, usersRes] = await Promise.all([fetch("/api/admin/posts"), fetch("/api/admin/users")])
      if (postsRes.ok && usersRes.ok) {
        const postsData = await postsRes.json()
        const usersData = await usersRes.json()
        setPosts(postsData.posts)
        setUsers(usersData.users)
        const now = new Date().toISOString();
        setLastUpdated(now);
        localStorage.setItem("adminLastUpdated", now);
      }
    } catch (error) {
      console.error("Error refreshing data:", error)
    } finally {
      setRefreshing(false)
    }
  }

  // Inactivity timer logic
  useEffect(() => {
    const resetTimer = () => {
      if (inactivityTimeout.current) clearTimeout(inactivityTimeout.current)
      inactivityTimeout.current = setTimeout(() => {
        refreshData()
      }, 10 * 60 * 1000) // 10 minutes
    }
    // Listen for user activity
    window.addEventListener("mousemove", resetTimer)
    window.addEventListener("keydown", resetTimer)
    window.addEventListener("mousedown", resetTimer)
    window.addEventListener("touchstart", resetTimer)
    // Start timer on mount
    resetTimer()
    return () => {
      if (inactivityTimeout.current) clearTimeout(inactivityTimeout.current)
      window.removeEventListener("mousemove", resetTimer)
      window.removeEventListener("keydown", resetTimer)
      window.removeEventListener("mousedown", resetTimer)
      window.removeEventListener("touchstart", resetTimer)
    }
  }, [])

  const handleDeletePost = async (postId: string) => {
    try {
      const res = await fetch(`/api/admin/posts/${postId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setPosts(posts.filter((post) => post.id !== postId))
      }
    } catch (error) {
      console.error("Error deleting post:", error)
    }
  }

  const handleTogglePublishPost = async (postId: string, published: boolean) => {
    try {
      const res = await fetch(`/api/admin/posts/${postId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ published: !published }),
      })

      if (res.ok) {
        setPosts(posts.map((post) => (post.id === postId ? { ...post, published: !published } : post)))
      }
    } catch (error) {
      console.error("Error updating post:", error)
    }
  }

  const handleBlockUser = async (userId: string, blocked = false) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ blocked: !blocked }),
      })

      if (res.ok) {
        setUsers(users.map((user) => (user.id === userId ? { ...user, blocked: !blocked } : user)))
      }
    } catch (error) {
      console.error("Error updating user:", error)
    }
  }

  // Filter posts and users based on search query
  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-gray-900 dark:to-gray-950">
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-16 h-16 rounded-full border-4 border-violet-200 border-t-violet-600 dark:border-violet-800 dark:border-t-violet-400"
        ></motion.div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="min-h-screen bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-gray-900 dark:to-gray-950 py-8 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <motion.h1
              className="text-3xl font-bold bg-gradient-to-r from-violet-700 to-indigo-700 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              Admin Dashboard
            </motion.h1>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <Button
                onClick={refreshData}
                variant="outline"
                size="sm"
                className="bg-white dark:bg-gray-800 border border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/30 transition-all duration-300"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                Refresh Data
              </Button>
            </motion.div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4 mb-8">
            <Link href="/">
              <a className="inline-block px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold shadow-md hover:from-purple-700 hover:to-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400">Go to Portfolio</a>
            </Link>
            <Link href="/blog">
              <a className="inline-block px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-md hover:from-blue-700 hover:to-purple-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400">Go to Blogs</a>
            </Link>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <motion.div variants={fadeIn}>
              <Card className="overflow-hidden border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl hover:shadow-violet-200/50 dark:hover:shadow-violet-900/30 transition-all duration-300">
                <CardHeader className="pb-2 bg-gradient-to-r from-violet-500/10 to-indigo-500/10 dark:from-violet-500/5 dark:to-indigo-500/5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                    <FileText className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold bg-gradient-to-r from-violet-700 to-indigo-700 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
                    {posts.length}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-muted-foreground">
                      {posts.filter((post) => post.published).length} published
                    </p>
                    <Badge
                      variant="outline"
                      className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800"
                    >
                      <ArrowUp className="h-3 w-3 mr-1" />
                      {Math.round((posts.filter((p) => p.published).length / Math.max(posts.length, 1)) * 100)}%
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn}>
              <Card className="overflow-hidden border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl hover:shadow-violet-200/50 dark:hover:shadow-violet-900/30 transition-all duration-300">
                <CardHeader className="pb-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/5 dark:to-purple-500/5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                    {users.length}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-muted-foreground">
                      {users.filter((user) => user.role === "admin").length} admins
                    </p>
                    <Badge
                      variant="outline"
                      className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800"
                    >
                      <Users className="h-3 w-3 mr-1" />
                      {users.filter((u) => !u.blocked).length} active
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn}>
              <Card className="overflow-hidden border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl hover:shadow-violet-200/50 dark:hover:shadow-violet-900/30 transition-all duration-300">
                <CardHeader className="pb-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/5 dark:to-pink-500/5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
                    <MessageSquare className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-pink-700 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                    {posts.reduce((acc, post) => acc + post._count.comments, 0)}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-muted-foreground">Across all posts</p>
                    <Badge
                      variant="outline"
                      className="bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800"
                    >
                      <BarChart3 className="h-3 w-3 mr-1" />
                      {(posts.reduce((acc, post) => acc + post._count.comments, 0) / Math.max(posts.length, 1)).toFixed(
                        1,
                      )}{" "}
                      avg
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <motion.div variants={fadeIn} className="mb-6 relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-violet-600 dark:text-violet-400" />
              <Input
                placeholder="Search posts and users..."
                className="pl-10 border-violet-200 dark:border-violet-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm focus:ring-2 focus:ring-violet-500/50 dark:focus:ring-violet-500/30 transition-all duration-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={() => setSearchQuery("")}
                >
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    ×
                  </motion.div>
                </Button>
              )}
            </div>
          </motion.div>

          <motion.div variants={fadeIn}>
            <Tabs value={tab} onValueChange={setTab} className="w-full">
              <TabsList className="mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-violet-200 dark:border-violet-800 p-1 rounded-lg">
                <TabsTrigger
                  value="posts"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500/10 data-[state=active]:to-indigo-500/10 data-[state=active]:text-violet-700 dark:data-[state=active]:text-violet-400 data-[state=active]:shadow-sm rounded-md transition-all duration-300"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Posts
                </TabsTrigger>
                <TabsTrigger
                  value="users"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500/10 data-[state=active]:to-purple-500/10 data-[state=active]:text-indigo-700 dark:data-[state=active]:text-indigo-400 data-[state=active]:shadow-sm rounded-md transition-all duration-300"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Users
                </TabsTrigger>
              </TabsList>

              <AnimatePresence mode="wait">
                <TabsContent value="posts" className="mt-0">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-xl overflow-hidden border border-violet-200 dark:border-violet-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl"
                  >
                    <Table>
                      <TableHeader className="bg-gradient-to-r from-violet-500/10 to-indigo-500/10 dark:from-violet-500/5 dark:to-indigo-500/5">
                        <TableRow className="hover:bg-transparent border-violet-200 dark:border-violet-800">
                          <TableHead className="text-violet-700 dark:text-violet-400 font-medium">Title</TableHead>
                          <TableHead className="text-violet-700 dark:text-violet-400 font-medium">Author</TableHead>
                          <TableHead className="text-violet-700 dark:text-violet-400 font-medium">Status</TableHead>
                          <TableHead className="text-center text-violet-700 dark:text-violet-400 font-medium">
                            Views
                          </TableHead>
                          <TableHead className="text-center text-violet-700 dark:text-violet-400 font-medium">
                            Likes
                          </TableHead>
                          <TableHead className="text-center text-violet-700 dark:text-violet-400 font-medium">
                            Comments
                          </TableHead>
                          <TableHead className="text-right text-violet-700 dark:text-violet-400 font-medium">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <AnimatePresence>
                          {filteredPosts.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ duration: 0.5 }}
                                  className="flex flex-col items-center justify-center"
                                >
                                  <Search className="h-8 w-8 mb-2 text-muted-foreground opacity-50" />
                                  No posts found
                                </motion.div>
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredPosts.map((post, index) => (
                              <motion.tr
                                key={post.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2, delay: index * 0.05 }}
                                className="border-b border-violet-100 dark:border-violet-900/20 hover:bg-violet-50 dark:hover:bg-violet-900/10 transition-colors duration-200"
                              >
                                <TableCell className="font-medium max-w-[200px] truncate">{post.title}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full overflow-hidden bg-violet-100 dark:bg-violet-900/30 flex-shrink-0">
                                      <img
                                        src={post.author.image || "/placeholder.svg"}
                                        alt={post.author.name}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <span className="text-sm">{post.author.name}</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant={post.published ? "default" : "secondary"}
                                    className={
                                      post.published
                                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 border-0"
                                        : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50 border-0"
                                    }
                                  >
                                    {post.published ? "Published" : "Draft"}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400">
                                    {post.views}
                                  </span>
                                </TableCell>
                                <TableCell className="text-center">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400">
                                    {post._count.likes}
                                  </span>
                                </TableCell>
                                <TableCell className="text-center">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400">
                                    {post._count.comments}
                                  </span>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end space-x-1">
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => router.push(`/blog/${post.slug}`)}
                                          className="h-8 w-8 rounded-full bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-900/40 transition-colors"
                                        >
                                          <Eye className="h-4 w-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>View</TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => router.push(`/blog/edit/${post.slug}`)}
                                          className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
                                        >
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>Edit</TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => handleTogglePublishPost(post.id, post.published)}
                                          className="h-8 w-8 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
                                        >
                                          <CheckCircle className="h-4 w-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>{post.published ? "Unpublish" : "Publish"}</TooltipContent>
                                    </Tooltip>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </motion.div>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-violet-200 dark:border-violet-800 shadow-xl">
                                        <AlertDialogHeader>
                                          <AlertDialogTitle className="text-xl font-bold bg-gradient-to-r from-violet-700 to-red-700 dark:from-violet-400 dark:to-red-400 bg-clip-text text-transparent">
                                            Are you sure you want to delete this post?
                                          </AlertDialogTitle>
                                          <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete the post and all
                                            associated comments.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel className="border border-violet-200 dark:border-violet-800 hover:bg-violet-50 dark:hover:bg-violet-900/30 transition-colors">
                                            Cancel
                                          </AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() => handleDeletePost(post.id)}
                                            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-0 shadow-md shadow-red-500/20 hover:shadow-red-500/30 transition-all duration-300"
                                          >
                                            Delete
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                </TableCell>
                              </motion.tr>
                            ))
                          )}
                        </AnimatePresence>
                      </TableBody>
                    </Table>
                  </motion.div>
                </TabsContent>
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <TabsContent value="users" className="mt-0">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-xl overflow-hidden border border-indigo-200 dark:border-indigo-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl"
                  >
                    <Table>
                      <TableHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/5 dark:to-purple-500/5">
                        <TableRow className="hover:bg-transparent border-indigo-200 dark:border-indigo-800">
                          <TableHead className="text-indigo-700 dark:text-indigo-400 font-medium">User</TableHead>
                          <TableHead className="text-indigo-700 dark:text-indigo-400 font-medium">Email</TableHead>
                          <TableHead className="text-indigo-700 dark:text-indigo-400 font-medium">Role</TableHead>
                          <TableHead className="text-center text-indigo-700 dark:text-indigo-400 font-medium">
                            Posts
                          </TableHead>
                          <TableHead className="text-center text-indigo-700 dark:text-indigo-400 font-medium">
                            Comments
                          </TableHead>
                          <TableHead className="text-right text-indigo-700 dark:text-indigo-400 font-medium">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <AnimatePresence>
                          {filteredUsers.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ duration: 0.5 }}
                                  className="flex flex-col items-center justify-center"
                                >
                                  <Search className="h-8 w-8 mb-2 text-muted-foreground opacity-50" />
                                  No users found
                                </motion.div>
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredUsers.map((user, index) => (
                              <motion.tr
                                key={user.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2, delay: index * 0.05 }}
                                className="border-b border-indigo-100 dark:border-indigo-900/20 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-colors duration-200"
                              >
                                <TableCell className="font-medium">
                                  <div className="flex items-center gap-3">
                                    <motion.div
                                      className="w-8 h-8 rounded-full overflow-hidden bg-indigo-100 dark:bg-indigo-900/30 flex-shrink-0 ring-2 ring-indigo-200 dark:ring-indigo-800"
                                      whileHover={{ scale: 1.1, rotate: 5 }}
                                      transition={{ type: "spring", stiffness: 300, damping: 10 }}
                                    >
                                      <img
                                        src={user.image || "/placeholder.svg"}
                                        alt={user.name || "User"}
                                        className="w-full h-full object-cover"
                                      />
                                    </motion.div>
                                    <span className="font-medium text-indigo-900 dark:text-indigo-100">
                                      {user.name || "Anonymous"}
                                      {user.blocked && (
                                        <span className="ml-2 text-xs text-red-500 dark:text-red-400">(Blocked)</span>
                                      )}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">{user.email}</TableCell>
                                <TableCell>
                                  <Badge
                                    variant={user.role === "admin" ? "default" : "secondary"}
                                    className={
                                      user.role === "admin"
                                        ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50 border-0"
                                        : "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 border-0"
                                    }
                                  >
                                    {user.role}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400">
                                    {user._count?.posts || 0}
                                  </span>
                                </TableCell>
                                <TableCell className="text-center">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400">
                                    {user._count?.comments || 0}
                                  </span>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end space-x-1">
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => router.push(`/admin/users/${user.id}`)}
                                          className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
                                        >
                                          <Eye className="h-4 w-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>View</TooltipContent>
                                    </Tooltip>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                                          >
                                            <UserX className="h-4 w-4" />
                                          </Button>
                                        </motion.div>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-indigo-200 dark:border-indigo-800 shadow-xl">
                                        <AlertDialogHeader>
                                          <AlertDialogTitle className="text-xl font-bold bg-gradient-to-r from-indigo-700 to-red-700 dark:from-indigo-400 dark:to-red-400 bg-clip-text text-transparent">
                                            Are you sure you want to {user.blocked ? "unblock" : "block"} this user?
                                          </AlertDialogTitle>
                                          <AlertDialogDescription>
                                            {user.blocked
                                              ? "This will allow the user to log in and interact with the site again."
                                              : "This will prevent the user from logging in and interacting with the site."}
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel className="border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors">
                                            Cancel
                                          </AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() => handleBlockUser(user.id, user.blocked)}
                                            className={
                                              user.blocked
                                                ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white border-0 shadow-md shadow-green-500/20 hover:shadow-green-500/30 transition-all duration-300"
                                                : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-0 shadow-md shadow-red-500/20 hover:shadow-red-500/30 transition-all duration-300"
                                            }
                                          >
                                            {user.blocked ? "Unblock" : "Block"}
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                </TableCell>
                              </motion.tr>
                            ))
                          )}
                        </AnimatePresence>
                      </TableBody>
                    </Table>
                  </motion.div>
                </TabsContent>
              </AnimatePresence>
            </Tabs>
          </motion.div>
        </div>
      </motion.div>
    </TooltipProvider>
  )
}
