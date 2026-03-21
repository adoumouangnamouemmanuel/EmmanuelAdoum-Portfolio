import { authOptions } from "@/lib/auth"
import { adminDb } from "@/lib/firebase/admin"
import { ArrowLeft, Calendar, Edit, Github, Linkedin, Mail, Twitter, ChevronRight, MessageSquare, Reply as ReplyIcon, LayoutGrid } from 'lucide-react'
import { getServerSession } from "next-auth"
import Link from "next/link"
import { redirect } from "next/navigation"
import Image from "next/image"

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

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: { tab?: string }
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect("/auth/login")
  }

  const activeTab = searchParams.tab || 'posts'

  // Get user data from Firestore
  const userDoc = await adminDb.collection("users").doc(session.user.id).get()
  const userData = userDoc.exists ? (userDoc.data() as User) : null

  let posts: Post[] = []
  let comments: Comment[] = []
  let replies: Reply[] = []

  try {
    // Get user's posts
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

    // Get all user's comments
    const commentsSnapshot = await adminDb
      .collection("comments")
      .where("authorId", "==", session.user.id)
      .limit(15)
      .get()

    // Get post titles and slugs for comments
    const postIds = new Set(commentsSnapshot.docs.map(doc => doc.data().postId))
    const postsMap = new Map()
    
    for (const postId of postIds) {
      const postDoc = await adminDb.collection("posts").doc(postId).get()
      if (postDoc.exists) {
        const postData = postDoc.data()
        postsMap.set(postId, {
          title: postData?.title || "Untitled Document",
          slug: postData?.slug || postId
        })
      }
    }

    // Filter comments and replies
    const allComments = commentsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      postTitle: postsMap.get(doc.data().postId)?.title || "Untitled Document",
      postSlug: postsMap.get(doc.data().postId)?.slug || doc.data().postId,
    })) as (Comment | Reply)[]

    comments = allComments
      .filter(comment => !comment.parentId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) as Comment[]

    replies = allComments
      .filter(comment => comment.parentId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) as Reply[]

  } catch (error) {
    console.error("Error fetching user data:", error)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 selection:bg-blue-200 dark:selection:bg-blue-900/50 pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16">
        
        {/* Navigation Layer */}
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group">
             <ArrowLeft className="mr-3 h-4 w-4 group-hover:-translate-x-2 transition-transform duration-300" />
             Return to Global Network
          </Link>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tighter text-slate-900 dark:text-white mt-8 mb-4">Command <span className="text-blue-600 dark:text-blue-400">Center.</span></h1>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Left: Glassmorphic Profile Panel */}
          <aside className="w-full lg:w-4/12 xl:w-3/12 relative">
             <div className="sticky top-32 flex flex-col gap-8">
                
                {/* Visual ID Node */}
                <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-8 sm:p-10 flex flex-col items-center text-center shadow-xl">
                   
                   <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full" />
                   <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full" />
                   
                   <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-slate-950 shadow-2xl z-10 mb-8 relative">
                      <Image
                         src={userData?.image || session.user.image || "/images/posts/profile.jpeg"}
                         alt={userData?.name || session.user.name || "User ID"}
                         fill
                         className="object-cover"
                      />
                   </div>
                   
                   <div className="z-10 w-full flex flex-col items-center">
                      <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-[9px] font-bold tracking-[0.2em] uppercase text-blue-600 dark:text-blue-400 mb-4 border border-blue-200 dark:border-blue-800/50">
                         {userData?.role === 'admin' ? 'System Admin' : 'Authorized User'}
                      </span>
                      <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">
                         {userData?.name || session.user.name || "Anonymous ID"}
                      </h2>
                      <p className="text-slate-500 dark:text-slate-400 font-light text-sm mb-8 leading-relaxed">
                         {userData?.bio || "No clearance bio assigned."}
                      </p>
                   </div>
                   
                   {/* Connection Telemetry */}
                   <div className="w-full space-y-4 z-10 border-t border-slate-200 dark:border-slate-800/60 pt-8 mt-auto">
                      
                      <div className="flex items-center gap-4 group">
                         <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 dark:group-hover:bg-blue-900/30 dark:group-hover:text-blue-400 transition-colors">
                            <Mail className="w-3.5 h-3.5" />
                         </div>
                         <span className="text-xs font-medium text-slate-600 dark:text-slate-300 truncate">
                            {userData?.email || session.user.email}
                         </span>
                      </div>

                      {userData?.github && (
                        <div className="flex items-center gap-4 group">
                           <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 dark:group-hover:bg-blue-900/30 dark:group-hover:text-blue-400 transition-colors">
                              <Github className="w-3.5 h-3.5" />
                           </div>
                           <a href={userData.github} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate">
                              {userData.github.split("/").pop()}
                           </a>
                        </div>
                      )}

                      {userData?.twitter && (
                        <div className="flex items-center gap-4 group">
                           <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 dark:group-hover:bg-blue-900/30 dark:group-hover:text-blue-400 transition-colors">
                              <Twitter className="w-3.5 h-3.5" />
                           </div>
                           <a href={userData.twitter} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate">
                              @{userData.twitter.split("/").pop()}
                           </a>
                        </div>
                      )}

                      {userData?.linkedin && (
                        <div className="flex items-center gap-4 group">
                           <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 dark:group-hover:bg-blue-900/30 dark:group-hover:text-blue-400 transition-colors">
                              <Linkedin className="w-3.5 h-3.5" />
                           </div>
                           <a href={userData.linkedin} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate">
                              {userData.linkedin.split("/").pop()}
                           </a>
                        </div>
                      )}

                      <div className="flex items-center gap-4 group pt-2">
                         <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
                            <Calendar className="w-3.5 h-3.5" />
                         </div>
                         <div className="flex flex-col">
                            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400">Time Indexed</span>
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                               {new Date(userData?.createdAt || new Date().toISOString()).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </span>
                         </div>
                      </div>

                   </div>
                </div>

                {/* Configuration Action */}
                <Link href="/settings" className="group relative flex items-center justify-between p-6 rounded-3xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/20 to-indigo-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                   <div className="relative flex items-center gap-4 z-10">
                      <Edit className="w-4 h-4" />
                      <span className="text-xs font-bold tracking-[0.2em] uppercase">Configure ID</span>
                   </div>
                   <ChevronRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>

             </div>
          </aside>

          {/* Right: Data Feed Matrix */}
          <div className="w-full lg:w-8/12 xl:w-9/12">
            
            {/* The Telemetry Tabs (Server-rendered via query param) */}
            <div className="flex bg-slate-200/50 dark:bg-slate-900/50 rounded-2xl p-1.5 mb-12 border border-slate-200 dark:border-slate-800 w-full md:w-fit overflow-x-auto">
               <Link href="/profile?tab=posts" className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow-none ${activeTab === 'posts' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                  <LayoutGrid className="w-4 h-4" />
                  Written Logs
               </Link>
               <Link href="/profile?tab=comments" className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow-none ${activeTab === 'comments' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                  <MessageSquare className="w-4 h-4" />
                  Discourse
               </Link>
               <Link href="/profile?tab=replies" className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow-none ${activeTab === 'replies' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                  <ReplyIcon className="w-4 h-4" />
                  Echoes
               </Link>
            </div>

            {/* Content Injection */}
            <div className="space-y-4">
               {activeTab === 'posts' && (
                 posts.length === 0 ? (
                   <div className="py-24 text-center border border-dashed border-slate-300 dark:border-slate-800 rounded-[2.5rem]">
                      <LayoutGrid className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700 mb-6" />
                      <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">No Documentation Found</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-light max-w-sm mx-auto mb-8">
                         You have not indexed any posts onto the Vault. Commence documentation protocols.
                      </p>
                      <Link href="/blog/new" className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
                         Initialize Document 
                         <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                   </div>
                 ) : (
                   posts.map((post) => (
                     <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                        <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-blue-600 dark:hover:border-blue-500 transition-all duration-300 flex flex-col sm:flex-row gap-6 sm:items-center justify-between shadow-sm hover:shadow-xl hover:shadow-blue-500/10">
                           <div className="flex-1">
                              <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                 {post.title}
                              </h3>
                              <p className="text-sm text-slate-500 dark:text-slate-400 font-light line-clamp-2 pr-4 lg:pr-12">
                                 {post.excerpt}
                              </p>
                           </div>
                           
                           <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-800/60 pt-6 sm:pt-0 sm:pl-8">
                              <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-md">
                                 {new Date(post.createdAt).toLocaleDateString()}
                              </span>
                              <div className="flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-500">
                                 <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {post.views || 0}</span>
                                 <span className="flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5" /> {post._count?.comments || 0}</span>
                              </div>
                           </div>
                        </div>
                     </Link>
                   ))
                 )
               )}

               {activeTab === 'comments' && (
                 comments.length === 0 ? (
                   <div className="py-24 text-center border border-dashed border-slate-300 dark:border-slate-800 rounded-[2.5rem]">
                      <MessageSquare className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700 mb-6" />
                      <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">Null Communication Array</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-light max-w-sm mx-auto mb-8">
                         You have not deployed any discourse onto the Vault logs.
                      </p>
                      <Link href="/blog" className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                         Scan Vault
                      </Link>
                   </div>
                 ) : (
                   comments.map((comment) => (
                     <Link key={comment.id} href={`/blog/${comment.postSlug}`} className="group block">
                        <div className="bg-slate-50/50 dark:bg-slate-900/30 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 flex flex-col lg:flex-row gap-6 sm:items-start justify-between">
                           
                           <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                              <MessageSquare className="w-5 h-5" />
                           </div>
                           
                           <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-3">
                                 <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400">Deployed At</span>
                                 <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                    {comment.postTitle}
                                 </h4>
                              </div>
                              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-4">
                                 "{comment.content}"
                              </p>
                              <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-md inline-block">
                                 {new Date(comment.createdAt).toLocaleDateString()}
                              </span>
                           </div>

                        </div>
                     </Link>
                   ))
                 )
               )}

               {activeTab === 'replies' && (
                 replies.length === 0 ? (
                   <div className="py-24 text-center border border-dashed border-slate-300 dark:border-slate-800 rounded-[2.5rem]">
                      <ReplyIcon className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700 mb-6" />
                      <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">No Network Echoes</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-light max-w-sm mx-auto mb-8">
                         You have not replied or linked into an existing communication node.
                      </p>
                   </div>
                 ) : (
                   replies.map((reply) => (
                     <Link key={reply.id} href={`/blog/${reply.postSlug}`} className="group block ml-0 sm:ml-12 relative">
                        <div className="hidden sm:block absolute -left-8 top-12 w-6 h-6 border-b-2 border-l-2 border-slate-200 dark:border-slate-800 rounded-bl-xl" />
                        <div className="bg-slate-100 dark:bg-slate-900/60 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 flex flex-col lg:flex-row gap-6 sm:items-start justify-between">
                           
                           <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                              <ReplyIcon className="w-5 h-5" />
                           </div>
                           
                           <div className="flex-1 min-w-0">
                              <div className="flex flex-col gap-1 mb-4">
                                 <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-indigo-600 dark:text-indigo-400">Response Deployed In</span>
                                 <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate opacity-60">
                                    Document: {reply.postTitle}
                                 </h4>
                              </div>
                              <p className="text-base sm:text-lg text-slate-800 dark:text-slate-200 font-medium leading-relaxed mb-4">
                                 "{reply.content}"
                              </p>
                              <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-slate-400 bg-white dark:bg-slate-950 px-3 py-1.5 rounded-md inline-block shadow-sm">
                                 {new Date(reply.createdAt).toLocaleDateString()}
                              </span>
                           </div>

                        </div>
                     </Link>
                   ))
                 )
               )}

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
