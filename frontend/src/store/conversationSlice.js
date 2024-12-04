import { createSlice, current } from "@reduxjs/toolkit";

const conversationSlice = createSlice({
  name: "conversationsListSlice",
  initialState: {
    conversations: [],
    currentConversation: null,
  },
  reducers: {
    setConversations: (state, { payload }) => {
      state.conversations = payload;
    },
    setCurrentConversation: (state, { payload }) => {
      const {id} = payload;
      if (state.conversations.length === 0) {
        return;
      }
      
      state.currentConversation = state.conversations.find((conversation) => conversation.id === id);
    },
    addToConversations: (state, { payload }) => {
      const existingConversation = state.conversations.some((c) => c.id === payload.id);
      if (!existingConversation) {
        state.conversations.push(payload);
      }
    },
    addMessageToConversation: (state, { payload }) => {
      const { conversationId, message } = payload;
      const conversation = state.conversations.find((conversation) => conversation.id === conversationId);
      conversation.Messages.push(message);
      if (state.currentConversation.id === conversationId) {
        state.currentConversation.Messages.push(message);
      }
    },
    clearData: (state) => {
      state.conversations = [];
      state.currentConversation = null;
    },
  },
});

export const conversationActions = conversationSlice.actions;

export default conversationSlice.reducer;