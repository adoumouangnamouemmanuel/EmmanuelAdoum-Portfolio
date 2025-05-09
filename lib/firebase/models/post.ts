import { adminDb } from "../admin";

export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  date: string;
  readTime: number;
  categories: string[];
  authorId?: string;
  views: number;
  _count?: {
    comments: number;
    likes: number;
  };
};

export const postModel = {
  async findBySlug(slug: string): Promise<Post | null> {
    const snapshot = await adminDb
      .collection('posts')
      .where('slug', '==', slug)
      .limit(1)
      .get();

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    const data = doc.data();

    // Get comments count
    const commentsSnapshot = await adminDb
      .collection('comments')
      .where('postId', '==', doc.id)
      .count()
      .get();
    const commentsCount = commentsSnapshot.data().count;

    // Get likes count
    const likesSnapshot = await adminDb
      .collection('likes')
      .where('postId', '==', doc.id)
      .count()
      .get();
    const likesCount = likesSnapshot.data().count;

    return {
      id: doc.id,
      ...data,
      _count: {
        comments: commentsCount,
        likes: likesCount
      }
    } as Post;
  },

  // ... rest of the model methods ...
}; 