// hooks/useNotes.js
'use client';

import { create } from 'zustand';
import { notesApi } from '@/app/lib/notesApi';

const useNotesStore = create((set, get) => ({
  notes: [],
  currentNote: null,
  isLoading: false,
  error: null,
  
  fetchNotes: async () => {
    set({ isLoading: true, error: null });
    try {
      const notes = await notesApi.getNotes();
      set({ notes, isLoading: false });
    } catch (error) {
      set({ 
        error: error.message || 'Failed to fetch notes', 
        isLoading: false 
      });
    }
  },
  
  fetchNote: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const note = await notesApi.getNote(id);
      set({ currentNote: note, isLoading: false });
      return note;
    } catch (error) {
      set({ 
        error: error.message || 'Failed to fetch note', 
        isLoading: false 
      });
    }
  },
  
  createNote: async (noteData) => {
    set({ isLoading: true, error: null });
    try {
      const newNote = await notesApi.createNote(noteData);
      set(state => ({ 
        notes: [...state.notes, newNote], 
        isLoading: false 
      }));
      return newNote;
    } catch (error) {
      set({ 
        error: error.message || 'Failed to create note', 
        isLoading: false 
      });
    }
  },
  
  updateNote: async (id, noteData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedNote = await notesApi.updateNote(id, noteData);
      set(state => ({
        notes: state.notes.map(note => 
          note.note_id === id ? updatedNote : note
        ),
        currentNote: state.currentNote?.note_id === id ? updatedNote : state.currentNote,
        isLoading: false
      }));
      return updatedNote;
    } catch (error) {
      set({ 
        error: error.message || 'Failed to update note', 
        isLoading: false 
      });
    }
  },
  
  deleteNote: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await notesApi.deleteNote(id);
      set(state => ({
        notes: state.notes.filter(note => note.note_id !== id),
        currentNote: state.currentNote?.note_id === id ? null : state.currentNote,
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error.message || 'Failed to delete note', 
        isLoading: false 
      });
    }
  },
  
  clearCurrentNote: () => set({ currentNote: null }),
  clearError: () => set({ error: null })
}));

export default useNotesStore;