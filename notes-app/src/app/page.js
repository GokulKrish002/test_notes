"use client"
import { useRouter } from "next/navigation";
import useAuthStore from "./hooks/useAuth";
import { useEffect, useState } from "react";
import NoteEditor from "./components/notes/NoteEditor";
import useNotesStore from "./hooks/useNotes";
import NoteCard from "./components/notes/NoteCard";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, checkAuth } = useAuthStore();
  const [showEditor, editorVisibility] = useState(false);
  const [note, updateNote] = useState('new');
  const { notes, fetchNotes, isLoading, error } = useNotesStore();
  const [greeting, setGreeting] = useState('Good Morning');


  useEffect(() => {
    const verifyAuth = async () => {
      const isAuth = await checkAuth();
      if (!isAuth) {
        router.push('/auth/signin');
      }
    };

    verifyAuth();
  }, [checkAuth, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotes();
    } else {
      router.push('/auth/signin');
    }
  }, [fetchNotes, isAuthenticated]);

  const showNewEditor = () => {
    editorVisibility(true);
    updateNote('new');
  }

  const showEditEditor = (note) => {
    editorVisibility(true);
    updateNote(note);
  }

  const toggleEditor = () => {
    showEditor ?
      editorVisibility(false) :
      editorVisibility(true)
  }

  if (isLoading) return <div>Loading notes...</div>;
  if (error) return <div>Error: {error}</div>;


  // useEffect(() => {
    // console.log('iam hit !')
    // let date = new Date();
    // let curent_time = date.getHours();
    // if (curent_time < 12) {
    //   setGreeting('good Morning');
    // } else if (curent_time < 18) {
    //   setGreeting('good Afternoon');
    // } else if (curent_time < 18) {
    //   setGreeting('good Night');
    // }
  // }, []);



  // if (!isAuthenticated) {
  //   return <div>Checking authentication...</div>;
  // } else {
  return (
    <div className="px-[10vw]">
      <div className="mt-[3vh] mb-[5vh]">
        <p className="text-[5vh] font-bold">{greeting}</p>
      </div>
      <button
        onClick={showNewEditor}
        className='fixed bottom-[10vh] right-[5vw] bg-amber-400 rounded-[50%] hover:cursor-pointer hover:shadow-2xs transition-all'>
        <svg xmlns="http://www.w3.org/2000/svg" className='w-[60px] h-[60px] p-3' fill="currentColor" viewBox="0 0 16 16">
          <path d="M10 .5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5.5.5 0 0 1-.5.5.5.5 0 0 0-.5.5V2a.5.5 0 0 0 .5.5h5A.5.5 0 0 0 11 2v-.5a.5.5 0 0 0-.5-.5.5.5 0 0 1-.5-.5" />
          <path d="M4.085 1H3.5A1.5 1.5 0 0 0 2 2.5v12A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 12.5 1h-.585q.084.236.085.5V2a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 4 2v-.5q.001-.264.085-.5M8.5 6.5V8H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V9H6a.5.5 0 0 1 0-1h1.5V6.5a.5.5 0 0 1 1 0" />
        </svg>
      </button>

      <NoteEditor note={note} show={showEditor} toggleShow={toggleEditor} />

      {notes.length === 0 ? (
        <p className='fixed top-0 left-0 w-[100vw] h-[100vh] flex justify-center items-center z-[-1]'>No notes yet. Create your first note!</p>
      ) : (
        <div className='transition-all duration-300 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 grid-auto-rows-auto'>
          {notes.map((note) => (
            <NoteCard key={note.note_id} note={note} toggleEdit={showEditEditor} />
          ))}
        </div>
      )}

    </div>
  );
  // }
}