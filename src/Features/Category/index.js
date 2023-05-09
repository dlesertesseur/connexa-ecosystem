import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { actions, API } from "../../Constants";

const initialState = {
  value: {
    loadingCategories: false,
    error: "",
    categoriesRoot: null,
    categoriesChild: [],
    categories: null,
    finalCategories: null,
    path: [],
    selectedRowId: null,
    refreshData: null,
    activePage: null,
    appState: null,
    processing: false,
    selectedRow: null,
  },
};

export const create = createAsyncThunk("category/create", async (parameters, asyncThunk) => {
  try {
    const body = JSON.stringify({
      name: parameters.name,
    });

    const requestOptions = {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
      body: body,
    };

    const url = API.category.create + parameters.parentId;
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return asyncThunk.rejectWithValue(error);
  }
});

export const remove = createAsyncThunk("category/remove", async (parameters, asyncThunk) => {
  try {
    const requestOptions = {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
    };

    await fetch(API.category.delete + parameters.id, requestOptions).then((response) => {
      return response;
    });
  } catch (error) {
    return asyncThunk.rejectWithValue(error);
  }
});

export const update = createAsyncThunk("category/update", async (parameters, asyncThunk) => {
  try {
    const body = JSON.stringify({
      id: parameters.id,
      name: parameters.name,
    });

    const requestOptions = {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: parameters.token,
      },
      body: body,
    };

    const res = await fetch(API.category.update, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return asyncThunk.rejectWithValue(error);
  }
});

export const getRootOfCategories = createAsyncThunk("category/getRootOfCategories", async (parameters, asyncThunk) => {
  try {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", token: parameters.token },
    };

    let url = null;
    if (parameters.rootId) {
      url = API.category.findById + parameters.rootId;
    } else {
      url = API.category.getRootOfCategories;
    }
    const res = await fetch(url, requestOptions);
    const data = await res.json();

    return data;
  } catch (error) {
    return asyncThunk.rejectWithValue(error);
  }
});

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

export const getChildrenOfCategory = createAsyncThunk(
  "category/getChildrenOfCategory",
  async (parameters, asyncThunk) => {
    try {
      const requestOptions = {
        method: "GET",
        mode: "cors",
        headers: { "Content-Type": "application/json", token: parameters.token },
      };

      const url = API.category.getChildrenOfCategory + parameters.nodeId + "/children";
      const res = await fetch(url, requestOptions);
      const data = await res.json();

      return data;
    } catch (error) {
      return asyncThunk.rejectWithValue(error);
    }
  }
);

function findLeafCategories(set, nodes) {
  if (nodes.children.length === 0) {
    set.push(nodes.id);
  }

  for (const child of nodes.children) {
    findLeafCategories(set, child);
  }
}

export const findCategoryById = createAsyncThunk("category/findCategoryById", async (parameters, asyncThunk) => {
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

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setSelectedRowId: (state, { payload }) => {
      state.value.selectedRowId = payload;
    },

    refreshDataGrid: (state) => {
      state.value.refreshData = Date.now();
    },

    setCategoryRoot: (state, { payload }) => {
      state.value.categoriesRoot = payload;
      state.value.selectedRow = null;
    },

    addToPath: (state, { payload }) => {
      state.value.path.push(payload);
    },

    getAndRemoveLastItemFromPath: (state) => {
      state.value.path.splice(-1);
      const last = state.value.path[state.value.path.length - 1];
      state.value.categoriesRoot = last;
      state.value.selectedRow = null;
    },

    calculateFinalCategries: (state) => {
      const set = [];
      findLeafCategories(set, state.value.categories);
      state.value.finalCategories = set;
    },

    clearError: (state) => {
      state.value.error = null;
      state.value.errorMessage = null;
      state.value.errorCode = null;
      state.value.creating = null;
    },
  },
  extraReducers: {
    /*CREATE*/
    [create.pending]: (state) => {
      state.value.processing = true;
      state.value.errorMessage = null;
      state.value.errorCode = null;
      state.value.error = null;
    },

    [create.fulfilled]: (state, { payload }) => {
      if (payload.error) {
        state.value.error = payload.error;
        state.value.errorMessage = payload.message;
        state.value.errorCode = payload.status;
      } else {
        state.value.errorMessage = null;
        state.value.errorCode = null;
        state.value.error = null;
        state.value.appState = actions.created;
      }
      state.value.processing = false;
    },

    [create.rejected]: (state, { payload }) => {
      state.value.error = payload.error;
      state.value.errorMessage = payload.message;
      state.value.errorCode = payload.status;
      state.value.processing = false;
    },

    /*DELETE*/
    [remove.pending]: (state) => {
      state.value.processing = true;
      state.value.errorMessage = null;
      state.value.errorCode = null;
      state.value.error = null;
    },

    [remove.fulfilled]: (state, { payload }) => {
      state.value.errorMessage = null;
      state.value.errorCode = null;
      state.value.error = null;
      state.value.appState = actions.deleted;
      state.value.processing = false;
      state.value.selectedRowId = null;
    },

    [remove.rejected]: (state, { payload }) => {
      state.value.error = payload.error;
      state.value.errorMessage = payload.message;
      state.value.errorCode = payload.status;
      state.value.processing = false;
    },

    /*UPDATE*/
    [update.pending]: (state) => {
      state.value.processing = true;
      state.value.errorMessage = null;
      state.value.errorCode = null;
      state.value.error = null;
    },

    [update.fulfilled]: (state, { payload }) => {
      if (payload.error) {
        state.value.error = payload.error;
        state.value.errorMessage = payload.message;
        state.value.errorCode = payload.status;
      } else {
        state.value.errorMessage = null;
        state.value.errorCode = null;
        state.value.error = null;
        state.value.appState = actions.updated;
      }
      state.value.processing = false;
    },

    [update.rejected]: (state, { payload }) => {
      state.value.error = payload.error;
      state.value.errorMessage = payload.message;
      state.value.errorCode = payload.status;
      state.value.processing = false;
    },

    /*FIND ALL BRANDS BY PROJECT ID*/
    [getRootOfCategories.pending]: (state) => {
      state.value.loadingCategories = true;
      state.value.error = null;
    },

    [getRootOfCategories.fulfilled]: (state, { payload }) => {
      //console.log("[getRootOfCategories.fulfilled]", payload);

      if (payload.error) {
        state.value.error = payload;
      } else {
        state.value.categoriesRoot = payload;
        state.value.error = null;
        state.value.path = [payload];
        state.value.selectedRow = null;
      }
      state.value.loadingCategories = false;
    },

    [getRootOfCategories.rejected]: (state, { payload }) => {
      state.value.loadingCategories = false;
      state.value.error = payload;
    },

    /*GET ALL CATEGORIES BY PROJECT ID*/
    [getAllCategories.pending]: (state) => {
      state.value.loadingCategories = true;
      state.value.error = null;
    },

    [getAllCategories.fulfilled]: (state, { payload }) => {
      if (payload.error) {
        state.value.error = payload;
      } else {
        state.value.categories = payload;
        state.value.error = null;
      }
      state.value.loadingCategories = false;
    },

    [getAllCategories.rejected]: (state, { payload }) => {
      state.value.loadingCategories = false;
      state.value.error = payload;
    },

    /*GET CHILDREN OF CATEGORY BY PROJECT ID*/
    [getChildrenOfCategory.pending]: (state) => {
      state.value.loadingCategories = true;
      state.value.error = null;
      state.value.selectedRow = null;
    },

    [getChildrenOfCategory.fulfilled]: (state, { payload }) => {
      //console.log("[getChildrenOfCategory.fulfilled]", payload);

      if (payload.error) {
        state.value.error = payload;
      } else {
        state.value.categoriesChild = payload;
        state.value.error = null;
        state.value.selectedRow = null;
        state.value.selectedRowId = null;
        state.value.appState = actions.readed;
      }
      state.value.loadingCategories = false;
    },

    [getChildrenOfCategory.rejected]: (state, { payload }) => {
      state.value.loadingCategories = false;
      state.value.error = payload;
    },

    /*PRODUCT BY ID*/
    [findCategoryById.pending]: (state) => {
      state.value.processing = true;
      state.value.error = null;
      state.value.created = false;
      state.value.creating = false;
    },

    [findCategoryById.fulfilled]: (state, { payload }) => {
      if (payload.error) {
        state.value.error = payload;
      } else {
        state.value.category = payload;
        state.value.error = null;
      }
      state.value.processing = false;
    },

    [findCategoryById.rejected]: (state, { payload }) => {
      state.value.processing = false;
      state.value.error = payload;
      state.value.category = null;
    },
  },
});

export const {
  setSelectedRowId,
  refreshDataGrid,
  setCategoryRoot,
  getAndRemoveLastItemFromPath,
  addToPath,
  calculateFinalCategries,
  clearError,
} = categorySlice.actions;

export default categorySlice.reducer;
