import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk to check auth on refresh
export const checkAuth = createAsyncThunk("auth/checkAuth", async (_, thunkAPI) => {
  try {
    const res = await axios.get("/api/v1/user/findMe", {
      withCredentials: true,
    });
    const data = res.data.data;
    return data;
  } catch (error) {
    console.log("error is happening")
    return thunkAPI.rejectWithValue(error.response?.data?.message || "User not authenticated");
  }
});

const initialState = {
  isLoggedIn: false,
  user: null,
  status: "idle", 
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userLoggedIn: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload;
    },
    userLoggedOut: (state) => {
      state.isLoggedIn = false;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.status = "loading";
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isLoggedIn = true;
        state.user = action.payload.user;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.status = "failed";
        state.isLoggedIn = false;
        state.user = null;
      });
  },
});

export const { userLoggedIn, userLoggedOut } = authSlice.actions;
export default authSlice.reducer;
