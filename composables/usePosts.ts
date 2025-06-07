import { ref } from 'vue'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import { useFirestore } from 'vuefire'
import { mapFirebasePost, type PostModel } from '~/models/post_models'

export type { PostModel }

export function usePosts() {
  const db = useFirestore() 
  const posts = ref<PostModel[]>([]) 
  const postCollection = collection(db, 'posts') 
  const q = query(postCollection, orderBy('createdAt', 'desc')) 

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      posts.value = snapshot.docs.map(mapFirebasePost)
    },
    (error) => {
      console.error('Error fetching posts:', error)
    }
  )

  return { posts, unsubscribe }
}