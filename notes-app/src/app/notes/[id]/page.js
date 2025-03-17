'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useAuthStore from '@/app/hooks/useAuth';
import useNotesStore from '@/app/hooks/useNotes';
import NoteEditor from '@/app/components/notes/NoteEditor';

export default function NoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, checkAuth } = useAuthStore();
  const { fetchNote, currentNote, isLoading, error, clearError } = useNotesStore();
  
  useEffect(() => {
    const verifyAuth = async () => {
      const isAuth = await checkAuth();
      if (!isAuth) {
        router.push('/auth/signin');
        return;
      }
      
      clearError();
      if (params.id !== 'new') {
        fetchNote(params.id);
      }
    };
    
    verifyAuth();
  }, [checkAuth, clearError, fetchNote, params.id, router]);

  if (!isAuthenticated) {
    return <div>Checking authentication...</div>;
  }

  if (isLoading) return <div>Loading note...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>{params.id === 'new' ? 'Create New Note' : 'Edit Note'}</h1>
      <NoteEditor noteId={params.id} initialNote={currentNote} />
    </div>
  );
}