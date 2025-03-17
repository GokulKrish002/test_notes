'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useNotesStore from '@/app/hooks/useNotes';
import useAuthStore from '@/app/hooks/useAuth';
import NoteCard from './NoteCard';

const NotesList = () => {
  const { notes, fetchNotes, isLoading, error } = useNotesStore();
  const { isAuthenticated, signOut } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotes();
    }
  }, [fetchNotes, isAuthenticated]);

  // const handleCreateNote = () => {
  //   router.push('/notes/new');
  // };


  if (isLoading) return <div>Loading notes...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      {notes.length === 0 ? (
        <p className='fixed top-0 left-0 w-[100vw] h-[100vh] flex justify-center items-center z-[-1]'>No notes yet. Create your first note!</p>
      ) : (
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 grid-auto-rows-auto'>
          {notes.map((note) => (
            <NoteCard key={note.note_id} note={note} />
          ))}
        </div>
      )}
    </>
  );
};

export default NotesList;