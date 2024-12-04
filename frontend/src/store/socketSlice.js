import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
  initialState: {socket: null},
  name: "socket",
  reducers: {
    setSocket: (state, { payload }) => payload.socket,
  },
});

export const socketActions = socketSlice.actions;

export default socketSlice.reducer;
