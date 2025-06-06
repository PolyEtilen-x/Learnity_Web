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
}

export function mapFirebasePost(doc: any): PostModel {
  const data = doc.data()

  return {
    id: doc.id,
    username: data.username || 'Người dùng',
    avatarUrl: data.avatarUrl || '',
    isVerified: data.isVerified || false,
    postDescription: data.postDescription,
    content: data.content,
    imageUrl: data.imageUrl,
    likes: data.likes || 0,
    comments: data.comments || 0,
    shares: data.shares || 0,
    uid: data.uid,
    sharedByUid: data.sharedByUid,
    createdAt: data.createdAt?.toDate?.() || new Date(),
    isLiked: data.isLiked || false,
  }
}
