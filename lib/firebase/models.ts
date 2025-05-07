import { adminDb } from "@/lib/firebase/admin";
import { db } from "@/lib/firebase/firestore";
import {
  categories as fallbackCategories,
  comments as fallbackComments,
  posts as fallbackPosts,
  users as fallbackUsers,
} from "./fallback-data";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where
} from "./firestore";

// Helper function to determine if we should use fallback data
const shouldUseFallback = () => {
  return (
    process.env.NODE_ENV === "development" &&
    (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
      !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID)
  );
};

// User model
export interface User {
  id: string;
  name?: string | null;
  displayName?: string | null;
  email: string;
  emailVerified?: string | null;
  image?: string | null;
  photoURL?: string | null;
  bio?: string | null;
  description?: string | null;
  role: string;
  blocked?: boolean;
  createdAt: string;
  updatedAt: string;
  github?: string;
  twitter?: string;
  linkedin?: string;
  social?: {
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
}

// Post model
export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  coverImage?: string | null;
  published: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  author?: User;
  categories?: string[];
  _count?: {
    comments: number;
    likes: number;
  };
}

// Comment model
export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  author?: User;
  postId: string;
  parentId?: string | null;
  replies?: Comment[];
}

// Like model
export interface Like {
  id: string;
  createdAt: string;
  userId: string;
  postId: string;
}

// Category model
export interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

// User CRUD operations
export const userModel = {
  async create(
    userData: Omit<User, "id" | "createdAt" | "updatedAt">
  ): Promise<User> {
    const userRef = doc(collection(db, "users"));
    const now = Timestamp.now();

    const user: Omit<User, "id"> = {
      ...userData,
      role: userData.role || "user",
      createdAt: now.toDate().toISOString(),
      updatedAt: now.toDate().toISOString(),
    };

    await setDoc(userRef, user);
    return { id: userRef.id, ...user };
  },

  async findById(id: string): Promise<User | null> {
    const userRef = doc(db, "users", id);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return null;

    return { id: userSnap.id, ...userSnap.data() } as User;
  },

  async findByEmail(email: string): Promise<User | null> {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email), limit(1));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) return null;

    const userDoc = querySnapshot.docs[0];
    return { id: userDoc.id, ...userDoc.data() } as User;
  },

  async update(id: string, userData: Partial<User>): Promise<User> {
    const userRef = doc(db, "users", id);
    const updateData = {
      ...userData,
      updatedAt: Timestamp.now().toDate().toISOString(),
    };

    await updateDoc(userRef, updateData);
    const updatedUser = await getDoc(userRef);

    return { id: updatedUser.id, ...updatedUser.data() } as User;
  },

  async delete(id: string): Promise<void> {
    const userRef = doc(db, "users", id);
    await deleteDoc(userRef);
  },

  async findAll(): Promise<User[]> {
    if (shouldUseFallback()) {
      console.log("Using fallback user data");
      return fallbackUsers;
    }

    const usersRef = collection(db, "users");
    const querySnapshot = await getDocs(usersRef);

    return querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as User)
    );
  },
};

// Post CRUD operations
export const postModel = {
  async create(
    postData: Omit<Post, "id" | "createdAt" | "updatedAt" | "views" | "_count">
  ): Promise<Post> {
    const postRef = doc(collection(db, "posts"));
    const now = Timestamp.now();

    const post: Omit<Post, "id" | "_count"> = {
      ...postData,
      views: 0,
      published: postData.published || false,
      createdAt: now.toDate().toISOString(),
      updatedAt: now.toDate().toISOString(),
    };

    await setDoc(postRef, post);
    return { id: postRef.id, ...post };
  },

  async findById(id: string): Promise<Post | null> {
    const postRef = doc(db, "posts", id);
    const postSnap = await getDoc(postRef);

    if (!postSnap.exists()) return null;

    return { id: postSnap.id, ...postSnap.data() } as Post;
  },

  async findBySlug(slug: string): Promise<Post | null> {
    if (shouldUseFallback()) {
      console.log("Using fallback post data for slug:", slug);
      const post = fallbackPosts.find((p) => p.slug === slug);
      return post || null;
    }

    const postsRef = collection(db, "posts");
    const q = query(postsRef, where("slug", "==", slug), limit(1));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) return null;

    const postDoc = querySnapshot.docs[0];
    return { id: postDoc.id, ...postDoc.data() } as Post;
  },

  async update(id: string, postData: Partial<Post>): Promise<Post> {
    const postRef = doc(db, "posts", id);
    const updateData = {
      ...postData,
      updatedAt: Timestamp.now().toDate().toISOString(),
    };

    await updateDoc(postRef, updateData);
    const updatedPost = await getDoc(postRef);

    return { id: updatedPost.id, ...updatedPost.data() } as Post;
  },

  async delete(id: string): Promise<void> {
    const postRef = doc(db, "posts", id);
    await deleteDoc(postRef);
  },

  async findAll(
    options: {
      published?: boolean;
      category?: string;
      limit?: number;
      page?: number;
    } = {}
  ): Promise<{ posts: Post[]; total: number }> {
    if (shouldUseFallback()) {
      console.log("Using fallback post data");
      let filteredPosts = [...fallbackPosts];

      if (options.published !== undefined) {
        filteredPosts = filteredPosts.filter(
          (post) => post.published === options.published
        );
      }

      if (options.category) {
        filteredPosts = filteredPosts.filter(
          (post) =>
            post.categories && post.categories.includes(options.category!)
        );
      }

      const total = filteredPosts.length;

      // Handle pagination
      const pageSize = options.limit || 10;
      const page = options.page || 1;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;

      const paginatedPosts = filteredPosts.slice(start, end);

      return { posts: paginatedPosts, total };
    }

    const postsRef = collection(db, "posts");
    let q = query(postsRef, orderBy("createdAt", "desc"));

    if (options.published !== undefined) {
      q = query(q, where("published", "==", options.published));
    }

    if (options.category) {
      q = query(q, where("categories", "array-contains", options.category));
    }

    const querySnapshot = await getDocs(q);
    const total = querySnapshot.docs.length;

    // Handle pagination
    const pageSize = options.limit || 10;
    const page = options.page || 1;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    const paginatedDocs = querySnapshot.docs.slice(start, end);
    const posts = paginatedDocs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Post)
    );

    return { posts, total };
  },

  async incrementViews(id: string): Promise<void> {
    try {
      const postRef = doc(db, "posts", id);
      const postSnap = await getDoc(postRef);

      if (!postSnap.exists()) return;

      const currentViews = postSnap.data().views || 0;
      await updateDoc(postRef, {
        views: currentViews + 1,
        updatedAt: Timestamp.now().toDate().toISOString(),
      });
    } catch (error) {
      console.error('Error incrementing views:', error);
      throw error;
    }
  },

  async getLikeCount(postId: string): Promise<number> {
    try {
      const likesRef = collection(db, 'likes');
      const q = query(likesRef, where('postId', '==', postId));
      const snapshot = await getDocs(q);
      return snapshot.size;
    } catch (error) {
      console.error('Error getting like count:', error);
      return 0;
    }
  },

  async toggleLike(postId: string, userId: string): Promise<boolean> {
    try {
      const likesRef = collection(db, 'likes');
      const q = query(
        likesRef,
        where('postId', '==', postId),
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        // Add like
        const likeRef = doc(collection(db, 'likes'));
        await setDoc(likeRef, {
          postId,
          userId,
          createdAt: Timestamp.now().toDate().toISOString()
        });
        return true;
      } else {
        // Remove like
        const likeDoc = snapshot.docs[0];
        await deleteDoc(doc(db, 'likes', likeDoc.id));
        return false;
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    }
  }
};

// Comment CRUD operations
export const commentModel = {
  async create(
    commentData: Omit<Comment, "id" | "createdAt" | "updatedAt">
  ): Promise<Comment> {
    const commentRef = adminDb.collection("comments").doc();
    const now = new Date().toISOString();

    const comment: Omit<Comment, "id"> = {
      ...commentData,
      createdAt: now,
      updatedAt: now,
    };

    await commentRef.set(comment);
    return { id: commentRef.id, ...comment };
  },

  async findById(id: string): Promise<Comment | null> {
    const commentRef = adminDb.collection("comments").doc(id);
    const commentSnap = await commentRef.get();

    if (!commentSnap.exists) return null;

    return { id: commentSnap.id, ...commentSnap.data() } as Comment;
  },

  async update(id: string, commentData: Partial<Comment>): Promise<Comment> {
    const commentRef = adminDb.collection("comments").doc(id);
    const updateData = {
      ...commentData,
      updatedAt: new Date().toISOString(),
    };

    await commentRef.update(updateData);
    const updatedComment = await commentRef.get();

    return { id: updatedComment.id, ...updatedComment.data() } as Comment;
  },

  async delete(id: string): Promise<void> {
    const commentRef = adminDb.collection("comments").doc(id);
    await commentRef.delete();
  },

  async findByPostId(postId: string): Promise<Comment[]> {
    if (shouldUseFallback()) {
      console.log("Using fallback comment data for post:", postId);
      return fallbackComments.filter((comment) => comment.postId === postId);
    }

    const commentsRef = adminDb.collection("comments");
    const q = commentsRef
      .where("postId", "==", postId)
      .where("parentId", "==", null)
      .orderBy("createdAt", "desc");

    const querySnapshot = await q.get();
    const comments = querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Comment)
    );

    // Get replies for each comment
    for (const comment of comments) {
      const repliesQuery = commentsRef
        .where("parentId", "==", comment.id)
        .orderBy("createdAt", "asc");

      const repliesSnapshot = await repliesQuery.get();
      comment.replies = repliesSnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Comment)
      );
    }

    return comments;
  },
};

// Like CRUD operations
export const likeModel = {
  async create(likeData: Omit<Like, "id" | "createdAt">): Promise<Like> {
    const likeRef = doc(collection(db, "likes"));
    const now = Timestamp.now();

    const like: Omit<Like, "id"> = {
      ...likeData,
      createdAt: now.toDate().toISOString(),
    };

    await setDoc(likeRef, like);
    return { id: likeRef.id, ...like };
  },

  async findById(id: string): Promise<Like | null> {
    const likeRef = doc(db, "likes", id);
    const likeSnap = await getDoc(likeRef);

    if (!likeSnap.exists()) return null;

    return { id: likeSnap.id, ...likeSnap.data() } as Like;
  },

  async findByUserAndPost(
    userId: string,
    postId: string
  ): Promise<Like | null> {
    const likesRef = collection(db, "likes");
    const q = query(
      likesRef,
      where("userId", "==", userId),
      where("postId", "==", postId),
      limit(1)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) return null;

    const likeDoc = querySnapshot.docs[0];
    return { id: likeDoc.id, ...likeDoc.data() } as Like;
  },

  async delete(id: string): Promise<void> {
    const likeRef = doc(db, "likes", id);
    await deleteDoc(likeRef);
  },

  async countByPostId(postId: string): Promise<number> {
    const likesRef = collection(db, "likes");
    const q = query(likesRef, where("postId", "==", postId));

    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  },
};

// Category CRUD operations
export const categoryModel = {
  async create(
    categoryData: Omit<Category, "id" | "createdAt" | "updatedAt">
  ): Promise<Category> {
    const categoryRef = doc(collection(db, "categories"));
    const now = Timestamp.now();

    const category: Omit<Category, "id"> = {
      ...categoryData,
      createdAt: now.toDate().toISOString(),
      updatedAt: now.toDate().toISOString(),
    };

    await setDoc(categoryRef, category);
    return { id: categoryRef.id, ...category };
  },

  async findById(id: string): Promise<Category | null> {
    const categoryRef = doc(db, "categories", id);
    const categorySnap = await getDoc(categoryRef);

    if (!categorySnap.exists()) return null;

    return { id: categorySnap.id, ...categorySnap.data() } as Category;
  },

  async findBySlug(slug: string): Promise<Category | null> {
    const categoriesRef = collection(db, "categories");
    const q = query(categoriesRef, where("slug", "==", slug), limit(1));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) return null;

    const categoryDoc = querySnapshot.docs[0];
    return { id: categoryDoc.id, ...categoryDoc.data() } as Category;
  },

  async update(id: string, categoryData: Partial<Category>): Promise<Category> {
    const categoryRef = doc(db, "categories", id);
    const updateData = {
      ...categoryData,
      updatedAt: Timestamp.now().toDate().toISOString(),
    };

    await updateDoc(categoryRef, updateData);
    const updatedCategory = await getDoc(categoryRef);

    return { id: updatedCategory.id, ...updatedCategory.data() } as Category;
  },

  async delete(id: string): Promise<void> {
    const categoryRef = doc(db, "categories", id);
    await deleteDoc(categoryRef);
  },

  async findAll(): Promise<Category[]> {
    if (shouldUseFallback()) {
      console.log("Using fallback category data");
      return fallbackCategories;
    }

    const categoriesRef = collection(db, "categories");
    const q = query(categoriesRef, orderBy("name", "asc"));

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Category)
    );
  },
};

export default {
  users: userModel,
  posts: postModel,
  comments: commentModel,
  likes: likeModel,
  categories: categoryModel,
};
