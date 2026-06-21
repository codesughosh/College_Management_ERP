import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { deleteApp, getApp, initializeApp } from 'firebase/app';
import { auth, firebaseConfig, isFirebaseConfigured } from './config';
import { getFallbackRoleId } from './demoRoles';

function requireAuth() {
  if (!isFirebaseConfigured || !auth) {
    throw new Error('Firebase is not configured. Add Firebase values to .env to use real authentication.');
  }
  return auth;
}

export function toAppUser(firebaseUser) {
  if (!firebaseUser) return null;
  const roleId = getFallbackRoleId(firebaseUser.email);
  return {
    uid: firebaseUser.uid,
    name: firebaseUser.displayName || 'Admin',
    email: firebaseUser.email,
    roleId,
  };
}

export function subscribeToAuthState(callback) {
  if (!isFirebaseConfigured || !auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, (firebaseUser) => callback(toAppUser(firebaseUser)));
}

export async function loginWithEmail(email, password) {
  const result = await signInWithEmailAndPassword(requireAuth(), email, password);
  return toAppUser(result.user);
}

export async function registerWithEmail({ name, email, password }) {
  const result = await createUserWithEmailAndPassword(requireAuth(), email, password);
  if (name) {
    await updateProfile(result.user, { displayName: name });
  }
  return {
    uid: result.user.uid,
    name: name || result.user.displayName || 'Admin',
    email: result.user.email,
    roleId: getFallbackRoleId(result.user.email),
  };
}

export async function logoutUser() {
  await signOut(requireAuth());
}

export async function createManagedAuthUser({ name, email, password }) {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured. Add Firebase values to .env to create users.');
  }

  const appName = `managed-user-${Date.now()}`;
  const secondaryApp = initializeApp(firebaseConfig, appName);
  const secondaryAuth = getAuth(secondaryApp);

  try {
    const result = await createUserWithEmailAndPassword(secondaryAuth, email, password);
    if (name) {
      await updateProfile(result.user, { displayName: name });
    }

    return {
      uid: result.user.uid,
      name: name || result.user.displayName || '',
      email: result.user.email,
    };
  } finally {
    await signOut(secondaryAuth).catch(() => {});
    const app = getApp(appName);
    await deleteApp(app).catch(() => {});
  }
}
