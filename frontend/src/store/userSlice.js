import { createSlice } from "@reduxjs/toolkit";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const userSlice = createSlice({
  initialState: {
    user: {}
  },
  name: "user",
  reducers: {
    setUser: (state, { payload }) => {
      state.user = payload;
      cookies.set("user", payload);
    }
  }
})

export const userActions = userSlice.actions;

export default userSlice.reducer;