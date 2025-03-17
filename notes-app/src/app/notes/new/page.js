'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/app/hooks/useAuth';
import NoteEditor from '@/app/components/notes/NoteEditor';

export default function NewNotePage() {
  const router = useRouter();
  const { isAuthenticated, checkAuth } = useAuthStore();
  
  useEffect(() => {
    const verifyAuth = async () => {
      const isAuth = await checkAuth();
      if (!isAuth) {
        router.push('/auth/signin');
      }
    };
    
    verifyAuth();
  }, [checkAuth, router]);

  if (!isAuthenticated) {
    return <div>Checking authentication...</div>;
  }

  return (
    <div>
      <h1>Create New Note</h1>
      <NoteEditor noteId="new" />
    </div>
  );
}