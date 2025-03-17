"use client"
import { useRouter } from "next/navigation";
import useAuthStore from "./hooks/useAuth";
import { useEffect, useState } from "react";
import NotesList from "./components/notes/NotesList";
import NoteEditor from "./components/notes/NoteEditor";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, checkAuth } = useAuthStore();
  const { showEditor, toggleEditor } = useState('false');
  // toggleEditor(false)
  const show_add_notes = () => {
    console.log('asfasf');
  }

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
      <button
        onClick={show_add_notes}
        className='fixed bottom-[10vh] right-[5vw] bg-amber-400 rounded-[50%] hover:cursor-pointer hover:shadow-2xs transition-all'>
        <svg xmlns="http://www.w3.org/2000/svg" className='w-[60px] h-[60px] p-3' fill="currentColor" viewBox="0 0 16 16">
          <path d="M10 .5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5.5.5 0 0 1-.5.5.5.5 0 0 0-.5.5V2a.5.5 0 0 0 .5.5h5A.5.5 0 0 0 11 2v-.5a.5.5 0 0 0-.5-.5.5.5 0 0 1-.5-.5" />
          <path d="M4.085 1H3.5A1.5 1.5 0 0 0 2 2.5v12A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 12.5 1h-.585q.084.236.085.5V2a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 4 2v-.5q.001-.264.085-.5M8.5 6.5V8H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V9H6a.5.5 0 0 1 0-1h1.5V6.5a.5.5 0 0 1 1 0" />
        </svg>
      </button>
      <NoteEditor noteId="new" visibility={toggleEditor} />
      <NotesList  />
    </div>
  );
}