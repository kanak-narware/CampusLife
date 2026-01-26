'use client';
import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
} from 'firebase/auth';
import { doc, getDoc, setDoc, Firestore, serverTimestamp } from 'firebase/firestore';

const provider = new GoogleAuthProvider();

export async function signInWithGoogle(auth: Auth, db: Firestore) {
  try {
    const result = await signInWithPopup(auth, provider);
    await createUserDocuments(result.user, db);
  } catch (error) {
    console.error('Error during sign-in:', error);
    // Handle error appropriately in the UI
  }
}

export async function signOutUser(auth: Auth) {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
  }
}

export async function createUserDocuments(user: User, db: Firestore) {
  const userAccountRef = doc(db, 'userAccounts', user.uid);
  const userProfileRef = doc(db, `userAccounts/${user.uid}/userProfile`, user.uid);

  // Check if UserAccount exists
  const userAccountSnap = await getDoc(userAccountRef);
  if (!userAccountSnap.exists()) {
    // Create UserAccount
    const { displayName, email, photoURL, uid } = user;
    const nameParts = displayName?.split(' ') || ['',''];
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');

    await setDoc(userAccountRef, {
      id: uid,
      googleId: user.providerData.find(p => p.providerId === 'google.com')?.uid,
      email,
      firstName,
      lastName,
      dateJoined: serverTimestamp(),
    });
  }

  // Check if UserProfile exists
  const userProfileSnap = await getDoc(userProfileRef);
  if (!userProfileSnap.exists()) {
    // Create UserProfile
    await setDoc(userProfileRef, {
      id: user.uid,
      userAccountId: user.uid,
      profilePictureUrl: user.photoURL,
      age: null,
      mobileNumber: null,
    });
  }
}
