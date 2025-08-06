
// don't forget to register in store before use
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  posts: [],
  isUploadModalOpen: false
};

export const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setUploadModalOpen: (state, action) => {
      state.isUploadModalOpen = action.payload;
    },
    addPost: (state, action) => {
      state.posts.unshift(action.payload);
    },
    likePost: (state, action) => {
      const post = state.posts.find(post => post.id === action.payload);
      if (post) {
        post.likes += 1;
      }
    },
    addComment: (state, action) => {
      const { postId, comment } = action.payload;
      const post = state.posts.find(post => post.id === postId);
      if (post) {
        post.comments.push(comment);
      }
    }
  }
});

export const { setUploadModalOpen, addPost, likePost, addComment } = postSlice.actions;
export default postSlice.reducer;