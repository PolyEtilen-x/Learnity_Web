import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'

export function useFirebaseAuth() {
  const auth = getAuth()

  const registerWithEmail = async (email: string, password: string) => {
    return await createUserWithEmailAndPassword(auth, email, password)
  }

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    return await signInWithPopup(auth, provider)
  }

  return {
    registerWithEmail,
    signInWithGoogle
  }
}
