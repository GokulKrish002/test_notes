'use client';

import { useRouter } from 'next/navigation';
import useNotesStore from '@/app/hooks/useNotes';

const NoteCard = ({ note }) => {
  const router = useRouter();
  const { deleteNote } = useNotesStore();

  const formattedDate = new Date(note.last_update).toLocaleDateString();

  const handleEdit = () => {
    router.push(`/notes/${note.note_id}`);
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this note?')) {
      await deleteNote(note.note_id);
    }
  };

  return (
    <div className='relative overflow-hidden transition-all border-[2px] bg-white border-amber-900 rounded-lg pt-[4vh] md:pt-[8vh] px-[1vw]'>

      <p className='absolute top-0 left-0 w-full pl-4 font-bold border-b-[2px] border-amber-900 truncate pr-3 bg-[#f2d1b5] py-[0.4vh] md:py-[0.8vh] text-[1.5vh] md:text-[2vh]'>{note.note_title}</p>

      <div className='text-amber-900 text-[1.5vh] md:text-[2vh]'>
        <p>{note.note_content.substring(0, 100)}
          {note.note_content.length > 100 ? '...' : ''}
        </p>
      </div>
      <p className='pt-3 pb-1 text-right text-[1vh] md:text-[1.5vh]'>Last updated: {formattedDate}</p>
    </div>
  );
};

export default NoteCard;