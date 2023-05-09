import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { actions, API } from "../../Constants";

const initialState = {
  value: {
    loading: false,
    error: null,
    errorMessage: null,
    errorCode: null,
    categories:[],
    appState: null,
    processing: false,
    uncategorizeProducts: null,
    categorizeProduct: null,
    categoryToAddProducts: null,
    category: null,
  },
};

export const getAllCategories = createAsyncThunk("category/getAllCategories", async (parameters, asyncThunk) => {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", token: parameters.token },
    };

    const url = API.category.getAllCategories;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return asyncThunk.rejectWithValue(error);
  }
});

export const getUncategorizeProducts = createAsyncThunk(
  "categorizer/getUncategorizeProducts",
  async (parameters, asyncThunk) => {
    try {
      const requestOptions = {
        method: "GET",
        mode: "cors",
        headers: { "Content-Type": "application/json", token: parameters.token },
      };

      const url = API.categorizer.getUncategorizeProducts;
      const res = await fetch(url, requestOptions);
      const data = await res.json();

      return data;
    } catch (error) {
      return asyncThunk.rejectWithValue(error);
    }
  }
);

export const getCategorizeProducts = createAsyncThunk(
  "categorizer/getCategorizeProducts",
  async (parameters, asyncThunk) => {
    try {
      const requestOptions = {
        method: "GET",
        mode: "cors",
        headers: { "Content-Type": "application/json", token: parameters.token },
      };

      const url = API.categorizer.getCategorizeProducts + parameters.id;
      const res = await fetch(url, requestOptions);
      const data = await res.json();

      return data;
    } catch (error) {
      return asyncThunk.rejectWithValue(error);
    }
  }
);

export const uncategorizeProduct = createAsyncThunk(
  "categorizer/uncategorizeProduct",
  async (parameters, asyncThunk) => {
    try {
      const requestOptions = {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json", token: parameters.token },
      };

      const url = API.categorizer.uncategorizeProducts;
      const res = await fetch(url, requestOptions);
      const data = await res.json();

      return data;
    } catch (error) {
      return asyncThunk.rejectWithValue(error);
    }
  }
);

export const categorizeProduct = createAsyncThunk("categorizer/categorizeProduct", async (parameters, asyncThunk) => {
  try {
    const requestOptions = {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json", token: parameters.token },
    };

    // const url = API.categorizer.categorizeProduct + parameters.id;
    // const res = await fetch(url, requestOptions);
    // const data = await res.json();
    //return data;

    return { status: 200 };
  } catch (error) {
    return asyncThunk.rejectWithValue(error);
  }
});

export const findCategoryById = createAsyncThunk("categorizer/findCategoryById", async (parameters, asyncThunk) => {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", token: parameters.token },
    };

    const url = API.category.findById + parameters.id;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return asyncThunk.rejectWithValue(error);
  }
});

export const categorizerSlice = createSlice({
  name: "categorizer",
  initialState,
  reducers: {

    resetAppState: (state) => {
      state.value.appState = null;
    },

    clearError: (state) => {
      state.value.error = null;
      state.value.errorMessage = null;
      state.value.errorCode = null;
    },
  },
  extraReducers: {
    [getUncategorizeProducts.pending]: (state) => {
      state.value.loading = true;
      state.value.errorMessage = null;
      state.value.errorCode = null;
      state.value.error = null;
    },

    [getUncategorizeProducts.fulfilled]: (state, { payload }) => {
      if (payload.error) {
        state.value.error = payload.error;
        state.value.errorMessage = payload.message;
        state.value.errorCode = payload.status;
      } else {
        state.value.errorMessage = null;
        state.value.errorCode = null;
        state.value.error = null;
        state.value.uncategorizeProducts = payload;
      }
      state.value.loading = false;
    },
    [getUncategorizeProducts.rejected]: (state, { payload }) => {
      state.value.loading = true;
      state.value.error = payload.error;
      state.value.errorMessage = payload.message;
      state.value.errorCode = payload.status;
    },

    [getCategorizeProducts.pending]: (state) => {
      state.value.loading = true;
      state.value.errorMessage = null;
      state.value.errorCode = null;
      state.value.error = null;
    },

    [getCategorizeProducts.fulfilled]: (state, { payload }) => {
      if (payload.error) {
        state.value.error = payload.error;
        state.value.errorMessage = payload.message;
        state.value.errorCode = payload.status;
      } else {
        state.value.errorMessage = null;
        state.value.errorCode = null;
        state.value.error = null;
        state.value.categorizeProducts = payload;
      }
      state.value.loading = false;
    },
    [getCategorizeProducts.rejected]: (state, { payload }) => {
      state.value.loading = true;
      state.value.error = payload.error;
      state.value.errorMessage = payload.message;
      state.value.errorCode = payload.status;
    },

    [uncategorizeProduct.pending]: (state) => {
      state.value.loading = true;
      state.value.errorMessage = null;
      state.value.errorCode = null;
      state.value.error = null;
    },

    [uncategorizeProduct.fulfilled]: (state, { payload }) => {
      console.log("[uncategorizeProducts.fulfilled]", payload);
      if (payload.error) {
        state.value.error = payload.error;
        state.value.errorMessage = payload.message;
        state.value.errorCode = payload.status;
      } else {
        state.value.errorMessage = null;
        state.value.errorCode = null;
        state.value.error = null;
      }
      state.value.loading = false;
    },

    [uncategorizeProduct.rejected]: (state, { payload }) => {
      state.value.loading = true;
      state.value.error = payload.error;
      state.value.errorMessage = payload.message;
      state.value.errorCode = payload.status;
    },

    [categorizeProduct.pending]: (state) => {
      state.value.loading = true;
      state.value.errorMessage = null;
      state.value.errorCode = null;
      state.value.error = null;
    },

    [categorizeProduct.fulfilled]: (state, { payload }) => {
      console.log("[categorizeProduct.fulfilled]", payload);
      if (payload.error) {
        state.value.error = payload.error;
        state.value.errorMessage = payload.message;
        state.value.errorCode = payload.status;
      } else {
        state.value.errorMessage = null;
        state.value.errorCode = null;
        state.value.error = null;
        state.value.appState = null;
      }
      state.value.loading = false;
    },

    [categorizeProduct.rejected]: (state, { payload }) => {
      state.value.loading = true;
      state.value.error = payload.error;
      state.value.errorMessage = payload.message;
      state.value.errorCode = payload.status;
    },

    [findCategoryById.pending]: (state) => {
      state.value.loading = true;
      state.value.errorMessage = null;
      state.value.errorCode = null;
      state.value.error = null;
    },

    [findCategoryById.fulfilled]: (state, { payload }) => {
      console.log("[findCategoryById.fulfilled]", payload);
      if (payload.error) {
        state.value.error = payload.error;
        state.value.errorMessage = payload.message;
        state.value.errorCode = payload.status;
      } else {
        state.value.errorMessage = null;
        state.value.errorCode = null;
        state.value.error = null;
        state.value.category = payload;
        state.value.appState = actions.readed;
      }
      state.value.loading = false;
    },

    [findCategoryById.rejected]: (state, { payload }) => {
      state.value.loading = true;
      state.value.error = payload.error;
      state.value.errorMessage = payload.message;
      state.value.errorCode = payload.status;
    },

    [getAllCategories.pending]: (state) => {
      state.value.loading = true;
      state.value.errorMessage = null;
      state.value.errorCode = null;
      state.value.error = null;
    },

    [getAllCategories.fulfilled]: (state, { payload }) => {
      if (payload.error) {
        state.value.error = payload.error;
        state.value.errorMessage = payload.message;
        state.value.errorCode = payload.status;
      } else {
        state.value.errorMessage = null;
        state.value.errorCode = null;
        state.value.error = null;
        state.value.categories = payload;
      }
      state.value.loading = false;
    },

    [getAllCategories.rejected]: (state, { payload }) => {
      state.value.loading = true;
      state.value.error = payload.error;
      state.value.errorMessage = payload.message;
      state.value.errorCode = payload.status;
    },
  },
});

export const { clearError, resetAppState } = categorizerSlice.actions;

export default categorizerSlice.reducer;
