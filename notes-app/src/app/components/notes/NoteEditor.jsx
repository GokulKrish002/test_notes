'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useNotesStore from '@/app/hooks/useNotes';

const NoteEditor = ({ noteId, initialNote,...restProps }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { createNote, updateNote, isLoading, error } = useNotesStore();
  const router = useRouter();
  

  console.log(restProps);

  
  useEffect(() => {
    if (initialNote) {
      setTitle(initialNote.note_title);
      setContent(initialNote.note_content);
    }
  }, [initialNote]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const noteData = {
      note_title: title,
      note_content: content
    };
    
    try {
      if (noteId === 'new') {
        await createNote(noteData);
      } else {
        await updateNote(noteId, noteData);
      }
      router.push('/');
    } catch (err) {
      console.error('Failed to save note:', err);
    }
  };

  const handleCancel = () => {
    router.push('/');
  };

  return (
    <div className='transition-all duration-500 fixed top-[100vh] left-0 w-[100vw] h-[100vh] flex justify-center items-center z-10 bg-[#00000050]'>
      
      <form onSubmit={handleSubmit} className='relative overflow-hidden border-[2px] border-amber-900 rounded-lg pt-[8vh] pb-[4vh] px-[2vw] w-[80vw] md:w-[50vw] lg:w-[40vw] xl:w-[25vw] bg-[#f4f2de]'>
      <p className='absolute top-0 left-0 w-full bg-[#f2d1b5] py-[0.8vh] pl-4 font-bold border-b-[2px] border-amber-900'>Editor</p>
      
      {error && <p>{error}</p>}
        <div>
          <label htmlFor="title" className='pl-1 pb-1'>Title</label>
          <input
            id="title"
            type="text"
            value={title}
            className='border-[1.5px] rounded-lg border-amber-800 bg-white px-2 py-1 w-full'
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        
        <div className='my-3'>
          <label htmlFor="content" className='pl-1 pb-1'>Content</label>
          <textarea
            id="content"
            value={content}
            className='border-[1.5px] rounded-lg border-amber-800 bg-white px-2 py-1 w-full'
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            required
          />
        </div>
        
        <div className='flex justify-end items-center'>
          <button type="submit" 
          disabled={isLoading}
          className='font-semibold py-2 px-5 bg-[#22c55e] text-white text-[14px] rounded-lg' >
            {isLoading ? 'Saving...' : 'Save Note'}
          </button>
          <button type="button"
          onClick={handleCancel}
          className='font-semibold py-2 px-5 bg-[#ef4444] text-white text-[14px] rounded-lg ml-3'>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoteEditor;