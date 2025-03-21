import axiosInstance from './axios';

export const notesApi = {
  getNotes: async () => {
    const response = await axiosInstance.get('/notes');
    return response.data;
  },
  
  getNote: async (id) => {
    const response = await axiosInstance.get(`/notes/${id}`);
    return response.data;
  },
  
  createNote: async (noteData) => {
    const response = await axiosInstance.post('/notes', noteData);
    return response.data;
  },
  
  updateNote: async (id, noteData) => {
    const response = await axiosInstance.put(`/notes/${id}`, noteData);
    return response.data;
  },
  
  deleteNote: async (id) => {
    const response = await axiosInstance.delete(`/notes/${id}`);
    return response.data;
  }
};
