import { env } from "@/env";
import { cert, initializeApp, type ServiceAccount } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const createAdminApp = () =>
  initializeApp({
    credential: cert(
      JSON.parse(env.GOOGLE_APPLICATION_CREDENTIALS_JSON) as ServiceAccount
    ),
  });

const globalForAdminApp = globalThis as unknown as {
  adminApp: ReturnType<typeof createAdminApp> | undefined;
};

export const adminApp = globalForAdminApp.adminApp ?? createAdminApp();
export const adminAuth = () => getAuth(adminApp);

if (env.NODE_ENV !== "production") globalForAdminApp.adminApp = adminApp;
