import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authOptions } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { Calendar, Edit, Github, Linkedin, Mail, Twitter } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/auth/login");
  }

  // Get user data from Firestore
  const userDoc = await adminDb.collection("users").doc(session.user.id).get();
  const userData = userDoc.exists ? userDoc.data() : null;

  let posts = [];
  let comments = [];

  try {
    // Get user's posts without ordering for now
    const postsSnapshot = await adminDb
      .collection("posts")
      .where("authorId", "==", session.user.id)
      .get();

    posts = postsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Get user's comments without ordering for now
    const commentsSnapshot = await adminDb
      .collection("comments")
      .where("authorId", "==", session.user.id)
      .limit(5)
      .get();

    comments = commentsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error("Error fetching user data:", error);
    // Continue rendering the page even if posts/comments fail to load
  }

  return (
    <div className="container max-w-5xl py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Profile Sidebar */}
        <div className="w-full md:w-1/3">
          <Card>
            <CardHeader className="text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage
                  src={userData?.image || session.user.image || ""}
                  alt={userData?.name || session.user.name || "User"}
                />
                <AvatarFallback>
                  {(userData?.name || session.user.name || "U")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl">
                {userData?.name || session.user.name || "Anonymous"}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {userData?.bio || "No bio yet"}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{userData?.email || session.user.email}</span>
                </div>
                {userData?.github && (
                  <div className="flex items-center gap-2">
                    <Github className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={userData.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm hover:underline"
                    >
                      {userData.github.split("/").pop()}
                    </a>
                  </div>
                )}
                {userData?.twitter && (
                  <div className="flex items-center gap-2">
                    <Twitter className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={userData.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm hover:underline"
                    >
                      {userData.twitter.split("/").pop()}
                    </a>
                  </div>
                )}
                {userData?.linkedin && (
                  <div className="flex items-center gap-2">
                    <Linkedin className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={userData.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm hover:underline"
                    >
                      {userData.linkedin.split("/").pop()}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Joined {new Date(userData?.createdAt || session.user.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <Button asChild className="w-full">
                  <Link href="/settings">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-2/3">
          <Tabs defaultValue="posts" className="space-y-4">
            <TabsList>
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="space-y-4">
              {posts.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">
                      No posts yet. Start writing!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                posts.map((post) => (
                  <Card key={post.id}>
                    <CardContent className="pt-6">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="hover:underline"
                      >
                        <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                      </Link>
                      <p className="text-sm text-muted-foreground mb-4">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span>{post.views || 0} views</span>
                        <span>•</span>
                        <span>{post._count?.comments || 0} comments</span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="comments" className="space-y-4">
              {comments.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">
                      No comments yet. Join the conversation!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                comments.map((comment) => (
                  <Card key={comment.id}>
                    <CardContent className="pt-6">
                      <Link
                        href={`/blog/${comment.postId}`}
                        className="hover:underline"
                      >
                        <p className="text-sm mb-2">{comment.content}</p>
                      </Link>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 