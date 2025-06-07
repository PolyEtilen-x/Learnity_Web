import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from 'firebase/auth'
import { getFirestore, doc, setDoc } from 'firebase/firestore'

export function useFirebaseAuth() {
  const auth = getAuth()
  const db = getFirestore()

  const registerWithEmail = async (email: string, password: string, username: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      await updateProfile(user, { displayName: username })

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: email,
        username: username,
        createdAt: new Date().toISOString(),
      })

      return userCredential
    } catch (error) {
      throw error
    }
  }

  const signInWithGoogleAndSave = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const userCredential = await signInWithPopup(auth, provider)
      const user = userCredential.user

      const userDocRef = doc(db, 'users', user.uid)
      await setDoc(
        userDocRef,
        {
          uid: user.uid,
          email: user.email,
          username: user.displayName || `User_${user.uid.slice(0, 8)}`, // Sử dụng displayName hoặc tạo username mặc định
          createdAt: new Date().toISOString(),
        },
        { merge: true } // merge: không ghi đè nếu tài liệu đã tồn tại
      )

      return userCredential
    } catch (error) {
      throw error
    }
  }

  return {
    registerWithEmail,
    signInWithGoogleAndSave,
  }
}