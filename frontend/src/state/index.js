import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  buyer: null,
  token: null,
  posts: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.buyer = action.payload.buyer;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.buyer = null;
      state.token = null;
    },
    
  },
});

export const { setMode, setLogin, setLogout } =
  authSlice.actions;
export default authSlice.reducer;