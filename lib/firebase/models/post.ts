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
    try {
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
        .get();
      const commentsCount = commentsSnapshot.size;

      // Get likes count
      const likesSnapshot = await adminDb
        .collection('likes')
        .where('postId', '==', doc.id)
        .get();
      const likesCount = likesSnapshot.size;

      // Update the post document with the current counts
      await doc.ref.update({
        '_count.comments': commentsCount,
        '_count.likes': likesCount
      });

      return {
        id: doc.id,
        ...data,
        _count: {
          comments: commentsCount,
          likes: likesCount
        }
      } as Post;
    } catch (error) {
      console.error('Error in findBySlug:', error);
      throw error;
    }
  },

  async create(data: Omit<Post, 'id' | '_count'>): Promise<Post> {
    const docRef = await adminDb.collection('posts').add({
      ...data,
      _count: {
        comments: 0,
        likes: 0
      }
    });
    
    return {
      id: docRef.id,
      ...data,
      _count: {
        comments: 0,
        likes: 0
      }
    } as Post;
  },

  async update(id: string, data: Partial<Post>): Promise<Post> {
    const docRef = adminDb.collection('posts').doc(id);
    await docRef.update(data);
    
    const doc = await docRef.get();
    return {
      id: doc.id,
      ...doc.data()
    } as Post;
  },

  async delete(id: string): Promise<void> {
    await adminDb.collection('posts').doc(id).delete();
  }
}; 