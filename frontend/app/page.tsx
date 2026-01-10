'use client';

import { useAuthGuard } from "./hook/use-auth-guard";


export default function Home() {
  useAuthGuard({redirectIfAuthenticated:true, redirectPath:"/dashboard"})
  useAuthGuard({redirectIfNotAuthenticated:true, redirectPath:"/login"})
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  );
}
