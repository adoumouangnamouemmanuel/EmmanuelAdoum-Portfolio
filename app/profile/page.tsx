import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { authOptions } from "@/lib/auth"
import { adminDb } from "@/lib/firebase/admin"
import { ArrowLeft, Calendar, Edit, Github, Linkedin, Mail, Twitter } from 'lucide-react'
import { getServerSession } from "next-auth"
import Link from "next/link"
import { redirect } from "next/navigation"

interface User {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  role: string
  createdAt: string
  bio?: string
  github?: string
  twitter?: string
  linkedin?: string
}

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  createdAt: string
  views?: number
  _count?: {
    comments: number
  }
}

interface Comment {
  id: string
  content: string
  postId: string
  postSlug: string
  postTitle: string
  createdAt: string
  parentId?: string | null
}

interface Reply {
  id: string
  content: string
  postId: string
  postSlug: string
  postTitle: string
  parentId: string
  createdAt: string
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect("/auth/login")
  }

  // Get user data from Firestore
  const userDoc = await adminDb.collection("users").doc(session.user.id).get()
  const userData = userDoc.exists ? (userDoc.data() as User) : null

  let posts: Post[] = []
  let comments: Comment[] = []
  let replies: Reply[] = []

  try {
    // Get user's posts without ordering for now
    const postsSnapshot = await adminDb.collection("posts").where("authorId", "==", session.user.id).get()

    posts = postsSnapshot.docs
      .map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as Post,
      )
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    // Get all user's comments without filtering by parentId
    const commentsSnapshot = await adminDb
      .collection("comments")
      .where("authorId", "==", session.user.id)
      .limit(10)
      .get()

    // Get post titles and slugs for comments
    const postIds = new Set(commentsSnapshot.docs.map(doc => doc.data().postId))
    const postsMap = new Map()
    
    for (const postId of postIds) {
      const postDoc = await adminDb.collection("posts").doc(postId).get()
      if (postDoc.exists) {
        const postData = postDoc.data()
        postsMap.set(postId, {
          title: postData?.title || "Untitled Post",
          slug: postData?.slug || postId
        })
      }
    }

    // Filter comments and replies in memory
    const allComments = commentsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      postTitle: postsMap.get(doc.data().postId)?.title || "Untitled Post",
      postSlug: postsMap.get(doc.data().postId)?.slug || doc.data().postId,
    })) as (Comment | Reply)[]

    comments = allComments
      .filter(comment => !comment.parentId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5) as Comment[]

    replies = allComments
      .filter(comment => comment.parentId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5) as Reply[]

  } catch (error) {
    console.error("Error fetching user data:", error)
    // Continue rendering the page even if posts/comments fail to load
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50/50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="container max-w-5xl py-8 px-4 sm:px-6">
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            className="group flex items-center text-muted-foreground hover:text-foreground transition-all"
            asChild
          >
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
              Back
            </Link>
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Sidebar */}
          <div className="w-full md:w-1/3">
            <Card className="border-none shadow-2xl overflow-hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 pointer-events-none"></div>
              <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
              <CardHeader className="text-center pt-12 relative z-10">
                <Avatar className="w-28 h-28 mx-auto mb-4 border-4 border-white dark:border-gray-800 shadow-xl">
                  <AvatarImage
                    src={userData?.image || session.user.image || "/images/posts/profile.jpeg"}
                    alt={userData?.name || session.user.name || "User"}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white text-xl">
                    {(userData?.name || session.user.name || "U")
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {userData?.name || session.user.name || "Anonymous"}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-2 italic">
                  {userData?.bio || "No bio yet"}
                </p>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-3 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
                  <div className="flex items-center gap-3 group">
                    <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300">
                      <Mail className="h-4 w-4" />
                    </div>
                    <span className="text-sm">{userData?.email || session.user.email}</span>
                  </div>
                  
                  {userData?.github && (
                    <div className="flex items-center gap-3 group">
                      <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300">
                        <Github className="h-4 w-4" />
                      </div>
                      <a
                        href={userData.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                      >
                        {userData.github.split("/").pop()}
                      </a>
                    </div>
                  )}
                  
                  {userData?.twitter && (
                    <div className="flex items-center gap-3 group">
                      <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300">
                        <Twitter className="h-4 w-4" />
                      </div>
                      <a
                        href={userData.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                      >
                        {userData.twitter.split("/").pop()}
                      </a>
                    </div>
                  )}
                  
                  {userData?.linkedin && (
                    <div className="flex items-center gap-3 group">
                      <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300">
                        <Linkedin className="h-4 w-4" />
                      </div>
                      <a
                        href={userData.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                      >
                        {userData.linkedin.split("/").pop()}
                      </a>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 group">
                    <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <span className="text-sm">
                      Joined {new Date(userData?.createdAt || new Date().toISOString()).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <Button 
                  asChild 
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <Link href="/settings">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="w-full md:w-2/3">
            <Tabs defaultValue="posts" className="space-y-6">
              <TabsList className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-1 rounded-xl border border-gray-100 dark:border-gray-800 shadow-md">
                <TabsTrigger 
                  value="posts"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
                >
                  Posts
                </TabsTrigger>
                <TabsTrigger 
                  value="comments"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
                >
                  Comments
                </TabsTrigger>
                <TabsTrigger 
                  value="replies"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
                >
                  Replies
                </TabsTrigger>
              </TabsList>

              <TabsContent value="posts" className="space-y-4">
                {posts.length === 0 ? (
                  <Card className="border-none shadow-lg overflow-hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
                    <CardContent className="pt-6 flex flex-col items-center justify-center py-12">
                      <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8a2 2 0 00-2-2h-1M9 15L12 12M12 12L15 15M12 12V8" />
                        </svg>
                      </div>
                      <p className="text-center text-muted-foreground">No posts yet. Start writing!</p>
                      <Button 
                        className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white transition-all duration-300"
                        asChild
                      >
                        <Link href="/blog/new">Create Post</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  posts.map((post) => (
                    <Card 
                      key={post.id} 
                      className="border-none shadow-lg overflow-hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group"
                    >
                      <CardContent className="p-6">
                        <Link 
                          href={`/blog/${post.slug}`} 
                          className="block group-hover:translate-x-1 transition-transform duration-300"
                        >
                          <h3 className="text-xl font-bold mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4">{post.excerpt}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-1 rounded-full">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              {post.views || 0}
                            </span>
                            <span className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                              {post._count?.comments || 0}
                            </span>
                          </div>
                        </Link>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="comments" className="space-y-4">
                {comments.length === 0 ? (
                  <Card className="border-none shadow-lg overflow-hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
                    <CardContent className="pt-6 flex flex-col items-center justify-center py-12">
                      <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                      </div>
                      <p className="text-center text-muted-foreground">No comments yet. Join the conversation!</p>
                      <Button 
                        className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white transition-all duration-300"
                        asChild
                      >
                        <Link href="/blog">Browse Posts</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ) :
                  comments.map((comment) => (
                    <Card 
                      key={comment.id} 
                      className="border-none shadow-lg overflow-hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group"
                    >
                      <CardContent className="p-6">
                        <Link 
                          href={`/blog/${comment.postSlug}`} 
                          className="block group-hover:translate-x-1 transition-transform duration-300"
                        >
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex-shrink-0">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-purple-900 dark:text-purple-300 mb-1">{comment.postTitle}</h4>
                              <p className="text-sm mb-2 line-clamp-2">{comment.content}</p>
                              <div className="text-xs text-muted-foreground">
                                <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-1 rounded-full">
                                  {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </CardContent>
                    </Card>
                  ))
                }
              </TabsContent>

              <TabsContent value="replies" className="space-y-4">
                {replies.length === 0 ? (
                  <Card className="border-none shadow-lg overflow-hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
                    <CardContent className="pt-6 flex flex-col items-center justify-center py-12">
                      <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                      </div>
                      <p className="text-center text-muted-foreground">No replies yet. Start a conversation!</p>
                      <Button 
                        className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white transition-all duration-300"
                        asChild
                      >
                        <Link href="/blog">Browse Posts</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ) :
                  replies.map((reply) => (
                    <Card 
                      key={reply.id} 
                      className="border-none shadow-lg overflow-hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group"
                    >
                      <CardContent className="p-6">
                        <Link 
                          href={`/blog/${reply.postSlug}`} 
                          className="block group-hover:translate-x-1 transition-transform duration-300"
                        >
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex-shrink-0">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-purple-900 dark:text-purple-300 mb-1">{reply.postTitle}</h4>
                              <p className="text-sm mb-2 line-clamp-2">{reply.content}</p>
                              <div className="text-xs text-muted-foreground">
                                <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-1 rounded-full">
                                  {new Date(reply.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </CardContent>
                    </Card>
                  ))
                }
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
