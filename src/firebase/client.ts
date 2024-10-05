"use client";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { env } from "@/env";

export const firebaseApp = initializeApp({
  apiKey: env.NEXT_PUBLIC_FB_API_KEY,
  authDomain: env.NEXT_PUBLIC_FB_AUTH_DOMAIN,
  projectId: env.NEXT_PUBLIC_FB_PROJECT_ID,
  storageBucket: env.NEXT_PUBLIC_FB_STORAGE_BUCKET,
  messagingSenderId: env.NEXT_PUBLIC_FB_MESSAGING_SENDER_ID,
  appId: env.NEXT_PUBLIC_FB_APP_ID,
  measurementId: env.NEXT_PUBLIC_FB_MEASUREMENT_ID,
});

export const firebaseAuth = () => getAuth(firebaseApp);

export const googleProvider = new GoogleAuthProvider();
