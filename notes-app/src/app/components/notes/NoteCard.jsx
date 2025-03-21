'use client';

import useNotesStore from '@/app/hooks/useNotes';

const NoteCard = ({ note, toggleEdit }) => {
  const { deleteNote } = useNotesStore();

  const formattedDate = new Date(note.last_update).toLocaleDateString();

  const handleEdit = () => {
    toggleEdit(note);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this note?')) {
      console.log(note.note_id);
      deleteNote(note.note_id);
    }
  };

  return (
    <div className='relative overflow-hidden transition-all duration-300 border-[2px] bg-white border-amber-900 rounded-lg pt-[4vh] md:pt-[8vh] px-[1vw]'>

      <div className='absolute top-0 left-0 w-full pl-4 flex justify-between items-center font-bold border-b-[2px] border-amber-900 pr-3 bg-[#f2d1b5] py-[0.4vh] md:py-[0.8vh] text-[1.5vh] md:text-[2vh]'>
        <span className='truncate'>{note.note_title}</span>

        <div>
          <button onClick={handleEdit} className='me-3 hover:cursor-pointer'>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16">
              <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z" />
            </svg>
          </button>
          <button onClick={handleDelete} className='hover:cursor-pointer'>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
            </svg>
          </button>
        </div>
      </div>

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