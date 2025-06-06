import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { signOut } from 'firebase/auth'
import { useFirestore } from 'vuefire'
import { mapFirebasePost, PostModel } from '~/models/post_models'

export async function usePosts() {
  const posts = ref<PostModel[]>([])
  const postCollection = collection(db, 'posts')
  const q = query(postCollection, orderBy('createdAt', 'desc'))

  const snapshot = await getDocs(q)
  posts.value = snapshot.docs.map(mapFirebasePost)

  return { posts }
}
