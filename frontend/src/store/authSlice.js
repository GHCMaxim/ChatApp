import { createSlice } from "@reduxjs/toolkit";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const initialState = {
  loggedIn: cookies.get('token') ? true : false,
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    login: (state, { token }) => {
      state.loggedIn = true;
      cookies.set('token', token)
    },
    logout: (state) => {
      state.loggedIn = false;
      cookies.remove('token')
    }
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
