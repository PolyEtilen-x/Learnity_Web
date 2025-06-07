export interface PostModel {
  id: string
  username: string
  avatarUrl?: string
  isVerified: boolean
  postDescription?: string
  content?: string
  imageUrl?: string
  likes: number
  comments: number
  shares: number
  uid?: string
  createdAt: Date
  isLiked: boolean
  sharedByUid?: string
  postId?: String
,
}

export function mapFirebasePost(doc: any): PostModel {
  const data = doc.data()

  return {
    id: doc.id || '', // 
    username: data.username || 'Người dùng', 
    avatarUrl: data.avatarUrl || '', 
    isVerified: data.isVerified ?? false, 
    postDescription: data.postDescription || '', 
    content: data.content || '', 
    imageUrl: data.imageUrl || '', 
    likes: data.likes ?? 0, 
    comments: data.comments ?? 0, 
    shares: data.shares ?? 0, 
    uid: data.uid || '', 
    sharedByUid: data.sharedByUid || '', 
    createdAt: data.createdAt?.toDate?.() || new Date(), 
    isLiked: data.isLiked ?? false,
    postId: data.postId ?? '',

  }
}

export function createPostModelFromCurrentUser(
  user: any,
  { postDescription, content, imageUrl }: { postDescription?: string; content?: string; imageUrl?: string }
): PostModel {
  const username = user?.displayName || user?.email?.split('@')[0] || 'Người dùng'
  return {
    id: Date.now().toString(),
    username,
    avatarUrl: user?.photoURL || '',
    isVerified: false,
    postDescription: postDescription || '',
    content: content || '',
    imageUrl: imageUrl || '',
    likes: 0,
    comments: 0,
    shares: 0,
    uid: user?.uid || '',
    sharedByUid: '',
    createdAt: new Date(),
    isLiked: false,
    // postId:,
  }
}

export function copyPostModel(post: PostModel, updates: Partial<PostModel>): PostModel {
  return {
    ...post,
    ...updates
  }
}