import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    bodyContainerWidth:0,
    bodyContainerHeight:0,
    draggingView:false,
    actualScale:1,

  },
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setBodyContainerSize: (state, { payload }) => {
      state.value.bodyContainerWidth = payload.width;
      state.value.bodyContainerHeight = payload.height;
    },

    setDraggingView: (state, { payload }) => {
      state.value.draggingView = payload;
    },

    setActualScale: (state, { payload }) => {
      state.value.actualScale = payload;
    },
  },
  extraReducers: {},
});

export const { setBodyContainerSize, setDraggingView, setActualScale } = appSlice.actions;

export default appSlice.reducer;
